/*  The Challenge Select page
    This page will let endusers select the challenge they want to make.
    This currently the workflow should be challenge select
*/
function trimString(s) {
  var l=0, r=s.length -1;
  while(l < s.length && s[l] == ' ') l++;
  while(r > l && s[r] == ' ') r-=1;
  return s.substring(l, r+1);
}

var ChallengeWho = function(ChallengeID) {
 
	this.render = function() {
		this.el.html(ChallengeWho.template());
		$('#contentDIV').html(this.el);
		$('body').trigger('create');
		//app.slidePage(this);
		//$('.ui-page-theme-b').css("display","block");
		//this.searchContacts();
		return this;
	};
	this.reRender = function() {
		return this;
	};
	this.getContacts = function(event) {
		if (event) event.preventDefault();
		console.log('getContacts');
		if (!navigator.contacts) {
			//app.showAlert("Contacts API not supported", "Error");
			return;
		} else {
			var options = new ContactFindOptions();
				options.filter=$('.search-key').val(); // empty search string returns all
				options.multiple=true;    // return multiple results
			var filter = ["name"]; // return contact.displayName field
			navigator.contacts.find(filter, onSuccess, onError, options);
			return false;
		}
	};
	this.searchContacts = function(event) {
		if (event) event.preventDefault();
		console.log('searchContacts');
		var results = [];
		var toSearch = trimString($('.search-key').val());
		if (toSearch.length > 2){
			for(var i=0; i<ChallengeWho.ContactObj.length; i++) {
				if(ChallengeWho.ContactObj[i]['Name'].toLowerCase().indexOf(toSearch.toLowerCase())!=-1) {
					results.push(ChallengeWho.ContactObj[i]);
				}
			}
			$('.contact-list').html('');
			$('.contact-list').html(ChallengeWho.ContactList(results));
			$('.contact-list').trigger('create');
		}
		return false;
	};

    this.initialize = function() {
        this.el = $('<div id="ChallengeWhoDiv"/>');
		var self = this;
		this.getContacts(); // refresh contact list that is stored in variable.
		this.el.on('keyup', '.search-key', this.searchContacts);
		//self.render();
    };
 
    this.initialize();
 
 }
 
function onSuccess(contacts) {
 /*
 [ { value: 'davidasao@gmail.com', pref: false, id: 0, type: 'home' },
  { value: 'davidasao@yahoo.com', pref: false, id: 1, type: 'work' },
  { value: 'david.asao@hl.konicaminolta.us',
    pref: false,
    id: 2,
    type: 'other' },
  { value: 'david@stmiconsulting.com',
    pref: false,
    id: 3,
    type: 'other' } ]
 */
 	var t=0;
 	var i=0;
	for (t=0,i=0; i<contacts.length; i++) {
		if (contacts[i].emails) {
			var tmp = [];
			for (var j=0; j<contacts[i].emails.length; j++) {
				tmp.push({'Id': contacts[i].emails[j].id,'Email': contacts[i].emails[j].value});
			}
			ChallengeWho.ContactObj[t] = {'id':contacts[i].id, 'Name':contacts[i].name.formatted, 'Emails': tmp};
			//console.log(contacts[i].id+'='+contacts[i].name.formatted+"="+tmp);
			t++;
		}
	}
	//$('.contact-list').html(ChallengeWho.ContactList(ChallengeWho.ContactObj));
	//$('.contact-list').trigger('create');
}
function onError(contactError) {
	console.log('onError!');
}

ChallengeWho.template = Handlebars.compile($("#challenge-who-tpl").html());
ChallengeWho.ContactList = Handlebars.compile($("#contact-list-tpl").html());
ChallengeWho.ContactObj=[];




	/*
	this.addToContacts = function(event) {
		event.preventDefault();
		console.log('addToContacts');
		if (!navigator.contacts) {
			app.showAlert("Contacts API not supported", "Error");
			return;
		}
		var contact = navigator.contacts.create();
		contact.name = {givenName: employee.firstName, familyName: employee.lastName};
		var phoneNumbers = [];
		phoneNumbers[0] = new ContactField('work', employee.officePhone, false);
		phoneNumbers[1] = new ContactField('mobile', employee.cellPhone, true); // preferred number
		contact.phoneNumbers = phoneNumbers;
		contact.save();
		return false;
	};
	*/
	/*
	this.addLocation = function(event) {
		event.preventDefault();
		console.log('addLocation');
		navigator.geolocation.getCurrentPosition(
			function(position) {
				$('.location', this.el).html(position.coords.latitude + ',' + position.coords.longitude);
			},
			function() {
				alert('Error getting location');
			});
		return false;
	};
*/
/*
	this.changePicture = function(event) {
		event.preventDefault();
		if (!navigator.camera) {
			app.showAlert("Camera API not supported", "Error");
			return;
		}
		var options =   {   quality: 40,
							destinationType: Camera.DestinationType.DATA_URL,
							sourceType: 1,      // 0:Photo Library, 1=Camera, 2=Saved Photo Album
							encodingType: 0     // 0=JPG 1=PNG
						};
 
		navigator.camera.getPicture(
			function(imageData) {
				$('.employee-image', this.el).attr('src', "data:image/jpeg;base64," + imageData);
			},
			function() {
				app.showAlert('Error taking picture', 'Error');
			},
			options);
 
		return false;
	};
	*/