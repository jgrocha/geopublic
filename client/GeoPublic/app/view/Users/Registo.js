Ext.define('GeoPublic.view.Users.Registo', {
	extend : 'Ext.window.Window',
	alias : 'widget.registo',
	// autoShow : true,
	height : 320,
	width : 460,
	layout : {
		type : 'fit'
	},
	title : 'New user'.translate(),
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
			labelWidth : 138,
			allowBlank : false,
			// vtype : 'alphanum',
			minLength : 3,
			// msgTarget : 'under',
			msgTarget : 'side'
			//minLengthText : 'O mínimo são {0} carateres'
		},
		plugins : {
			ptype : 'datatip'
		},
		items : [{
			xtype : 'label',
			text : 'Register to participate in the discussions.'.translate(),
			style : 'display:block; padding:10px 0px 0px 0px' // top right bottom left
		}, {
			xtype : 'label',
			forId : 'email',
			text : 'Use a valid email address to identify yourself.'.translate(),
			style : 'display:block; padding:20px 0px 20px 0px' // top right bottom left
		}, {
			name : 'email',
			itemId : 'email',
			fieldLabel : 'Email'.translate(),
			vtype : 'email',
			afterLabelTextTpl : '<span style="color:red;font-weight:bold" data-qtip="Required">*</span>',
			maxLength : 48,
			allowBlank : false
			//tooltip : 'Insira o seu email'
		}, {
			name : 'name',
			// itemId : 'user',
			fieldLabel : 'Name'.translate(),
			maxLength : 120,
			allowBlank : false
			//tooltip : 'Insira o seu nome'
		}, {
			// http://stackoverflow.com/questions/9704913/confirm-password-validator-extjs-4
			inputType : 'password',
			name : 'password',
			itemId : 'password',
			fieldLabel : 'Password'.translate(),
			enableKeyEvents : true,
			maxLength : 15,
			allowBlank : false
			//tooltip : 'Escolha uma senha'
		}, {
			inputType : 'password',
			name : 'password2x',
			vtype : 'password', // para validar
			fieldLabel : 'Repeat password'.translate(),
			enableKeyEvents : true,
			maxLength : 15,
			allowBlank : false
			//tooltip : 'Repita a senha escolhida para confirmar'
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
				text : 'Cancel'.translate()
			}, {
				xtype : 'button',
				itemId : 'entrar',
				formBind : true,
				text : 'Register'.translate()
			}]
		}]
	}]
});
