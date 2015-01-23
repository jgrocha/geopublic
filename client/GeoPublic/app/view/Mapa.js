Ext.define('GeoPublic.view.Mapa', {
	extend : 'GeoExt.panel.Map',
	requires : ['GeoExt.form.field.GeocoderComboBox'], // , 'GeoExt.plugins.PrintExtent'],
	alias : 'widget.mapa',
	// title : 'Mapa',
	// funciona!
	center : [-940328.71082446, 4949944.6827996], // coordenadas ESPG:900913
	zoom : 12,
	stateful : true,

	initComponent : function() {
        // o estado [do mapa] é guardado num cookie
        this.stateId = 'mapa-' + this.initialConfig.config.idplano;
		var options = {
			controls : [new OpenLayers.Control.MousePosition({
				prefix : 'Coordenadas <a href="http://www.igeo.pt/produtos/Geodesia/inf_tecnica/sistemas_referencia/Datum_ETRS89.htm" target="_blank">PT-TM06/ETRS89</a>: ',
				suffix : ' (long, lat)',
				numDigits : 0
			}), new OpenLayers.Control.Navigation(), new OpenLayers.Control.PanZoom(), new OpenLayers.Control.LayerSwitcher()],
			projection : new OpenLayers.Projection("EPSG:900913"),
			// displayProjection : new OpenLayers.Projection("EPSG:3763"),
			units : 'm'
		};
		this.map = new OpenLayers.Map(options);
		
		var baseOSM = new OpenLayers.Layer.OSM("MapQuest-OSM Tiles", ["http://otile1.mqcdn.com/tiles/1.0.0/map/${z}/${x}/${y}.jpg", "http://otile2.mqcdn.com/tiles/1.0.0/map/${z}/${x}/${y}.jpg", "http://otile3.mqcdn.com/tiles/1.0.0/map/${z}/${x}/${y}.jpg", "http://otile4.mqcdn.com/tiles/1.0.0/map/${z}/${x}/${y}.jpg"]);
		var baseAerial = new OpenLayers.Layer.OSM("MapQuest Open Aerial Tiles", ["http://otile1.mqcdn.com/tiles/1.0.0/sat/${z}/${x}/${y}.jpg", "http://otile2.mqcdn.com/tiles/1.0.0/sat/${z}/${x}/${y}.jpg", "http://otile3.mqcdn.com/tiles/1.0.0/sat/${z}/${x}/${y}.jpg", "http://otile4.mqcdn.com/tiles/1.0.0/sat/${z}/${x}/${y}.jpg"]);
		
		this.map.addLayers([baseOSM, baseAerial]);

		var defaultStyle = new OpenLayers.Style({
			'pointRadius' : 10,
			'fillColor' : '${color}',
			'title' : '${title}'
		});

		var highlightStyle = new OpenLayers.Style({
			'pointRadius' : 12 // {Number} Pixel point radius.  Default is 6.
		});

		var selectStyle = new OpenLayers.Style({
			'pointRadius' : 10, // não está a fazer nada... // {Number} Pixel point radius.  Default is 6.
			'strokeColor' : '#FFBB09',
			'strokeWidth' : 2 // dafault 1
		});

		var styleMap = new OpenLayers.StyleMap({
			'default' : defaultStyle,
			'temporary' : highlightStyle,
			'select' : selectStyle
		});

		var report = new OpenLayers.Layer.Vector("Report", {
			styleMap : styleMap
		});

		this.map.addLayer(report);
				
		/*
		 * Fim de 
		 */
		
		this.callParent(arguments);
	},
	tbar : [{
		xtype : 'gx_geocodercombo',
		itemId : 'geocoder',
		emptyText : 'Procurar por rua',
		srs : "EPSG:4326",
		queryDelay : 500,
		// url : "http://nominatim.openstreetmap.org/search?format=json&bounded=1&viewboxlbrt=-8.559,40.495,-8.245,40.695",
		// url : "http://open.mapquestapi.com/nominatim/v1/search.php?format=json&bounded=1&viewboxlbrt=-8.559,40.495,-8.245,40.695",
		url : "http://open.mapquestapi.com/nominatim/v1/search.php?format=json&bounded=1",
		width : 400
	}]
});