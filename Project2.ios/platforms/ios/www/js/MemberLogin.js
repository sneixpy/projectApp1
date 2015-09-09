var MemberLogin = function() {
 
 	this.render = function() {
		this.el.html(MemberLogin.template());
		$('#contentDIV').html(this.el);
		$('body').trigger('create');
		return this;
	};
	this.LoginMember = function() {

	};
	this.initialize = function() {
        // Define a div wrapper for the view. The div wrapper is used to attach events.
        this.el = $('<div/>');
    };
    this.initialize();
 
}
MemberLogin.challengeList = [];
MemberLogin.template = Handlebars.compile($("#member-login-tpl").html());