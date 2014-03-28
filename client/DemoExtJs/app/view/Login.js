Ext.define('DemoExtJs.view.Login', {
	extend : 'Ext.window.Window',
	alias : 'widget.login',
	// autoShow : true,
	height : 170,
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
			name : 'user',
			// itemId : 'user',
			fieldLabel : 'Utilizador',
			maxLength : 25
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
	}]
});
