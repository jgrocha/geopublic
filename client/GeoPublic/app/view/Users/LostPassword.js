Ext.define('GeoPublic.view.Users.LostPassword', {
	extend : 'Ext.window.Window',
	alias : 'widget.lostpassword',
	// autoShow : true,
	height : 246,
	width : 378,
	layout : {
		type : 'fit'
	},
	title : "Lost password".translate(),
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
			minLengthText : 'The minimum are {0} characters'.translate()
		},
		plugins : {
			ptype : 'datatip'
		},
		items : [{
			xtype : 'label',
			text : 'Email address'.translate(),
			style : 'display:block; padding:10px 0px 0px 0px' // top right bottom left
		}, {
			xtype : 'label',
			forId : 'email',
			text : 'You will receive further instructions on the email'.translate(),
			style : 'display:block; padding:20px 0px 20px 0px' // top right bottom left
		}, {
			name : 'email',
			itemId : 'email',
			fieldLabel : 'E-mail',
			vtype : 'email',
			afterLabelTextTpl : '<span style="color:red;font-weight:bold" data-qtip="Required">*</span>',
			maxLength : 48,
			allowBlank : false,
			tooltip : 'Email address'.translate()
		}],
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
				text : 'Send'.translate()
			}]
		}]
	}]
});
