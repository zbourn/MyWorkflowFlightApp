sap.ui.controller("UI5Apps.myworkflowproj.App", {
	
	/**
	 * Navigates to another page
	 * @param {string} pageId The id of the next page
	 * @param {sap.ui.model.Context} context The data context to be applied to the next page (optional)
	 */
	to : function (pageId, context) {
		
		var app = this.getView().app;
		
		// load page on demand
		var master = ("Workitems" === pageId);
		
		if (app.getPage(pageId, master) === null) {
			var page = sap.ui.view({
				id : pageId,
				viewName : "UI5Apps.myworkflowproj." + pageId,
				type : "XML"
			});
			page.getController().nav = this;
			app.addPage(page, master);
			jQuery.sap.log.info("app controller > loaded page: " + pageId);
		}
		
		if (context) {
			
			var page = app.getPage(pageId);
			
			if(pageId == "Main"){
				
				var templateItem = page.byId("oWorkitemListItem");
				page.byId("oWorkitemsList").bindItems(context.getPath()+'/WiHeaderSet', templateItem);
				page.setBindingContext(context);
				this.goTo(pageId);
				
			}else if(pageId == "Detail"){
				
				//Odata
				page.bindElement("/WiHeaderSet(WiId='" + context.WiId + "')");
				//JSON
				//page.setBindingContext(context.acontext);
				this.goTo(pageId);
				
			}else{
				
				page.setBindingContext(context);
				this.goTo(pageId);
				
			};
			
		}else{
			
			this.goTo(pageId);
			
		}
	},
	
	goTo: function(whatpage){
		if (this.getView().getModel("loadedModel").getProperty("/loaded")){
			this.getView().app.to(whatpage);
		}else{
			var towhatpage = whatpage;
			var thisController = this;
		    setTimeout(function () {
		    	thisController.goTo(towhatpage);
		    }, 200);
		}
	},
//	&nbsp;&nbsp;&nbsp;&nbsp;
	/**
	 * Navigates back to a previous page
	 * @param {string} pageId The id of the next page
	 */
	back : function (pageId) {
		this.getView().app.backToPage(pageId);
	},
	
	/**
	 * Open a dialog
	 */
	openDialog: function (sType) {
	    if (!this[sType]) {
	      this[sType] = sap.ui.xmlfragment("UI5Apps.myworkflowproj." + sType,this);
	    }
	    this[sType].open();
	},
	
	/**
	 * Close a dialog
	 */
	closeDialog: function (sType) {
		if (this[sType]) {
			this[sType].close();
		}
	},
	

	/**
	 * check if the service user and pass correct and Load the app odata model
	 * Navigate to Customers (ship to) screen
	 */
	loadModel: function(user, pass){
		
		/*//JSON MODEL
		var oModel = new sap.ui.model.json.JSONModel("d/data.json");
		if((user.toLowerCase()=="nikir" && pass.toLowerCase()=="welcome")||(user.toLowerCase()=="admin" && pass.toLowerCase()=="admin")){*/
		
		
		//ODATA MODEL
		//when Local
		//var oServiceUrl = "proxy/http/ddcffiwin10.ffi.local/sap/opu/odata/sap/ZSMITHFIELD_TRANSPORTATION_SRV/";
		
		//when ABAP NG Server
		var oServiceUrl = "/sap/opu/odata/sap/ZWF_FLIGT_SRV/";
		
		var oModel = new sap.ui.model.odata.ODataModel(oServiceUrl, true, user, pass);
		oModel.setSizeLimit(1000);
		oModel.setDefaultCountMode("Inline");
		
		//check odata status
		var metadataRead = oModel.getServiceMetadata();
		var dataServicesRead = metadataRead && metadataRead.dataServices || null;
		
		if(dataServicesRead){
			
			this.closeDialog('Loading');
			
			// When Request sent
			oModel.attachRequestSent(jQuery.proxy(function(oEvent) {
				this.openDialog('Loading');
				this.getView().getModel("loadedModel").setProperty("/loaded",false);
		    }, this));

		    // When Request completed
			oModel.attachRequestCompleted(jQuery.proxy(function(oEvent) {
				this.closeDialog('Loading');
				this.getView().getModel("loadedModel").setProperty("/loaded",true);
		    }, this));
			
			//Set the model to the App view
			this.getView().setModel(oModel);
			
			var LoginSucssesWelcomeMsg= this.getView().getModel("i18n").getResourceBundle().getText("LoginSucssesWelcomeMsg");
			
			jQuery.sap.require("sap.m.MessageToast");
			sap.m.MessageToast.show(LoginSucssesWelcomeMsg);
			
			this.getView().app.setMode("ShowHideMode");
			this.getView().app.showMaster();
			
			//go to ship to screen
			this.to("Workitems");
			
		}else{
			
			var LoginErrorMsg= this.getView().getModel("i18n").getResourceBundle().getText("LoginErrorMsg");
			
			this.closeDialog('Loading');
			jQuery.sap.require("sap.m.MessageBox");
			sap.m.MessageBox.alert(LoginErrorMsg);
			
		};
		
	},
	
	
	/**
	 * Logout dialog buttons
	 */
	LogOutButton: function() {
		this.back("Empty");
		this.back("Login");
		sap.ui.getCore().byId("App").app.setMode("StretchCompressMode");
		this.logOut();
		this.closeDialog("LogOut");
	},

	LogOutCancelButton: function () {
	    this.closeDialog("LogOut");
	},
	
	/**
	 * Log Out function
	 */
	logOut: function(){
		var userModel = this.getView().getModel("offlineUser");
		userModel.setProperty("/name","");
		userModel.setProperty("/password","");
		
		//sap.ui.getCore().byId("Customers").destroy();
		
		//Odata logoff
		$.ajax({
			type: "GET",
			url: "/sap/public/bc/icf/logoff",  //Clear SSO cookies: SAP Provided service to do that
			}).done(function(data){ //Now clear the authentication header stored in the browser
				if (!document.execCommand("ClearAuthenticationCache")) {
					//"ClearAuthenticationCache" will work only for IE. Below code for other browsers
					$.ajax({
						type: "GET",
						url: "/sap/opu/odata/sap/ZWF_FLIGT_SRV/", //any URL to a Gateway service
						username: 'dummy', //dummy credentials: when request fails, will clear the authentication header&nbsp;&nbsp;
	                    password: 'dummy',
//	                    &nbsp;&nbsp;
	                    statusCode: { 401: function() {
	                    	//This empty handler function will prevent authentication pop-up in chrome/firefox&nbsp;
	                    	} },
//	                    	&nbsp;&nbsp;
	                        error: function() {
	                        	//alert('reached error of wrong username password')
	                        	}
	                });
	            }
//				&nbsp;&nbsp;
	     });
	}
	
});