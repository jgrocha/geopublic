Ext.define('DemoExtJs.controller.BemVindoPanel', {
	extend : 'Ext.app.Controller',
	refs : [{
		selector : 'viewport > tabpanel > bem-vindo-panel',
		ref : 'painelBemVindo' // gera um getPainelBemVindo
	}],
	init : function() {
		console.log('O controlador DemoExtJs.controller.BemVindoPanel init...');
		this.control({
			'bem-vindo-panel' : {
				'beforerender' : this.onMapPanelBeforeRender,
				'afterrender' : this.onMapPanelAfterRender
			}
		}, this);
	},
	onLaunch : function() {
		console.log('...O controlador DemoExtJs.controller.BemVindoPanel onLaunch.');
	},

	onMapPanelBeforeRender : function(mapPanel, options) {
		var me = this;
		console.log('controlador DemoExtJs.controller.BemVindoPanel onMapPanelBeforeRender');
	},
	onMapPanelAfterRender : function(mapPanel, options) {
		var me = this;
		console.log('controlador DemoExtJs.controller.BemVindoPanel onMapPanelAfterRender');
		mapPanel.updateLayout();
	}
});
