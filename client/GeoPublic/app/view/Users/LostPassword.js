Ext.define('GeoPublic.view.Users.LostPassword', {
	extend : 'Ext.window.Window',
	alias : 'widget.lostpassword',
	// autoShow : true,
	height : 218,
	width : 360,
	layout : {
		type : 'fit'
	},
	title : "Recuperar a senha",
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
		plugins : {
			ptype : 'datatip'
		},
		items : [{
			xtype : 'label',
			text : 'Introduza o endereço de email com que se registou.',
			style : 'display:block; padding:10px 0px 0px 0px' // top right bottom left
		}, {
			xtype : 'label',
			forId : 'email',
			text : 'Irá receber nesse email as instruções necessárias.',
			style : 'display:block; padding:20px 0px 20px 0px' // top right bottom left
		}, {
			name : 'email',
			itemId : 'email',
			fieldLabel : 'E-mail',
			vtype : 'email',
			afterLabelTextTpl : '<span style="color:red;font-weight:bold" data-qtip="Required">*</span>',
			maxLength : 48,
			allowBlank : false,
			tooltip : 'Insira o seu email'
		}],
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
				text : 'Enviar'
			}]
		}]
	}]
});
