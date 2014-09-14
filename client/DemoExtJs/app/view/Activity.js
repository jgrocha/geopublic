Ext.define('DemoExtJs.view.Activity', {
	// extend : 'Ext.container.Container',
	extend : 'Ext.panel.Panel',
	xtype : 'activity',
	requires : ['Ext.grid.Panel', 'Ext.grid.column.Number', 'Ext.form.field.Number', 'Ext.toolbar.Paging', 'Ext.form.field.Checkbox', 'Ext.grid.column.Action', 'Ext.grid.plugin.RowEditing'],
	layout : 'border',
	title : 'Participe!',
	// style : 'padding:5px',
	items : [{
		xtype : 'contribution',
		region : 'north',
		height : 360,
		layout: 'fit'
	}, {
		title: 'Contribuições',
		region : 'center',
		html: 'Todas as outras contribuições'
	}]
});
