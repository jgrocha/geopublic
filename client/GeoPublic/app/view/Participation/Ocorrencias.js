Ext.define('GeoPublic.view.Participation.Ocorrencias', {
	extend : 'Ext.grid.Panel',
	alias : 'widget.ocorrencias',
	requires : ['Ext.grid.Panel', 'Ext.grid.column.Number', 'Ext.form.field.Number', 'Ext.toolbar.Paging', 'Ext.form.field.Checkbox', 'Ext.grid.column.Action', 'Ext.grid.plugin.RowEditing'],
	store : 'Ocorrencia',
	columns : [{
		dataIndex : 'id',
		width : 40
	}, {
		dataIndex : 'titulo',
		header : 'Assunto',
		width : 100,
		editor : {
			xtype : 'textfield',
			allowBlank : false
		}
	}, {
		dataIndex : 'participacao',
		header : 'Comentário',
		flex : 1,
		editor : {
			xtype : 'textfield',
			allowBlank : false
		}
	}],
	tbar : [{
		itemId : 'add',
		text : 'Adiciona',
		icon : 'resources/images/icons/fam/add.png'
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
});
