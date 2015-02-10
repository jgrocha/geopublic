Ext.define('GeoPublic.controller.Participation.Fotografia', {
	extend : 'Ext.app.Controller',
	requires : ['GeoPublic.view.Participation.Fotografia'],
	// Ext.ComponentQuery.query('discussion fotografia')
	refs : [{
		selector : 'discussion fotografia',
		ref : 'panelFotografia' // gera um getPanelFotografia
	}],
	init : function() {
		this.control({
			"discussion fotografia dataview" : {
				// itemclick : this.onFotografiaItemClick
			},
			'fotografia': {
				'beforerender': this.onFotografiaBeforeRender,
				'afterrender': this.onFotografiaAfterRender,
				'beforeactivate': this.onFotografiaBeforeActivate
			}
		});
		/*
		 this.getPanelFotografia().getStore().addListener("load", function(store, records) {
		 console.log('store fotografias loaded!');
		 // console.log(arguments);
		 }, this);
		 */
	},
	onFotografiaBeforeRender: function (panel, options) {
        //<debug>
		console.log('onFotografiaBeforeRender');
        //</debug>
	},
	onFotografiaAfterRender: function (panel, options) {
        //<debug>
		console.log('onFotografiaAfterRender');
        //</debug>
	},
	onFotografiaBeforeActivate: function (panel, options) {
        //<debug>
		console.log('onFotografiaBeforeActivate');
        //</debug>
	},
	onFotografiaItemClick : function(dview, record, item, index, e, eOpts) {
		// console.log(arguments);
		// record.data.url, record.data.largura, record.data.altura
		// var res = str.replace("Microsoft", "W3Schools");
		// http://localhost:3000/participation_data/2/2/80x80/500950f0f512dc9a8dca7888bd9a9a17.jpg
		// http://localhost:3000/participation_data/2/2/500950f0f512dc9a8dca7888bd9a9a17.jpg
		var imagem = record.data.url.replace("/80x80/", "/");
		var win = window.open(imagem, '_blank');
		win.focus();
	},
	onLaunch : function() {
		var me = this;
		console.log('...O controlador GeoPublic.controller.Participation.Fotografia arrancou.');
	}
});
