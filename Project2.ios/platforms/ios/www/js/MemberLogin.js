var MemberLogin = function() {
 
 	this.render = function() {
		this.el.html(MemberLogin.template());
		$('#contentDIV').html(this.el);
		$('#contentDIV').trigger('create');
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
MemberLogin.template = Handlebars.compile($("#member-login-tpl").html());