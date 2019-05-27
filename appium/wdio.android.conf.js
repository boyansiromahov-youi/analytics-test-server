// wdio.dev.config.js
var merge = require('deepmerge');
var wdioConf = require('./wdio.conf.js');

// have main config file as default but overwrite environment specific information
exports.config = merge(wdioConf.config, {
  capabilities: [{
    app: 'app/DIRECTV-armeabi-v7a-debug.apk',
    automationName: 'YouiEngine',
    deviceName: 'Pixel',
    platformName: 'android',
    youiEngineAppAddress: '10.100.89.117',
    autoGrantPermissions: true
  }],

}, { clone: false });
