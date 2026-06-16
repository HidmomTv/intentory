fx_version 'cerulean'
game 'gta5'

author 'Antigravity'
description 'Universal Tetris Inventory'

shared_scripts {
    '@oxmysql/lib/MySQL.lua',
    'shared/config.lua'
}

client_scripts {
    'client/main.lua',
    'client/clothing.lua',
    'client/loot.lua',
    'client/rob.lua',
    'client/crafting.lua',
    'client/weapons.lua',
    'client/hotbar.lua'
}

server_scripts {
    'server/main.lua',
    'server/items.lua'
}

ui_page 'web/dist/index.html'

files {
    'web/dist/index.html',
    'web/dist/assets/*.js',
    'web/dist/assets/*.css',
    'web/dist/assets/*.png',
    'web/dist/assets/*.svg'
}

lua54 'yes'
