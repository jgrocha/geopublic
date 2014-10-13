Ext.ns("ExtRemote");
ExtRemote.REMOTING_API = {
	"url" : "http://development.localhost.lan/direct",
	"namespace" : "ExtRemote",
	"type" : "remoting",
	"actions" : {
		"DXFormTest" : [{
			"name" : "testMe",
			"len" : 1
		}, {
			"name" : "testException",
			"len" : 1
		}, {
			"name" : "load",
			"len" : 1
		}, {
			"name" : "submit",
			"len" : 1,
			"formHandler" : true
		}, {
			"name" : "filesubmit",
			"len" : 1,
			"formHandler" : true
		}],
		"DXLogin" : [{
			"name" : "alive",
			"len" : 1
		}, {
			"name" : "authenticate",
			"len" : 1
		}, {
			"name" : "deauthenticate",
			"len" : 1
		}, {
			"name" : "registration",
			"len" : 1
		}, {
			"name" : "reset",
			"len" : 1
		}, {
			"name" : "update",
			"len" : 1
		}, {
			"name" : "updateLocation",
			"len" : 1
		}, {
			"name" : "social",
			"len" : 1
		}],
		"DXParticipacao" : [{
			"name" : "createTipoOcorrencia",
			"len" : 1
		}, {
			"name" : "updateTipoOcorrencia",
			"len" : 1
		}, {
			"name" : "destroyTipoOcorrencia",
			"len" : 1
		}, {
			"name" : "readTipoOcorrencia",
			"len" : 1
		}, {
			"name" : "createPlano",
			"len" : 1
		}, {
			"name" : "updatePlano",
			"len" : 1
		}, {
			"name" : "destroyPlano",
			"len" : 1
		}, {
			"name" : "readPlano",
			"len" : 1
		}, {
			"name" : "createPromotor",
			"len" : 1
		}, {
			"name" : "updatePromotor",
			"len" : 1
		}, {
			"name" : "destroyPromotor",
			"len" : 1
		}, {
			"name" : "readPromotor",
			"len" : 1
		}],
		"DXSessao" : [{
			"name" : "read",
			"len" : 1
		}],
		"DXConfrontacao" : [{
			"name" : "read",
			"len" : 1
		}],
		"DXTodoItem" : [{
			"name" : "create",
			"len" : 1
		}, {
			"name" : "read",
			"len" : 1
		}, {
			"name" : "update",
			"len" : 1
		}, {
			"name" : "destroy",
			"len" : 1
		}],
		"DXTree" : [{
			"name" : "getTree",
			"len" : 1
		}]
	}
};