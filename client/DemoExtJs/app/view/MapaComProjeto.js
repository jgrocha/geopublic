Ext.define('DemoExtJs.view.MapaComProjeto', {
	extend : 'Ext.container.Container',
	alias : 'widget.mapa-com-projeto',
	// requires : ['Ext.grid.Panel', 'Ext.grid.column.Number', 'Ext.form.field.Number', 'Ext.toolbar.Paging', 'Ext.form.field.Checkbox', 'Ext.grid.column.Action', 'Ext.grid.plugin.RowEditing'],
	layout : 'border',
	title : 'Mapa e Dados',
	// style : 'padding:5px',
	items : [{
		xtype : 'app-main-map-panel',
		region : 'center',
		collapsible : false
	}, {
		xtype : 'activity',
		region : 'east',
		collapsible : false,
		split : true,
		width : 400
	}]
});
