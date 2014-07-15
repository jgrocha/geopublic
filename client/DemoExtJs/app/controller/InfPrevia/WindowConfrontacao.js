Ext.define('DemoExtJs.controller.InfPrevia.WindowConfrontacao', {
	extend : 'Ext.app.Controller',
	// Ext.ComponentQuery.query('windowconfrontacao')
	stores : ['InfPrevia.ConfrontacaoPretensao'], // getInfPreviaConfrontacaoPretensaoStore()
	views : ['InfPrevia.WindowConfrontacao'],
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
				}
			},
			'feedback-map-panel' : {
				'beforerender' : this.onMapPanelBeforeRender,
				'afterrender' : this.onMapPanelAfterRender
			}
		});
	},
	onMapPanelBeforeRender : function(mapPanel, options) {
		var me = this;
		// var bounds = mapPanel.up().up().bounds;
		var bounds = mapPanel.up('windowconfrontacao').bounds;
		var idpretensao = mapPanel.up('windowconfrontacao').pretensao;
		console.log('Vai apresentar a pretensão ' + idpretensao + ' com os limites ' + bounds);

		/*
		 var layers = [];
		 map = mapPanel.map;
		 // OpenLayers object creating

		 var layerQuest = new OpenLayers.Layer.TMS('TMS mapquest', '/mapproxy/tms/', {
		 layername : 'mapquest/pt_tm_06',
		 type : 'png',
		 tileSize : new OpenLayers.Size(256, 256)
		 });

		 layers.push(layerQuest);
		 map.addLayers(layers);
		 */

		/*
		 var resultado_confrontacao = new OpenLayers.Layer.WMS("geomaster:confrontacao", "http://development.localhost.lan/geoserver/geomaster/wms", {
		 LAYERS : 'geomaster:confrontacao',
		 STYLES : '',
		 format : 'image/png',
		 transparent : 'true'
		 // tiled : true,
		 // tilesOrigin : map.maxExtent.left + ',' + map.maxExtent.bottom
		 }, {
		 buffer : 0,
		 displayOutsideMaxExtent : true,
		 isBaseLayer : false,
		 yx : {
		 'EPSG:3763' : false
		 }
		 });
		 map.addLayer(resultado_confrontacao);
		 */

		var wfs_confrontacao = new OpenLayers.Layer.Vector('Confrontação', {
			strategies : [new OpenLayers.Strategy.Fixed()],
			protocol : new OpenLayers.Protocol.WFS({
				url : 'http://development.localhost.lan/geoserver/wfs', //
				featureType : 'confrontacao',
				featureNS : 'http://geomaster.pt',
				srsName : 'EPSG:3763',
				version : '1.1.0',
				reportError : true,
				featurePrefix : 'geomaster',
				schema : 'http://development.localhost.lan/geoserver/wfs/DescribeFeatureType?version=1.1.0&typename=geomaster:confrontacao',
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
		wfs_confrontacao.filter = new OpenLayers.Filter.Comparison({
		type : OpenLayers.Filter.Comparison.EQUAL_TO,
		property : 'idpretensao',
		value : idpretensao
		});
		*/

		/*
		wfs_confrontacao.refresh({
		force : true
		});
		*/

		// console.debug(me.getInfPreviaConfrontacaoPretensaoStore());
		// me.getInfPreviaConfrontacaoPretensaoStore().unbind();
		// me.getInfPreviaConfrontacaoPretensaoStore().removeAll();

		// me.getInfPreviaConfrontacaoPretensaoStore().bind(wfs_confrontacao);

		mapPanel.map.addLayer(wfs_confrontacao);

		/*
		* o setCenter funciona muito bem
		*/
		// mapPanel.map.setCenter(bounds.getCenterLonLat(), 10);
		// ok!

		// map.zoomToExtent(bounds);
		// not ok! Só funciona no fim de ler os tiles...

		// for debug // fica com global, para se usar na consola
		mapConfrontacao = mapPanel.map;

		// mapPanel.map.setCenter(new OpenLayers.LonLat(-26557, 100814), 10);

		/*
		 layerQuest.events.register("loadend", layerQuest, function(e) {
		 console.log('Tiles loaded...');
		 mapPanel.map.zoomToExtent(bounds);
		 });
		 */

		wfs_confrontacao.events.register("loadend", wfs_confrontacao, function(e) {
			console.log('WFS loaded...');
			mapPanel.map.zoomToExtent(bounds);
			me.getInfPreviaConfrontacaoPretensaoStore().bind(wfs_confrontacao);

			var grid = mapPanel.up('windowconfrontacao').down('tabela-confrontacao');
			grid.getSelectionModel().bind(wfs_confrontacao);
			console.log(grid);
		});

		wfs_confrontacao.events.register("loadstart", wfs_confrontacao, function(e) {
			console.log('WFS started...');
		});

	},
	onMapPanelAfterRender : function(mapPanel, options) {
		var me = this;
		var bounds = mapPanel.up().up().bounds;
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