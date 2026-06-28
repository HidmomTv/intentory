-- server/items.lua
local QBCore = exports['qb-core']:GetCoreObject()
local FormattedItems = {}

CreateThread(function()
    Wait(1000) -- Esperar carga de QBCore.Shared.Items
    local count = 0
    for name, item in pairs(QBCore.Shared.Items) do
        FormattedItems[name] = {
            name = item.name,
            label = item.label,
            weight = item.weight or 0,
            type = item.type or 'item',
            image = item.image or (item.name .. '.png'),
            unique = item.unique or false,
            useable = item.useable or false,
            description = item.description or ''
        }
        count = count + 1
    end
    print('^2[qb-inventory] Formateados ' .. count .. ' ítems de QBCore correctamente.^7')
end)

RegisterNetEvent('qb-inventory:server:requestItems', function()
    local src = source
    TriggerClientEvent('qb-inventory:client:syncItems', src, FormattedItems)
end)

RegisterNetEvent('inventory:server:requestItems', function()
    local src = source
    TriggerClientEvent('qb-inventory:client:syncItems', src, FormattedItems)
end)

exports('GetFormattedItems', function()
    return FormattedItems
end)
