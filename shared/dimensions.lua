-- shared/dimensions.lua
-- Mapeo oficial de dimensiones espaciales (Tetris Grid) para ítems de QBCore.
-- Puedes editar libremente el ancho (w) y alto (h) de cada objeto.

Config = Config or {}

Config.Dimensions = {
    -- ARMAS CUERPO A CUERPO (MELEE)
    ['weapon_unarmed']               = { w = 1, h = 1 },
    ['weapon_dagger']                = { w = 1, h = 2 },
    ['weapon_bat']                   = { w = 1, h = 3 },
    ['weapon_bottle']                = { w = 1, h = 2 },
    ['weapon_crowbar']               = { w = 1, h = 3 },
    ['weapon_flashlight']            = { w = 1, h = 2 },
    ['weapon_golfclub']              = { w = 1, h = 4 },
    ['weapon_hammer']                = { w = 1, h = 2 },
    ['weapon_hatchet']               = { w = 2, h = 2 },
    ['weapon_knuckle']               = { w = 1, h = 1 },
    ['weapon_knife']                 = { w = 1, h = 2 },
    ['weapon_machete']               = { w = 1, h = 3 },
    ['weapon_switchblade']           = { w = 1, h = 1 },
    ['weapon_nightstick']            = { w = 1, h = 2 },
    ['weapon_wrench']                = { w = 1, h = 2 },
    ['weapon_battleaxe']             = { w = 2, h = 3 },
    ['weapon_poolcue']               = { w = 1, h = 4 },
    ['weapon_briefcase']             = { w = 3, h = 2 },
    ['weapon_briefcase_02']          = { w = 3, h = 2 },
    ['weapon_garbagebag']            = { w = 2, h = 2 },
    ['weapon_handcuffs']             = { w = 1, h = 1 },
    ['weapon_bread']                 = { w = 1, h = 2 },
    ['weapon_stone_hatchet']         = { w = 2, h = 2 },
    ['weapon_candycane']             = { w = 1, h = 2 },

    -- ARMAS CORTAS (HANDGUNS)
    ['weapon_pistol']                = { w = 2, h = 2 },
    ['weapon_pistol_mk2']            = { w = 2, h = 2 },
    ['weapon_combatpistol']          = { w = 2, h = 2 },
    ['weapon_appistol']              = { w = 2, h = 2 },
    ['weapon_stungun']               = { w = 2, h = 2 },
    ['weapon_pistol50']              = { w = 2, h = 2 },
    ['weapon_snspistol']             = { w = 1, h = 1 },
    ['weapon_heavypistol']           = { w = 2, h = 2 },
    ['weapon_vintagepistol']         = { w = 2, h = 2 },
    ['weapon_flaregun']              = { w = 2, h = 2 },
    ['weapon_marksmanpistol']        = { w = 2, h = 2 },
    ['weapon_revolver']              = { w = 2, h = 2 },
    ['weapon_revolver_mk2']          = { w = 2, h = 2 },
    ['weapon_doubleaction']          = { w = 2, h = 2 },
    ['weapon_snspistol_mk2']         = { w = 1, h = 1 },
    ['weapon_raypistol']             = { w = 2, h = 2 },
    ['weapon_ceramicpistol']         = { w = 1, h = 1 },
    ['weapon_navyrevolver']          = { w = 2, h = 2 },
    ['weapon_gadgetpistol']          = { w = 1, h = 1 },
    ['weapon_pistolxm3']             = { w = 2, h = 2 },

    -- SUBFUSILES (SMGS)
    ['weapon_microsmg']              = { w = 2, h = 2 },
    ['weapon_smg']                   = { w = 3, h = 2 },
    ['weapon_smg_mk2']               = { w = 3, h = 2 },
    ['weapon_assaultsmg']            = { w = 3, h = 2 },
    ['weapon_combatpdw']             = { w = 3, h = 2 },
    ['weapon_machinepistol']         = { w = 2, h = 2 },
    ['weapon_minismg']               = { w = 2, h = 2 },
    ['weapon_raycarbine']            = { w = 4, h = 2 },

    -- ESCOPETAS (SHOTGUNS)
    ['weapon_pumpshotgun']           = { w = 4, h = 2 },
    ['weapon_sawnoffshotgun']        = { w = 2, h = 2 },
    ['weapon_assaultshotgun']        = { w = 3, h = 2 },
    ['weapon_bullpupshotgun']        = { w = 3, h = 2 },
    ['weapon_musket']                = { w = 5, h = 1 },
    ['weapon_heavyshotgun']          = { w = 4, h = 2 },
    ['weapon_dbshotgun']             = { w = 3, h = 1 },
    ['weapon_autoshotgun']           = { w = 4, h = 2 },
    ['weapon_pumpshotgun_mk2']       = { w = 4, h = 2 },
    ['weapon_combatshotgun']         = { w = 4, h = 2 },

    -- FUSILES DE ASALTO (ASSAULT RIFLES)
    ['weapon_assaultrifle']          = { w = 4, h = 2 },
    ['weapon_assaultrifle_mk2']      = { w = 4, h = 2 },
    ['weapon_carbinerifle']          = { w = 4, h = 2 },
    ['weapon_carbinerifle_mk2']      = { w = 4, h = 2 },
    ['weapon_advancedrifle']         = { w = 3, h = 2 },
    ['weapon_specialcarbine']        = { w = 4, h = 2 },
    ['weapon_bullpuprifle']          = { w = 3, h = 2 },
    ['weapon_compactrifle']          = { w = 3, h = 2 },
    ['weapon_specialcarbine_mk2']    = { w = 4, h = 2 },
    ['weapon_bullpuprifle_mk2']      = { w = 3, h = 2 },
    ['weapon_militaryrifle']         = { w = 4, h = 2 },

    -- AMETRALLADORAS LIGERAS (LMGS)
    ['weapon_mg']                    = { w = 5, h = 2 },
    ['weapon_combatmg']              = { w = 5, h = 2 },
    ['weapon_gusenberg']             = { w = 4, h = 2 },
    ['weapon_combatmg_mk2']          = { w = 5, h = 2 },

    -- RIFLES DE FRANCOTIRADOR (SNIPER RIFLES)
    ['weapon_sniperrifle']           = { w = 5, h = 2 },
    ['weapon_heavysniper']           = { w = 5, h = 2 },
    ['weapon_marksmanrifle']         = { w = 4, h = 2 },
    ['weapon_remotesniper']          = { w = 4, h = 2 },
    ['weapon_heavysniper_mk2']       = { w = 5, h = 2 },
    ['weapon_marksmanrifle_mk2']     = { w = 4, h = 2 },

    -- COMIDA Y BEBIDA
    ['water_bottle']                 = { w = 1, h = 2 },
    ['kurkakola']                    = { w = 1, h = 2 },
    ['tosti']                        = { w = 1, h = 1 },
    ['sandwich']                     = { w = 1, h = 1 },
    ['coffee']                       = { w = 1, h = 1 },
    ['beer']                         = { w = 1, h = 2 },
    ['whiskey']                      = { w = 1, h = 2 },
    ['vodka']                        = { w = 1, h = 2 },

    -- MEDICINA
    ['bandage']                      = { w = 1, h = 1 },
    ['firstaid']                     = { w = 2, h = 2 },
    ['painkillers']                  = { w = 1, h = 1 },

    -- ELECTRÓNICA Y HERRAMIENTAS
    ['phone']                        = { w = 1, h = 2 },
    ['radio']                        = { w = 1, h = 2 },
    ['lockpick']                     = { w = 1, h = 1 },
    ['advancedlockpick']             = { w = 1, h = 1 },
    ['repairkit']                    = { w = 2, h = 2 },
    ['advancedrepairkit']            = { w = 2, h = 2 },
    ['id_card']                      = { w = 1, h = 1 },
    ['driver_license']               = { w = 1, h = 1 },
    ['lawyerpass']                   = { w = 1, h = 1 },

    -- MOCHILAS Y BOLSAS
    ['bag']                          = { w = 3, h = 3 }
}

