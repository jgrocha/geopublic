/*
 * http://kb.imakewebsites.ca/2014/01/04/new-node-wishlist/
 */
Ext.define('DemoExtJs.controller.MainMapPanel', {
	extend : 'Ext.app.Controller',
	requires : ['GeoExt.Action'],

	/*
	 selectCtrl : {},
	 highlightCtrl : {},
	 insertPoint : {},
	 insertPolygon : {},
	 */

	wfs_pretensao : {},
	saveStrategy : {},
	refs : [

	// ver exemplo: http://geoext.github.io/geoext2/examples/action/mappanel_with_actions.html

	// Ext.ComponentQuery.query('app-main-map-panel toolbar')
	{
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
	}],
	init : function() {
		console.log('O controlador Ppgis.controller.MainMapPanel init...');
		this.control({
			'app-main-map-panel' : {
				'beforerender' : this.onMapPanelBeforeRender,
				'afterrender' : this.onMapPanelAfterRender
			},
			"app-main-map-panel button#highlightCtrl" : {
				click : this.onButtonClickHighlightCtrl
			},
			"app-main-map-panel gx_geocodercombo#geocoder" : {
				select : this.onSelectGeocoder
			},
			"app-main-map-panel button#insertPolygon" : {
				click : this.onButtonClickInsertPolygon
			},
			"app-main-map-panel button#save" : {
				click : this.onButtonClickSave
			}
		}, this);
	},
	onLaunch : function() {
		console.log('...O controlador DemoExtJs.controller.MainMapPanel onLaunch.');
	},
	onButtonClickSave : function(button, e, options) {
		console.log('onButtonClickSave');
	},
	onButtonClickHighlightCtrl : function(button, e, options) {
		console.log('onButtonClickHighlightCtrl');
	},
	onSelectGeocoder : function(combo, records) {
		console.log('onSelectGeocoder');
		console.debug(records[0].data);
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
		// só agora tenho o fid atribuído... fixe, que é para ser atribuído à imagem.
		// console.log('Your mapped field(s) have been successfully saved, em particular ' + ultimoFeatureInserido.fid);
		// console.log('Atualizar o store JSON com as contribuições...');
		// storeContribuicoesJson.load();
		// console.debug(event.response);
		// console.debug(this);	// OpenLayers.Strategy.Save //se me.saveStrategy.events.register('success', null, this.saveSuccess);
		console.debug(this);
		// DemoExtJs.controller.MainMapPanel //se me.saveStrategy.events.register('success', this, this.saveSuccess);
		this.wfs_pretensao.refresh({
			force : true
		});
		// pode ter acontecido um insert ou um remove :-)
		if (this.getInserir().pressed) {
			this.getInserir().toggle(false);
			//-- a ordem é importante...
			this.getMapa().highlightCtrl.activate();
			this.getMapa().selectCtrl.activate();
			this.getMapa().insertPoint.deactivate();
			this.getMapa().insertPolygon.deactivate();
		}
	},
	saveFail : function(event) {
		console.log('Error! Your changes could not be saved. ');
		console.debug(event.response);
		// alert('Error! Your changes could not be saved. ');
		Ext.Msg.alert('Erro', 'Não foi possível fazer a confrontação do polígono com os instrumentos de gestão do território.<br>O erro ficou registado e será analisado.');
	},
	onMapPanelBeforeRender : function(mapPanel, options) {
		// this = instância "DemoExtJs.controller.MainMapPanel"
		var me = this;

		var userid = -1;
		if (DemoExtJs.LoggedInUser) {
			userid = DemoExtJs.LoggedInUser.data.id;
		}

		var layers = [];
		map = mapPanel.map;
		// OpenLayers object creating

		var layerQuest = new OpenLayers.Layer.TMS('TMS mapquest', '/mapproxy/tms/', {
			layername : 'mapquest/pt_tm_06',
			type : 'png',
			tileSize : new OpenLayers.Size(256, 256)
		}, {
			isBaseLayer : true
		});
		layers.push(layerQuest);

		var layerOrtos = new OpenLayers.Layer.TMS('Ortos', '/mapproxy/tms/', {
			layername : 'ortos/pt_tm_06',
			type : 'png',
			tileSize : new OpenLayers.Size(256, 256)
			// resolutions: [8.79651750792, 4.39825875396, 2.19912937698, 1.09956468849, 0.549782344245, 0.274891172122, 0.137445586061, 0.0687227930306]
		}, {
			isBaseLayer : true
		});
		layers.push(layerOrtos);

		// ok     http://localhost:8011/tms/1.0.0/ortos/pt_tm_06/11/326/1254.png
		// ok     http://development.localhost.lan/mapproxy/tms/1.0.0/ortos/pt_tm_06/11/326/1254.png
		// not ok http://development.localhost.lan/mapproxy/tms/1.0.0/ortos/pt_tm_06/2/162/713.png

		// resolutions : [2251.90848203, 1125.95424101, 562.977120507, 281.488560253, 140.744280127, 70.3721400634, 35.1860700317, 17.5930350158, 8.79651750792, 4.39825875396, 2.19912937698, 1.09956468849, 0.549782344245, 0.274891172122, 0.137445586061, 0.0687227930306], // , 0.0343613965153, 0.0171806982577, 0.00859034912883, 0.00429517456441],
		// os ortos só dá para resoluções [8.79651750792, 4.39825875396, 2.19912937698, 1.09956468849, 0.549782344245, 0.274891172122, 0.137445586061, 0.0687227930306],

		map.addLayers(layers);
		map.setCenter(new OpenLayers.LonLat(-26557, 100814), 10);
		// deve ser 5; em debug pode ser 10

		mapDebug = map;
		mapPanelDebug = mapPanel;

		me.saveStrategy = new OpenLayers.Strategy.Save({
			auto : 'true'
		});
		// me.saveStrategy = new OpenLayers.Strategy.Save();
		me.saveStrategy.events.register('success', this, this.saveSuccess);
		me.saveStrategy.events.register('fail', this, this.saveFail);
		me.wfs_pretensao = new OpenLayers.Layer.Vector('Pretensões', {
			strategies : [new OpenLayers.Strategy.BBOX(), me.saveStrategy],
			protocol : new OpenLayers.Protocol.WFS({
				url : 'http://development.localhost.lan/geoserver/wfs', //
				featureType : 'pretensao',
				featureNS : 'http://geomaster.pt',
				srsName : 'EPSG:3763',
				version : '1.1.0',
				reportError : true,
				featurePrefix : 'geomaster',
				schema : 'http://development.localhost.lan/geoserver/wfs/DescribeFeatureType?version=1.1.0&typename=geomaster:pretensao',
				geometryName : 'the_geom'
			}),
			visibility : true,
			projection : new OpenLayers.Projection("EPSG:3763"),
			filter : new OpenLayers.Filter.Comparison({
				type : OpenLayers.Filter.Comparison.EQUAL_TO,
				property : "idutilizador",
				value : userid
			})
		});
		map.addLayer(me.wfs_pretensao);

		var locationLayer = new OpenLayers.Layer.Vector("Location", {
			projection : new OpenLayers.Projection("EPSG:4326"),
			styleMap : new OpenLayers.Style({
				externalGraphic : "http://openlayers.org/api/img/marker.png",
				graphicYOffset : -25,
				graphicHeight : 25,
				graphicTitle : "${name}"
			})
		});

		map.addLayer(locationLayer);
		//
		me.getGeocoder().layer = locationLayer;
		me.getGeocoderprocesso().layer = locationLayer;

	},
	onMapPanelAfterRender : function(mapPanel, options) {
		// this = instância "DemoExtJs.controller.MainMapPanel"
		var me = this;

		mapPanel.selectCtrl = new OpenLayers.Control.SelectFeature(me.wfs_pretensao, {
			clickout : true,
			eventListeners : {
				beforefeaturehighlighted : function(event) {
					console.debug(event.feature);
					// este feature pode vir a ser removido...

					// console.debug(event.feature.geometry.getBounds().toBBOX());
					console.debug('Confrontações da pretensão ' + event.feature.data.id);
					// me.getConfrontacaoStore().proxy.setExtraParam("idpretensao", event.feature.data.id);
					// .proxy não existe no store geoext
					// me.getConfrontacaoStore().filter("id", parseInt(event.feature.data.id));
					// me.getConfrontacaoStore().load();
					// widget.windowconfrontacao
					var view = Ext.widget('windowconfrontacao', {
						// title : 'Área total: ' + parseFloat(event.feature.data.area).toFixed(2) + ' m2',
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
				// console.log('beforefeatureadded');
				// console.debug(event.feature);
				// só devia preencher estes campos para os novos features...
				event.feature.attributes["designacao"] = 'Desenhado na web';
				event.feature.attributes["idutilizador"] = DemoExtJs.LoggedInUser.data.id;
			}
		});

		mapPanel.insertPolygon.events.on({
			featureadded : function(event) {
				console.log('featureadded');
			}
		});

		//-- a ordem destes dois é importante
		mapPanel.highlightCtrl.activate();
		mapPanel.selectCtrl.activate();

		/*
		var ctrl, toolbarItems = [], action, actions = {};

		action = Ext.create('GeoExt.Action', {
		text : "previous",
		control : ctrl.previous,
		disabled : true,
		tooltip : "previous in history"
		});
		actions["previous"] = action;
		toolbarItems.push(Ext.create('Ext.button.Button', action));

		action = Ext.create('GeoExt.Action', {
		text : "next",
		control : ctrl.next,
		disabled : true,
		tooltip : "next in history"
		});
		actions["next"] = action;
		toolbarItems.push(Ext.create('Ext.button.Button', action));
		toolbarItems.push("->");
		*/

		// this.getBarra().add(action);

	}
});
