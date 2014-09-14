Ext.define('DemoExtJs.view.MainMapPanel', {
	extend : 'GeoExt.panel.Map',
	requires : ['GeoExt.form.field.GeocoderComboBox'], // , 'GeoExt.plugins.PrintExtent'],
	// xtype : 'app-main-map-panel',
	alias : 'widget.app-main-map-panel',
	title : 'Mapa',

	// funciona!
	center : [-940328.71082446, 4949944.6827996], // coordenadas ESPG:900913
	zoom : 12,
	stateful : false, // true, // false,
	// o estado [do mapa] é guardado num cookie
	stateId : 'app-main-map-panel',

	wfs_pretensao : {},
	selectCtrl : {},
	highlightCtrl : {},
	insertPoint : {},
	insertPolygon : {},

	initComponent : function() {
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
		this.callParent(arguments);
	},
	tbar : [{
		xtype : 'gx_geocodercombo',
		itemId : 'geocoder',
		emptyText : 'Procurar por rua',
		srs : "EPSG:4326",
		queryDelay : 500,
		// url : "http://nominatim.openstreetmap.org/search?format=json&bounded=1&viewboxlbrt=-8.559,40.495,-8.245,40.695",
		url : "http://open.mapquestapi.com/nominatim/v1/search.php?format=json&bounded=1&viewboxlbrt=-8.559,40.495,-8.245,40.695",
		width : 400
	}, /* {
	 text : 'Atualiza',
	 itemId : 'refresh',
	 icon : 'resources/assets/arrow-circle-double-135.png',
	 enableToggle : false,
	 tooltip : 'Pede novamente ao servidor as pretensões já desenhadas ou importadas'
	 }, */'->', {
		text : 'Participar', // só vamos deixar desenhar a partir de um dado nível de zoom...
		itemId : 'insertPolygon',
		icon : 'resources/assets/pencil.png',
		enableToggle : true,
		tooltip : 'Ativa ou desativa a ferramenta de desenho'
	}]
});

/*
 select
 st_xmin(st_transform(st_envelope(wkb_geometry), 4326)),
 st_ymin(st_transform(st_envelope(wkb_geometry), 4326)),
 st_xmax(st_transform(st_envelope(wkb_geometry), 4326)),
 st_ymax(st_transform(st_envelope(wkb_geometry), 4326))
 from caop2k13.concelho
 where municipio = 'ÁGUEDA'
 -8.55898470432682;40.4952659894046;-8.24518232621154;40.6944963001662
 */