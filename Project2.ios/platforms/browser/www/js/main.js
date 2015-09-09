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
		this.tDIV = [];
		if ( this.homePage === 'ChallengeList' && page != 'ChallengeList' && this.challengeList ) {
			this.challengeList.setAside();
		}
		if (page == 'ChallengeList'){
			this.homePage = 'ChallengeList';
			if (this.challengeList) {
				this.slidePage(this.challengeList.reRender());
			} else {
				this.challengeList = new ChallengeList();
				this.slidePage(this.challengeList.render());
			}
		}else if (page == 'MemberLogin'  || !page) {
			this.homePage = 'MemberLogin';
			this.memberLogin = new MemberLogin();
			this.slidePage(this.memberLogin.render());
		}else if (page == 'chooseChallenger'){
			this.homePage = 'chooseChallenger';
			this.challengeWho = new ChallengeWho(id);
			this.slidePage(this.challengeWho.render());
		}
		return;
	},
	slidePage: function(page) {
 
		var currentPageDest,
			self = this;
 
		// If there is no current page (app just started) -> No transition: Position new page in the view port
		if (!this.currentPage) {
			$(page.el).attr('class', 'page stage-center');
			//$('body').append(page.el);
			this.currentPage = page;
			return;
		} else {
			this.currentPage = page;
		}
		// Cleaning up: remove old pages that were moved out of the viewport
		$('.stage-right, .stage-left').not('#ChallengeListDiv').remove();
		//$('.stage-right, .stage-left').not('.homePage').remove();

		if (page === app.homePage) {
			// Always apply a Back transition (slide from left) when we go back to the search page
			$(page.el).attr('class', 'page stage-left');
			currentPageDest = "stage-right";
		} else {
			// Forward transition (slide from right)
			$(page.el).attr('class', 'page stage-right');
			currentPageDest = "stage-left";
		}
		
		//$('body').append(page.el);
		//$('body').trigger('create');
		$('.page').not('#ChallengeListDiv').css("display","block");
		$('.ui-page').not('#ChallengeListDiv').css("display","block");

		// Wait until the new page has been added to the DOM...
		setTimeout(function() {
			// Slide out the current page: If new page slides from the right -> slide current page to the left, and vice versa
			$(self.currentPage.el).attr('class', 'transition ' + currentPageDest);
			// Slide in the new page
			$('.stage-center').not('#ChallengeListDiv').remove();
			$(page.el).attr('class', 'page stage-center transition');
			self.currentPage = page;
		});
	},
	initialize: function() {
		var self = this;
		checkLoginStatus(this);
		//this.route();
		this.registerEvents();
	}
};
app.initialize();


function checkLoginStatus (tmp) {
	openFB.api({
		path: '/me',
		success: function(data) {
			//console.log(JSON.stringify(data));
			//alert(data.name);
			//document.getElementById('userPic').src = 'http://graph.facebook.com/' + data.id + '/picture?type=small';
			var panelOverlay = new PanelOverlay();
			panelOverlay.render();
			tmp.route('ChallengeList');
		},
		error: function(data) {
			tmp.route('MemberLogin');
		}
	});
}
function onClickList (id) {
	app.route('challenge',id);
}
function onChooseChallenger (ChallengeID) {
	app.route('chooseChallenger',ChallengeID);
}
function goCreateChallenge () {
	app.route('ChallengeList');
}
function goHome () {
	app.route('ChallengeList');
}
function goMemberProfile () {
	app.route('MemberProfile');
}
function goLoginPage () {
	app.route('MemberLogin');
}
function goMemberChallenges () {
	app.route('MemberChallenges');
}
function appendPanel () {
	var panelOverlay = new PanelOverlay();
	panelOverlay.render();
}
function runFunction(fnstring) {
	switch (fnstring) {
		case "goCreateChallenge": goCreateChallenge(); break;
	}
}
function validatingLogin(fnstring) {
	var thisOpenFB = openFB;
	if ( !ISMEMBERLOGGEDIN ) {
		var Session = Parse.Object.extend("Session");
		var query = new Parse.Query(Session);
		query.equalTo("GUUID", GUUID);
		query.find({
			success: function(results) {
				if ( results.length > 0 ) {
					var object = results[0];
					window.localStorage.fbAccessToken = object.get('access_token');
					ISMEMBERLOGGEDIN = true;
					runFunction(fnstring);
				}
			},
			error: function(error) {
				alert("Error: " + error.code + " " + error.message);
			}
		});
	}
}
function login() {
	if (!ISMEMBERLOGGEDIN) {
		openFB.login(function(response) {
			if(response.status === 'connected') {
				alert('Facebook login succeeded, got access token: ' + response.authResponse.accessToken);
			} else {
				alert('Facebook login failed: ' + response.error);
			}
		}, {scope: 'email,publish_actions'}); 
		// create a poll to check login status
		var timer = setInterval(function() {
			if (ISMEMBERLOGGEDIN) { 
				clearInterval(timer);
			} else {
				validatingLogin('goCreateChallenge');
				var panelOverlay = new PanelOverlay();
				panelOverlay.render();
			}
		}, 1000);
	}
}


