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
		var url= "http://stmiconsulting.com/cgi-bin/APP/dataConnection.php?Type=getChallenges";
		$.getJSON(url,function(data){
			$.each(data.challenges, function(i,chg){
				if (Cid == chg.id)
					self.challenge = chg;
			});
			self.render();
		});
		/*
		
        var r = $.Deferred();
        var Challenge = Parse.Object.extend("Challenge");
		var query = new Parse.Query(Challenge);
		var myResults = Parse.Object.extend("Challenge");
		query.equalTo("num", this.challengeID.toString());
		query.find(null, {}).then(
			function(results) { 
				for (var i = 0; i < results.length; i++) { 
					myResults = results[i];
				}
				r.resolve();
				this.tmpObj = myResults.attributes;
			}, 
			function() { alert("Error: " + error.code + " " + error.message); }
		);
		return this.tmpObj;
		*/
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
	this.initialize(ChallengeID);
}
ChallengeDetails.template = Handlebars.compile($("#challenge-details-tpl").html());