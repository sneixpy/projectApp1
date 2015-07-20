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
	route: function(page,id) {  // Function to navigate all to all different pages
		var self = this;
		if (page == 'HomeView' || !page) {
			if (this.homeView){
				this.homePage=true;
				this.slidePage(this.homeView.reRender());
			}else{
				this.homeView = new HomeView();
				this.slidePage(this.homeView.render());
			}
		}else if (page == "chooseChallenger"){
			if (this.challengeWho){
				this.slidePage(this.challengeWho.reRender());
			}else{
				this.challengeWho = new ChallengeWho(id);
				this.slidePage(this.challengeWho.render());
			}
		}
		//else if (page == "challenge"){
		//	var CD = new ChallengeDetails(id);
		return;
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
		$('.stage-right, .stage-left, .stage-center').remove();
		//$('.stage-right, .stage-left').not('.homePage').remove();
		
		if (app.homePage) {
			// Always apply a Back transition (slide from left) when we go back to the search page
			$(page.el).attr('class', 'page stage-left');
			currentPageDest = "stage-right";
		} else {
			// Forward transition (slide from right)
			$(page.el).attr('class', 'page stage-right');
			currentPageDest = "stage-left";
		}
		this.currentPage = page;
		$('body').append(page.el);
		$('body').trigger('create');
		$('.page').css("display","block");
		$('.ui-page').css("display","block");

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
		this.route();
		this.registerEvents();
	}
};
app.initialize();

function onClickList (id) {
	app.route('challenge',id);
}
function onChooseChallenger (ChallengeID) {
	app.route('chooseChallenger',ChallengeID);
}
function goHome () {
	app.route('HomeView');
}



