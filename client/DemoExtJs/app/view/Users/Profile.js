Ext.define('DemoExtJs.view.Avatar', {
	extend : 'Ext.form.Panel',
	xtype : 'avatar',
	requires : ['Ext.form.field.File', 'Ext.form.action.DirectLoad', 'Ext.form.action.DirectSubmit'],
	title : 'Avatar',
	bodyPadding : 5,

	api : {
		submit : 'ExtRemote.DXFormTest.filesubmit'
	},

	paramOrder : ['uid'],

	/*
	 * The Profile Image dimensions are 160px by 160px!
	 * The profile image that appears next to your name on comments and posts is the same image but is automatically scaled down to 32px by 32px!
	 */
	items : [{
		xtype : 'imagecomponent',
		src : 'resources/images/Man-Silhouette-Clip-Art-160.jpg',
		height : 160
	}, {
		xtype : 'imagecomponent',
		src : 'resources/images/Man-Silhouette-Clip-Art-32.jpg',
		height : 32
	}, {
		xtype : 'filefield',
		name : 'photo',
		fieldLabel : 'Photo',
		labelWidth : 50,
		msgTarget : 'side',
		allowBlank : true,
		anchor : '40%',
		buttonText : 'Select Photo...'
	}],
	bbar : [{
		text : 'Upload..',
		handler : function(btn) {

			btn.up('form').getForm().submit({
				waitMsg : 'Uploading your photo...',

				callback : function(fp, o) {

				},

				success : function(fp, o) {
					Ext.Msg.alert('Success', 'Your photo "' + o.result.name + '" has been uploaded.<br> File size:' + o.result.size + ' bytes.');
				},

				failure : function(form, action) {
					console.log(arguments);
					Ext.MessageBox.show({
						title : 'EXCEPTION',
						msg : 'Error uploading file',
						icon : Ext.MessageBox.ERROR,
						buttons : Ext.Msg.OK
					});
				}
			});
		}
	}]
});

Ext.define('DemoExtJs.view.Users.Profile', {
	extend : 'Ext.panel.Panel',
	// com vários forms dentro
	xtype : 'profile',
	title : 'Profile',
	requires : ['Ext.form.action.DirectLoad', 'Ext.form.action.DirectSubmit'],
	bodyPadding : 5,
	autoScroll : true,
	items : [{
		xtype : 'avatar',
		title : 'Fotografia'
	}, {
		xtype : 'form',
		trackResetOnLoad : true, // saber que fields estão dirty
		title : 'Dados',
		items : [{
			xtype : 'fieldset',
			title : 'Identificação',
			frame : false,
			items : [{
				xtype : 'textfield',
				fieldLabel : 'Nome',
				name : 'nome'
			}, {
				xtype : 'textfield',
				fieldLabel : 'Nº de Identificação Fiscal',
				name : 'nif'
			}, {
				xtype : 'textfield',
				fieldLabel : 'Nº de Identificação Civil (BI ou CC)',
				name : 'nic'
			}, {
				xtype : 'checkbox',
				fieldLabel : 'Masculino?',
				name : 'masculino',
				inputValue : '1',
				uncheckedValue : '0'
			}]
		}, {
			xtype : 'fieldset',
			title : 'Endereço de email',
			layout : 'hbox',
			items : [{
				xtype : 'textfield',
				fieldLabel : 'Email',
				name : 'email',
				readOnly : true,
				disabled : true,
				maxLength : 48
			}, {
				xtype : 'button',
				itemId : 'changeEmail',
				text : 'Alterar o email'
			}]
		}, {
			xtype : 'fieldset',
			title : 'Telefones',
			frame : false,
			items : [{
				xtype : 'textfield',
				fieldLabel : 'Telefone',
				name : 'telefone'
			}, {
				xtype : 'textfield',
				fieldLabel : 'Telemóvel',
				name : 'telemovel'
			}]
		}, {
			xtype : 'fieldset',
			title : 'Endereço postal',
			frame : false,
			items : [{
				xtype : 'textfield',
				fieldLabel : 'Morada',
				name : 'morada'
			}, {
				xtype : 'textfield',
				fieldLabel : 'Localidade',
				name : 'localidade'
			}, {
				xtype : 'panel',
				layout : 'hbox',
				items : [{
					xtype : 'textfield',
					fieldLabel : 'Código',
					name : 'codpostal',
					maxLength : 8, // 4715-281
					minLength : 4,
					minLengthText : 'O código postal tem que ter 4 digitos.'
				}, {
					xtype : 'textfield',
					name : 'despostal'
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
				itemId : 'carregar',
				text : 'Carregar'
			}, {
				xtype : 'button',
				itemId : 'cancelar',
				text : 'Cancelar'
			}, {
				xtype : 'button',
				itemId : 'gravar',
				formBind : true,
				text : 'Gravar'
			}, {
				xtype : 'tbfill'
			}]
		}]
	}, {
		xtype : 'panel',
		title : 'Localização'
	}]

});
