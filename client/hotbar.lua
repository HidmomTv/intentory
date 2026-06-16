-- client/hotbar.lua
local isHotbarVisible = false

CreateThread(function()
    while true do
        Wait(0)
        -- Disable standard GTA V weapon wheel if using this
        DisableControlAction(0, 37, true) -- Tab
        
        -- Control 20 is 'Z' by default in FiveM
        if IsDisabledControlJustPressed(0, 20) or IsControlJustPressed(0, 20) then
            if not isHotbarVisible then
                isHotbarVisible = true
                -- Trigger React NUI to show the Hotbar HUD
                SendNUIMessage({
                    action = "showHotbar"
                })
                -- Apply blur effect to screen
                SetTimecycleModifier('hud_def_blur')
            end
        elseif IsDisabledControlJustReleased(0, 20) or IsControlJustReleased(0, 20) then
            if isHotbarVisible then
                isHotbarVisible = false
                SendNUIMessage({
                    action = "hideHotbar"
                })
                -- Remove blur effect
                ClearTimecycleModifier()
            end
        end
    end
end)
