/* Challenge details page
 This page will set the start/end date of challenge.
 this page will set the ratio of the challenge (may be moved to person selector)
*/
var ChallengeDetails = function(challenge) {
	this.render = function() {
		this.el.html(ChallengeDetails.template(challenge));
		return this;
	};
    this.initialize = function() {
        this.el = $('<div/>');
    };
    this.initialize();
}
ChallengeDetails.template = Handlebars.compile($("#challenge-details-tpl").html());