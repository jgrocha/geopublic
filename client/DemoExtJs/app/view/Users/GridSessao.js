Ext.define('DemoExtJs.view.Users.GridSessao', {
	extend : 'Ext.container.Container',
	xtype : 'grid-sessao',
	requires : ['Ext.grid.Panel', 'Ext.grid.column.Number', 'Ext.form.field.Number', 'Ext.toolbar.Paging', 'Ext.form.field.Checkbox', 'Ext.grid.column.Action'],
	title : 'Login history',
	layout : 'border',
	style : 'padding:5px',
	items : [{
		xtype : 'gridpanel',
		region : 'center',
		// itemId: 'todoGrid',
		store : 'Sessao',
		dockedItems : [{
			xtype : 'toolbar',
			dock : 'top',
			items : ['->', {
				xtype : 'trigger',
				triggerCls : 'x-form-clear-trigger',
				emptyText : 'Filter',
				onTriggerClick : function(trigger) {
					this.reset();
					this.fireEvent('filter-reset', trigger);
				}
			}, {
				xtype : 'button',
				action : 'filterStore',
				text : 'Filter'
			}]
		}, {
			xtype : 'pagingtoolbar',
			store : 'Sessao', // same store GridPanel is using
			dock : 'bottom',
			displayInfo : true
		}],

		columns : [{
			dataIndex : 'datalogin',
			xtype : 'datecolumn', // fundamental :-)
			text : 'Login date',
			width : 140,
			format : 'Y-m-d H:i:s'
			/* por testar
			 editor : {
			 xtype : 'datefield',
			 format : 'Y-m-d H:i:s',
			 submitFormat : 'c'
			 }
			 */
		}, /* {
		 dataIndex : 'datalogout',
		 xtype : 'datecolumn',
		 text : 'Logout date',
		 format : 'Y-m-d H:i:s',
		 width : 140
		 }, */
		{
			dataIndex : 'ip',
			text : 'IP address',
			width : 120
		}, {
			dataIndex : 'hostname',
			text : 'Host name',
			width : 180
		}, {
			dataIndex : 'browser',
			text : 'Browser',
			flex : 1
		} /*, {
		 dataIndex : 'sisoperativo',
		 text : 'Sistema operativo',
		 width : 120
		 } */]
	}]
});
