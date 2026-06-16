local inventoryOpen = false

RegisterCommand('inventory', function()
    ToggleInventory()
end)

RegisterKeyMapping('inventory', 'Open Inventory', 'keyboard', 'TAB')

function ToggleInventory()
    inventoryOpen = not inventoryOpen
    SetNuiFocus(inventoryOpen, inventoryOpen)
    SendNUIMessage({
        action = inventoryOpen and 'openInventory' or 'closeInventory'
    })
end

RegisterNUICallback('close', function(data, cb)
    inventoryOpen = false
    SetNuiFocus(false, false)
    cb('ok')
end)
