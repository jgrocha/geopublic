/*
 * http://kb.imakewebsites.ca/2014/01/04/new-node-wishlist/
 */
Ext.define('DemoExtJs.controller.MainMapPanel', {
	extend : 'Ext.app.Controller',
	requires : ['GeoExt.Action'],
	stores : ['Confrontacao'], // getConfrontacaoStore()
	highlightCtrl : {},
	insertPoint : {},
	insertPolygon : {},
	wfs_ocorrencia : {},
	saveStrategy : {},
	refs : [

	// ver exemplo: http://geoext.github.io/geoext2/examples/action/mappanel_with_actions.html

	// corrigir esta referência, para depois passar como par
	// Ext.ComponentQuery.query('app-main-map-panel tbar')
	{
		ref : 'barra',
		selector : 'app-main-map-panel toolbar'
	}, {
		ref : 'mapa',
		selector : 'app-main-map-panel'
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
			"app-main-map-panel button#insertPoint" : {
				click : this.onButtonClickInsertPoint
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
		this.saveStrategy.save();
	},
	onButtonClickHighlightCtrl : function(button, e, options) {
		console.log('onButtonClickHighlightCtrl');
		this.highlightCtrl.activate();
		this.insertPoint.deactivate();
		this.insertPolygon.deactivate();
	},
	onButtonClickInsertPoint : function(button, e, options) {
		console.log('onButtonClickInsertPoint');
		this.highlightCtrl.deactivate();
		this.insertPoint.activate();
		this.insertPolygon.deactivate();
		console.debug(this.getBarra());
	},
	onButtonClickInsertPolygon : function(button, e, options) {
		console.log('onButtonClickInsertPolygon');
		this.highlightCtrl.deactivate();
		this.insertPoint.deactivate();
		this.insertPolygon.activate();
	},
	saveSuccess : function(event) {
		// só agora tenho o fid atribuído... fixe, que é para ser atribuído à imagem.
		// console.log('Your mapped field(s) have been successfully saved, em particular ' + ultimoFeatureInserido.fid);
		console.log('Atualizar o store JSON com as contribuições...');
		// storeContribuicoesJson.load();
		console.debug(event.response);
	},
	saveFail : function(event) {
		console.log('Error! Your changes could not be saved. ');
		console.debug(event.response);
		// alert('Error! Your changes could not be saved. ');
	},
	mostraDados : function(event) {
		console.debug(event.feature);
		// alert('Error! Your changes could not be saved. ');

		// this.getConfrontacaoStore().proxy.setExtraParam("userid", DemoExtJs.LoggedInUser.data.id);
		this.getConfrontacaoStore().load();

		var view = Ext.widget('windowconfrontacao');
		// widget.windowconfrontacao
		view.show();
	},
	onMapPanelBeforeRender : function(mapPanel, options) {
		// this = instância "DemoExtJs.controller.MainMapPanel"
		var me = this;

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
		map.setCenter(new OpenLayers.LonLat(-26557, 100814), 5);

		mapDebug = map;
		mapPanelDebug = mapPanel;

		me.saveStrategy = new OpenLayers.Strategy.Save();
		me.saveStrategy.events.register('success', null, this.saveSuccess);
		me.saveStrategy.events.register('fail', null, this.saveFail);
		me.wfs_ocorrencia = new OpenLayers.Layer.Vector('Pretensões', {
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
			projection : new OpenLayers.Projection("EPSG:3763")
		});
		map.addLayer(me.wfs_ocorrencia);

		/*
		 this.insertPoint = new OpenLayers.Control.DrawFeature(wfs_ocorrencia, OpenLayers.Handler.Point, {
		 'displayClass' : 'olControlDrawFeaturePoint'
		 });
		 this.insertPolygon = new OpenLayers.Control.DrawFeature(wfs_ocorrencia, OpenLayers.Handler.Polygon, {
		 'displayClass' : 'olControlDrawFeaturePolygon'
		 });

		 var toolbar = new OpenLayers.Control.Panel({
		 displayClass : 'customEditingToolbar'
		 });
		 toolbar.addControls([this.insertPoint, this.insertPolygon]);
		 map.addControl(toolbar);
		 */

	},
	onMapPanelAfterRender : function(mapPanel, options) {
		// this = instância "DemoExtJs.controller.MainMapPanel"
		var me = this;

		this.highlightCtrl = new OpenLayers.Control.SelectFeature(me.wfs_ocorrencia, {
			// hover : true,
			// clickout : true, // {Boolean} Unselect features when clicking outside any feature.  Default is true.
			highlightOnly : true,
			eventListeners : {
				// beforefeaturehighlighted : this.mostraDados
				// featurehighlighted : mostraDados
				// featureunhighlighted : limpaDados
				beforefeaturehighlighted : function(event) {
					console.debug(event.feature);
					console.debug(event.feature.geometry.getBounds().toBBOX());
					console.debug('Confrontações da pretensão ' + event.feature.data.id);
					me.getConfrontacaoStore().proxy.setExtraParam("idpretensao", event.feature.data.id);
					// me.getConfrontacaoStore().filter("id", parseInt(event.feature.data.id));
					me.getConfrontacaoStore().load();
					// widget.windowconfrontacao
					var view = Ext.widget('windowconfrontacao');
					view.bounds = event.feature.geometry.getBounds();
					console.debug(view);
					view.show();
					
				}
			}
		});

		this.insertPoint = new OpenLayers.Control.DrawFeature(me.wfs_ocorrencia, OpenLayers.Handler.Point, {
			'displayClass' : 'olControlDrawFeaturePoint'
		});
		this.insertPolygon = new OpenLayers.Control.DrawFeature(me.wfs_ocorrencia, OpenLayers.Handler.Polygon, {
			'displayClass' : 'olControlDrawFeaturePolygon'
		});

		var toolbar = new OpenLayers.Control.Panel({
			displayClass : 'customEditingToolbar'
		});
		toolbar.addControls([this.highlightCtrl, this.insertPoint, this.insertPolygon]);
		map.addControl(toolbar);

		this.insertPolygon.events.on({
			featureadded : function(event) {
				event.feature.attributes["designacao"] = 'Acabadinho de Inserir';
				event.feature.attributes["idutilizador"] = DemoExtJs.LoggedInUser.data.id;
			}
		});

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
