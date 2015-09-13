/**
 * openVenmo is a micro-library that lets you integrate your JavaScript application with Venmo.
 * openVenmo works for both BROWSER-BASED apps and CORDOVA/PHONEGAP apps.
 * This library has no dependency: You don't need (and shouldn't use) the Venmo SDK with this library. Whe running in
 * Cordova, you also don't need the Venmo Cordova plugin. There is also no dependency on jQuery.
 * openVenmo allows you to login to Venmo and execute any Venmo Graph API request.
 * @author Christophe Coenraets @ccoenraets
 * @version 0.5
 */
var openVenmo = (function () {

    var loginURL = 'https://api.venmo.com/v1/oauth/authorize',

        logoutURL = 'https://www.vemno.com/logout.php',
        
        loginRetrieved = false,

    // By default we store venmoAccessToken in sessionStorage. This can be overridden in init()
        tokenStore = window.sessionStorage,

    // The Venmo App Id. Required. Set using init().
        //fbAppId,
		venmoClientID,
		
        context = window.location.pathname.substring(0, window.location.pathname.lastIndexOf("/")),

        baseURL = location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '') + context,

    // Default OAuth redirect URL. Can be overriden in init()
        oauthRedirectURL = baseURL + '/oauthcallback.html',

    // Default Cordova OAuth redirect URL. Can be overriden in init()
        cordovaOAuthRedirectURL = "https://www.venmo.com/connect/login_success.html",

    // Default Logout redirect URL. Can be overriden in init()
        logoutRedirectURL = baseURL + '/logoutcallback.html',

    // Because the OAuth login spans multiple processes, we need to keep the login callback function as a variable
    // inside the module instead of keeping it local within the login function.
        loginCallback,

    // Indicates if the app is running inside Cordova
        runningInCordova,

    // Used in the exit event handler to identify if the login has already been processed elsewhere (in the oauthCallback function)
        loginProcessed;

    // MAKE SURE YOU INCLUDE <script src="cordova.js"></script> IN YOUR index.html, OTHERWISE runningInCordova will always by false.
    // You don't need to (and should not) add the actual cordova.js file to your file system: it will be added automatically
    // by the Cordova build process
    document.addEventListener("deviceready", function () {
        runningInCordova = true;
    }, false);

    /**
     * Initialize the openVenmo module. You must use this function and initialize the module with an appId before you can
     * use any other function.
     * @param params - init paramters
     *  clientId: (Required) The id of the Venmo app,
     *  tokenStore: (optional) The store used to save the Venmo token. If not provided, we use sessionStorage.
     *  loginURL: (optional) The OAuth login URL. Defaults to https://www.Venmo.com/dialog/oauth.
     *  logoutURL: (optional) The logout URL. Defaults to https://www.Venmo.com/logout.php.
     *  oauthRedirectURL: (optional) The OAuth redirect URL. Defaults to [baseURL]/oauthcallback.html.
     *  cordovaOAuthRedirectURL: (optional) The OAuth redirect URL. Defaults to https://www.Venmo.com/connect/login_success.html.
     *  logoutRedirectURL: (optional) The logout redirect URL. Defaults to [baseURL]/logoutcallback.html.
     *  accessToken: (optional) An already authenticated access token.
     */
    function init(params) {

        if (params.clientId) {
            venmoClientID = params.clientId;
        } else {
            throw 'clientId parameter not set in init()';
        }

        if (params.tokenStore) {
            tokenStore = params.tokenStore;
        }

        if (params.accessToken) {
            tokenStore.venmoAccessToken = params.accessToken;
        }

        loginURL = params.loginURL || loginURL;
        logoutURL = params.logoutURL || logoutURL;
        oauthRedirectURL = params.oauthRedirectURL || oauthRedirectURL;
        cordovaOAuthRedirectURL = params.cordovaOAuthRedirectURL || cordovaOAuthRedirectURL;
        logoutRedirectURL = params.logoutRedirectURL || logoutRedirectURL;
    }

    /**
     * Checks if the user has logged in with openVenmo and currently has a session api token.
     * @param callback the function that receives the loginstatus
     */
    function getLoginStatus(callback) {
        var token = tokenStore.venmoAccessToken,
            loginStatus = {};
        if (token) {
            loginStatus.status = 'connected';
            loginStatus.authResponse = {accessToken: token};
        } else {
            loginStatus.status = 'unknown';
        }
        if (callback) callback(loginStatus);
    }

    /**
     * Login to Venmo using OAuth. If running in a Browser, the OAuth workflow happens in a a popup window.
     * If running in Cordova container, it happens using the In-App Browser. Don't forget to install the In-App Browser
     * plugin in your Cordova project: cordova plugins add org.apache.cordova.inappbrowser.
     *
     * @param callback - Callback function to invoke when the login process succeeds
     * @param options - options.scope: The set of Venmo permissions requested
     * @returns {*}
     */
    function login(callback, options) {

        var loginWindow,
            startTime,
            scope = '',
            redirectURL = runningInCordova ? cordovaOAuthRedirectURL : oauthRedirectURL;

        if (!venmoClientID) {
            return callback({status: 'unknown', error: 'Venmo App Id not set.'});
        }

        // Inappbrowser load start handler: Used when running in Cordova only
        function loginWindow_loadStartHandler(event) {
            var url = event.url;
            if (url.indexOf("access_token=") > 0 || url.indexOf("error=") > 0) {
                // When we get the access token fast, the login window (inappbrowser) is still opening with animation
                // in the Cordova app, and trying to close it while it's animating generates an exception. Wait a little...
                var timeout = 600 - (new Date().getTime() - startTime);
                setTimeout(function () {
                    loginWindow.close();
                }, timeout > 0 ? timeout : 0);
                oauthCallback(url);
            }
        }

        // Inappbrowser exit handler: Used when running in Cordova only
        function loginWindow_exitHandler() {
            console.log('exit and remove listeners');
            // Handle the situation where the user closes the login window manually before completing the login process
            if (loginCallback && !loginProcessed) loginCallback({status: 'user_cancelled'});
            loginWindow.removeEventListener('loadstop', loginWindow_loadStopHandler);
            loginWindow.removeEventListener('exit', loginWindow_exitHandler);
            loginWindow = null;
            console.log('done removing listeners');
        }

        if (options && options.scope) {
            scope = options.scope;
        }

        loginCallback = callback;
        loginProcessed = false;

        startTime = new Date().getTime();
        loginWindow = window.open(loginURL + '?client_id=' + venmoClientID +
            '&response_type=token&scope=' + scope, '_blank', 'location=no,clearcache=yes');

        // If the app is running in Cordova, listen to URL changes in the InAppBrowser until we get a URL with an access_token or an error
        if (runningInCordova) {
            loginWindow.addEventListener('loadstart', loginWindow_loadStartHandler);
            loginWindow.addEventListener('exit', loginWindow_exitHandler);
        }
        // Note: if the app is running in the browser the loginWindow dialog will call back by invoking the
        // oauthCallback() function. See oauthcallback.html for details.

    }
    function runFunction(fnstring, var1, var2) {
    	switch (fnstring) {
			case "logout": logout(var1); break;
			case "revokePermissions": revokePermissions(var1, var2); break;
			case "getLoginStatus": getLoginStatus(var1); break;
			case "api": api(var1); break;
			case "login": login(var1,var2); break;
		}
    }
    function validateLogin(fnstring, var1, var2) {
    	if ( !loginRetrieved ) {
			var Session = Parse.Object.extend("Session");
			var query = new Parse.Query(Session);
			query.equalTo("GUUID", GUUID);
			query.find({
				success: function(results) {
					if ( results.length > 0 ) {
						var object = results[0];
						tokenStore.venmoAccessToken = object.get('access_token');
						loginRetrieved = true;
						runFunction(fnstring, var1, var2);
					} else {
						runFunction(fnstring, var1, var2);
					}
				},
				error: function(error) {
					alert("Error: " + error.code + " " + error.message);
				}
			});
		} else {
			runFunction(fnstring, var1, var2);
		}
    }
    /**
     * Called either by oauthcallback.html (when the app is running the browser) or by the loginWindow loadstart event
     * handler defined in the login() function (when the app is running in the Cordova/PhoneGap container).
     * @param url - The oautchRedictURL called by Venmo with the access_token in the querystring at the ned of the
     * OAuth workflow.
     */
    function oauthCallback(url) {
        // Parse the OAuth data received from Venmo
        var queryString,
            obj;

        loginProcessed = true;
        if (url.indexOf("access_token=") > 0) {
            queryString = url.substr(url.indexOf('#') + 1);
            obj = parseQueryString(queryString);
            tokenStore.venmoAccessToken = obj['access_token'];
            if (loginCallback) loginCallback({status: 'connected', authResponse: {accessToken: obj['access_token']}});
        } else if (url.indexOf("error=") > 0) {
            queryString = url.substring(url.indexOf('?') + 1, url.indexOf('#'));
            obj = parseQueryString(queryString);
            if (loginCallback) loginCallback({status: 'not_authorized', error: obj.error});
        } else {
            if (loginCallback) loginCallback({status: 'not_authorized'});
        }
    }

    /**
     * Logout from Venmo, and remove the token.
     * IMPORTANT: For the Venmo logout to work, the logoutRedirectURL must be on the domain specified in "Site URL" in your Venmo App Settings
     *
     */
    function logout(callback) {
        var logoutWindow,
            token = tokenStore.venmoAccessToken;

        /* Remove token. Will fail silently if does not exist */
        tokenStore.removeItem('venmoAccessToken');

        if (token) {
            logoutWindow = window.open(logoutURL + '?access_token=' + token + '&next=' + logoutRedirectURL, '_blank', 'location=no,clearcache=yes');
            if (runningInCordova) {
                setTimeout(function() {
                    logoutWindow.close();
                }, 700);
            }
        }

        if (callback) {
            callback();
        }

    }

    /**
     * Lets you make any Venmo Graph API request.
     * @param obj - Request configuration object. Can include:
     *  method:  HTTP method: GET, POST, etc. Optional - Default is 'GET'
     *  path:    path in the Venmo graph: /me, /me.friends, etc. - Required
     *  params:  queryString parameters as a map - Optional
     *  success: callback function when operation succeeds - Optional
     *  error:   callback function when operation fails - Optional
     */
    function api(obj) {

        var method = obj.method || 'GET',
            params = obj.params || {},
            xhr = new XMLHttpRequest(),
            url;

        params['access_token'] = tokenStore.venmoAccessToken;

        url = 'https://graph.Venmo.com' + obj.path + '?' + toQueryString(params);

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    if (obj.success) obj.success(JSON.parse(xhr.responseText));
                } else {
                    var error = xhr.responseText ? JSON.parse(xhr.responseText).error : {message: 'An error has occurred'};
                    if (obj.error) obj.error(error);
                }
            }
        };

        xhr.open(method, url, false);
        xhr.send();
    }

    /**
     * Helper function to de-authorize the app
     * @param success
     * @param error
     * @returns {*}
     */
    function revokePermissions(success, error) {
        return api({method: 'DELETE',
            path: '/me/permissions',
            success: function () {
                success();
            },
            error: error});
    }

    function parseQueryString(queryString) {
        var qs = decodeURIComponent(queryString),
            obj = {},
            params = qs.split('&');
        params.forEach(function (param) {
            var splitter = param.split('=');
            obj[splitter[0]] = splitter[1];
        });
        return obj;
    }

    function toQueryString(obj) {
        var parts = [];
        for (var i in obj) {
            if (obj.hasOwnProperty(i)) {
                parts.push(encodeURIComponent(i) + "=" + encodeURIComponent(obj[i]));
            }
        }
        return parts.join("&");
    }

    // The public API
    return {
        init: init,
        login: login,
        logout: logout,
        revokePermissions: revokePermissions,
        api: api,
        oauthCallback: oauthCallback,
        validateLogin: validateLogin,
        getLoginStatus: getLoginStatus
    }

}());