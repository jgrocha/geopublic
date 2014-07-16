Ext.define('DemoExtJs.view.MainMapPanel', {
	extend : 'GeoExt.panel.Map',
	// xtype : 'app-main-map-panel',
	alias : 'widget.app-main-map-panel',
	title : 'Mapa',
	// center : '-940328.71082446, 4949944.6827996', // coordenadas ESPG:900913
	// zoom : 12,
	stateful : true, // false,
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
			projection : new OpenLayers.Projection('EPSG:3763'),
			maxResolution : 2251.90848203,
			resolutions : [2251.90848203, 1125.95424101, 562.977120507, 281.488560253, 140.744280127, 70.3721400634, 35.1860700317, 17.5930350158, 8.79651750792, 4.39825875396, 2.19912937698, 1.09956468849, 0.549782344245, 0.274891172122, 0.137445586061, 0.0687227930306], // , 0.0343613965153, 0.0171806982577, 0.00859034912883, 0.00429517456441],
			units : 'm',
			numZoomLevels : 16, // 20,
			maxExtent : new OpenLayers.Bounds(-119191.407499, -300404.803999, 162129.0811, 276083.7674)
		};
		this.map = new OpenLayers.Map(options);
		this.callParent(arguments);
	},
	tbar : [/* {
	 text : 'Mostra',
	 itemId : 'highlightCtrl',
	 icon : 'resources/images/icons/fam/grid.png'
	 }, {
	 text : 'Ponto',
	 itemId : 'insertPoint',
	 icon : 'resources/assets/pencil.png'
	 },*/
	{
		text : 'Desenhar a pretensão', // só vamos deixar desenhar a partir de um dado nível de zoom...
		itemId : 'insertPolygon',
		icon : 'resources/assets/pencil.png',
		enableToggle : true
	} /*, {
		text : 'Remover',
		itemId : 'removePolygon',
		icon : 'resources/images/icons/fam/cross.gif',
		enableToggle : true
	} */ ]
});
