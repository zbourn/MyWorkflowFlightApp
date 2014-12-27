jQuery.sap.declare("UI5Apps.Component");

sap.ui.core.UIComponent.extend("UI5Apps.Component", {

	createContent : function() {

		// create root view, a main application view - container for all other views
		var oView = sap.ui.view({
			id : "App",
			viewName : "UI5Apps.myworkflowproj.App",
			type : "JS",
			viewData : { component : this }
		});
		
		// set i18n model
		var i18nModel = new sap.ui.model.resource.ResourceModel({
			bundleUrl : "i18n/messageBundle.properties"
		});
		oView.setModel(i18nModel, "i18n");

		// Using OData model to connect against a real service
		//var url = "/proxy/http/<server>:<port>/sap/opu/odata/sap/ZGWSAMPLE_SRV/";
		//var oModel = new sap.ui.model.odata.ODataModel(url, true, "<user>", "<password>");
		
		// set device model
		var deviceModel = new sap.ui.model.json.JSONModel({
			isPhone :  sap.ui.Device.system.phone,
			isNoPhone :	!  sap.ui.Device.system.phone,
			isNotDesktop: ! sap.ui.Device.system.desktop,
			isNoTouch : !sap.ui.Device.support.touch,
			isTouch : sap.ui.Device.support.touch
		});
		deviceModel.setDefaultBindingMode("OneWay");
		oView.setModel(deviceModel, "device");
		
		//alert("  combi:" + sap.ui.Device.system.combi + "  desktop:" + sap.ui.Device.system.desktop + "  phone:" + sap.ui.Device.system.phone + "  tablet:" + sap.ui.Device.system.tablet);
		
		// Using a json model for login fields validation
		var offlineUserModel = new sap.ui.model.json.JSONModel({"name":"","password":""});
		oView.setModel(offlineUserModel, "offlineUser");
		
		// Using a json model for saving value loading completed or not
		var loadedModel = new sap.ui.model.json.JSONModel({"loaded":"false"});
		oView.setModel(loadedModel, "loadedModel");
		
		// done
		return oView;
	}
});