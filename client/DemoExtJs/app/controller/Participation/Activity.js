Ext.define('DemoExtJs.controller.Participation.Activity', {
	extend : 'Ext.app.Controller',
	stores : ['Ocorrencia'], // getOcorrenciaStore()
	// Ext.ComponentQuery.query('profile checkbox')
	refs : [],
	init : function() {
		this.control();
	}
});
