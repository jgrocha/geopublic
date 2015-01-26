Ext.define('GeoPublic.view.Participation.FotografiaTmp', {
	extend : 'Ext.form.Panel',
	alias : 'widget.fotografiatmp',
	requires : ['GeoPublic.store.Participation.FotografiaTmp'],
	// id : 'images-view', //importante por causa do CSS // hum... tem que passar a classe, pois vou ter muitas dataviews
	cls : 'images-view',
	// frame : true,
	// autoHeight : true,
	height : 110,
	autoScroll : true,
	// title : 'Simple DataView (0 items selected)',

	// http://honoluluhacker.com/2008/12/15/horizontal-scrollbars-on-extjs-dataview/

	initComponent : function() {
		console.log('A criar componente GeoPublic.view.Participation.FotografiaTmp SEM idocorrencia');
		this.store = Ext.create(GeoPublic.store.Participation.FotografiaTmp);
        // podem existir imagens postas por este utilizador...
        this.store.load();
		this.items = [{
			xtype : 'dataview',
			title : 'Fotografias',
			store : this.store,
			tpl : ['<tpl for=".">', //
			'<div class="thumb-wrap" id="fotografia-{id}">', //
			'<div class="thumb"><img src="{url}"></div>', //
			'</div>', '</tpl>', //
			'<div class="x-clear"></div>' //
			],
			multiSelect : true,
			width : 2000, // depois de ler o store, pode ajustar este width
			height : 95,
			trackOver : true,
			overItemCls : 'x-item-over',
			itemSelector : 'div.thumb-wrap',
			emptyText : 'Acrescente fotografias...'
		}];
		this.callParent(arguments);
	},
    getStore: function () {
        return this.store;
    }
});
