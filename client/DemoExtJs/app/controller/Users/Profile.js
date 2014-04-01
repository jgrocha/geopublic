Ext.define('DemoExtJs.controller.Users.Profile', {
	extend : 'Ext.app.Controller',
	// Ext.ComponentQuery.query('profile checkbox')
	refs : [{
		selector : 'profile checkbox',
		ref : 'sexoCheckbox' // gera um getSexoCheckbox
	}],
	init : function() {
		this.control({
			"profile button#carregar" : {
				click : this.onButtonCarregar
			},
			"profile button#cancelar" : {
				click : this.onButtonCancelar
			},
			"profile button#gravar" : {
				click : this.onButtonGravar
			},
			"profile button#changeEmail" : {
				click : this.onButtonChangeEmail
			}
		});
	},
	onButtonCarregar : function(button, e, options) {
		console.log("onButtonCarregar");
		button.up('form').getForm().setValues(DemoExtJs.LoggedInUser.data);
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
		Ext.Msg.alert('Alterar o email', 'Lamentamos, mas essa funcionalidade ainda não está disponível.');
	}
});
