Ext.define('GeoPublic.controller.MainMapPanel', {
	extend : 'Ext.app.Controller',
	stores : ['PromotorCombo', 'PlanoCombo', 'TipoOcorrenciaCombo', 'Ocorrencia', 'Participation.EstadoCombo'], // getPromotorComboStore()
	requires : ['GeoExt.Action'],

	zoomLevelEdit : 12,
	firsttime : 0,
	refs : [

	// ver exemplo:
	// http://geoext.github.io/geoext2/examples/action/mappanel_with_actions.html

	// Ext.ComponentQuery.query('app-main-map-panel toolbar')
	{
		selector : 'contribution',
		ref : 'contribution' // gera um getContribution
	}, {
		selector : 'contribution form#detail',
		ref : 'formContribution' // gera um getFormContribution
	}, {
		selector : 'contribution toolbar#contributiontb tbtext',
		ref : 'contributionCoordinates' // gera um getContributionCoordinates()
	}, {
		selector : 'contribution form#photos',
		ref : 'formPhotos' // gera um getFormPhotos
	}, {
		selector : 'contribution fotografiatmp',
		ref : 'fotografiatmp' // gera um getFotografiatmp
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
		selector : 'activity contribution toolbar button#gravar'
	}, {
		ref : 'local',
		selector : 'activity contribution toolbar button#local'
	}, {
		ref : 'todasDiscussoes',
		selector : 'activity #flow'
	}, {
		ref : 'geocoder',
		selector : 'app-main-map-panel toolbar gx_geocodercombo#geocoder'
	}, {
		ref : 'combopromotor', // this.getCombopromotor()
		selector : 'app-main-map-panel combo#promotor'
	}, {
		ref : 'comboplano', // this.getComboplano()
		selector : 'app-main-map-panel combo#plano'
	}, {
		ref : 'activityPanel', // this.getActivityPanel()
		selector : 'mapa-com-projeto activity'
	}],

	init : function() {
		// <debug>
		console.log('O controlador GeoPublic.controller.MainMapPanel init...');
		// </debug>
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
			},
			"app-main-map-panel gx_geocodercombo#geocoder" : {
				select : this.onSelectGeocoder
			},
			'app-main-map-panel combo#plano' : {
				change : this.onChangePlano
			},
			"app-main-map-panel combo#promotor" : {
				change : this.onChangePromotor
			},
			"contribution toolbar button#local" : {
				click : this.onButtonLocal
			}
		}, this);
		this.listen({
			controller : {
				'*' : {
					logoutComSucesso : this.onLogoutComSucesso, // this.fireEvent('showPromotores'); in GeoPublic.controller.MainMapPanel
					loginComSucesso : this.onLoginComSucesso
				}
			}
		});
	},
	onLoginComSucesso : function() {
		// <debug>
		// console.log('onLoginComSucesso', this);
		// </debug>

		this.getTodasDiscussoes().query('discussion commentform').forEach(function(c) {
			c.setVisible(true);
		});

		/*
		 if (this.getMapa().up('tabpanel').getActiveTab().title == "Mapa") {
		 var mapa = this.getMapa().map;
		 var zLevel = mapa.getZoom();
		 if (GeoPublic.LoggedInUser && zLevel >= this.zoomLevelEdit) {
		 this.getInserir().enable();
		 } else {
		 this.getInserir().disable();
		 }
		 } else {
		 // <debug>
		 console.log('Não faço nada onLoginComSucesso no GeoPublic.controller.MainMapPanel');
		 // </debug>
		 }
		 */
	},
	onLogoutComSucesso : function() {
		// <debug>
		console.log('onLogoutComSucesso', this, console.log(arguments));
		// </debug>

		// Posso colapsar o form, que depois já não abre...
		this.getContribution().collapse();
		// Se há paineis em discussão...
		// - devo fazer setVisible(false) aos form dos comentários

		this.getTodasDiscussoes().query('discussion commentform').forEach(function(c) {
			c.setVisible(false);
		});

		/*
		 if (this.getMapa().up('tabpanel').getActiveTab().title == "Mapa") {
		 // this.getInserir().disable();
		 // this.getBarra().disable();

		 } else {
		 // <debug>
		 console.log('Não faço nada onLogoutComSucesso no GeoPublic.controller.MainMapPanel');
		 // </debug>
		 }
		 */
	},
	onOcorrenciaStoreLoad : function(store, records) {
		// <debug>
		console.log('onOcorrenciaStoreLoad');
		// console.debug(store);
		console.debug(records);
		// </debug>

		var me = this;
		var report = me.getMapa().map.getLayersByName('Report')[0];
		report.destroyFeatures();
		var parser = new OpenLayers.Format.GeoJSON();

		for (var i = 0, len = records.length; i < len; i++) {
			// http://docs.openlayers.org/library/feature_styling.html
			// http://www.codechewing.com/library/add-external-graphic-icon-to-geometry-point-openlayers/
			// http://dev.openlayers.org/releases/OpenLayers-2.12/doc/apidocs/files/OpenLayers/Feature/Vector-js.html

			// geometry, attributes, style
			var f = new OpenLayers.Feature.Vector(parser.read(records[i].data.geojson, "Geometry"), {
				color : records[i].data.color,
				icon : records[i].data.icon,
				title : records[i].data.titulo
			});
			// f.style.fillColor = records[i].data.color;
			f.fid = records[i].data.id;
			report.addFeatures([f]);

			// criar os paineis de discussao
			var newDiscussion = new GeoPublic.view.Participation.Discussion({
				id_ocorrencia : records[i].data.id,
				idplano : records[i].data.idplano,
				idpromotor : me.getCombopromotor().getValue(),
				idestado : records[i].data.idestado,
				idtipoocorrencia : records[i].data.idtipoocorrencia,
				titulo : records[i].data.titulo,
				participacao : records[i].data.participacao,
				datacriacao : records[i].data.datacriacao,
				numcomments : records[i].data.numcomentarios,
				fotografia : records[i].data.fotografia,
				days : records[i].data.days,
				hours : records[i].data.hours,
				minutes : records[i].data.minutes,
				seconds : records[i].data.seconds,
				nome : records[i].data.nome,
				feature : f
			});
			// me.getTodasDiscussoes().add(newDiscussion);
			me.getTodasDiscussoes().insert(0, newDiscussion);
			me.getTodasDiscussoes().doLayout();
		}
		// this.getTodasDiscussoes().doLayout();
	},
	onChangePlano : function(field, newValue, oldValue, eOpts) {
		// <debug>
		console.log('   Plano: ' + newValue);
		console.log('Promotor: ' + this.getCombopromotor().getValue());
		// </debug>

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
			// console.log(rec.data.the_geom);

			if (rec.data.the_geom) {
				var polygon = parser.read(rec.data.the_geom, "Geometry");
				this.getMapa().map.zoomToExtent(polygon.getBounds(), closest = true);
			}

			// console.log('Ler os tipo de ocorrência do plano ' + plano + ' do promotor ' + promotor);
			var tostore = this.getTipoOcorrenciaComboStore();
			tostore.load({
				params : {
					idplano : plano
				}
			});

			// console.log('Ler as ocorrências do plano ' + plano + ' do promotor ' + promotor);
			// remover discussões eventualmente existentes de um outro plano
			this.getTodasDiscussoes().removeAll(true);

			// ler o store (e no fim de ler, criar novos paineis)
			var ostore = this.getOcorrenciaStore();
			ostore.load({
				params : {
					idplano : plano
				}
			});

			// combobox to change participation state
			var estore = this.getParticipationEstadoComboStore();
			estore.load({
				params : {
					idplano : plano
				}
			});

			this.getFormPhotos().getForm().setValues({
				idplano : plano,
				idpromotor : promotor
			});
			// load do store
			this.getFotografiatmp().store.load();


			this.fireEvent('changePlan');

			// Abrir a barra do StartPanel e mostrar todos os promotores...
			// controller StartPanel showPromotores(null);
			this.fireEvent('showPlanDetails');
		}
	},
	onChangePromotor : function(combo, newValue, oldValue, eOpts) {
		console.log('Selecionou: ', newValue);
		if (newValue) {
			// console.log('Ler os planos do promotor ', newValue);
			var store = this.getPlanoComboStore();
			store.load({
				id : newValue
			});
		}

		// destroi algum plano que estive a ser visualizado
		var me = this;
		var report = me.getMapa().map.getLayersByName('Report')[0];
		report.destroyFeatures();
		this.getTodasDiscussoes().removeAll(true);

		// Abrir a barra do StartPanel e mostrar todos os promotores...
		// controller StartPanel showPromotores(null);
		this.fireEvent('showPromotores');

	},
	/*
	 onComboPromotor : function(combo, records, eOpts) {
	 // console.log('Selecionou: ', records[0].data.id);
	 if (records[0].data.id) {
	 // console.log('Ler os planos do promotor ', records[0].data.id);
	 // var store = Ext.StoreManager.lookup('Plano');
	 var store = this.getPlanoComboStore();
	 // var model = this.getPlanoModel();
	 // model.load(selection[0].data.id);
	 store.load({
	 id : records[0].data.id
	 });
	 }
	 },
	 */
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
	onMapPanelBeforeRender : function(mapPanel, options) {
		console.log('onMapPanelBeforeRender');

		var me = this;
		var map = mapPanel.map;

		/*

		var userid = -1;
		if (GeoPublic.LoggedInUser) {
		userid = GeoPublic.LoggedInUser.data.id;
		}
		var baseOSM = new OpenLayers.Layer.OSM("MapQuest-OSM Tiles", ["http://otile1.mqcdn.com/tiles/1.0.0/map/${z}/${x}/${y}.jpg", "http://otile2.mqcdn.com/tiles/1.0.0/map/${z}/${x}/${y}.jpg", "http://otile3.mqcdn.com/tiles/1.0.0/map/${z}/${x}/${y}.jpg", "http://otile4.mqcdn.com/tiles/1.0.0/map/${z}/${x}/${y}.jpg"]);
		var baseAerial = new OpenLayers.Layer.OSM("MapQuest Open Aerial Tiles", ["http://otile1.mqcdn.com/tiles/1.0.0/sat/${z}/${x}/${y}.jpg", "http://otile2.mqcdn.com/tiles/1.0.0/sat/${z}/${x}/${y}.jpg", "http://otile3.mqcdn.com/tiles/1.0.0/sat/${z}/${x}/${y}.jpg", "http://otile4.mqcdn.com/tiles/1.0.0/sat/${z}/${x}/${y}.jpg"]);
		map.addLayers([baseOSM, baseAerial]);

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

		map.addLayer(report);

		*/

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

		this.firsttime = 1;

		mapPanel.selectCtrl = new OpenLayers.Control.SelectFeature(report, {
			clickout : true,
			/*
			 eventListeners : {
			 beforefeaturehighlighted : function(event) {
			 console.log('beforefeaturehighlighted');
			 console.debug(event.feature);
			 },
			 featurehighlighted : function(event) {
			 console.log('featurehighlighted');
			 // this.unselectAll();
			 }
			 },
			 */
			onSelect : function(f) {
				console.log('o feature ' + f.fid + ' foi selecionado');
				var p = me.getTodasDiscussoes();
				// console.log(p.items);
				var d = p.items.findBy(function(cmp) {
					// console.log('Comparar: ' + cmp.idocorrencia + ' com ' + event.feature.fid);
					return (cmp.idocorrencia == f.fid);
				});
				// console.log(d);
				d.setUI('discussion-framed');
				console.log(d);
				var pos = d.getOffsetsTo(p)[1];
				p.body.scroll('top', pos, true);
			},
			onUnselect : function(f) {
				console.log('o feature ' + f.fid + ' foi deselecionado');
				var p = me.getTodasDiscussoes();
				// console.log(p.items);
				var d = p.items.findBy(function(cmp) {
					// console.log('Comparar: ' + cmp.idocorrencia + ' com ' + event.feature.fid);
					return (cmp.idocorrencia == f.fid);
				});
				// console.log(d);
				d.setUI('default-framed');
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

		/*
		 report.events.on({
		 beforefeatureadded : function(event) {
		 console.log('report.beforefeatureadded');

		 // console.log(arguments);
		 // console.debug(event.feature);
		 // só devia preencher estes campos para os novos features...
		 // if (!event.feature.attributes["designacao"]) {
		 // event.feature.attributes["designacao"] = 'Desenhado na web';
		 // }
		 // event.feature.attributes["idutilizador"] = GeoPublic.LoggedInUser.data.id;

		 }
		 });
		 */

		mapPanel.insertPoint.events.on({
			featureadded : function(event) {
				console.log('mapPanel.insertPoint.events.on featureadded');
				// console.log(arguments);
				var f = event.feature;
				// console.log(f);

				// vou ver se já existia um ponto marcado (mas não gravado)
				// FALTA!

				me.getFormContribution().getForm().setValues({
					feature : f.id
				});

				// Mostrar as coordenadas no form
				// console.log('Mudar as coordenadas' + f.geometry.toString());
				// console.log(me.getContributionCoordinates());
				// converter coordenadas e formatar...
				// console.log(f);
				var novo = new OpenLayers.LonLat(f.geometry.x, f.geometry.y).transform(f.layer.map.getProjectionObject(), new OpenLayers.Projection("EPSG:4326"));
				// console.log(novo);
				me.getContributionCoordinates().setText(novo.lon.toFixed(5) + ' ' + novo.lat.toFixed(5));

				// check if the Save button can be enabled
				me.fireEvent('featureAdded');
			
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

			if (this.firsttime) {
				this.firsttime = 0;
				// this is only necessary if a plan is selected in the startpanel and the map was never rendered before
				var plano = this.getComboplano().getValue();
				console.log('Faço zoom ao plano ' + plano);
				if (plano) {
					var rec = this.getPlanoComboStore().findRecord('id', plano);
					if (rec) {
						var parser = new OpenLayers.Format.GeoJSON();
						if (rec.data.the_geom) {
							var polygon = parser.read(rec.data.the_geom, "Geometry");
							console.log('Vou fazer zoom ao plano ');
							console.log(polygon.getBounds());
							map.zoomToExtent(polygon.getBounds(), true);
						}
					}
				}
			}
			/*
			 if (GeoPublic.LoggedInUser && zLevel >= this.zoomLevelEdit) {
			 this.getInserir().enable();
			 } else {
			 this.getInserir().disable();
			 }
			 */
		});

		// var guia = Ext.widget('guia');
		// guia.show();

	},
	onMapPanelBeforeActivate : function(mapPanel, options) {
		console.log('onMapPanelBeforeActivate');
		var map = mapPanel.map;
		if (GeoPublic.LoggedInUser) {
			this.getBarra().enable();
		} else {
			this.getBarra().disable();
		}
	}
});
