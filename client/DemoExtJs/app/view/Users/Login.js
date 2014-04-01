Ext.define('DemoExtJs.view.Users.Login', {
	extend : 'Ext.window.Window',
	alias : 'widget.login',
	// autoShow : true,
	height : 380,
	width : 360,
	layout : {
		type : 'fit'
	},
	title : "Identifique-se",
	modal : true,
	closable : false,
	defaultFocus : 'user',
	items : [{
		xtype : 'form',
		frame : false,
		bodyPadding : 15,
		defaults : {
			xtype : 'textfield',
			anchor : '100%',
			labelWidth : 60,
			allowBlank : false,
			vtype : 'alphanum',
			minLength : 3,
			msgTarget : 'under',
			minLengthText : 'O mínimo são {0} carateres'
		},
		items : [{
			name : 'email',
			fieldLabel : 'Email',
			vtype : 'email',
			maxLength : 48
		}, {
			inputType : 'password',
			name : 'password',
			fieldLabel : 'Senha',
			enableKeyEvents : true,
			// id : 'password',
			maxLength : 15
		}, {
			xtype : 'checkbox',
			labelWidth : 160,
			fieldLabel : 'Estou no meu computador',
			name : 'remember'
		}, {
			xtype : 'box',
			// el : 'fb-login-button',
			// https://developers.facebook.com/docs/plugins/login-button/
			html: '<div class="fb-login-button" data-scope="basic_info,email" data-max-rows="1" data-size="medium" data-show-faces="true" data-auto-logout-link="true"></div>',
			// data-show-faces="true" - Aparece "Jorge Gustavo Rocha uses Promoção da Acessibilidade" e a cara
			autoShow : true
		}],
		dockedItems : [{
			xtype : 'toolbar',
			dock : 'bottom',
			items : [{
				xtype : 'button',
				itemId : 'lost',
				text : 'Perdi a senha'
			}, {
				xtype : 'tbfill'
			}, {
				xtype : 'button',
				itemId : 'cancelar',
				text : 'Cancelar'
			}, {
				xtype : 'button',
				itemId : 'entrar',
				formBind : true,
				text : 'Entrar'
			}]
		}]
	}],
	listeners : {
		afterrender : function() {
			console.log('DemoExtJs.view.Users.Login afterrender');
			// really important to have facebook button get rendered
			FB.XFBML.parse();
		}
	}
});
