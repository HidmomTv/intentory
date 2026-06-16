local CustomItems = {}

MySQL.ready(function()
    MySQL.query('SELECT * FROM universal_items', {}, function(results)
        if results then
            for _, item in ipairs(results) do
                CustomItems[item.name] = item
            end
            print('^2[Universal Inventory] Loaded ' .. #results .. ' custom items from database.^7')
        end
    end)
end)

-- Sincronizar items con clientes
RegisterNetEvent('universal_inventory:server:requestItems', function()
    local src = source
    TriggerClientEvent('universal_inventory:client:syncItems', src, CustomItems)
end)

-- Evento de Administrador para crear items dinámicamente In-Game
RegisterNetEvent('universal_inventory:server:createItem', function(itemData)
    local src = source
    -- TODO: Verificar permisos de administrador aquí
    
    local query = 'INSERT INTO universal_items (name, label, weight, type, image, is_unique, useable, description, tetris_width, tetris_height) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
    local params = {
        itemData.name, itemData.label, itemData.weight, itemData.type, itemData.image, 
        itemData.is_unique and 1 or 0, itemData.useable and 1 or 0, itemData.description, 
        itemData.width, itemData.height
    }

    MySQL.insert(query, params, function(id)
        if id then
            CustomItems[itemData.name] = itemData
            -- Sincronizar con todos los jugadores
            TriggerClientEvent('universal_inventory:client:syncItems', -1, CustomItems)
            print('^2[Admin] Nuevo Item creado dinámicamente: ' .. itemData.name .. '^7')
        end
    end)
end)
