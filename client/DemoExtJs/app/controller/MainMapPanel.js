Ext.define('DemoExtJs.controller.MainMapPanel', {
	extend : 'Ext.app.Controller',
	init : function() {
		console.log('O controlador Ppgis.controller.MainMapPanel init...');
		this.control({
			'app-main-map-panel' : {
				'beforerender' : this.onMapPanelBeforeRender
			}
		}, this);
	},
	onLaunch : function() {
		console.log('...O controlador DemoExtJs.controller.MainMapPanel onLaunch.');
	},

	onMapPanelBeforeRender : function(mapPanel, options) {
		// this = instância "DemoExtJs.controller.MainMapPanel"
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
		map.setCenter(new OpenLayers.LonLat(-26557, 100814), 5);
		
        mapDebug = map;
        mapPanelDebug = mapPanel;		
	}
});
