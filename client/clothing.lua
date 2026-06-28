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

RegisterNUICallback('toggleClothing', function(data, cb)
    local type = data.type or data.slot
    if not type then cb({}) return end

    local capMap = {
        ['mask'] = 'Mask', ['neck'] = 'Neck', ['top'] = 'Top', ['shirt'] = 'Shirt',
        ['gloves'] = 'Gloves', ['pants'] = 'Pants', ['shoes'] = 'Shoes', ['vest'] = 'Vest',
        ['bag'] = 'Bag', ['hat'] = 'Hat', ['glasses'] = 'Glasses', ['visor'] = 'Visor',
        ['watch'] = 'Watch', ['bracelet'] = 'Bracelet'
    }

    local capName = capMap[type] or type
    local lowName = string.lower(type)

    TriggerEvent('qb-radialmenu:ToggleClothing', capName)
    TriggerEvent('qb-radialmenu:ToggleProps', capName)
    TriggerEvent('qb-radialmenu:client:ToggleClothing', capName)
    TriggerEvent('qb-radialmenu:client:ToggleProps', capName)
    TriggerEvent('illenium-appearance:client:toggleClothing', capName)
    TriggerEvent('illenium-appearance:client:toggleProps', capName)
    TriggerEvent('qb-clothing:client:toggleClothing', capName)

    ExecuteCommand(lowName)

    cb({})
end)
