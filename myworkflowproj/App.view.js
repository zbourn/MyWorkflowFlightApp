sap.ui.jsview("UI5Apps.myworkflowproj.App", {

	getControllerName: function () {
		return "UI5Apps.myworkflowproj.App";
	},
	
	createContent: function (oController) {
		
		// to avoid scroll bars on desktop the root view must be set to block display
		this.setDisplayBlock(true);
		
		// create app
		this.app = new sap.m.SplitApp();
		
		this.app.addStyleClass("splitAppStyle");
		this.app.setHomeIcon({ 'phone':'i/icon/phone-icon.png', 'phone@2':'i/icon/phone-retina.png', 'tablet':'i/icon/tablet-icon.png', 'tablet@2':'i/icon/tablet-retina.png', 'icon':'i/icon/desktop.ico' });

		// load the master page
		var master = sap.ui.xmlview("Login", "UI5Apps.myworkflowproj.Login");
		master.getController().nav = this.getController();
		this.app.addPage(master, true);
		
		// load the empty page
		var detail = sap.ui.xmlview("Empty", "UI5Apps.myworkflowproj.Empty");
		this.app.addPage(detail, false);

		return this.app;
	}
});