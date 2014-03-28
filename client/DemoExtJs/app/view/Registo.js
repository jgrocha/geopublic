Ext.apply(Ext.form.field.VTypes, {
	password : function(val, field) {
		var formPanel = field.up('form'), pwd = formPanel.down('textfield[name=password]').getValue();
		// console.log(val, field.name, pwd);
		// consoante eu sou a password de cima ou de baixo, tenho que fazera comparação
		// tenho que por este vtype em ambos os campos
		return val == pwd;
	},
	passwordText : 'Passwords do not match'
});

// http://stackoverflow.com/questions/9704913/confirm-password-validator-extjs-4

Ext.define('DemoExtJs.view.Registo', {
	extend : 'Ext.window.Window',
	alias : 'widget.registo',
	// autoShow : true,
	height : 320,
	width : 400,
	layout : {
		type : 'fit'
	},
	title : "Registe-se",
	modal : true,
	closable : false,
	defaultFocus : 'email',
	items : [{
		xtype : 'form',
		frame : false,
		bodyPadding : 15,
		defaults : {
			xtype : 'textfield',
			anchor : '100%',
			labelWidth : 60,
			allowBlank : false,
			// vtype : 'alphanum',
			minLength : 3,
			// msgTarget : 'under',
			msgTarget : 'side',
			minLengthText : 'O mínimo são {0} carateres'
		},
		plugins : {
			ptype : 'datatip'
		},
		items : [{
			xtype : 'label',
			text : 'Registe-se para poder participar ativamente neste site.',
			style : 'display:block; padding:10px 0px 0px 0px' // top right bottom left
		}, {
			xtype : 'label',
			forId : 'email',
			text : 'Use um endereço de email para se identificar.',
			style : 'display:block; padding:20px 0px 20px 0px' // top right bottom left
		}, {
			name : 'email',
			itemId : 'email',
			fieldLabel : 'E-mail',
			vtype : 'email',
			afterLabelTextTpl : '<span style="color:red;font-weight:bold" data-qtip="Required">*</span>',
			maxLength : 100,
			allowBlank : false,
			tooltip : 'Insira o seu email'
		}, {
			name : 'name',
			// itemId : 'user',
			fieldLabel : 'Nome',
			maxLength : 120,
			allowBlank : false,
			tooltip : 'Insira o seu nome'
		}, {
			// http://stackoverflow.com/questions/9704913/confirm-password-validator-extjs-4
			inputType : 'password',
			name : 'password',
			itemId : 'password',
			fieldLabel : 'Senha',
			enableKeyEvents : true,
			maxLength : 15,
			allowBlank : false,
			tooltip : 'Escolha uma senha'
		}, {
			inputType : 'password',
			name : 'password2x',
			vtype : 'password', // para validar
			fieldLabel : 'Repetir senha',
			enableKeyEvents : true,
			maxLength : 15,
			allowBlank : false,
			tooltip : 'Repita a senha escolhida para confirmar'
		} /*, {
		 xtype : 'checkbox',
		 labelWidth : 160,
		 fieldLabel : 'Estou no meu computador',
		 name : 'remember'
		 }*/ ],
		dockedItems : [{
			xtype : 'toolbar',
			dock : 'bottom',
			items : [{
				xtype : 'tbfill'
			}, {
				xtype : 'button',
				itemId : 'cancelar',
				text : 'Cancelar'
			}, {
				xtype : 'button',
				itemId : 'entrar',
				formBind : true,
				text : 'Registar'
			}]
		}]
	}]
});