-- Función inteligente de obtención de dimensiones
function GetItemDimensions(itemName)
    if not itemName then return 1, 1 end
    local cleanName = string.lower(itemName)

    -- 1. Buscar en overrides explícitos de Config.Dimensions
    if Config.Dimensions[cleanName] then
        return Config.Dimensions[cleanName].w, Config.Dimensions[cleanName].h
    end

    -- 2. Heurística automática por tipo/prefijo si es un ítem nuevo no registrado
    if string.find(cleanName, 'weapon_') then
        if string.find(cleanName, 'pistol') or string.find(cleanName, 'stun') then
            return 2, 2
        elseif string.find(cleanName, 'smg') or string.find(cleanName, 'shotgun') then
            return 3, 2
        elseif string.find(cleanName, 'rifle') or string.find(cleanName, 'sniper') or string.find(cleanName, 'mg') then
            return 4, 2
        else
            return 3, 2
        end
    elseif string.find(cleanName, 'bottle') or string.find(cleanName, 'can') or string.find(cleanName, 'cola') or string.find(cleanName, 'beer') then
        return 1, 2
    elseif string.find(cleanName, 'kit') or string.find(cleanName, 'box') or string.find(cleanName, 'case') then
        return 2, 2
    end

    -- Por defecto 1x1
    return 1, 1
end
