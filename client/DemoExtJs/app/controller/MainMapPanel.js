/*
 * http://kb.imakewebsites.ca/2014/01/04/new-node-wishlist/
 */
Ext.define('DemoExtJs.controller.MainMapPanel', {
	extend : 'Ext.app.Controller',
	requires : ['GeoExt.Action'],

	wfs_pretensao : {},
	saveStrategy : {},
	zoomLevelEdit : 12,
	refs : [

	// ver exemplo:
	// http://geoext.github.io/geoext2/examples/action/mappanel_with_actions.html

	// Ext.ComponentQuery.query('app-main-map-panel toolbar')
	{
		selector : 'viewport > tabpanel',
		ref : 'painelPrincipal' // gera um getPainelPrincipal
	}, {
		ref : 'barra',
		selector : 'app-main-map-panel toolbar'
	}, {
		ref : 'mapa',
		selector : 'app-main-map-panel'
	}, {
		ref : 'inserir',
		selector : 'app-main-map-panel toolbar button#insertPolygon'
	}, {
		ref : 'geocoder',
		selector : 'app-main-map-panel toolbar gx_geocodercombo#geocoder'
	}, {
		ref : 'geocoderprocesso',
		selector : 'app-main-map-panel toolbar gx_geocodercombo#geocoderprocesso'
	}, {
		ref : 'combopromotor', // this.getCombopromotor()
		selector : 'topheader combo#promotor'
	}],
	init : function() {
		// <debug>
		console.log('O controlador DemoExtJs.controller.MainMapPanel init...');
		// </debug>
		 this.listen({
		             controller: {
		                 '*': {
		                     logoutComSucesso: this.onLogoutComSucesso,
		                     loginComSucesso: this.onLoginComSucesso
		                 }
		             }
		         });
		this.control({
			'app-main-map-panel' : {
				'beforerender' : this.onMapPanelBeforeRender,
				'afterrender' : this.onMapPanelAfterRender,
				'beforeactivate' : this.onMapPanelBeforeActivate
			}, /*
			 "app-main-map-panel button#highlightCtrl" : {
			 click : this.onButtonClickHighlightCtrl
			 }, */
			"app-main-map-panel gx_geocodercombo#geocoder" : {
				select : this.onSelectGeocoder
			},
			"app-main-map-panel button#insertPolygon" : {
				click : this.onButtonClickInsertPolygon
			},
			'topheader combo#plano' : {
				change : this.onChangePlano
			},
		}, this);
	},
	onLoginComSucesso : function() {
		console.log('onLoginComSucesso', this, console.log(arguments));
		if (this.getMapa().up('tabpanel').getActiveTab().title == "Mapa") {
			var mapa = this.getMapa().map;
			this.getBarra().enable();
			var zLevel = mapa.getZoom();
			if (DemoExtJs.LoggedInUser && zLevel >= this.zoomLevelEdit) {
				this.getInserir().enable();
			} else {
				this.getInserir().disable();
			}
			this.wfs_pretensao.filter = new OpenLayers.Filter.Comparison({
				type : OpenLayers.Filter.Comparison.EQUAL_TO,
				property : "idutilizador",
				value : DemoExtJs.LoggedInUser.data.id
			});
			this.wfs_pretensao.refresh({
				force : true
			});
		} else {
			console.log('Não faço nada onLoginComSucesso no DemoExtJs.controller.MainMapPanel');
		}
	},
	onLogoutComSucesso : function() {
		console.log('onLogoutComSucesso', this, console.log(arguments));
		if (this.getMapa().up('tabpanel').getActiveTab().title == "Mapa") {
			this.getInserir().disable();
			this.getBarra().disable();
			this.wfs_pretensao.filter = new OpenLayers.Filter.Comparison({
				type : OpenLayers.Filter.Comparison.EQUAL_TO,
				property : "idutilizador",
				value : -1
			});
			this.wfs_pretensao.refresh({
				force : true
			});
		} else {
			console.log('Não faço nada onLogoutComSucesso no DemoExtJs.controller.MainMapPanel');
		}
	},
	onChangePlano : function(field, newValue, oldValue, eOpts) {
		console.log('   Plano: ' + newValue);
		console.log('Promotor: ' + this.getCombopromotor().getValue());

		var promotor = this.getCombopromotor().getValue();
		var plano = parseInt(newValue);

		// Muda para o mapa

		// this.getPainelPrincipal().setActiveTab(1);
		
		// configura o filtro do WFS para só apanhar participações deste plano
		// configura o estilo dos features, de acordo com o plano

	},
	onButtonClickRefresh : function(button, e, options) {
		// <debug>
		console.log('onButtonClickRefresh');
		// </debug>
		this.wfs_pretensao.filter = new OpenLayers.Filter.Comparison({
			type : OpenLayers.Filter.Comparison.EQUAL_TO,
			property : "idutilizador",
			value : DemoExtJs.LoggedInUser.data.id
		});
		this.wfs_pretensao.refresh({
			force : true
		});
	},
	onSelectGeocoder : function(combo, records) {
		// <debug>
		console.log('onSelectGeocoder');
		console.debug(records[0].data);
		// </debug>
	},
	onButtonClickInsertPolygon : function(button, e, options) {
		// console.log('onButtonClickInsertPolygon');
		// console.debug(button);
		if (button.pressed) {
			button.up('app-main-map-panel').highlightCtrl.deactivate();
			button.up('app-main-map-panel').selectCtrl.deactivate();
			button.up('app-main-map-panel').insertPoint.deactivate();
			button.up('app-main-map-panel').insertPolygon.activate();
		} else {
			button.up('app-main-map-panel').insertPolygon.cancel();

			button.up('app-main-map-panel').highlightCtrl.activate();
			button.up('app-main-map-panel').selectCtrl.activate();
			button.up('app-main-map-panel').insertPoint.deactivate();
			button.up('app-main-map-panel').insertPolygon.deactivate();
		}
	},
	saveSuccess : function(event) {
		// só agora tenho o fid atribuído... fixe, que é para ser atribuído à
		// imagem.
		// console.log('Your mapped field(s) have been successfully saved, em
		// particular ' + ultimoFeatureInserido.fid);
		// console.log('Atualizar o store JSON com as contribuições...');
		// storeContribuicoesJson.load();
		// console.debug(event.response);
		// console.debug(this); // OpenLayers.Strategy.Save //se
		// me.saveStrategy.events.register('success', null, this.saveSuccess);
		// console.debug(this);
		// DemoExtJs.controller.MainMapPanel //se
		// me.saveStrategy.events.register('success', this, this.saveSuccess);
		this.wfs_pretensao.refresh({
			force : true
		});
		// pode ter acontecido um insert ou um remove :-)
		if (this.getInserir().pressed) {
			this.getInserir().toggle(false);
			// -- a ordem é importante...
			this.getMapa().highlightCtrl.activate();
			this.getMapa().selectCtrl.activate();
			this.getMapa().insertPoint.deactivate();
			this.getMapa().insertPolygon.deactivate();
		}
	},
	saveFail : function(event) {
		// <debug>
		console.log('Error! Your changes could not be saved. ');
		console.debug(event.response);
		// </debug>
		// alert('Error! Your changes could not be saved. ');
		Ext.Msg.alert('Erro', 'Não foi possível fazer a confrontação do polígono com os instrumentos de gestão do território.<br>O erro ficou registado e será analisado.');
	},
	onMapPanelBeforeRender : function(mapPanel, options) {
		console.log('onMapPanelBeforeRender');
		var me = this;
		var map = mapPanel.map;

		var userid = -1;
		if (DemoExtJs.LoggedInUser) {
			userid = DemoExtJs.LoggedInUser.data.id;
		}

		baseOSM = new OpenLayers.Layer.OSM("MapQuest-OSM Tiles", ["http://otile1.mqcdn.com/tiles/1.0.0/map/${z}/${x}/${y}.jpg", "http://otile2.mqcdn.com/tiles/1.0.0/map/${z}/${x}/${y}.jpg", "http://otile3.mqcdn.com/tiles/1.0.0/map/${z}/${x}/${y}.jpg", "http://otile4.mqcdn.com/tiles/1.0.0/map/${z}/${x}/${y}.jpg"]);
		baseAerial = new OpenLayers.Layer.OSM("MapQuest Open Aerial Tiles", ["http://otile1.mqcdn.com/tiles/1.0.0/sat/${z}/${x}/${y}.jpg", "http://otile2.mqcdn.com/tiles/1.0.0/sat/${z}/${x}/${y}.jpg", "http://otile3.mqcdn.com/tiles/1.0.0/sat/${z}/${x}/${y}.jpg", "http://otile4.mqcdn.com/tiles/1.0.0/sat/${z}/${x}/${y}.jpg"]);

		map.addLayers([baseOSM, baseAerial]);

		// http://www.openstreetmap.org/#map=18/40.57626/-8.44609
		// map.setCenter(new OpenLayers.LonLat(-8.44609, 40.57626).transform(new OpenLayers.Projection("EPSG:4326"), map.getProjectionObject()), 18);

		//<debug>
		// variáveis globais para debug
		mapDebug = map;
		mapPanelDebug = mapPanel;
		//</debug>

		me.saveStrategy = new OpenLayers.Strategy.Save({
			auto : 'true'
		});
		// me.saveStrategy = new OpenLayers.Strategy.Save();
		me.saveStrategy.events.register('success', this, this.saveSuccess);
		me.saveStrategy.events.register('fail', this, this.saveFail);

		me.wfs_pretensao = new OpenLayers.Layer.Vector('Pretensões', {
			strategies : [new OpenLayers.Strategy.BBOX(), me.saveStrategy],
			protocol : new OpenLayers.Protocol.WFS({
				url : DemoExtJs.geoserver + '/geoserver/wfs', //
				featureType : 'pretensao',
				featureNS : 'http://geomaster.pt',
				srsName : 'EPSG:3763',
				version : '1.1.0',
				reportError : true,
				featurePrefix : 'geomaster',
				schema : DemoExtJs.geoserver + '/geoserver/wfs/DescribeFeatureType?version=1.1.0&typename=geomaster:pretensao',
				geometryName : 'the_geom'
			}),
			visibility : true,
			displayInLayerSwitcher : false,
			projection : new OpenLayers.Projection("EPSG:3763"),
			filter : new OpenLayers.Filter.Comparison({
				type : OpenLayers.Filter.Comparison.EQUAL_TO,
				property : "idutilizador",
				value : userid
			})
		});
		map.addLayer(me.wfs_pretensao);

		var locationLayer = new OpenLayers.Layer.Vector("Location", {
			displayInLayerSwitcher : false,
			projection : new OpenLayers.Projection("EPSG:4326"),
			styleMap : new OpenLayers.Style({
				externalGraphic : "resources/images/marker.png",
				graphicYOffset : -25,
				graphicHeight : 25,
				graphicTitle : "${name}"
			})
		});
		map.addLayer(locationLayer);
		me.getGeocoder().layer = locationLayer;
	},
	onMapPanelAfterRender : function(mapPanel, options) {
		console.log('onMapPanelAfterRender');
		var me = this;
		var map = mapPanel.map;

		mapPanel.selectCtrl = new OpenLayers.Control.SelectFeature(me.wfs_pretensao, {
			clickout : true,
			eventListeners : {
				beforefeaturehighlighted : function(event) {
					console.debug(event.feature);
					console.debug('Confrontações da pretensão ' + event.feature.data.id);
					var view = Ext.widget('windowconfrontacao', {
						// title : 'Área total: ' +
						// parseFloat(event.feature.data.area).toFixed(2) + '
						// m2',
						title : 'Área total: ' + Ext.util.Format.number(event.feature.data.area, '0.00') + ' m2',
						bounds : event.feature.geometry.getBounds(),
						pretensao : parseInt(event.feature.data.id),
						feature : event.feature
					});
					// view.bounds = event.feature.geometry.getBounds();
					// console.debug(view);
					view.show();
				},
				featurehighlighted : function(event) {
					this.unselectAll();
				}
			}
		});

		mapPanel.highlightCtrl = new OpenLayers.Control.SelectFeature(me.wfs_pretensao, {
			hover : true,
			highlightOnly : true,
			renderIntent : "temporary"
		});

		mapPanel.insertPoint = new OpenLayers.Control.DrawFeature(me.wfs_pretensao, OpenLayers.Handler.Point, {
			'displayClass' : 'olControlDrawFeaturePoint'
		});
		mapPanel.insertPolygon = new OpenLayers.Control.DrawFeature(me.wfs_pretensao, OpenLayers.Handler.Polygon, {
			'displayClass' : 'olControlDrawFeaturePolygon'
		});

		var toolbar = new OpenLayers.Control.Panel({
			displayClass : 'customEditingToolbar'
		});
		toolbar.addControls([mapPanel.selectCtrl, mapPanel.highlightCtrl, mapPanel.insertPoint, mapPanel.insertPolygon]);
		map.addControl(toolbar);
		me.wfs_pretensao.events.on({
			beforefeatureadded : function(event) {
				// console.log('beforefeatureadded WFS');
				// console.log(arguments);
				// console.debug(event.feature);
				// só devia preencher estes campos para os novos features...
				if (!event.feature.attributes["designacao"]) {
					event.feature.attributes["designacao"] = 'Desenhado na web';
				}
				event.feature.attributes["idutilizador"] = DemoExtJs.LoggedInUser.data.id;
			}
		});
		mapPanel.insertPolygon.events.on({
			featureadded : function(event) {
				console.log('featureadded');
			}
		});
		// -- a ordem destes dois é importante
		mapPanel.highlightCtrl.activate();
		mapPanel.selectCtrl.activate();

		map.events.register('zoomend', this, function(event) {
			var zLevel = map.getZoom();
			console.log('Zoom level: ', zLevel);
			if (DemoExtJs.LoggedInUser && zLevel >= this.zoomLevelEdit) {
				this.getInserir().enable();
			} else {
				this.getInserir().disable();
			}
		});

		// var guia = Ext.widget('guia');
		// guia.show();
	},
	onMapPanelBeforeActivate : function(mapPanel, options) {
		console.log('onMapPanelBeforeActivate');
		var map = mapPanel.map;
		if (DemoExtJs.LoggedInUser) {
			this.getBarra().enable();
		} else {
			this.getBarra().disable();
		}
	}
});
