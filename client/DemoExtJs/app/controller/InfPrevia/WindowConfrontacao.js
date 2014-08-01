Ext.define('DemoExtJs.controller.InfPrevia.WindowConfrontacao', {
	extend : 'Ext.app.Controller',
	requires : ['GeoExt.data.MapfishPrintProvider'], // , 'GeoExt.plugins.PrintExtent'],
	// Ext.ComponentQuery.query('windowconfrontacao')
	stores : ['InfPrevia.ConfrontacaoPretensao'], // getInfPreviaConfrontacaoPretensaoStore()
	views : ['InfPrevia.WindowConfrontacao'],
	refs : [{
		selector : 'windowconfrontacao > feedback-map-panel',
		ref : 'mapa' // gera um getMapa
	}],
	init : function() {
		var me = this;
		var map = null;
		this.control({
			'windowconfrontacao' : {
				beforerender : function(view) {
					// console.debug(view.bounds);
					// me.getConfrontacaoStore().proxy.setExtraParam("idpretensao", view.pretensao);
					// .proxy não existe no store geoext
					// me.getConfrontacaoStore().filter("id", parseInt(event.feature.data.id));
					// me.getConfrontacaoStore().load();
				},
				afterrender : function(view) {
					console.debug('InfPrevia.WindowConfrontacao afterrender');
				},
				refresh : function(view) {
					console.debug('InfPrevia.WindowConfrontacao refresh');
				},
				close : function(view) {
					console.debug('InfPrevia.WindowConfrontacao close');
					me.getInfPreviaConfrontacaoPretensaoStore().unbind();
					me.getInfPreviaConfrontacaoPretensaoStore().removeAll();
					var num = me.getMapa().map.getNumLayers();
					for (var i = num - 1; i >= 0; i--) {
						me.getMapa().map.removeLayer(me.getMapa().map.layers[i]);
					}
				}
			},
			'feedback-map-panel' : {
				'beforerender' : this.onMapPanelBeforeRender,
				'afterrender' : this.onMapPanelAfterRender
			},
			"windowconfrontacao button#remove" : {
				click : this.onButtonClickRemovePolygon
			},
			"windowconfrontacao button#imprimemapa" : {
				click : this.onButtonClickImprimeMapa
			},
			"windowconfrontacao button#relatorio" : {
				click : this.onButtonClickEnviaRelatorio
			},
			"windowconfrontacao button#centra" : {
				click : this.onButtonClickCentrar
			}
		}, this);
	},
	onButtonClickRemovePolygon : function(button, e, options) {
		console.log('onButtonClickRemovePolygon para remover o feature: ');

		Ext.Msg.confirm('Remover confrontação', 'Tem a certeza?', function(id, value) {
			if (id === 'yes') {
				console.log('confirmed');
				// no access to list, record, node, ... here, why?
				var f = button.up('windowconfrontacao').feature;
				console.debug(f);
				f.state = OpenLayers.State.DELETE;
				f.layer.events.triggerEvent("afterfeaturemodified", {
					feature : f
				});
				button.up('windowconfrontacao').close();
			}
		}, this);
	},
	onButtonClickImprimeMapa : function(button, e, options) {
		console.log('onButtonClickImprimeMapa');
		console.debug(this.getMapa());
		// this.getMapa().plugins[0].addPage();
		// this.getMapa().plugins[0].print();
	},
	onButtonClickEnviaRelatorio : function(button, e, options) {
		console.log('onButtonClickEnviaRelatorio');
		// console.debug(this.getMapa());

		var printProvider = this.getMapa().printProvider;

		console.debug(this.jsonData);

		Ext.Ajax.request({
			url : printProvider.capabilities.createURL,
			// timeout : this.timeout,
			jsonData : this.jsonData,
			headers : {
				"Content-Type" : "application/json; charset=" + printProvider.encoding
			},
			success : function(response) {
				// console.debug(response);
				var url = Ext.decode(response.responseText).getURL;
				this.download(url);
			},
			failure : function(response) {
				printProvider.fireEvent("printexception", this, response);
			},
			params : printProvider.initialConfig.baseParams,
			scope : printProvider
		});

		// Download do PDF

	},
	download : function(url) {
		if (this.fireEvent("beforedownload", this, url) !== false) {
			if (Ext.isOpera) {
				// Make sure that Opera don't replace the content tab with
				// the pdf
				window.open(url);
			} else {
				// This avoids popup blockers for all other browsers
				window.location.href = url;
			}
		}
		this.fireEvent("print", this, url);
	},
	onButtonClickCentrar : function(button, e, options) {
		console.log('onButtonClickCentrar');
		var bb = button.up('windowconfrontacao').bounds;
		button.up('windowconfrontacao').down('feedback-map-panel').map.zoomToExtent(bb);
	},
	onMapPanelBeforeRender : function(mapPanel, options) {
		var me = this;
		// var bounds = mapPanel.up().up().bounds;
		var bounds = mapPanel.up('windowconfrontacao').bounds;
		var idpretensao = mapPanel.up('windowconfrontacao').pretensao;
		console.log('Vai apresentar a pretensão ' + idpretensao + ' com os limites ' + bounds);

		var servidor_de_mapas = '';
		if (document.location.href.split('/')[2].indexOf('3000') > -1)
			servidor_de_mapas = 'http://development.localhost.lan';
		else
			servidor_de_mapas = document.location.href.split('/')[0] + '//' + document.location.href.split('/')[2];
			
		var wfs_confrontacao = new OpenLayers.Layer.Vector('Confrontação', {
			strategies : [new OpenLayers.Strategy.Fixed()],
			protocol : new OpenLayers.Protocol.WFS({
				url : servidor_de_mapas + ':8080' + '/geoserver/wfs', //
				featureType : 'confrontacao',
				featureNS : 'http://geomaster.pt',
				srsName : 'EPSG:3763',
				version : '1.1.0',
				reportError : true,
				featurePrefix : 'geomaster',
				schema : servidor_de_mapas + ':8080' + '/geoserver/wfs/DescribeFeatureType?version=1.1.0&typename=geomaster:confrontacao',
				geometryName : 'the_geom'
			}),
			visibility : true,
			projection : new OpenLayers.Projection("EPSG:3763"),
			filter : new OpenLayers.Filter.Comparison({
				type : OpenLayers.Filter.Comparison.EQUAL_TO,
				property : "idpretensao",
				value : idpretensao
			})
		});

		/*
		* o setCenter funciona muito bem
		*/
		// mapPanel.map.setCenter(bounds.getCenterLonLat(), 10);
		// ok!

		// map.zoomToExtent(bounds);
		// not ok! Só funciona no fim de ler os tiles...

		// for debug // fica com global, para se usar na consola
		mapConfrontacao = mapPanel.map;

		wfs_confrontacao.events.register("loadend", wfs_confrontacao, function(e) {
			console.log('WFS loaded...');
			mapPanel.map.zoomToExtent(bounds);
			me.getInfPreviaConfrontacaoPretensaoStore().bind(wfs_confrontacao);

			var grid = mapPanel.up('windowconfrontacao').down('tabela-confrontacao');
			grid.getSelectionModel().bind(wfs_confrontacao);
			console.log(grid);

			var printProvider = me.getMapa().printProvider;
			var encodedLayers = [];
			// ensure that the baseLayer is the first one in the encoded list
			var layers = me.getMapa().map.layers.concat();
			Ext.Array.remove(layers, me.getMapa().map.baseLayer);
			Ext.Array.insert(layers, 0, [me.getMapa().map.baseLayer]);
			Ext.each(layers, function(layer) {
				if (layer.getVisibility() === true) {
					var enc = printProvider.encodeLayer(layer);
					enc && encodedLayers.push(enc);
				}
			}, this);

			me.jsonData = {
				units : "m",
				srs : "EPSG:3763",
				layout : "A4-5",
				dpi : 150,
				mapTitle : "Confrontação da pretensão",
				comment : "Este mapa indicativo.",
				maps : {
					"mapa0" : {
						"layers" : [{
							"baseURL" : "http://localhost/mapproxy/tms/",
							"opacity" : 1,
							"singleTile" : false,
							"type" : "TMS",
							"layer" : "mapquest/pt_tm_06",
							"maxExtent" : [-119191.407499, -300404.803999, 162129.0811, 276083.7674],
							"tileSize" : [256, 256],
							"resolutions" : [2251.90848203, 1125.95424101, 562.977120507, 281.488560253, 140.744280127, 70.3721400634, 35.1860700317, 17.5930350158, 8.79651750792, 4.39825875396, 2.19912937698, 1.09956468849, 0.549782344245, 0.274891172122, 0.137445586061, 0.0687227930306],
							"format" : "png"
						}],
						"srs" : "EPSG:3763"
					}
				},
				pages : [{
					maps : {
						"mapa0" : {
							"center" : [-26557, 100814],
							"rotation" : 0,
							"dpi" : 75,
							"scale" : 10000
						}
					},
					"tabela" : {
						"data" : [{
							"id" : 1,
							"area" : 27.5,
							"sumario" : "Este terreno  para quase nada",
							"texto" : "Texto muito comprimdo, maior do que a  de Braga"
						}],
						"columns" : ["id", "area", "sumario", "texto"]
					}
				}]
			};

			me.jsonData.maps.mapa0.layers = encodedLayers;

			me.jsonData.pages[0].maps["mapa0"].center = [mapPanel.map.getCenter().lon.toFixed(), mapPanel.map.getCenter().lat.toFixed()];
			var limite = wfs_confrontacao.features.length > 6 ? 6 : wfs_confrontacao.features.length;
			me.jsonData.layout = "A4-" + limite;
			for (var i = 0; i < limite; ++i) {
				var mapa_layers = {
					"layers" : [{
						"baseURL" : "http://localhost/mapproxy/tms/",
						"opacity" : 1,
						"singleTile" : false,
						"type" : "TMS",
						"layer" : "mapquest/pt_tm_06",
						"maxExtent" : [-119191.407499, -300404.803999, 162129.0811, 276083.7674],
						"tileSize" : [256, 256],
						"resolutions" : [2251.90848203, 1125.95424101, 562.977120507, 281.488560253, 140.744280127, 70.3721400634, 35.1860700317, 17.5930350158, 8.79651750792, 4.39825875396, 2.19912937698, 1.09956468849, 0.549782344245, 0.274891172122, 0.137445586061, 0.0687227930306],
						"format" : "png"
					}],
					"srs" : "EPSG:3763"
				};

				var mapa_layout = {
					"center" : [-26557, 100814],
					"rotation" : 0,
					"dpi" : 75,
					"scale" : 5000
				};

				var aux = Ext.clone(encodedLayers);
				var f = encodedLayers[encodedLayers.length-1].geoJson.features[i];
				// console.debug(encodedLayers[encodedLayers.length-1].geoJson);
				// console.debug('f = ', f);
				aux[aux.length - 1].geoJson.features = [f];
				// console.log(aux[aux.length-1].geoJson);

				me.jsonData.maps["mapa" + (i + 1)] = {
					layers : aux,
					srs : "EPSG:3763"
				};

				mapa_layout.center = [wfs_confrontacao.features[i].geometry.getCentroid().x.toFixed(0), wfs_confrontacao.features[i].geometry.getCentroid().y.toFixed(0)];
				me.jsonData.pages[0].maps["mapa" + (i + 1)] = mapa_layout;
			}
			// console.debug(me.jsonData);
		});

		wfs_confrontacao.events.register("loadstart", wfs_confrontacao, function(e) {
			console.log('WFS started...');
		});

		mapPanel.map.addLayer(wfs_confrontacao);

	},
	onMapPanelAfterRender : function(mapPanel, options) {
		var me = this;
		// var bounds = mapPanel.up().up().bounds;
		var bounds = mapPanel.up('windowconfrontacao').bounds;

		// console.debug(mapPanel);
		// mapPanel.map.zoomToExtent(bounds, false);
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