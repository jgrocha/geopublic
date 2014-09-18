Ext.define('DemoExtJs.controller.MainMapPanel', {
	extend : 'Ext.app.Controller',
	stores : ['PromotorCombo', 'PlanoCombo', 'TipoOcorrenciaCombo', 'Ocorrencia'], // getPromotorComboStore()
	requires : ['GeoExt.Action'],

	wfs_pretensao : {},
	saveStrategy : {},
	zoomLevelEdit : 12,
	refs : [

	// ver exemplo:
	// http://geoext.github.io/geoext2/examples/action/mappanel_with_actions.html

	// Ext.ComponentQuery.query('app-main-map-panel toolbar')
	{
		selector : 'contribution form#detail',
		ref : 'formContribution' // gera um getFormContribution
	}, {
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
		selector : 'activity contribution form toolbar button#gravar'
	}, {
		ref : 'local',
		selector : 'activity contribution form toolbar button#local'
	}, {
		ref : 'todasDiscussoes',
		selector : 'activity #flow'
	}, {
		ref : 'geocoder',
		selector : 'app-main-map-panel toolbar gx_geocodercombo#geocoder'
	}, {
		ref : 'geocoderprocesso',
		selector : 'app-main-map-panel toolbar gx_geocodercombo#geocoderprocesso'
	}, {
		ref : 'combopromotor', // this.getCombopromotor()
		selector : 'app-main-map-panel combo#promotor'
	}, {
		ref : 'comboplano', // this.getComboplano()
		selector : 'app-main-map-panel combo#plano'
	}],

	init : function() {
		// <debug>
		console.log('O controlador DemoExtJs.controller.MainMapPanel init...');
		// </debug>
		/*
		 this.listen({
		             controller: {
		                 '*': {
		                     logoutComSucesso: this.onLogoutComSucesso,
		                     loginComSucesso: this.onLoginComSucesso
		                 }
		             }
		         });
		 */
		this.application.on({
			scope : this,
			loginComSucesso : this.onLoginComSucesso,
			logoutComSucesso : this.onLogoutComSucesso
		});
		this.getOcorrenciaStore().on({
			scope : this,
			load : this.onOcorrenciaStoreLoad
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
			'app-main-map-panel combo#plano' : {
				change : this.onChangePlano
			},
			"app-main-map-panel combo#promotor" : {
				select : this.onComboPromotor
			},
			"contribution form#detail toolbar button#local" : {
				click : this.onButtonLocal
			}
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
	onOcorrenciaStoreLoad : function(store, records) {
		console.log('onOcorrenciaStoreLoad');
		console.debug(store);
		console.debug(records);

		var report = this.getMapa().map.getLayersByName('Report')[0];
		report.destroyFeatures();
		var parser = new OpenLayers.Format.GeoJSON();

		for (var i = 0, len = records.length; i < len; i++) {
			var f = new OpenLayers.Feature.Vector(parser.read(records[i].data.geojson, "Geometry"));
			f.fid = records[i].data.id;
			report.addFeatures([f]);

			// criar os paineis de discussao
			var newDiscussion = new DemoExtJs.view.Participation.Discussion({
				id_ocorrencia : records[i].data.id,
				idplano : records[i].data.idplano,
				idestado : records[i].data.idestado,
				idtipoocorrencia : records[i].data.idtipoocorrencia,
				titulo : records[i].data.titulo,
				participacao : records[i].data.participacao,
				datacriacao : records[i].data.datacriacao
			});
			this.getTodasDiscussoes().add(newDiscussion);
			this.getTodasDiscussoes().doLayout();
		}
		// this.getTodasDiscussoes().doLayout();
	},

	onChangePlano : function(field, newValue, oldValue, eOpts) {
		console.log('   Plano: ' + newValue);
		console.log('Promotor: ' + this.getCombopromotor().getValue());

		var promotor = this.getCombopromotor().getValue();
		var plano = parseInt(newValue);

		if (plano) {
			// centrar o mapa
			// sacar o registo no store
			var rec = this.getPlanoComboStore().findRecord('id', plano);
			// sacar as coordenadas
			// console.debug(rec.data);
			// working with WKT
			// var polygon = OpenLayers.Geometry.fromWKT(rec.data.wkt);
			// this.getMapa().map.zoomToExtent(polygon.getBounds(), closest = true);
			// working with GeoJSON
			var parser = new OpenLayers.Format.GeoJSON();
			// “Geometry”, “Feature”, and “FeatureCollection”
			var polygon = parser.read(rec.data.geojson, "Geometry");
			this.getMapa().map.zoomToExtent(polygon.getBounds(), closest = true);
			console.log('Ler os tipo de ocorrência do plano ' + plano + ' do promotor ' + promotor);
			var tostore = this.getTipoOcorrenciaComboStore();
			tostore.load({
				id : plano
			});
			console.log('Ler as ocorrências do plano ' + plano + ' do promotor ' + promotor);
			var ostore = this.getOcorrenciaStore();
			ostore.load({
				id : plano
			});
		}
	},
	onComboPromotor : function(combo, records, eOpts) {
		console.log('Selecionou: ', records[0].data.id);
		if (records[0].data.id) {
			console.log('Ler os planos do promotor ', records[0].data.id);
			// var store = Ext.StoreManager.lookup('Plano');
			var store = this.getPlanoComboStore();
			// var model = this.getPlanoModel();
			// model.load(selection[0].data.id);
			store.load({
				id : records[0].data.id
			});
		}
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
	onButtonLocal : function(button, e, options) {
		console.log('onButtonLocal');
		if (button.pressed) {
			this.getMapa().highlightCtrl.deactivate();
			this.getMapa().selectCtrl.deactivate();
			this.getMapa().insertPoint.activate();
		} else {
			this.getMapa().insertPoint.cancel();
			this.getMapa().highlightCtrl.activate();
			this.getMapa().selectCtrl.activate();
			this.getMapa().insertPoint.deactivate();
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
		var baseOSM = new OpenLayers.Layer.OSM("MapQuest-OSM Tiles", ["http://otile1.mqcdn.com/tiles/1.0.0/map/${z}/${x}/${y}.jpg", "http://otile2.mqcdn.com/tiles/1.0.0/map/${z}/${x}/${y}.jpg", "http://otile3.mqcdn.com/tiles/1.0.0/map/${z}/${x}/${y}.jpg", "http://otile4.mqcdn.com/tiles/1.0.0/map/${z}/${x}/${y}.jpg"]);
		var baseAerial = new OpenLayers.Layer.OSM("MapQuest Open Aerial Tiles", ["http://otile1.mqcdn.com/tiles/1.0.0/sat/${z}/${x}/${y}.jpg", "http://otile2.mqcdn.com/tiles/1.0.0/sat/${z}/${x}/${y}.jpg", "http://otile3.mqcdn.com/tiles/1.0.0/sat/${z}/${x}/${y}.jpg", "http://otile4.mqcdn.com/tiles/1.0.0/sat/${z}/${x}/${y}.jpg"]);
		map.addLayers([baseOSM, baseAerial]);
		var report = new OpenLayers.Layer.Vector("Report");
		map.addLayer(report);
		//<debug>
		// variáveis globais para debug
		mapDebug = map;
		mapPanelDebug = mapPanel;
		//</debug>
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
		var report = map.getLayersByName('Report')[0];

		mapPanel.selectCtrl = new OpenLayers.Control.SelectFeature(report, {
			clickout : true,
			eventListeners : {
				beforefeaturehighlighted : function(event) {
					console.log('beforefeaturehighlighted');
					console.debug(event.feature); (
						event.feature.fid);
				},
				featurehighlighted : function(event) {
					console.log('featurehighlighted');
					this.unselectAll();
				}
			}
		});

		mapPanel.highlightCtrl = new OpenLayers.Control.SelectFeature(report, {
			hover : true,
			highlightOnly : true,
			renderIntent : "temporary"
		});

		mapPanel.insertPoint = new OpenLayers.Control.DrawFeature(report, OpenLayers.Handler.Point, {
			'displayClass' : 'olControlDrawFeaturePoint'
		});

		var toolbar = new OpenLayers.Control.Panel({
			displayClass : 'customEditingToolbar'
		});
		toolbar.addControls([mapPanel.selectCtrl, mapPanel.highlightCtrl, mapPanel.insertPoint]);
		map.addControl(toolbar);

		report.events.on({
			beforefeatureadded : function(event) {
				console.log('report.beforefeatureadded');
				/*
				 // console.log(arguments);
				 // console.debug(event.feature);
				 // só devia preencher estes campos para os novos features...
				 if (!event.feature.attributes["designacao"]) {
				 event.feature.attributes["designacao"] = 'Desenhado na web';
				 }
				 event.feature.attributes["idutilizador"] = DemoExtJs.LoggedInUser.data.id;
				 */
			}
		});
		mapPanel.insertPoint.events.on({
			featureadded : function(event) {
				console.log('mapPanel.insertPoint.events.on featureadded');
				// console.log(arguments);
				var f = event.feature;
				// console.log(f);

				// vou ver se já existia um ponto marcado (mas não gravado)

				me.getFormContribution().getForm().setValues({
					feature : f.id
				});

				// event.feature
				// event.feature.state === "Insert"
				if (me.getLocal().pressed) {
					me.getLocal().toggle(false);
					// -- a ordem é importante...
					me.getMapa().highlightCtrl.activate();
					me.getMapa().selectCtrl.activate();
					me.getMapa().insertPoint.deactivate();
				}
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
