Ext.define('DemoExtJs.view.InfPrevia.UploadShapefile', {
	extend : 'Ext.window.Window',
	requires : ['Ext.form.FieldSet'],
	alias : 'widget.uploadshapefile',
	height : 160,
	width : 500,
	layout : {
		type : 'fit'
	},

	title : 'Carregar pretensão a partir de uma shapefile',
	items : [{
		xtype : 'form',
		api : {
			submit : 'ExtRemote.DXFormTest.filesubmitshapefile'
		},
		bodyPadding : 5,
		layout : {
			type : 'hbox', // #1
			align : 'stretch'
		},
		items : [{
			xtype : 'fieldset',
			flex : 2,
			title : 'Indique APENAS o ficheiro *.shp',
			defaults : {
				anchor : '100%',
				allowBlank : false,
				labelWidth : 60
			},
			items : [{
				padding: '20 0 0 0',
				xtype : 'filefield',
				emptyText : '*.shp',
				fieldLabel : 'Shapefile',
				name : 'shapefile',
				buttonText : 'Escolha o ficheiro...'
			}]
		}]
	}],
	dockedItems : [{
		xtype : 'toolbar',
		flex : 1,
		dock : 'bottom',
		layout : {
			pack : 'end',
			type : 'hbox'
		},
		items : [{
			xtype : 'button',
			text : 'Cancelar',
			itemId : 'cancela'
		}, {
			xtype : 'button',
			text : 'Enviar',
			itemId : 'adiciona'
		}]
	}]
});
