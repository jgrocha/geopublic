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
	extend : 'Ext.form.Panel',
	xtype : 'profile',
	title : 'Profile',
	requires : ['Ext.form.action.DirectLoad', 'Ext.form.action.DirectSubmit'],
	bodyPadding : 5,
	items : [{
		xtype : 'avatar',
		title : 'Fotografia'
	}, {
		xtype : 'panel',
		title : 'Contactos',
		items : [{
			xtype : 'textfield',
			fieldLabel : 'Email',
			name : 'email'
		}, {
			xtype : 'textfield',
			fieldLabel : 'Telefone',
			name : 'telefone'
		}, {
			xtype : 'textfield',
			fieldLabel : 'Telemóvel',
			name : 'telemovel'
		}]
	}, {
		xtype : 'panel',
		title : 'Localização'
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
});
