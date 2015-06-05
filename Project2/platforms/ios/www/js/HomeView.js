var HomeView = function(store) {
 
    this.findByName = function() {
		store.findByName($('.search-key').val(), function(employees) {
			$('.employee-list').html(HomeView.liTemplate(employees));
			//$( ".hashExLink" ).on( "click", function() {
			//	window.parent.document.src = window.location.host +"/" + $( this ).attr( "href" );
			//	app.route();
			//});
		});
	};
 	this.render = function() {
		this.el.html(HomeView.template());
		return this;
	};
	this.initialize = function() {
        // Define a div wrapper for the view. The div wrapper is used to attach events.
        this.el = $('<div/>');
        this.el.on('keyup', '.search-key', this.findByName);
    };
    this.initialize();
 
}

HomeView.template = Handlebars.compile($("#home-tpl").html());
HomeView.liTemplate = Handlebars.compile($("#employee-li-tpl").html());