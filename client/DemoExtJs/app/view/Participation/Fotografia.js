Ext.define('DemoExtJs.view.Participation.Fotografia', {
	extend : 'Ext.form.Panel',
	alias : 'widget.fotografia',
	requires : ['DemoExtJs.store.Participation.Fotografia'],
	// id : 'images-view', //importante por causa do CSS // hum... tem que passar a classe, pois vou ter muitas dataviews
	cls : 'images-view',
	// frame : true,
	autoHeight : true,
	height : 110,
	autoScroll : true,
	// title : 'Simple DataView (0 items selected)',

	// http://honoluluhacker.com/2008/12/15/horizontal-scrollbars-on-extjs-dataview/

	initComponent : function() {
		this.store = Ext.create(DemoExtJs.store.Participation.Fotografia);
		if (this.initialConfig.config) {
			this.idocorrencia = this.initialConfig.config.idocorrencia;
			this.idplano = this.initialConfig.config.idplano;
			this.idpromotor = this.initialConfig.config.idpromotor;
			console.log('A criar componente DemoExtJs.view.Participation.Fotografia para o idocorrencia = ' + this.idocorrencia);
			this.store.load({
				params : {
					idocorrencia : this.idocorrencia
				},
				scope : this
			});
			// { idocorrencia: 1, page: 1, start: 0, limit: 25 }
		} else {
			console.log('A criar componente DemoExtJs.view.Participation.Fotografia SEM idocorrencia');
			// neste caso, usa-se um store que vá buscar os dados a fotografiatmp
		}

		// com filtros
		// this.store.filter("idocorrencia", this.idocorrencia);
		/*
		 { page: 1,
		 start: 0,
		 limit: 25,
		 filter: [ { property: 'idocorrencia', value: 9 } ] }
		 */

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
			emptyText : 'No images to display',
			/*
			 plugins : [Ext.create('Ext.ux.DataView.DragSelector', {}), Ext.create('Ext.ux.DataView.LabelEditor', {
			 dataIndex : 'name'
			 })],
			 */

			/*
			 prepareData : function(data) {
			 Ext.apply(data, {
			 shortName : Ext.util.Format.ellipsis(data.name, 15),
			 sizeString : Ext.util.Format.fileSize(data.size),
			 dateString : Ext.util.Format.date(data.lastmod, "m/d/Y g:i a")
			 });
			 return data;
			 },
			 */

			listeners : {
				selectionchange : function(dv, nodes) {
					var l = nodes.length, s = l !== 1 ? 's' : '';
					// this.up('panel').setTitle('Simple DataView (' + l + ' item' + s + ' selected)');
				}
			}
		}];

		this.callParent(arguments);
	}
});
