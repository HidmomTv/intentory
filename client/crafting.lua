-- client/crafting.lua
local function IsNearProp(propModels, distance)
    local ped = PlayerPedId()
    local coords = GetEntityCoords(ped)
    for _, model in ipairs(propModels) do
        local obj = GetClosestObjectOfType(coords.x, coords.y, coords.z, distance, model, false, false, false)
        if obj ~= 0 then
            return true, obj
        end
    end
    return false, nil
end

local craftingEnvironments = {
    campfire = { GetHashKey("prop_beach_fire") },
    workbench = { GetHashKey("prop_toolchest_01") },
    lab = { GetHashKey("v_ret_ml_tablea") }
}

RegisterNUICallback('checkCraftingEnvironment', function(data, cb)
    local envType = data.envType
    if craftingEnvironments[envType] then
        local isNear, prop = IsNearProp(craftingEnvironments[envType], 3.0)
        cb({ success = isNear })
    else
        cb({ success = true }) -- No environment required
    end
end)
