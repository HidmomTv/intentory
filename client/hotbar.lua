-- client/hotbar.lua
local QBCore = exports['qb-core']:GetCoreObject()
local isHotbarVisible = false

-- Función para usar objeto asignado al slot rápido 1..6
local function UseQuickbarSlot(slotNum)
    local PlayerData = QBCore.Functions.GetPlayerData()
    if not PlayerData or not PlayerData.items then return end

    for _, item in pairs(PlayerData.items) do
        if item and item.info and tonumber(item.info.hotbarSlot) == slotNum then
            TriggerServerEvent('qb-inventory:server:UseItem', item)
            break
        end
    end
end

-- Keymappings nativos para atajos 1 al 6
for i = 1, 6 do
    RegisterCommand('quickslot_' .. i, function()
        UseQuickbarSlot(i)
    end, false)
    RegisterKeyMapping('quickslot_' .. i, 'Usar Slot Rápido ' .. i, 'keyboard', tostring(i))
end

CreateThread(function()
    while true do
        Wait(0)
        DisableControlAction(0, 37, true) -- Desactivar rueda de armas GTA V

        if IsDisabledControlJustPressed(0, 20) or IsControlJustPressed(0, 20) then
            if not isHotbarVisible then
                isHotbarVisible = true
                SendNUIMessage({ action = "showHotbar" })
                SetTimecycleModifier('hud_def_blur')
            end
        elseif IsDisabledControlJustReleased(0, 20) or IsControlJustReleased(0, 20) then
            if isHotbarVisible then
                isHotbarVisible = false
                SendNUIMessage({ action = "hideHotbar" })
                ClearTimecycleModifier()
            end
        end
    end
end)
