oApplication = { // Application is an object
		
		load: function(src, id, libs, resourceroots, bindingSyntax, theme, callback) {
			var opts = {
					lines: 17, // The number of lines to draw
					length: 0, // The length of each line
					width: 30, // The line thickness
					radius: 29, // The radius of the inner circle
					corners: 1, // Corner roundness (0..1)
					rotate: 0, // The rotation offset
					direction: 1, // 1: clockwise, -1: counterclockwise
					color: '#10ACE7', // #rgb or #rrggbb or array of colors
					speed: 1.5, // Rounds per second
					trail: 50, // Afterglow percentage
					shadow: false, // Whether to render a shadow
					hwaccel: false, // Whether to use hardware acceleration
					className: 'spinner', // The CSS class to assign to the spinner
					zIndex: 2e9, // The z-index (defaults to 2000000000)
					top: '50%', // Top position relative to parent
					left: '50%' // Left position relative to parent
			};
			var target = document.getElementById('tempLoadPlaceholder');
			this.spinner = new Spinner(opts).spin(target);
			setTimeout(this.loadSAPUI5(src, id, libs, resourceroots, bindingSyntax, theme, callback));
		},
		
		loadSAPUI5: function (src, id, libs, resourceroots, bindingSyntax, theme, callback) {
			
			var s,r,t;
//	&nbsp;&nbsp;
			r = false;
			
			s = document.createElement('script');
			
			s.type = 'text/javascript';
			s.src = src;
			s.id = id;
			s.setAttribute("data-sap-ui-libs", libs);
			s.setAttribute("data-sap-ui-resourceroots", resourceroots);
			s.setAttribute("data-sap-ui-xx-bindingSyntax", bindingSyntax);
			s.setAttribute("data-sap-ui-theme", theme);
//	&nbsp;&nbsp;
			s.onload = s.onreadystatechange = function() {
				//console.log( this.readyState ); //uncomment this line to see which ready states are called.
				if ( !r && (!this.readyState || this.readyState == 'complete') ){
					r = true;
					callback();
				}
			};
			
			t = document.getElementsByTagName('script')[0];
			t.parentElement.insertBefore(s, t);
			
		},
//		&nbsp;&nbsp;
//&nbsp;&nbsp;
//&nbsp;&nbsp;
		onSAPUI5Loaded: function(){
			
			oApplication.initializeUI5();
			
			$("body").fadeOut("slow",function(){
				$("#tempLoadPlaceholder").empty().remove();
				$("#tempLogoPlaceholder").empty().remove();
				
				oApplication.shell.placeAt("content");
				jQuery.sap.includeStyleSheet("s/smithfield.css","smithfieldStyles");
				
				$(this).fadeIn("slow");
			});
			
		},
		
		initializeUI5: function(){
			
			var oShell = new sap.m.Shell({
				app : new sap.ui.core.ComponentContainer({
					name : "UI5Apps"
				})
			});
			
			this.shell = oShell;
		}
};