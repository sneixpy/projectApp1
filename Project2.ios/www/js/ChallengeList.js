var ChallengeList = function() {
 
 	this.render = function() {
		this.el.html(ChallengeList.template());
		$('#tempContentDIV').append(this.el);
		$('#tempContentDIV').trigger('create');
		this.getChallengeList();
		return this;
	};
	this.setAside = function() {
	    $("#ChallengeListDiv").attr('class', 'page stage-center');
		$("#ChallengeListDiv").hide();
	};
	this.reRender = function() {
		$("#ChallengeListDiv").show();
		return this;
	};
	this.buildChallengeList = function() {
		$('.challenge-list').html(ChallengeList.liTemplate(ChallengeList.challengeList));
		//$(this.el).find('challenge-list').html(ChallengeList.liTemplate(challenges.toJSON()));
		$(' .chooseDates').each(function( i, cD ) {
			var Num = cD.id.split("_")[1];
			$('#'+cD.id).datepicker({
				minDate: 0,
				beforeShowDay: function(date) {
					var date1 = $.datepicker.parseDate($.datepicker._defaults.dateFormat, $("#input1_"+Num).val());
					var date2 = $.datepicker.parseDate($.datepicker._defaults.dateFormat, $("#input2_"+Num).val());
					return [true, date1 && ((date.getTime() == date1.getTime()) || (date2 && date >= date1 && date <= date2)) ? "dp-highlight" : ""];
				},
				onSelect: function(dateText, inst) {
					var date1 = $.datepicker.parseDate($.datepicker._defaults.dateFormat, $("#input1_"+Num).val());
					var date2 = $.datepicker.parseDate($.datepicker._defaults.dateFormat, $("#input2_"+Num).val());
					if (!date1 || date2) {
						$("#input1_"+Num).val(dateText);
						$("#input2_"+Num).val("");
						$(this).datepicker("option", "minDate", dateText);
					} else {
						$("#input2_"+Num).val(dateText);
						$(this).datepicker("option", "minDate", 0);
					}
				}
			});
		});
		$('.challenge-list').trigger('create');
	};
	this.getChallengeList = function() {
		var self = this;
		if ( ChallengeList.challengeList.length < 1 ) {
			var Challenge = Parse.Object.extend("Challenge");
			var Challenges = Parse.Collection.extend({
				model: Challenge
			});
			var challenges = new Challenges();
			challenges.fetch({
				success: function() {
					ChallengeList.challengeList = challenges.toJSON();
					self.buildChallengeList();
				},
				error: function(challenges, error) {
					console.log(error);
				}
			});
		} else {
			this.buildChallengeList();
		}
	};
	this.initialize = function() {
        // Define a div wrapper for the view. The div wrapper is used to attach events.
        this.el = $('<div id="ChallengeListDiv" />');
    };
    this.initialize();
 
}
ChallengeList.challengeList = [];
ChallengeList.template = Handlebars.compile($("#challenge-home-tpl").html());
ChallengeList.liTemplate = Handlebars.compile($("#challenge-list-tpl").html());