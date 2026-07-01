local QBCore = exports['qb-core']:GetCoreObject()

local function GetClosestPlayer()
    local players = GetActivePlayers()
    local closestDistance = -1
    local closestPlayer = -1
    local ply = PlayerPedId()
    local plyCoords = GetEntityCoords(ply, 0)
    
    for _, value in ipairs(players) do
        local target = GetPlayerPed(value)
        if (target ~= ply) then
            local targetCoords = GetEntityCoords(target, 0)
            local distance = #(targetCoords - plyCoords)
            if (closestDistance == -1 or closestDistance > distance) then
                closestPlayer = value
                closestDistance = distance
            end
        end
    end
    
    return closestPlayer, closestDistance
end

RegisterCommand('robar', function()
    local closestPlayer, closestDistance = GetClosestPlayer()
    
    if closestPlayer ~= -1 and closestDistance < 2.0 then
        local targetPed = GetPlayerPed(closestPlayer)
        
        -- Comprobamos si el objetivo está muerto, esposado o con las manos arriba
        if IsEntityDead(targetPed) or IsEntityPlayingAnim(targetPed, "missminuteman_1ig_2", "handsup_base", 3) or IsEntityPlayingAnim(targetPed, "mp_arresting", "idle", 3) then
            QBCore.Functions.Notify("Cacheando al jugador...", "info")
            TriggerServerEvent('qb-inventory:server:robPlayer', GetPlayerServerId(closestPlayer))
            
            -- Animación de cacheo
            CreateThread(function()
                RequestAnimDict("random@shop_robbery")
                while not HasAnimDictLoaded("random@shop_robbery") do Wait(10) end
                TaskPlayAnim(PlayerPedId(), "random@shop_robbery", "robbery_action_b", 8.0, -8.0, 2000, 48, 0, false, false, false)
            end)
        else
            QBCore.Functions.Notify("El jugador no tiene las manos arriba ni está inconsciente o esposado", "error")
        end
    else
        QBCore.Functions.Notify("No hay jugadores cerca", "error")
    end
end)
