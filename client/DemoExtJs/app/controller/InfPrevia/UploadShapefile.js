Ext.define('DemoExtJs.controller.InfPrevia.UploadShapefile', {
	extend : 'Ext.app.Controller',
	requires : ['Ext.form.field.File', 'Ext.form.action.DirectLoad', 'Ext.form.action.DirectSubmit'],
	// Ext.ComponentQuery.query('windowconfrontacao')
	// views : ['InfPrevia.UploadShapefile'],
	refs : [{
		selector : 'uploadshapefile form',
		ref : 'formulario' // gera um getFormulario
	}],
	init : function() {
		var me = this;
		this.control({
			"uploadshapefile button#adiciona" : {
				click : this.onButtonClickEnvia
			},
			"uploadshapefile button#cancela" : {
				click : this.onButtonClickCancela
			}
		}, this);
	},
	onButtonClickEnvia : function(button, e, options) {
		var me = this;
		var form = this.getFormulario().getForm();
		console.log(form);
		if (form.isValid()) {
			form.submit({
				waitMsg : 'A carregar a shapefile ...',

				callback : function(fp, o) {
				},

				success : function(fp, o) {
					Ext.Msg.alert('Success', 'Your shapefile "' + o.result.name + '" has been uploaded.<br> File size:' + o.result.size + ' bytes.');
					// Your shapefile "./public/uploaded_shapefiles/edificosporto.shp" has been uploaded.
					// File size:1365684 bytes.
					me.fireEvent('uploadSuccessful', o.result.name.replace('./public', ''));
					button.up('uploadshapefile').close();
				},
				failure : function(form, action) {
					console.log(arguments);
					Ext.MessageBox.show({
						title : 'Erro',
						msg : 'Erro ao carregar o arquivo',
						icon : Ext.MessageBox.ERROR,
						buttons : Ext.Msg.OK
					});
				}
			});
		} else {
			Ext.MessageBox.show({
				title : 'Erro',
				msg : 'O formulário não está corretamente preenchido.',
				icon : Ext.MessageBox.ERROR,
				buttons : Ext.Msg.OK
			});
		}
	},
	onButtonClickCancela : function(button, e, options) {
		button.up('uploadshapefile').close();
	}
});