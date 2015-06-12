﻿/* Challenge details page
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
    };

	this.initialize(ChallengeID);
}
ChallengeDetails.template = Handlebars.compile($("#challenge-details-tpl").html());