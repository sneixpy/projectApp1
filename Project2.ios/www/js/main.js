Parse.initialize("6Wy9VizWsuh5dXErxzoagrHF3m6p0065xVO6C4XA", "BFINDwmJhhAIhc9o3tQ4ACY2XrJIdmJA91grNHrs");

var app = {  // main app navigates and readys the app content.
	showAlert: function (message, title) {
		if (navigator.notification) {
			navigator.notification.alert(message, null, title, 'OK');
		} else {
			alert(title ? (title + ": " + message) : message);
		}
	},
	registerEvents: function() {
		var self = this;
		// Check of browser supports touch events...
		if (document.documentElement.hasOwnProperty('ontouchstart')) {
			// ... if yes: register touch event listener to change the "selected" state of the item
			$('body').on('touchstart', 'a', function(event) {
				$(event.target).addClass('tappable-active');
			});
			$('body').on('touchend', 'a', function(event) {
				$(event.target).removeClass('tappable-active');
			});
		} else {
			// ... if not: register mouse events instead
			$('body').on('mousedown', 'a', function(event) {
				$(event.target).addClass('tappable-active');
			});
			$('body').on('mouseup', 'a', function(event) {
				$(event.target).removeClass('tappable-active');
			});
		}
	},
	route: function(id) {  // Function to navigate all to all different pages
		var self = this;
		if (!id) {
			if (this.homePage) {
				this.slidePage(this.homePage);
			} else {
				this.homePage = new HomeView().render();
				this.slidePage(this.homePage);
			}
			return;
		}else{
			var Challenge = Parse.Object.extend("Challenge");
			var query = new Parse.Query(Challenge);
			query.equalTo("num", id);
			query.find({
			  success: function(results) {
				for (var i = 0; i < results.length; i++) { 
				  var object = results[i];
				  self.slidePage(new ChallengeDetails(object.get('Name')).render());
				  $( ".date-input-css" ).datepicker();
				}
			  },
			  error: function(error) {
				alert("Error: " + error.code + " " + error.message);
			  }
			});
		}
	},
	slidePage: function(page) {
 
		var currentPageDest,
			self = this;
 
		// If there is no current page (app just started) -> No transition: Position new page in the view port
		if (!this.currentPage) {
			$(page.el).attr('class', 'page stage-center');
			$('body').append(page.el);
			this.currentPage = page;
			return;
		}
 
		// Cleaning up: remove old pages that were moved out of the viewport
		$('.stage-right, .stage-left').not('.homePage').remove();
 
		if (page === app.homePage) {
			// Always apply a Back transition (slide from left) when we go back to the search page
			$(page.el).attr('class', 'page stage-left');
			currentPageDest = "stage-right";
		} else {
			// Forward transition (slide from right)
			$(page.el).attr('class', 'page stage-right');
			currentPageDest = "stage-left";
		}
 
		$('body').append(page.el);
 
		// Wait until the new page has been added to the DOM...
		setTimeout(function() {
			// Slide out the current page: If new page slides from the right -> slide current page to the left, and vice versa
			$(self.currentPage.el).attr('class', 'page transition ' + currentPageDest);
			// Slide in the new page
			$(page.el).attr('class', 'page stage-center transition');
			self.currentPage = page;
		});
 
	},
	initialize: function() {
		var self = this;
		this.registerEvents();
		this.route();
		var Challenge = Parse.Object.extend("Challenge");
		var Challenges = Parse.Collection.extend({
			model: Challenge
		});
		var challenges = new Challenges();
		challenges.fetch({
			success: function(challenges) {
				$('.challenge-list').html(app.liTemplate(challenges.toJSON()));
			},
			error: function(challenges, error) {
				console.log(error);
			}
		});
	}
};
app.initialize();
app.liTemplate = Handlebars.compile($("#challenge-list-tpl").html());
function onClick (id) {
	app.route(id);
}



