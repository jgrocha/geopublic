Ext.define('GeoPublic.view.Users.Login', {
	extend : 'Ext.window.Window',
	alias : 'widget.login',
	// autoShow : true,
	// height : 420,
	width : 432,
	layout : {
		type : 'fit'
	},
	title : "Authentication".translate(),
	modal : true,
	closable : false,
	items : [{
		xtype : 'form',
		frame : false,
		defaultFocus : 'email',
		bodyPadding : 15,
		defaults : {
			xtype : 'textfield',
			// anchor : '100%',
			labelWidth : 60,
			allowBlank : false,
			vtype : 'alphanum',
			minLength : 3,
			msgTarget : 'under',
			minLengthText : 'The minimum are {0} characters'.translate()
		},
		items : [{
			xtype : 'fieldset',
			title : 'Use a social network'.translate(),
			items : [{
				xtype : 'label',
				text : 'Your social network is a suitable authentication form to use this platform without an additional password'.translate(),
				style : 'display:block; padding:6px 0px 6px 0px' // top right bottom left
			}, {
				xtype : 'fieldset',
				layout : 'hbox',
				border : 0,
				items : [{
					xtype : 'button',
					text : 'Facebook',
					itemId : 'facebook',
					icon : 'resources/images/facebook/icon_facebook_24.png',
					margin : "0 10 0 0",
					scale : 'medium',
					style : 'background-size: cover;'
				}, {
					xtype : 'button',
					text : 'Google',
					itemId : 'google',
					icon : 'resources/images/google/google24.png',
					margin : "0 10 0 0", // Same as CSS ordering (top, right, bottom, left)
					scale : 'medium', // small 16x16, medium 24x24, large 32x32
					style : 'background-size: cover;',
					disabled : false
				}, {
					xtype : 'button',
					text : 'Microsoft',
					itemId : 'windows',
					icon : 'resources/images/windows/windows24.png',
					scale : 'medium',
					style : 'background-size: cover;',
					disabled : false
				}]
			}, {
				xtype : 'label',
				html : '<b>Nothing will be published on your social network</b>'.translate(),
				style : 'display:block; padding:0px 0px 6px 0px' // top right bottom left
			}]
		}, {
			margin : "20 0 0 0",
			xtype : 'fieldset',
			title : 'Use your registered email and password'.translate(),
			items : [/* {
			 xtype : 'label',
			 text : 'Endereço de email com que se registou.',
			 style : 'display:block; padding:6px 6px 0px 0px' // top right bottom left
			 }, */
			{
				xtype : 'textfield',
				name : 'email',
				fieldLabel : 'Email'.translate(),
				vtype : 'email',
				maxLength : 48,
				allowBlank : false,
				msgTarget : 'side'
			}, {
				xtype : 'textfield',
				inputType : 'password',
				name : 'password',
				fieldLabel : 'Password'.translate(),
				enableKeyEvents : true,
				// id : 'password',
				maxLength : 15,
				allowBlank : false,
				msgTarget : 'side'
			}, {
				xtype : 'checkbox',
				labelWidth : 160,
				fieldLabel : 'I am on my computer'.translate(),
				name : 'remember'
			}, {
				xtype : 'label',
				html : 'If you are on your computer, you can login automatically for a week.<br/>'.translate(),
				style : 'display:block; padding:6px 0px 0px 0px' // top right bottom left
			}, {
				xtype : 'label',
				html : "<i>Don't use this option on a public computer.</i>".translate(),
				style : 'display:block; padding:6px 0px 0px 0px' // top right bottom left
			}]

		}],
		dockedItems : [{
			xtype : 'toolbar',
			dock : 'bottom',
			items : [{
				xtype : 'button',
				itemId : 'lost',
				text : 'Lost password'.translate()
			}, {
				xtype : 'tbfill'
			}, {
				xtype : 'button',
				itemId : 'cancelar',
				text : 'Cancel'.translate()
			}, {
				xtype : 'button',
				itemId : 'entrar',
				formBind : true,
				text : 'Login'.translate()
			}]
		}]
	}] /*,
	 listeners : {
	 afterrender : function() {
	 console.log('GeoPublic.view.Users.Login afterrender');
	 // really important to have facebook button get rendered
	 FB.XFBML.parse();
	 }
	 } */
});
