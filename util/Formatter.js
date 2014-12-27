jQuery.sap.declare("UI5Apps.util.Formatter");
jQuery.sap.require("sap.ui.core.format.DateFormat");

UI5Apps.util.Formatter = {

	uppercaseFirstChar: function(sStr) {
		return sStr.charAt(0).toUpperCase() + sStr.slice(1);
	},

	discontinuedStatusState: function(sDate) {
		return sDate ? "Error" : "None";
	},

	discontinuedStatusValue: function(sDate) {
		return sDate ? "Discontinued" : "";
	},

	currencyValue: function(value) {
		return parseFloat(value).toFixed(2);
	},
	date: function(value) {
		if (value) {
			var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
				pattern: "MM-dd-yyyy"
			});
			return oDateFormat.format(new Date(value));
		} else {
			return value;
		}
	},
	time: function(value) {
		if (value) {
			var oTimeFormat = sap.ui.core.format.DateFormat.getTimeInstance({
				pattern: "KK:mm a"
			});
			return oTimeFormat.format(new Date(value.ms)); //value.ms when odata 11:00:00 AM
		} else {
			return value;
		}
	},
	ETAdate: function(value) {
		if (value) {
			var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
				pattern: "MM-dd-yyyy KK:mm a"
			});
			return oDateFormat.format(new Date(value));
		} else {
			return value;
		}
	},

	lineBreak: function(value) {
		if (value) {
			var str = value;
			var res = str.replace(/###/g, "\n");
			return res;
		} else {
			return value;
		}
	},

	ponumber: function(value) {
		if (value) {
			var str = value;
			var res = str.replace(/###/g, "   |   ");
			return res;
		} else {
			return value;
		}
	}
};