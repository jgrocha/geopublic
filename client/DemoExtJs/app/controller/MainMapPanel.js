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
		var map = mapPanel.map;
		// OpenLayers object creating
		var wms = new OpenLayers.Layer.WMS("OpenLayers WMS", "http://vmap0.tiles.osgeo.org/wms/vmap0?", {
			layers : 'basic'
		});
		var osm = new OpenLayers.Layer.OSM("Simple OSM Map");
		layers.push(osm);
		map.addLayers(layers);
		// map.setCenter(new OpenLayers.LonLat(-8.44561, 40.57744).transform(new OpenLayers.Projection("EPSG:4326"), map.getProjectionObject()), 12);		
        // globals for dev purpose
        mapDebug = map;
        mapPanelDebug = mapPanel;		
	}
});
