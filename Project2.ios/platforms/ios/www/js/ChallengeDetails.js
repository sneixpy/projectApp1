/* Challenge details page
 This page will set the start/end date of challenge.
 this page will set the ratio of the challenge (may be moved to person selector)
*/
var ChallengeDetails = function(ChallengeID) {
	this.render = function() {
		this.el.html(ChallengeDetails.template(this.tmpObj));
		$( ".date-input-css" ).datepicker();
		return this;
	};
    this.initialize = function(ChallengeID) {
        this.el = $('<div/>');
        this.challengeID = ChallengeID;
        var Challenge = Parse.Object.extend("Challenge");
		var query = new Parse.Query(Challenge);
		var myResults = Parse.Object.extend("Challenge");
		query.equalTo("num", this.challengeID.toString());
		query.find({
			success: function(results) {
				for (var i = 0; i < results.length; i++) { 
					myResults = results[i];
				}
			},
			error: function(error) {
				alert("Error: " + error.code + " " + error.message);
			}
		});
		//console.log(myResults[0].attributes.Name);
		this.tmpObj = myResults.attributes;
    };
}
ChallengeDetails.template = Handlebars.compile($("#challenge-details-tpl").html());