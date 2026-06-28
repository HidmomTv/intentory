-- client/weapons.lua
RegisterNUICallback('modifyWeapon', function(data, cb)
    local ped = PlayerPedId()
    local weaponHash = GetHashKey(data.weaponName)
    local componentHash = GetHashKey(data.componentName)
    
    if HasPedGotWeapon(ped, weaponHash, false) then
        if data.install then
            GiveWeaponComponentToPed(ped, weaponHash, componentHash)
            QBCore.Functions.Notify("Accesorio acoplado al arma", "success")
        else
            RemoveWeaponComponentFromPed(ped, weaponHash, componentHash)
            QBCore.Functions.Notify("Accesorio desacoplado del arma", "info")
        end
        TriggerServerEvent('qb-inventory:server:modifyWeaponAttachment', data.slot, data.componentName, data.install)
        cb({ success = true })
    else
        QBCore.Functions.Notify("Debes tener el arma en mano para modificarla", "error")
        cb({ success = false, error = "No tienes el arma equipada" })
    end
end)
