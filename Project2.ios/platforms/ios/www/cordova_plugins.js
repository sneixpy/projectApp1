cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/com.sharinglabs.cordova.plugin.datepicker/www/ios/DatePicker.js",
        "id": "com.sharinglabs.cordova.plugin.datepicker.DatePicker",
        "clobbers": [
            "datePicker"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.core.parseplugin/www/cdv-plugin-parse.js",
        "id": "org.apache.cordova.core.parseplugin.ParsePlugin",
        "clobbers": [
            "window.parsePlugin"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-whitelist": "1.0.0",
    "com.sharinglabs.cordova.plugin.datepicker": "1.1.3",
    "org.apache.cordova.core.parseplugin": "0.1.0"
}
// BOTTOM OF METADATA
});