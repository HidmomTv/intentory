-- server/main.lua
local QBCore = exports['qb-core']:GetCoreObject()
local Drops = {}
local Trunks = {}
local Gloveboxes = {}
local Stashes = {}
local Shops = {}

-- FUNCIONES CORE DE INVENTARIO PARA JUGADORES QBCORE
local function GetItemBySlot(source, slot)
    local Player = QBCore.Functions.GetPlayer(source)
    if not Player then return nil end
    slot = tonumber(slot)
    return Player.PlayerData.items[slot]
end

local function GetItemByName(source, item)
    local Player = QBCore.Functions.GetPlayer(source)
    if not Player or not item then return nil end
    item = item:lower()
    for _, itemData in pairs(Player.PlayerData.items) do
        if itemData and itemData.name:lower() == item then
            return itemData
        end
    end
    return nil
end

local function GetItemsByName(source, item)
    local Player = QBCore.Functions.GetPlayer(source)
    if not Player or not item then return {} end
    item = item:lower()
    local found = {}
    for _, itemData in pairs(Player.PlayerData.items) do
        if itemData and itemData.name:lower() == item then
            found[#found+1] = itemData
        end
    end
    return found
end

local function GetFirstFreeSlot(items, maxSlots)
    maxSlots = maxSlots or 41
    for i = 1, maxSlots do
        if not items[i] then
            return i
        end
    end
    return nil
end

local function AddItem(source, item, amount, slot, info)
    local Player = QBCore.Functions.GetPlayer(source)
    if not Player then return false end

    local sharedItem = QBCore.Shared.Items[item:lower()]
    if not sharedItem then
        print("^1[qb-inventory] Intento de añadir ítem inexistente: " .. tostring(item) .. "^7")
        return false
    end

    amount = tonumber(amount) or 1
    slot = tonumber(slot)
    info = info or {}

    local items = Player.PlayerData.items

    -- Si no nos dieron slot, intentamos apilar en uno existente si el objeto no es único ni arma
    if not slot then
        if not sharedItem.unique and sharedItem.type ~= 'weapon' then
            for s, itemData in pairs(items) do
                if itemData and itemData.name:lower() == item:lower() then
                    itemData.amount = itemData.amount + amount
                    Player.Functions.SetPlayerData("items", items)
                    TriggerClientEvent('inventory:client:ItemBox', source, sharedItem, 'add')
                    TriggerClientEvent('qb-inventory:client:refreshUI', source, items)
                    return true
                end
            end
        end

        slot = GetFirstFreeSlot(items)
        if not slot then
            TriggerClientEvent('QBCore:Notify', source, "Inventario lleno", "error")
            return false
        end
    end

    -- Si el slot pedido ya está ocupado y es el mismo objeto apilable
    if items[slot] and items[slot].name:lower() == item:lower() and not sharedItem.unique and sharedItem.type ~= 'weapon' then
        items[slot].amount = items[slot].amount + amount
    else
        -- Nuevo objeto en el slot
        items[slot] = {
            name = sharedItem.name,
            amount = amount,
            info = info,
            label = sharedItem.label,
            description = sharedItem.description or '',
            weight = sharedItem.weight or 0,
            type = sharedItem.type or 'item',
            unique = sharedItem.unique or false,
            useable = sharedItem.useable or false,
            image = sharedItem.image or (sharedItem.name .. '.png'),
            slot = slot
        }
    end

    Player.Functions.SetPlayerData("items", items)
    TriggerClientEvent('inventory:client:ItemBox', source, sharedItem, 'add')
    TriggerClientEvent('qb-inventory:client:refreshUI', source, items)
    return true
end

local function RemoveItem(source, item, amount, slot)
    local Player = QBCore.Functions.GetPlayer(source)
    if not Player then return false end

    amount = tonumber(amount) or 1
    slot = tonumber(slot)
    local items = Player.PlayerData.items

    if slot then
        local itemData = items[slot]
        if itemData and itemData.name:lower() == item:lower() then
            if itemData.amount > amount then
                itemData.amount = itemData.amount - amount
            else
                items[slot] = nil
            end
            Player.Functions.SetPlayerData("items", items)
            local sharedItem = QBCore.Shared.Items[item:lower()] or itemData
            TriggerClientEvent('inventory:client:ItemBox', source, sharedItem, 'remove')
            TriggerClientEvent('qb-inventory:client:refreshUI', source, items)
            return true
        end
        return false
    else
        for s, itemData in pairs(items) do
            if itemData and itemData.name:lower() == item:lower() then
                if itemData.amount > amount then
                    itemData.amount = itemData.amount - amount
                else
                    items[s] = nil
                end
                Player.Functions.SetPlayerData("items", items)
                local sharedItem = QBCore.Shared.Items[item:lower()] or itemData
                TriggerClientEvent('inventory:client:ItemBox', source, sharedItem, 'remove')
                TriggerClientEvent('qb-inventory:client:refreshUI', source, items)
                return true
            end
        end
        return false
    end
end

local function SetInventory(source, items)
    local Player = QBCore.Functions.GetPlayer(source)
    if not Player then return false end
    Player.Functions.SetPlayerData("items", items)
    return true
end

-- INYECCIÓN EN JUGADORES QBCORE
local function InyectarMetodosJugador(src)
    QBCore.Functions.AddPlayerMethod(src, "AddItem", function(...) return AddItem(src, ...) end)
    QBCore.Functions.AddPlayerMethod(src, "RemoveItem", function(...) return RemoveItem(src, ...) end)
    QBCore.Functions.AddPlayerMethod(src, "GetItemByName", function(...) return GetItemByName(src, ...) end)
    QBCore.Functions.AddPlayerMethod(src, "GetItemBySlot", function(...) return GetItemBySlot(src, ...) end)
    QBCore.Functions.AddPlayerMethod(src, "GetItemsByName", function(...) return GetItemsByName(src, ...) end)
    QBCore.Functions.AddPlayerMethod(src, "SetInventory", function(...) return SetInventory(src, ...) end)
end

AddEventHandler('QBCore:Server:PlayerLoaded', function(Player)
    if Player and Player.PlayerData and Player.PlayerData.source then
        InyectarMetodosJugador(Player.PlayerData.source)
    end
end)

CreateThread(function()
    Wait(500)
    local players = QBCore.Functions.GetQBPlayers()
    for _, Player in pairs(players) do
        if Player and Player.PlayerData and Player.PlayerData.source then
            InyectarMetodosJugador(Player.PlayerData.source)
        end
    end
end)

-- EXPORTS PUBLICOS
exports('AddItem', AddItem)
exports('RemoveItem', RemoveItem)
exports('GetItemByName', GetItemByName)
exports('GetItemBySlot', GetItemBySlot)
exports('GetItemsByName', GetItemsByName)
exports('SetInventory', SetInventory)

exports('CreateShop', function(shopData)
    local shopId = shopData.name or ("shop_" .. math.random(1000,9999))
    local formattedItems = {}
    if shopData.items then
        for i, item in pairs(shopData.items) do
            local sItem = QBCore.Shared.Items[item.name:lower()]
            formattedItems[i] = {
                name = item.name,
                price = item.price or 0,
                amount = item.amount or 9999,
                slot = i,
                label = sItem and sItem.label or item.name,
                image = sItem and sItem.image or (item.name .. ".png"),
                weight = sItem and sItem.weight or 0,
                info = item.info or {}
            }
        end
    end
    Shops[shopId] = { name = shopData.label or shopId, items = formattedItems }
    return shopId
end)

exports('OpenShop', function(source, shopId)
    local shop = Shops[shopId]
    if not shop then return end
    TriggerClientEvent('qb-inventory:client:openSecondary', source, shop.name, 1000.0, shopId, "shop", shop.items)
end)

exports('OpenInventory', function(source, invType, invId, other)
    TriggerEvent('inventory:server:OpenInventory', invType, invId, other)
end)
exports('OpenInventoryById', function(source, invId)
    TriggerEvent('inventory:server:OpenInventory', "stash", invId)
end)
exports('OpenStash', function(source, stashId)
    TriggerClientEvent('qb-inventory:client:openSecondary', source, "Stash: " .. stashId, 100.0, stashId, "stash")
end)
exports('OpenTrunk', function(source, plate)
    TriggerClientEvent('qb-inventory:client:openSecondary', source, "Maletero: " .. plate, 150.0, plate, "trunk")
end)
exports('OpenGlovebox', function(source, plate)
    TriggerClientEvent('qb-inventory:client:openSecondary', source, "Guantera: " .. plate, 15.0, plate, "glovebox")
end)

exports('HasItem', function(source, items, amount)
    local Player = QBCore.Functions.GetPlayer(source)
    if not Player then return false end
    local count = amount or 1

    if type(items) == "table" then
        for _, item in pairs(items) do
            local itemData = GetItemByName(source, item)
            if itemData and itemData.amount >= count then return true end
        end
        return false
    else
        local itemData = GetItemByName(source, items)
        return (itemData and itemData.amount >= count)
    end
end)

local function UseItem(itemName, ...)
    local itemData = QBCore.Functions.CanUseItem(itemName)
    if type(itemData) == 'table' and itemData.func then
        itemData.func(...)
    end
end
exports('UseItem', UseItem)

exports('LoadInventory', function(source, citizenid)
    local inventory = MySQL.query.await('SELECT inventory FROM players WHERE citizenid = ?', { citizenid })
    if inventory[1] and inventory[1].inventory then
        local items = json.decode(inventory[1].inventory)
        if type(items) == "table" then return items end
    end
    return {}
end)

exports('SaveInventory', function(source, offline)
    local items = nil
    local citizenid = nil

    if type(source) == "table" and offline then
        items = source.items
        citizenid = source.citizenid
    else
        local Player = QBCore.Functions.GetPlayer(source)
        if Player then
            items = Player.PlayerData.items
            citizenid = Player.PlayerData.citizenid
        end
    end

    if citizenid and items then
        MySQL.update('UPDATE players SET inventory = ? WHERE citizenid = ?', { json.encode(items), citizenid })
    end
end)

-- CALLBACKS ESTÁNDAR DE QBCORE
QBCore.Functions.CreateCallback('qb-inventory:server:getPlayerInventory', function(source, cb)
    local Player = QBCore.Functions.GetPlayer(source)
    if not Player then cb({}) return end
    cb(Player.PlayerData.items)
end)
QBCore.Functions.CreateCallback('universal_inventory:server:getPlayerInventory', function(source, cb)
    local Player = QBCore.Functions.GetPlayer(source)
    if not Player then cb({}) return end
    cb(Player.PlayerData.items)
end)

QBCore.Functions.CreateCallback('qb-inventory:server:GetStashItems', function(source, cb, stashId)
    if Stashes[stashId] then cb(Stashes[stashId].items) return end
    local result = MySQL.query.await('SELECT items FROM stashitems WHERE stash = ?', { stashId })
    if result[1] and result[1].items then
        local items = json.decode(result[1].items)
        Stashes[stashId] = { items = items }
        cb(items)
    else
        Stashes[stashId] = { items = {} }
        cb({})
    end
end)

QBCore.Functions.CreateCallback('qb-inventory:server:GetCurrentDrops', function(source, cb) cb(Drops) end)
QBCore.Functions.CreateCallback('universal_inventory:server:GetDrops', function(source, cb) cb(Drops) end)

QBCore.Functions.CreateCallback('qb-inventory:server:GetTrunkItems', function(source, cb, plate)
    if Trunks[plate] then cb(Trunks[plate].items) return end
    local result = MySQL.query.await('SELECT items FROM trunkitems WHERE plate = ?', { plate })
    if result[1] and result[1].items then
        local items = json.decode(result[1].items)
        Trunks[plate] = { items = items }
        cb(items)
    else
        Trunks[plate] = { items = {} }
        cb({})
    end
end)

QBCore.Functions.CreateCallback('qb-inventory:server:GetGloveboxItems', function(source, cb, plate)
    if Gloveboxes[plate] then cb(Gloveboxes[plate].items) return end
    local result = MySQL.query.await('SELECT items FROM gloveboxitems WHERE plate = ?', { plate })
    if result[1] and result[1].items then
        local items = json.decode(result[1].items)
        Gloveboxes[plate] = { items = items }
        cb(items)
    else
        Gloveboxes[plate] = { items = {} }
        cb({})
    end
end)

-- EVENTOS NATIvOS DE APERTURA (tiendas, stashes, maleteros, guanteras)
RegisterNetEvent('inventory:server:OpenInventory', function(type, id, other)
    local src = source
    local Player = QBCore.Functions.GetPlayer(src)
    if not Player then return end

    if type == "stash" then
        TriggerClientEvent('qb-inventory:client:openSecondary', src, "Armario: " .. id, 100.0, id, "stash")
    elseif type == "trunk" then
        TriggerClientEvent('qb-inventory:client:openSecondary', src, "Maletero: " .. id, 150.0, id, "trunk")
    elseif type == "glovebox" then
        TriggerClientEvent('qb-inventory:client:openSecondary', src, "Guantera: " .. id, 15.0, id, "glovebox")
    elseif type == "shop" then
        local shopItems = Shops[id] and Shops[id].items or (other and other.items or {})
        TriggerClientEvent('qb-inventory:client:openSecondary', src, Shops[id] and Shops[id].name or "Tienda", 1000.0, id, "shop", shopItems)
    end
end)

-- GUARDADO DE CONTENEDORES
RegisterNetEvent('inventory:server:SaveStashItems', function(stashId, items)
    Stashes[stashId] = { items = items }
    MySQL.insert('INSERT INTO stashitems (stash, items) VALUES (?, ?) ON DUPLICATE KEY UPDATE items = ?', { stashId, json.encode(items), json.encode(items) })
end)

RegisterNetEvent('inventory:server:SaveTrunkItems', function(plate, items)
    Trunks[plate] = { items = items }
    MySQL.insert('INSERT INTO trunkitems (plate, items) VALUES (?, ?) ON DUPLICATE KEY UPDATE items = ?', { plate, json.encode(items), json.encode(items) })
end)

RegisterNetEvent('inventory:server:SaveGloveboxItems', function(plate, items)
    Gloveboxes[plate] = { items = items }
    MySQL.insert('INSERT INTO gloveboxitems (plate, items) VALUES (?, ?) ON DUPLICATE KEY UPDATE items = ?', { plate, json.encode(items), json.encode(items) })
end)

-- EVENTOS DE USO DE ÍTEMS
local function HandleItemUse(src, itemSlot)
    local Player = QBCore.Functions.GetPlayer(src)
    if not Player then return end
    local itemData = GetItemBySlot(src, itemSlot)
    if not itemData then return end

    if itemData.type == 'weapon' then
        TriggerClientEvent('qb-weapons:client:UseWeapon', src, itemData, itemData.info.quality and itemData.info.quality > 0)
    else
        UseItem(itemData.name, src, itemData)
    end
end

RegisterNetEvent('qb-inventory:server:UseItem', function(item) HandleItemUse(source, item.qbslot or item.slot) end)
RegisterNetEvent('inventory:server:UseItem', function(slot) HandleItemUse(source, slot) end)
RegisterNetEvent('universal_inventory:server:UseItem', function(item) HandleItemUse(source, item.qbslot or item.slot) end)

-- ACTUAlIZAR COORDENADAS TETRIS Y ACCESO RÁPIDO (HOTBAR 1-6)
RegisterNetEvent('qb-inventory:server:SetItemSlot', function(data)
    local src = source
    local Player = QBCore.Functions.GetPlayer(src)
    if not Player then return end

    local slot = data.item.qbslot or data.item.slot
    local pItem = Player.PlayerData.items[slot]
    if pItem then
        pItem.info = pItem.info or {}
        pItem.info.tetris = { x = data.x, y = data.y, rotated = data.rotated }
        Player.Functions.SetPlayerData("items", Player.PlayerData.items)
    end
end)

RegisterNetEvent('qb-inventory:server:SetQuickbarSlot', function(data)
    local src = source
    local Player = QBCore.Functions.GetPlayer(src)
    if not Player then return end

    local slot = data.item.qbslot or data.item.slot
    local pItem = Player.PlayerData.items[slot]
    if pItem then
        pItem.info = pItem.info or {}
        pItem.info.hotbarSlot = data.hotbarSlot
        Player.Functions.SetPlayerData("items", Player.PlayerData.items)
    end
end)

local function SyncPlayerUI(src)
    local Player = QBCore.Functions.GetPlayer(src)
    if Player and Player.PlayerData then
        TriggerClientEvent('qb-inventory:client:refreshUI', src, Player.PlayerData.items)
    end
end

-- DROPS EN EL SUELO Y MUERTE
RegisterNetEvent('qb-inventory:server:DropItem', function(item, amount)
    local src = source
    local Player = QBCore.Functions.GetPlayer(src)
    if not Player or not item then return end

    local playerPed = GetPlayerPed(src)
    local playerCoords = GetEntityCoords(playerPed)
    local slot = item.qbslot or item.slot

    amount = tonumber(amount) or 1
    if RemoveItem(src, item.name, amount, slot) then
        local dropId = "drop-" .. math.random(100000, 999999)
        local droppedItem = table.clone(item)
        droppedItem.amount = amount
        droppedItem.slot = 1

        Drops[dropId] = { id = dropId, items = { [1] = droppedItem }, coords = playerCoords }
        TriggerClientEvent('qb-inventory:client:createLocalDrop', -1, dropId, playerCoords, Drops[dropId])
        SyncPlayerUI(src)
    end
end)
RegisterNetEvent('universal_inventory:server:DropItem', function(item, amount) TriggerEvent('qb-inventory:server:DropItem', item, amount) end)

RegisterNetEvent('hospital:server:SetDeathStatus', function(isDead)
    if not isDead then return end
    local src = source
    local Player = QBCore.Functions.GetPlayer(src)
    if not Player then return end

    local playerPed = GetPlayerPed(src)
    local playerCoords = GetEntityCoords(playerPed)
    local dropId = "death-" .. math.random(100000, 999999)
    local deathItems = {}
    local slot = 1

    for k, v in pairs(Player.PlayerData.items) do
        if v.name ~= 'id_card' and v.name ~= 'phone' then
            deathItems[slot] = table.clone(v)
            deathItems[slot].slot = slot
            RemoveItem(src, v.name, v.amount, v.slot)
            slot = slot + 1
        end
    end

    if slot > 1 then
        Drops[dropId] = { id = dropId, items = deathItems, coords = playerCoords }
        TriggerClientEvent('qb-inventory:client:createLocalDrop', -1, dropId, playerCoords, Drops[dropId])
        SyncPlayerUI(src)
    end
end)

RegisterNetEvent('qb-inventory:server:openDrop', function(dropId)
    local src = source
    if Drops[dropId] then
        TriggerClientEvent('qb-inventory:client:openLoot', src, dropId, Drops[dropId].items)
    end
end)
RegisterNetEvent('universal_inventory:server:openDrop', function(dropId) TriggerEvent('qb-inventory:server:openDrop', dropId) end)

-- TRANSFERIR Y DIVIDIR ÍTEMS
RegisterNetEvent('qb-inventory:server:GiveItem', function(item, amount, targetId)
    local src = source
    local Player = QBCore.Functions.GetPlayer(src)
    local Target = QBCore.Functions.GetPlayer(targetId)

    if not Player or not Target or src == targetId or not item then return end

    local pCoords = GetEntityCoords(GetPlayerPed(src))
    local tCoords = GetEntityCoords(GetPlayerPed(targetId))
    if #(pCoords - tCoords) > 5.0 then
        TriggerClientEvent('QBCore:Notify', src, "Jugador demasiado lejos", "error")
        return
    end

    amount = tonumber(amount) or 1
    if RemoveItem(src, item.name, amount, item.qbslot or item.slot) then
        AddItem(targetId, item.name, amount, false, item.info)
        TriggerClientEvent('QBCore:Notify', src, "Has dado " .. amount .. "x " .. item.label, "success")
        TriggerClientEvent('QBCore:Notify', targetId, "Has recibido " .. amount .. "x " .. item.label, "success")
        SyncPlayerUI(src)
        SyncPlayerUI(targetId)
    end
end)
RegisterNetEvent('universal_inventory:server:GiveItem', function(...) TriggerEvent('qb-inventory:server:GiveItem', ...) end)

RegisterNetEvent('qb-inventory:server:SplitItem', function(item, amount)
    local src = source
    local Player = QBCore.Functions.GetPlayer(src)
    if not Player or not item then return end

    amount = tonumber(amount) or 1
    local origSlot = tonumber(item.qbslot or item.slot)
    local items = Player.PlayerData.items
    local origItem = items[origSlot]

    if not origItem or origItem.amount <= amount then return end

    local freeSlot = GetFirstFreeSlot(items)
    if not freeSlot then
        TriggerClientEvent('QBCore:Notify', src, "Inventario lleno para dividir", "error")
        return
    end

    -- Restamos del original
    origItem.amount = origItem.amount - amount

    -- Insertamos como nuevo stack separado en el nuevo slot libre
    items[freeSlot] = {
        name = origItem.name,
        amount = amount,
        info = table.clone(origItem.info or {}),
        label = origItem.label,
        description = origItem.description or '',
        weight = origItem.weight or 0,
        type = origItem.type or 'item',
        unique = origItem.unique or false,
        useable = origItem.useable or false,
        image = origItem.image or (origItem.name .. '.png'),
        slot = freeSlot
    }
    -- Borramos coordenadas tetris en el stack dividido para que aparezca en el primer hueco libre
    if items[freeSlot].info then items[freeSlot].info.tetris = nil end

    Player.Functions.SetPlayerData("items", items)
    SyncPlayerUI(src)
end)
RegisterNetEvent('universal_inventory:server:SplitItem', function(...) TriggerEvent('qb-inventory:server:SplitItem', ...) end)

RegisterNetEvent('qb-inventory:server:MergeStack', function(sourceItem, targetItem)
    local src = source
    local Player = QBCore.Functions.GetPlayer(src)
    if not Player or not sourceItem or not targetItem then return end

    local srcSlot = tonumber(sourceItem.qbslot or sourceItem.slot)
    local tgtSlot = tonumber(targetItem.qbslot or targetItem.slot)
    local items = Player.PlayerData.items

    if items[srcSlot] and items[tgtSlot] and items[srcSlot].name == items[tgtSlot].name then
        items[tgtSlot].amount = items[tgtSlot].amount + items[srcSlot].amount
        items[srcSlot] = nil
        Player.Functions.SetPlayerData("items", items)
        SyncPlayerUI(src)
    end
end)

-- TRANSFERENCIA TRANSACCIONAL: RECOGER DE BOLSA / MALETERO / ARMARIO A MOCHILA
RegisterNetEvent('qb-inventory:server:TakeFromSecondary', function(data)
    local src = source
    local containerId = data.containerId
    local item = data.item
    local amount = tonumber(item.count or item.amount or 1)

    if Drops[containerId] then
        local drop = Drops[containerId]
        if drop and drop.items then
            local foundSlot = nil
            for k, v in pairs(drop.items) do
                if v and (v.name == item.name) then
                    foundSlot = k
                    if v.amount > amount then
                        v.amount = v.amount - amount
                    else
                        drop.items[k] = nil
                    end
                    break
                end
            end
            
            if foundSlot then
                item.info = item.info or {}
                item.info.tetris = { x = data.x, y = data.y, rotated = data.rotated }
                AddItem(src, item.name, amount, false, item.info)

                local remainingCount = 0
                for _, _ in pairs(drop.items) do remainingCount = remainingCount + 1 end

                if remainingCount == 0 then
                    Drops[containerId] = nil
                    TriggerClientEvent('qb-inventory:client:removeDrop', -1, containerId)
                else
                    TriggerClientEvent('qb-inventory:client:openLoot', src, containerId, drop.items)
                end
                SyncPlayerUI(src)
            end
        end
    end
end)

-- TRANSFERENCIA TRANSACCIONAL: DEPOSITAR DE MOCHILA A BOLSA / MALETERO / ARMARIO
RegisterNetEvent('qb-inventory:server:PutInSecondary', function(data)
    local src = source
    local containerId = data.containerId
    local item = data.item
    local amount = tonumber(item.count or item.amount or 1)
    local origSlot = tonumber(item.qbslot or item.slot)

    if RemoveItem(src, item.name, amount, origSlot) then
        if Drops[containerId] then
            local drop = Drops[containerId]
            local nextSlot = 1
            while drop.items[nextSlot] do nextSlot = nextSlot + 1 end
            
            local newItem = table.clone(item)
            newItem.amount = amount
            newItem.slot = nextSlot
            newItem.info = newItem.info or {}
            newItem.info.tetris = { x = data.x, y = data.y, rotated = data.rotated }

            drop.items[nextSlot] = newItem
            TriggerClientEvent('qb-inventory:client:openLoot', src, containerId, drop.items)
        end
        SyncPlayerUI(src)
    end
end)

RegisterNetEvent('qb-inventory:server:BuyItem', function(shopId, itemName, amount, slot)
    local src = source
    local Player = QBCore.Functions.GetPlayer(src)
    if not Player then return end

    local shop = Shops[shopId]
    if not shop then return end

    local shopItem = nil
    for _, si in pairs(shop.items) do
        if si.name == itemName then shopItem = si break end
    end
    if not shopItem then return end

    local buyQty = tonumber(amount) or 1
    local price = (shopItem.price or 0) * buyQty

    if Player.Functions.RemoveMoney('cash', price, "shop-purchase") or Player.Functions.RemoveMoney('bank', price, "shop-purchase") then
        Player.Functions.AddItem(itemName, buyQty, false, shopItem.info)
        TriggerClientEvent('QBCore:Notify', src, "Comprado x" .. buyQty .. " " .. (shopItem.label or itemName) .. " por $" .. price, "success")
    else
        TriggerClientEvent('QBCore:Notify', src, "No tienes dinero suficiente ($" .. price .. ")", "error")
    end
end)

RegisterNetEvent('qb-inventory:server:AdminGiveItem', function(targetId, itemName, amount)
    local src = source
    if not QBCore.Functions.HasPermission(src, 'admin') and not QBCore.Functions.HasPermission(src, 'god') then
        TriggerClientEvent('QBCore:Notify', src, "No tienes permisos de administrador", "error")
        return
    end

    local Target = QBCore.Functions.GetPlayer(tonumber(targetId))
    if not Target then
        TriggerClientEvent('QBCore:Notify', src, "El jugador seleccionado no se encuentra en línea", "error")
        return
    end

    local qty = tonumber(amount) or 1
    if Target.Functions.AddItem(itemName, qty) then
        TriggerClientEvent('QBCore:Notify', src, "Despachado x" .. qty .. " " .. itemName .. " a " .. (Target.PlayerData.charinfo.firstname or "Jugador"), "success")
        TriggerClientEvent('QBCore:Notify', Target.PlayerData.source, "Recibido x" .. qty .. " " .. itemName .. " de un Administrador", "info")
    else
        TriggerClientEvent('QBCore:Notify', src, "El inventario de destino está lleno", "error")
    end
end)
