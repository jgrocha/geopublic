Ext.define('DemoExtJs.view.Promotor', {
	extend : 'Ext.container.Container',
	xtype : 'grid-promotor',
	requires : ['Ext.grid.Panel', 'Ext.grid.column.Number', 'Ext.form.field.Number', 'Ext.toolbar.Paging', 'Ext.form.field.Checkbox', 'Ext.grid.column.Action', 'Ext.grid.plugin.RowEditing'],
	layout : 'border',
	title : 'Entidades',
	style : 'padding:5px',
	items : [{
		xtype : 'gridpanel',
		region : 'center',
		store : 'Promotor',
		columns : [{
			dataIndex : 'id',
			header : 'Id',
			width : 40
		}, {
			dataIndex : 'designacao',
			header : 'Entidade promotora',
			width : 280,
			editor : {
				xtype : 'textfield',
				allowBlank : false
			}
		}, {
			dataIndex : 'email',
			header : 'Email',
			flex : 1,
			editor : {
				xtype : 'textfield',
				allowBlank : false
			}
		}, {
			dataIndex : 'site',
			header : 'Site',
			flex : 1,
			editor : {
				xtype : 'textfield',
				allowBlank : true
			}
		}, {
			dataIndex : 'dataregisto',
			xtype : 'datecolumn', // fundamental :-)
			header : 'Data de registo',
			width : 140,
			format : 'Y-m-d H:i:s',
			editor : {
				xtype : 'datefield',
				format : 'Y-m-d H:i:s',
				submitFormat : 'c'
			}
		}],
		tbar : [{
			itemId : 'add',
			text : 'Adiciona',
			icon : 'resources/images/icons/fam/add.png',
		}, {
			itemId : 'remove',
			text : 'Apaga',
			icon : 'resources/images/icons/fam/delete.gif',
			disabled : true
		}],
		selType : 'rowmodel',
		// http://stackoverflow.com/questions/7750529/extjs-4-row-editor-grid-how-to-change-update-button-text
		plugins : [Ext.create('Ext.grid.plugin.RowEditing', {
			saveBtnText : 'Alterar',
			cancelBtnText : 'Descartar'
			// clicksToEdit: 1, //this changes from the default double-click activation to single click activation
			// errorSummary: false //disables display of validation messages if the row is invalid
		})]
	}]
});
