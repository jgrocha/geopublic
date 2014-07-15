Ext.define('DemoExtJs.view.InfPrevia.Feedback', {
	extend : 'GeoExt.panel.Map',
	alias : 'widget.feedback-map-panel',
	// center : '-940328.71082446, 4949944.6827996', // coordenadas ESPG:900913
	width : 800,
	height : 200,
	zoom : 12,
	stateful : false, // true,
	// stateId : 'mappanel',
	initComponent : function() {
		var items = [];
		var options = {
			controls : [new OpenLayers.Control.MousePosition({
				prefix : 'Coordenadas <a href="http://www.igeo.pt/produtos/Geodesia/inf_tecnica/sistemas_referencia/Datum_ETRS89.htm" target="_blank">PT-TM06/ETRS89</a>: ',
				suffix : ' (long, lat)',
				numDigits : 0
			}), new OpenLayers.Control.Navigation(), new OpenLayers.Control.PanZoom()],
			projection : new OpenLayers.Projection('EPSG:3763'),
			maxResolution : 2251.90848203,
			resolutions : [2251.90848203, 1125.95424101, 562.977120507, 281.488560253, 140.744280127, 70.3721400634, 35.1860700317, 17.5930350158, 8.79651750792, 4.39825875396, 2.19912937698, 1.09956468849, 0.549782344245, 0.274891172122, 0.137445586061, 0.0687227930306], // , 0.0343613965153, 0.0171806982577, 0.00859034912883, 0.00429517456441],
			units : 'm',
			numZoomLevels : 16, // 20,
			maxExtent : new OpenLayers.Bounds(-119191.407499, -300404.803999, 162129.0811, 276083.7674)
		};
		this.map = new OpenLayers.Map(options);
		// this.center = new OpenLayers.LonLat(-8.44561, 40.57744).transform(new OpenLayers.Projection("EPSG:4326"), this.map.getProjectionObject());

		// OpenLayers object creating

		var layerQuest = new OpenLayers.Layer.TMS('TMS mapquest', '/mapproxy/tms/', {
			layername : 'mapquest/pt_tm_06',
			type : 'png',
			tileSize : new OpenLayers.Size(256, 256)
		});
		this.map.addLayer(layerQuest);

		/*
		 items.push(Ext.create('Ext.button.Button', Ext.create('GeoExt.Action', {
		 control : new OpenLayers.Control.ZoomToMaxExtent(),
		 map : map,
		 text : "max extent",
		 tooltip : "zoom to max extent"
		 })));

		 Ext.apply(me, {
		 map : map,
		 dockedItems : [{
		 xtype : 'toolbar',
		 dock : 'top',
		 items : items,
		 style : {
		 border : 0,
		 padding : 0
		 }
		 }]
		 });
		 */

		this.callParent(arguments);
	}
});

Ext.define('DemoExtJs.view.InfPrevia.Tabela', {
	extend : 'Ext.grid.Panel',
	requires : ['GeoExt.selection.FeatureModel', 'GeoExt.grid.column.Symbolizer'],
	alias : 'widget.tabela-confrontacao',
	// http://osgeo-org.1560.x6.nabble.com/ZoomBox-not-working-when-using-Ext-toolbar-and-GeoExt-Action-td3911425.html
	initComponent : function() {
		Ext.apply(this, {
			border : false,
			columns : [{
				dataIndex : 'id',
				text : 'Id',
				width : 20
			}, {
				// tentar por apenas uma casa decimal
				dataIndex : 'area',
				text : 'Área',
				width : 80
			}, {
				dataIndex : 'dominio',
				text : 'Domínio',
				width : 80
			}, {
				dataIndex : 'subdominio',
				text : 'Subdomínio',
				width : 80
			}, {
				dataIndex : 'familia',
				text : 'Família',
				width : 80
			}, {
				dataIndex : 'objecto',
				text : 'Objecto',
				width : 80
			}, {
				dataIndex : 'ident_gene',
				text : 'Id. genérico',
				width : 80
			}, {
				dataIndex : 'ident_part',
				text : 'Id. particular',
				width : 80
			}, {
				dataIndex : 'diploma_es',
				text : 'Diploma',
				width : 80
			}, {
				dataIndex : 'parecer',
				text : 'Parecer',
				width : 80
			}, {
				dataIndex : 'entidade',
				text : 'Entidade',
				width : 80
			}
			/* {
			 flex : 1,
			 dataIndex : 'texto',
			 text : 'Texto'
			 }, {
			 dataIndex : 'complete',
			 text : 'Complete'
			 } */
			],
			flex : 2,
			store : 'InfPrevia.ConfrontacaoPretensao',
			selType : 'featuremodel'
		});
		this.callParent(arguments);
	}
});

Ext.define('DemoExtJs.view.InfPrevia.WindowConfrontacao', {
	extend : 'Ext.window.Window',
	alias : 'widget.windowconfrontacao',
	// autoShow : true,
	height : 400,
	width : 800,
	title : "Confrontações", // vai ser redefinido pelos parâmetros de inicialização da view
	modal : true,
	closable : true,
	closeAction : 'hide', // 'destroy', // 'hide',
	initComponent : function() {
		// console.debug(this.initialConfig);
		// console.debug(this.bounds);
		console.log('Abrir com a pretensão ' + this.pretensao);
		this.callParent(arguments);
	},
	items : [{
		xtype : 'panel',
		itemId : 'localizacao',
		// title : 'Localização',
		items : [{
			xtype : 'feedback-map-panel'
		}]
	}, {
		xtype : 'tabela-confrontacao',
		region : 'south'
	}]
});

/*
 * 	fields : [{
 name : 'id',
 type : 'int'
 }, {
 name : 'area',
 type : 'float'
 }, {
 name : 'dominio',
 type : 'string'
 }, {
 name : 'subdominio',
 type : 'string'
 }, {
 name : 'familia',
 type : 'string'
 }, {
 name : 'objecto',
 type : 'string'
 }, {
 name : 'ident_gene',
 type : 'string'
 }, {
 name : 'ident_part',
 type : 'string'
 }, {
 name : 'diploma_es',
 type : 'string'
 }, {
 name : 'texto',
 type : 'string'
 }, {
 name : 'parecer',
 type : 'string'
 }, {
 name : 'entidade',
 type : 'string'
 }],
 */