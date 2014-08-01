Ext.define('DemoExtJs.view.InfPrevia.Feedback', {
	extend : 'GeoExt.panel.Map',
	requires : ['GeoExt.data.MapfishPrintProvider'], // , 'GeoExt.plugins.PrintExtent'],
	alias : 'widget.feedback-map-panel',
	// center : '-940328.71082446, 4949944.6827996', // coordenadas ESPG:900913
	width : 400,
	height : 400,
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
			
		var layerQuest = new OpenLayers.Layer.TMS('TMS mapquest', DemoExtJs.mapproxy, {
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

		// http://ows.terrestris.de:8080/print/pdf/print.pdf?spec=%7B%22units%22%3A%22degrees%22%2C%22srs%22%3A%22EPSG%3A4326%22%2C%22layout%22%3A%22A4%20portrait%22%2C%22dpi%22%3A75%2C%22mapTitle%22%3A%22Printing%20Demo%22%2C%22comment%22%3A%22This%20is%20a%20map%20printed%20from%20GeoExt.%22%2C%22layers%22%3A%5B%7B%22baseURL%22%3A%22http%3A%2F%2Fows.terrestris.de%2Fosm%2Fservice%3F%22%2C%22opacity%22%3A1%2C%22singleTile%22%3Afalse%2C%22type%22%3A%22WMS%22%2C%22layers%22%3A%5B%22OSM-WMS%22%5D%2C%22format%22%3A%22image%2Fjpeg%22%2C%22styles%22%3A%5B%22%22%5D%7D%5D%2C%22pages%22%3A%5B%7B%22center%22%3A%5B146.56%2C-41.56%5D%2C%22scale%22%3A4000000%2C%22rotation%22%3A0%7D%5D%7D
		// http://ows.terrestris.de:8080/print/pdf/info.json 
		// The printProvider that connects us to the print service
		this.printProvider = Ext.create('GeoExt.data.MapfishPrintProvider', {
			autoLoad : true,
			url : DemoExtJs.geoserver + "/geoserver/pdf/",
			method : "POST", // "GET", // "POST" recommended for production use
			// capabilities : printCapabilities, // from the info.json script in the html
			customParams : {
				mapTitle : "Demostração da Impressão",
				comment : "Este é um mapa gerado a partir do GeoExt."
			},
			layout : "A4",
			listeners : {
				"loadcapabilities" : function() {
					console.log('loadcapabilities'); // http://localhost/geoserver/pdf/info.json
					console.log(this.capabilities);
					this.capabilities.printURL = DemoExtJs.geoserver + '/geoserver/pdf/print.pdf';					
					this.capabilities.createURL = DemoExtJs.geoserver + '/geoserver/pdf/create.json';				
				}
			}
		});

		/*
		var printExtent = Ext.create('GeoExt.plugins.PrintExtent', {
			printProvider : this.printProvider
		});

		this.plugins = [printExtent];
		// printExtent.addPage();
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
			columns : [/*{
			 dataIndex : 'id',
			 text : 'Id',
			 width : 20
			 }, */
			{
				// tentar por apenas uma casa decimal
				dataIndex : 'area',
				text : 'Área (m2)',
				width : 76,
				renderer : Ext.util.Format.numberRenderer('0.0'),
				align : 'right'
			}, /* {
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
			 }, */
			{
				// text : 'Hierarquia',
				menuDisabled : true,
				sortable : false,
				xtype : 'actioncolumn',
				width : 20,
				items : [{
					icon : 'resources/images/tree_structure.png',
					// tooltip : 'Classes de espaços',
					getTip : function(v, meta, record, rowIndex, colIndex, store) {
						return record.get('objecto');
					},
					handler : function(grid, rowIndex, colIndex) {
						var rec = grid.getStore().getAt(rowIndex);
						// Ext.Msg.alert('Exige parecer', 'Entidade: ' + rec.get('entidade'));
						console.log('Vai mostrar hierarquia');
						var ident_part = {};
						if (rec.get('ident_part') != '') {
							ident_part = {
								text : rec.get('ident_part'),
								leaf : true
							};
						}
						var ident_gene = {};
						if (rec.get('ident_gene') != '') {
							if (Object.keys(ident_part).length > 0) {
								ident_gene = {
									text : rec.get('ident_gene'),
									expanded : true,
									children : ident_part
								};
							} else {
								ident_gene = {
									text : rec.get('ident_gene'),
									leaf : true
								};
							}
						}
						var objecto = {};
						if (rec.get('objecto') != '') {
							if (Object.keys(ident_gene).length > 0) {
								objecto = {
									text : rec.get('objecto'),
									expanded : true,
									children : ident_gene
								};
							} else if (Object.keys(ident_part).length > 0) {
								objecto = {
									text : rec.get('objecto'),
									expanded : true,
									children : ident_part
								};
							} else {
								objecto = {
									text : rec.get('objecto'),
									leaf : true
								};
							}
						}
						var view = Ext.widget('hierarquia', {
							title : 'Instrumentos de Gestão do Território',
							root : {
								text : rec.get('dominio'), // "Condicionantes",
								expanded : true,
								children : [{
									text : rec.get('subdominio'), // "Reserva Agrícola Nacional",
									expanded : true,
									children : [{
										text : rec.get('familia'), // "Recursos Naturais",
										expanded : true,
										children : objecto
									}]
								}]
							}
						});
						view.show();
					}
				}]
			}, /* {
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
			 },
			 {
			 dataIndex : 'parecer',
			 text : 'Parecer',
			 width : 80
			 }, {
			 dataIndex : 'entidade',
			 text : 'Entidade',
			 width : 80
			 }, */
			{
				// text : 'Parecer',
				menuDisabled : true,
				sortable : false,
				xtype : 'actioncolumn',
				width : 20,
				items : [{
					icon : 'resources/images/icons/fam/user_comment.png',
					tooltip : 'Exige parecer',
					handler : function(grid, rowIndex, colIndex) {
						var rec = grid.getStore().getAt(rowIndex);
						Ext.Msg.alert('Exige parecer', 'Entidade: ' + rec.get('entidade'));
					},
					isDisabled : function(view, rowIndex, colIndex, item, record) {
						// Returns true if 'editable' is false (, null, or undefined)
						return record.get('parecer') != '1';
					}
				}]
			}, {
				// text : 'Diplomas',
				menuDisabled : true,
				sortable : false,
				xtype : 'actioncolumn',
				width : 20,
				items : [{
					icon : 'resources/images/icons/fam/book.png',
					tooltip : 'Diplomas específicos',
					handler : function(grid, rowIndex, colIndex) {
						var rec = grid.getStore().getAt(rowIndex);
						Ext.Msg.alert('Diplomas específicos aplicáveis', 'Diplomas: ' + rec.get('diploma_es'));
					}
				}]
			}, {
				dataIndex : 'sumario',
				text : 'Sumário',
				// width : 80,
				flex : 5,
				tdCls : 'grid-cell-wrap-text'
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
	height : 490,
	width : 880,
	title : "Confrontações", // vai ser redefinido pelos parâmetros de inicialização da view
	modal : true,
	closable : true,
	closeAction : 'destroy', // 'hide',
	initComponent : function() {
		// console.debug(this.initialConfig);
		// console.debug(this.bounds);
		console.log('Abrir com a pretensão ' + this.pretensao);
		this.callParent(arguments);
	},
	layout : {
		type : 'hbox',
		padding : '10',
		align : 'top'
	},
	defaults : {
		margin : '0 10 0 0'
	}, // separação entre as duas colunas
	items : [/*{
	 xtype : 'panel',
	 itemId : 'localizacao',
	 // title : 'Localização',
	 items : [{
	 xtype : 'feedback-map-panel'
	 }]
	 }, */
	{
		xtype : 'feedback-map-panel'
	}, {
		xtype : 'panel', // para depois ter scroll na grid
		layout : 'fit',
		width : 440,
		height : 400,
		items : {
			xtype : 'tabela-confrontacao'
		}
	}],
	bbar : [{
		text : 'Centrar na pretensão',
		itemId : 'centra',
		icon : 'resources/images/target.png'
	}, '->', {
		text : 'Remover',
		itemId : 'remove',
		icon : 'resources/images/icons/fam/cross.gif'
	}, {
		text : 'Imprimir mapa',
		itemId : 'imprimemapa',
		icon : 'resources/images/envelope.png'
	}, {
		text : 'Imprimir relatório', // 'Enviar relatório para o email',
		itemId : 'relatorio',
		icon : 'resources/images/envelope.png'
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
 name : 'subdominio',printExtent.addPage();
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

 {
 "scales":[{"name":"1:25.000","value":"25000.0"},{"name":"1:50.000","value":"50000.0"},{"name":"1:100.000","value":"100000.0"},{"name":"1:200.000","value":"200000.0"},{"name":"1:500.000","value":"500000.0"},{"name":"1:1.000.000","value":"1000000.0"},{"name":"1:2.000.000","value":"2000000.0"},{"name":"1:4.000.000","value":"4000000.0"}],
 "dpis":[{"name":"75","value":"75"},{"name":"150","value":"150"},{"name":"300","value":"300"}],
 "outputFormats":[{"name":"pdf"}],
 "layouts":[{"name":"A4 portrait","map":{"width":440,"height":483},"rotation":true},{"name":"Legal","map":{"width":440,"height":483},"rotation":false}],
 "printURL":"http://localhost:8080/geoserver/pdf/print.pdf","createURL":"http://localhost:8080/geoserver/pdf/create.json"
 }

 */