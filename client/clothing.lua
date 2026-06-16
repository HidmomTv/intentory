local hasBackpack = false
local backpackSlots = 0

-- Bucle de comprobación inmersiva de mochilas
Citizen.CreateThread(function()
    while true do
        Citizen.Wait(1000) -- Comprobamos cada segundo (optimizado)
        local ped = PlayerPedId()
        
        -- El componente de ropa 5 corresponde a mochilas/paracaídas en GTA V
        local drawableId = GetPedDrawableVariation(ped, 5)
        
        -- Si el ID es mayor a 0, significa que el jugador lleva algo en la espalda
        if drawableId > 0 then
            if not hasBackpack then
                hasBackpack = true
                -- TODO: Leer de una tabla de configuración qué ID da cuántos huecos
                backpackSlots = 20 
                
                -- Desbloqueamos la cuadrícula de la mochila en la UI
                SendNUIMessage({
                    action = "toggleBackpack",
                    state = true,
                    slots = backpackSlots
                })
            end
        else
            if hasBackpack then
                hasBackpack = false
                backpackSlots = 0
                
                -- Bloqueamos la cuadrícula de la mochila en la UI
                SendNUIMessage({
                    action = "toggleBackpack",
                    state = false,
                    slots = 0
                })
            end
        end
    end
end)
