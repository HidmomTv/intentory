fx_version 'cerulean'
game 'gta5'

author 'HidmomTv (fork of qb-inventory by QBCore Framework)'
description 'qb-inventory rework — fork of https://github.com/qbcore-framework/qb-inventory'
version '2.0.0'
provide 'qb-inventory'
repository 'https://github.com/HidmomTv/intentory'

export 'HasItem'
export 'OpenTrunk'
export 'OpenGlovebox'
export 'OpenStash'
export 'OpenShop'
export 'CreateShop'
export 'SyncPlayerUI'

shared_scripts {
    '@oxmysql/lib/MySQL.lua',
    'config/config.lua'
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
    'server/functions.lua',
    'server/items.lua',
    'server/commands.lua'
}

ui_page 'html/index.html'

files {
    'html/index.html',
    'html/style.css',
    'html/app.js',
    'html/images/*.png',
    'html/images/*.PNG',
    'html/images/*.jpg',
    'html/images/*.webp'
}

lua54 'yes'
