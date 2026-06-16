-- client/rob.lua

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
        
        -- Comprobamos si el objetivo está muerto o con las manos arriba
        if IsEntityDead(targetPed) or IsEntityPlayingAnim(targetPed, "missminuteman_1ig_2", "handsup_base", 3) then
            print("^2[Robo] Registrando jugador: " .. GetPlayerServerId(closestPlayer) .. "^7")
            TriggerServerEvent('universal_inventory:server:robPlayer', GetPlayerServerId(closestPlayer))
            
            -- TODO: Reproducir animación de cachear en nuestro personaje
        else
            print("^1[Robo] El jugador no tiene las manos arriba ni está inconsciente.^7")
            -- Opcional: Mostrar una notificación in-game en lugar del print
        end
    else
        print("^1[Robo] No hay jugadores cerca.^7")
    end
end)
