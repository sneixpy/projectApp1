cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/org.apache.cordova.core.parseplugin/www/cdv-plugin-parse.js",
        "id": "org.apache.cordova.core.parseplugin.ParsePlugin",
        "clobbers": [
            "window.parsePlugin"
        ]
    },
    {
        "file": "plugins/com.phonegap.plugins.facebookconnect/facebookConnectPlugin.js",
        "id": "com.phonegap.plugins.facebookconnect.FacebookConnectPlugin",
        "clobbers": [
            "facebookConnectPlugin"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "com.sharinglabs.cordova.plugin.datepicker": "1.1.3",
    "cordova-plugin-whitelist": "1.0.0",
    "org.apache.cordova.core.parseplugin": "0.1.0",
    "com.phonegap.plugins.facebookconnect": "0.11.0"
}
// BOTTOM OF METADATA
});