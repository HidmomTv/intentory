-- client/loot.lua

local function RotationToDirection(rotation)
    local adjustedRotation = {
        x = (math.pi / 180) * rotation.x,
        y = (math.pi / 180) * rotation.y,
        z = (math.pi / 180) * rotation.z
    }
    local direction = {
        x = -math.sin(adjustedRotation.z) * math.abs(math.cos(adjustedRotation.x)),
        y = math.cos(adjustedRotation.z) * math.abs(math.cos(adjustedRotation.x)),
        z = math.sin(adjustedRotation.x)
    }
    return direction
end

local function GetEntityPlayerIsLookingAt(distance)
    local ped = PlayerPedId()
    local cameraRotation = GetGameplayCamRot()
    local cameraCoord = GetGameplayCamCoord()
    local direction = RotationToDirection(cameraRotation)
    
    local destination = {
        x = cameraCoord.x + direction.x * distance,
        y = cameraCoord.y + direction.y * distance,
        z = cameraCoord.z + direction.z * distance
    }
    
    local rayHandle = CastRayPointToPoint(cameraCoord.x, cameraCoord.y, cameraCoord.z, destination.x, destination.y, destination.z, 16, ped, 0)
    local _, hit, endCoords, surfaceNormal, entityHit = GetRaycastResult(rayHandle)
    
    if hit == 1 and entityHit ~= 0 then
        return entityHit, endCoords
    end
    return nil, nil
end

-- Lista de hashes de modelos de props que se pueden saquear
local lootableProps = {
    [GetHashKey("prop_dumpster_01a")] = "basura",
    [GetHashKey("prop_dumpster_02a")] = "basura",
    [GetHashKey("prop_bin_01a")] = "papelera",
    [GetHashKey("prop_box_wood02a_pu")] = "caja",
}

Citizen.CreateThread(function()
    while true do
        Citizen.Wait(0)
        
        -- Al pulsar ALT (tecla 19) o E (38)
        if IsControlJustPressed(0, 38) then 
            local entityHit, endCoords = GetEntityPlayerIsLookingAt(3.0)
            if entityHit then
                local model = GetEntityModel(entityHit)
                
                -- Si el modelo que miramos está en nuestra tabla de loot
                if lootableProps[model] then
                    local lootType = lootableProps[model]
                    local propCoords = GetEntityCoords(entityHit)
                    
                    -- Avisamos al servidor para que genere el loot según el tipo (basura, papelera, etc.)
                    TriggerServerEvent('universal_inventory:server:searchProp', lootType, propCoords)
                    
                    -- Prevenimos spam de la tecla
                    Citizen.Wait(2000) 
                end
            end
        end
    end
end)
