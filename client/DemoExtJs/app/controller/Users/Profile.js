Ext.define('DemoExtJs.controller.Users.Profile', {
	extend : 'Ext.app.Controller',
	// Ext.ComponentQuery.query('profile checkbox')
	// views : [ 'Users.Profile' ],
	refs : [{
		selector : 'profile checkbox',
		ref : 'sexoCheckbox' // gera um getSexoCheckbox
	}, {
		selector : 'profile form#dados',
		ref : 'formDados' // gera um getFormDados
	}, {
		selector : 'avatar imagecomponent#imagecomponent32',
		ref : 'imageUm' // gera um getImageUm
	}, {
		selector : 'avatar imagecomponent#imagecomponent160',
		ref : 'imageDois' // gera um getImageDois
	}],
	init : function() {
		this.control({
			"avatar button#upload" : {
				click : this.onButtonUpload
			},
			/*
			"profile button#carregar" : {
				click : this.onButtonCarregar
			},
			"profile button#cancelar" : {
				click : this.onButtonCancelar
			},
			*/
			"profile button#gravar" : {
				click : this.onButtonGravar
			},
			"profile button#changeEmail" : {
				click : this.onButtonChangeEmail
			},
			'avatar' : {
				afterrender : function(view) {
					// console.log('Está na hora de carregar o avatar');
					var photo = DemoExtJs.LoggedInUser.data.fotografia;
					// uploaded_images/profiles/32x32/31_5f66cde0f0ae3fdf99c9169f657a1834.png
					this.getImageUm().setSrc(photo);
					this.getImageDois().setSrc(photo.replace("/profiles/32x32/", "/profiles/160x160/"));
				}
			},
			'profile' : {
				afterrender : function(view) {
					// console.log('Está na hora de carregar o perfil');	
					this.getFormDados().getForm().setValues(DemoExtJs.LoggedInUser.data);
				}
			}
		});
	},
	onButtonUpload : function(button, e, options) {
		var me = this;
		console.log("onButtonUpload");
		button.up('form').getForm().submit({
			waitMsg : 'Uploading your photo...',
			callback : function(fp, o) {

			},
			success : function(fp, o) {
				console.log(me.getImageUm());
				// uploaded_images/profiles/32x32/31_5f66cde0f0ae3fdf99c9169f657a1834.png
				me.getImageUm().setSrc(o.result.name32);
				me.getImageDois().setSrc(o.result.name160);

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
	},
	onButtonCarregar : function(button, e, options) {
		console.log("onButtonCarregar");
		button.up('form').getForm().setValues(DemoExtJs.LoggedInUser.data);
		//
		var photo = DemoExtJs.LoggedInUser.data.fotografia;
		// uploaded_images/profiles/32x32/31_5f66cde0f0ae3fdf99c9169f657a1834.png
		this.getImageUm().setSrc(photo);
		this.getImageDois().setSrc(photo.replace("/profiles/32x32/", "/profiles/160x160/"));
	},
	onButtonCancelar : function(button, e, options) {
		console.log("onButtonCancelar");
	},
	onButtonGravar : function(button, e, options) {
		console.log("onButtonGravar");
		// var params = button.up('form').getForm().getValues(false, true, false, false);
		var params = button.up('form').getForm().getValues();
		console.log(params);
		// getValues( [asString], [dirtyOnly], [includeEmptyText], [useDataValues] )
		// cf. http://localhost/extjs/docs/index.html#!/api/Ext.form.Basic-method-getValues
		if (this.getSexoCheckbox().isDirty()) {
			console.log("Mexeu no sexo");
			// params['masculino'] = this.getSexoCheckbox().checked ? "1" : "0";
		}
		ExtRemote.DXLogin.update(params, function(result, event) {
			if (result.success) {
				Ext.Msg.alert('Success', Ext.encode(result));
			} else {
				Ext.Msg.alert('No success', Ext.encode(result));
			}
		});
	},
	onButtonChangeEmail : function(button, e, options) {
		Ext.Msg.alert('Alterar o email', 'Lamentamos, mas esta funcionalidade ainda não está disponível.');
	}
});
