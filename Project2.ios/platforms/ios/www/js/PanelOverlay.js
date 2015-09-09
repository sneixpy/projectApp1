var PanelOverlay = function() {
 
 	this.render = function() {
		this.el.html(PanelOverlay.template());
		$('#panelDIV').html(this.el);
		$('body').trigger('create');
		return this;
	};
	this.initialize = function() {
        // Define a div wrapper for the view. The div wrapper is used to attach events.
        this.el = $('<div/>');
    };
    this.initialize();
 
}
PanelOverlay.template = Handlebars.compile($("#panel-overlay-tpl").html());