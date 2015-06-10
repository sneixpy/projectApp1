/* Challenge details page
 This page will set the start/end date of challenge.
 this page will set the ratio of the challenge (may be moved to person selector)
*/
var ChallengeDetails = function() {
	this.render = function(obj) {
		this.el.html(ChallengeDetails.template(obj));
		$( ".date-input-css" ).datepicker();
		return this;
	};
    this.initialize = function(ChallengeID) {
        this.el = $('<div/>');
        this.challengeID = ChallengeID;
        var r = $.Deferred();
        var Challenge = Parse.Object.extend("Challenge");
		var query = new Parse.Query(Challenge);
		var myResults = Parse.Object.extend("Challenge");
		query.equalTo("num", this.challengeID.toString());
		query.find({
			success: function(results) {
				for (var i = 0; i < results.length; i++) { 
					myResults = results[i];
				}
				r.resolve();
				this.tmpObj = myResults.attributes;
				return this.tmpObj;
			},
			error: function(error) {
				alert("Error: " + error.code + " " + error.message);
			}
		});
    };
    /*
    this.render = function(ChallengeID) {
    	var self = this;
        var Challenge = Parse.Object.extend("Challenge");
		var query = new Parse.Query(Challenge);
		var myResults = Parse.Object.extend("Challenge");
		query.equalTo("num", this.challengeID.toString());
		return query.find({
			success: function(results) {
				for (var i = 0; i < results.length; i++) { 
					myResults = results[i];
				}
				this.tmpObj = myResults.attributes;
				self.el.html(ChallengeDetails.template(this.tmpObj));
				$( ".date-input-css" ).datepicker();
				return this;
			},
			error: function(error) {
				alert("Error: " + error.code + " " + error.message);
			}
		});
	};
    this.initialize = function(ChallengeID) {
        this.el = $('<div/>');
        this.challengeID = ChallengeID;		
    };*/
}
ChallengeDetails.template = Handlebars.compile($("#challenge-details-tpl").html());