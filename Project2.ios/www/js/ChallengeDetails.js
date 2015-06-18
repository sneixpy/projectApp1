/* Challenge details page
 This page will set the start/end date of challenge.
 this page will set the ratio of the challenge (may be moved to person selector)
*/
var ChallengeDetails = function(ChallengeID) {
	this.render = function() {
		var self = this;
		this.el.html(ChallengeDetails.template(this.challenge));
		$( ".date-input-css" ).datepicker();
		app.slidePage(this);
	};
    this.initialize = function(ChallengeID) {
        this.el = $('<div/>');
		var self = this;
		var Cid = ChallengeID;
		
		$.ajax({

			  // The 'type' property sets the HTTP method.
			  // A value of 'PUT' or 'DELETE' will trigger a preflight request.
			  type: 'GET',

			  // The URL to make the request to.
			  url: 'http://stmiconsulting.com/APP/challenge/',

			  // The 'contentType' property sets the 'Content-Type' header.
			  // The JQuery default for this property is
			  // 'application/x-www-form-urlencoded; charset=UTF-8', which does not trigger
			  // a preflight. If you set this value to anything other than
			  // application/x-www-form-urlencoded, multipart/form-data, or text/plain,
			  // you will trigger a preflight request.
			  contentType: 'application/x-www-form-urlencoded; charset=UTF-8',

			  xhrFields: {
				// The 'xhrFields' property sets additional fields on the XMLHttpRequest.
				// This can be used to set the 'withCredentials' property.
				// Set the value to 'true' if you'd like to pass cookies to the server.
				// If this is enabled, your server must respond with the header
				// 'Access-Control-Allow-Credentials: true'.
				withCredentials: false
			  },

			  headers: {
				// Set any custom headers here.
				// If you set any non-simple headers, your server must include these
				// headers in the 'Access-Control-Allow-Headers' response header.
			  },

			  success: function(data){
					$.each(data.challenges, function(i,chg){
						if (Cid == chg.id)
							self.challenge = chg;
					});
					self.render();
				},

			  error: function() {
				// Here's where you handle an error response.
				// Note that if the error was due to a CORS issue,
				// this function will still fire, but there won't be any additional
				// information about the error.
			}
		});
		
		
		
		
		
		
		/*
		var url= "http://stmiconsulting.com/cgi-bin/APP/dataConnection.php?Type=getChallenges";
		$.getJSON(url,function(data){
			$.each(data.challenges, function(i,chg){
				if (Cid == chg.id)
					self.challenge = chg;
			});
			self.render();
		});
		*/
    };

	this.initialize(ChallengeID);
}
ChallengeDetails.template = Handlebars.compile($("#challenge-details-tpl").html());


function createCORSRequest(method, url) {
  var xhr = new XMLHttpRequest();
  if ("withCredentials" in xhr) {

    // Check if the XMLHttpRequest object has a "withCredentials" property.
    // "withCredentials" only exists on XMLHTTPRequest2 objects.
    xhr.open(method, url, true);

  } else if (typeof XDomainRequest != "undefined") {

    // Otherwise, check if XDomainRequest.
    // XDomainRequest only exists in IE, and is IE's way of making CORS requests.
    xhr = new XDomainRequest();
    xhr.open(method, url);

  } else {

    // Otherwise, CORS is not supported by the browser.
    xhr = null;

  }
  return xhr;
}

var xhr = createCORSRequest('GET', url);
if (!xhr) {
  throw new Error('CORS not supported');
}