Ext.define('DemoExtJs.view.TopHeader', {
	extend : 'Ext.toolbar.Toolbar',
	alias : 'widget.topheader',
	// height : 30,
	items : [{
		xtype : 'label',
		html : 'Test application'
	}, {
		xtype : 'tbfill'
	}, {
		xtype : 'button',
		text : 'New user',
		icon : 'resources/assets/plus-circle.png',
		itemId : 'botaoRegisto'
	}, {
		xtype : 'splitbutton',
		text : 'Log in',
		itemId : 'botaoLogin',
		resizable : true,
		menu : [{
			text : 'Last access',
			itemId : 'botaoLastAccess'
		}, {
			text : 'Messages'
		}, {
			text : 'Profile',
			itemId : 'botaoPerfil'
		}, {
			text : 'Log out',
			icon : 'resources/assets/logout.png',
			itemId : 'botaoLogout'
		}]
	}]
});
