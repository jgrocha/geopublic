Ext.define('DemoExtJs.controller.InfPrevia.WindowConfrontacao', {
	extend : 'Ext.app.Controller',
	// Ext.ComponentQuery.query('windowconfrontacao')
	views : ['InfPrevia.WindowConfrontacao'],
	init : function() {
		var me = this;
		var map = null;
		this.control({
			'windowconfrontacao' : {
				beforerender : function(view) {
					console.log('Vamos ter janela de confrontação');
					me.bounds = view.bounds;
				},
				afterrender : function(view) {
					console.log('Já temos janela de confrontação');
				},
			},
			'feedback-map-panel' : {
				'beforerender' : this.onMapPanelBeforeRender,
				'afterrender' : this.onMapPanelAfterRender
			}
		});
	},
	onMapPanelBeforeRender : function(mapPanel, options) {
		var me = this;

		var layers = [];
		map = mapPanel.map;
		// OpenLayers object creating

		var layerQuest = new OpenLayers.Layer.TMS('TMS mapquest', '/mapproxy/tms/', {
			layername : 'mapquest/pt_tm_06',
			type : 'png',
			tileSize : new OpenLayers.Size(256, 256)
		});

		layers.push(layerQuest);
		map.addLayers(layers);
	},
	onMapPanelAfterRender : function(mapPanel, options) {
		var me = this;
		console.debug(me.bounds);
		map.zoomToExtent(me.bounds, false);
	}
});

/*
 -38.939,1989531957
 91.275,0561580396
 -8.098,74683630174
 115.559,850672546

 -8,593897489860082
 40,48937574608635
 -8,22863490575264
 40,708939520000236
 */