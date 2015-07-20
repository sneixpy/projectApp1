var HomeView = function() {
 
 	this.render = function() {
		this.el.html(HomeView.template());
		this.el.trigger('create');
		this.buildChallengeList();
		return this;
	};
	this.reRender = function() {
		this.el.trigger('create');
		$(this.el).find('chooseDates').each(function( i, cD ) {
			var Num = cD.id.split("_")[1];
			$('#'+cD.id).datepicker('destroy');
		});
		return this;
	};
	this.buildChallengeList = function() {
		var Challenge = Parse.Object.extend("Challenge");
		var Challenges = Parse.Collection.extend({
			model: Challenge
		});
		var challenges = new Challenges();
		challenges.fetch({
			success: function() {
				$('.challenge-list').html(HomeView.liTemplate(challenges.toJSON()));
				$(this.el).find('challenge-list').html(HomeView.liTemplate(challenges.toJSON()));
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
				$('body').trigger('create');
			},
			error: function(challenges, error) {
				console.log(error);
			}
		});
	};
	this.initialize = function() {
        // Define a div wrapper for the view. The div wrapper is used to attach events.
        this.el = $('<div id="HomeViewDiv" />');
    };
    this.initialize();
 
}

HomeView.template = Handlebars.compile($("#home-tpl").html());
HomeView.liTemplate = Handlebars.compile($("#challenge-list-tpl").html());