Ext.define('DemoExtJs.view.MainMapPanel', {
	extend : 'GeoExt.panel.Map',
	xtype : 'app-main-map-panel',
	title : 'GeoExt map panel',
	center : '-940328.71082446, 4949944.6827996', // coordenadas ESPG:900913
	zoom : 12,
	stateful : false, // true,
	// stateId : 'mappanel',
	initComponent : function() {
		var options = {
			projection : new OpenLayers.Projection("EPSG:900913")
		};
		this.map = new OpenLayers.Map(options);
		// this.center = new OpenLayers.LonLat(-8.44561, 40.57744).transform(new OpenLayers.Projection("EPSG:4326"), this.map.getProjectionObject());
		this.callParent();
	}
});