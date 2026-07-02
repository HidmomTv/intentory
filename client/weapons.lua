local QBCore = exports['qb-core']:GetCoreObject()

RegisterNUICallback('modifyWeapon', function(data, cb)
    local ped = PlayerPedId()
    local weaponHash = tonumber(data.weaponName) or GetHashKey(data.weaponName)
    local componentHash = tonumber(data.componentHash) or tonumber(data.componentName)
    if not componentHash and data.componentName then
        componentHash = GetHashKey(tostring(data.componentName))
    end
    
    if HasPedGotWeapon(ped, weaponHash, false) then
        if data.install then
            GiveWeaponComponentToPed(ped, weaponHash, componentHash)
            QBCore.Functions.Notify("Accesorio acoplado al arma en mano", "success")
        else
            RemoveWeaponComponentFromPed(ped, weaponHash, componentHash)
            QBCore.Functions.Notify("Accesorio desacoplado del arma en mano", "primary")
        end
    else
        if data.install then
            QBCore.Functions.Notify("Accesorio acoplado al arma del inventario", "success")
        else
            QBCore.Functions.Notify("Accesorio desacoplado del arma del inventario", "primary")
        end
    end

    TriggerServerEvent('qb-inventory:server:modifyWeaponAttachment', data.slot, componentHash, data.install)
    cb({ success = true })
end)
