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

Ext.define('DemoExtJs.view.Viewport', {
	extend : 'Ext.container.Viewport',
	requires : ['Ext.tab.Panel', 'Ext.layout.container.Border', 'Ext.layout.container.Column'],

	layout : 'border',
	items : [{
		title : 'Node.js + ExtDirect + ExtJS 4',
		region : 'north',
		xtype : 'topheader'
	}, {
		region : 'center',
		xtype : 'tabpanel',
		items : [{
			xtype : 'bem-vindo-panel'
		}, {
			xtype : 'app-main-map-panel'
		}, {
			xtype : 'grid-promotor'
		} /*, {
			xtype : 'grid-actions'
		}, {
			xtype : 'method-call'
		}, {
			xtype : 'form-actions'
		}, {
			xtype : 'form-upload'
		}, {
			xtype : 'tree-actions'
		}, {
			xtype : 'demo-cookies'
		} */ ]
	}]
});
