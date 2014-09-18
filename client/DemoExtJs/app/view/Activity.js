Ext.define('DemoExtJs.view.Activity', {
	extend : 'Ext.container.Container',
	// extend : 'Ext.panel.Panel',
	xtype : 'activity',
	// requires : ['Ext.grid.Panel', 'Ext.grid.column.Number', 'Ext.form.field.Number', 'Ext.toolbar.Paging', 'Ext.form.field.Checkbox', 'Ext.grid.column.Action', 'Ext.grid.plugin.RowEditing'],
	layout : 'border',
	title : 'Participe!',
	items : [{
		xtype : 'contribution',
		region : 'north',
		// height : 360,
		collapsible : true,
		layout : 'fit'
	}, {
		defaultType : 'container',
		layout : 'fit',
		region : 'center',
		autoScroll : true,
		// http://jsfiddle.net/H4vp7/84/
		items : [{
			layout : 'anchor',
			minWidth : 200,
			minHeight : 200,
			defaultType : 'container',
			items : [{
				xtype : 'discussion'
			}, {
				xtype : 'discussion'
			}, {
				xtype : 'discussion'
			}, {
				xtype : 'discussion'
			}, {
				xtype : 'discussion'
			}, {
				xtype : 'discussion'
			}, {
				xtype : 'discussion'
			}]
		}]

	}, {
		region : 'south',
		defaultType : 'container',
		padding : '10 0 10 0',
		layout : {
			type : 'hbox',
			align : 'middle',
			pack : 'center'
		},
		items : [{
			html : 'Blaaah'
		}]
	}]
});
