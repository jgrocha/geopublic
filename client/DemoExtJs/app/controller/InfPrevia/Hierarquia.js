Ext.define('DemoExtJs.controller.InfPrevia.Hierarquia', {
	extend : 'Ext.app.Controller',
	// Ext.ComponentQuery.query('hierarquia')
	stores : ['InfPrevia.Hierarquia'], // getInfPreviaHierarquiaStore()
	init : function() {
		var me = this;
		var map = null;
		this.control({
			'hierarquia' : {
				beforerender : function(view) {
					console.debug('InfPrevia.Hierarquia beforerender');
					console.debug(view.root);
					this.getInfPreviaHierarquiaStore().setRootNode(view.root);
					// .proxy não existe no store geoext
					// me.getConfrontacaoStore().filter("id", parseInt(event.feature.data.id));
					// me.getConfrontacaoStore().load();
				},
				afterrender : function(view) {
					console.debug('InfPrevia.Hierarquia afterrender');
				},
				refresh : function(view) {
					console.debug('InfPrevia.Hierarquia refresh');
				},
				close : function(view) {
					console.debug('InfPrevia.Hierarquia close');
				}
			}
		});
	}
});
