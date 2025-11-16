fx_version 'cerulean'
game 'gta5'

name 'NextGen Demo Plugin'
description 'Complete demo plugin showcasing all NextGen Framework features'
author 'NextGen Team'
version '1.0.0'

-- Server scripts
server_scripts {
  'server.js'
}

-- Client scripts
client_scripts {
  'client.js',
  'client/demos/target-demo.js',
  'client/ui-controller.js'
}

-- UI configuration
ui_page 'ui/dist/index.html'

files {
  'ui/dist/index.html',
  'ui/dist/assets/**/*'
}

-- Dependencies
dependency 'ng_core'
