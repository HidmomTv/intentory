local QBCore = exports['qb-core']:GetCoreObject()

local function IsAdmin(src)
    return QBCore.Functions.HasPermission(src, 'admin') or QBCore.Functions.HasPermission(src, 'god') or QBCore.Functions.HasPermission(src, 'command') or QBCore.Functions.HasPermission(src, 'mod') or IsPlayerAceAllowed(src, 'command')
end

QBCore.Commands.Add('giveitem', 'Dar un objeto a un jugador (Admin)', { { name = 'id', help = 'ID de Jugador' }, { name = 'item', help = 'Nombre del ítem (ej: water)' }, { name = 'cantidad', help = 'Cantidad' } }, false, function(source, args)
    local src = source
    if not IsAdmin(src) then
        TriggerClientEvent('QBCore:Notify', src, "No tienes permisos de administrador", "error")
        return
    end
    local id = tonumber(args[1])
    local item = tostring(args[2]):lower()
    local amount = tonumber(args[3]) or 1

    local Target = QBCore.Functions.GetPlayer(id)
    if not Target then
        TriggerClientEvent('QBCore:Notify', src, "Jugador no encontrado", "error")
        return
    end

    local itemData = QBCore.Shared.Items[item]
    if not itemData then
        TriggerClientEvent('QBCore:Notify', src, "Ese ítem no existe en QBCore", "error")
        return
    end

    if Target.Functions.AddItem(item, amount) then
        TriggerClientEvent('QBCore:Notify', src, "Diste " .. amount .. "x " .. itemData.label .. " a " .. GetPlayerName(id), "success")
        if id ~= src then
            TriggerClientEvent('QBCore:Notify', id, "Recibiste " .. amount .. "x " .. itemData.label, "success")
        end
        exports['qb-inventory']:SyncPlayerUI(id)
    else
        TriggerClientEvent('QBCore:Notify', src, "Inventario del jugador lleno", "error")
    end
end)

-- Alias corto /give
QBCore.Commands.Add('give', 'Dar un objeto a un jugador (Admin)', { { name = 'id', help = 'ID de Jugador' }, { name = 'item', help = 'Nombre del ítem' }, { name = 'cantidad', help = 'Cantidad' } }, false, function(source, args)
    if not IsAdmin(source) then return end
    local id = tonumber(args[1])
    if id then ExecuteCommand('giveitem ' .. table.concat(args, ' ')) end
end)

QBCore.Commands.Add('clearinv', 'Limpiar inventario (Admin)', { { name = 'id', help = 'ID de Jugador' } }, false, function(source, args)
    local src = source
    if not IsAdmin(src) then
        TriggerClientEvent('QBCore:Notify', src, "No tienes permisos de administrador", "error")
        return
    end
    local id = tonumber(args[1]) or src
    local Target = QBCore.Functions.GetPlayer(id)
    if Target then
        Target.Functions.SetPlayerData("items", {})
        exports['qb-inventory']:SyncPlayerUI(id)
        TriggerClientEvent('QBCore:Notify', src, "Inventario limpiado para ID " .. id, "success")
    end
end)

QBCore.Commands.Add('inventoryadmin', 'Panel de Despacho Visual de Ítems (Admin)', {}, false, function(source)
    local src = source
    if not IsAdmin(src) then
        TriggerClientEvent('QBCore:Notify', src, "No tienes permisos de administrador", "error")
        return
    end
    local players = {}
    for _, p in pairs(QBCore.Functions.GetQBPlayers()) do
        if p and p.PlayerData then
            players[#players+1] = {
                id = p.PlayerData.source,
                name = (p.PlayerData.charinfo.firstname or '') .. ' ' .. (p.PlayerData.charinfo.lastname or '') .. ' (' .. GetPlayerName(p.PlayerData.source) .. ')'
            }
        end
    end

    local itemsList = {}
    for k, v in pairs(QBCore.Shared.Items) do
        itemsList[#itemsList+1] = v
    end

    TriggerClientEvent('qb-inventory:client:openAdminMenu', src, players, itemsList)
end)

RegisterNetEvent('qb-inventory:server:AdminGiveItem', function(targetId, itemName, amount)
    local src = source
    if not IsAdmin(src) then return end

    local tid = tonumber(targetId)
    if not tid or tid == 0 then tid = src end
    local Target = QBCore.Functions.GetPlayer(tid)
    if not Target then
        TriggerClientEvent('QBCore:Notify', src, "Jugador desconectado", "error")
        return
    end

    amount = tonumber(amount) or 1
    if Target.Functions.AddItem(itemName, amount) then
        TriggerClientEvent('QBCore:Notify', src, "Despachado " .. amount .. "x " .. itemName .. " a " .. GetPlayerName(tid), "success")
        if tid ~= src then
            TriggerClientEvent('QBCore:Notify', tid, "Recibiste " .. amount .. "x " .. itemName .. " de un administrador", "success")
        end
    else
        TriggerClientEvent('QBCore:Notify', src, "El inventario del jugador está lleno", "error")
    end
end)

QBCore.Commands.Add('randomitems', 'Recibir ítems aleatorios (Pruebas)', {}, false, function(source)
    local src = source
    if not IsAdmin(src) then return end
    local Player = QBCore.Functions.GetPlayer(src)
    if not Player then return end

    local items = {}
    for k, v in pairs(QBCore.Shared.Items) do
        if v.type ~= 'weapon' and not v.unique then
            items[#items+1] = v.name
        end
    end

    for _ = 1, 5 do
        local randomName = items[math.random(1, #items)]
        Player.Functions.AddItem(randomName, math.random(1, 10))
    end
    TriggerClientEvent('QBCore:Notify', src, "Recibiste ítems aleatorios de prueba", "success")
end)
