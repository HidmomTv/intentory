-- client/weapons.lua
RegisterNUICallback('modifyWeapon', function(data, cb)
    local ped = PlayerPedId()
    local weaponHash = GetHashKey(data.weaponName)
    local componentHash = GetHashKey(data.componentName)
    
    if HasPedGotWeapon(ped, weaponHash, false) then
        GiveWeaponComponentToPed(ped, weaponHash, componentHash)
        print("^2[Armas] Accesorio instalado.^7")
        -- TODO: Play an animation of tinkering with the weapon
        cb({ success = true })
    else
        print("^1[Armas] No tienes el arma equipada para modificarla.^7")
        cb({ success = false, error = "No tienes el arma equipada" })
    end
end)
