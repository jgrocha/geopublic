Ext.define('DemoExtJs.view.TopHeader', {
	extend : 'Ext.toolbar.Toolbar',
	alias : 'widget.topheader',
	// height : 30,
	/*
	 style: {
	 // background:'#ffffff',
	 backgroundImage: 'url(resources/images/hands_raised_x44.png)',
	 // backgroundSize: '100% 100%',
	 backgroundRepeat: 'no-repeat',
	 backgroundPosition: 'bottom left',
	 },
	 */
	items : [{
		xtype : 'imagecomponent',
		src : 'resources/images/hands_raised_x44.png' // 'http://www.sencha.com/img/20110215-feat-html5.png'
	}, {
		xtype : 'label',
		html : 'Participação Cívica'
	}, {
		xtype : 'splitbutton',
		text : 'Promotor',
		itemId : 'botaoPromotor',
		resizable : true,
		scale : 'medium',
		menu : [{
			text : 'Câmara Mnunicipal de Águeda',
			icon : 'resources/images/logo_cmagueda.png',
			itemId : 'botaoCMA'
		}, {
			text : 'Associação U Mosquito',
			icon : 'resources/images/umosquito_26x24.png',
			itemId : 'botaoUMosquito'
		}]
	}, {
		// É preenchido de acordo com o splitbutton anterior...
		xtype : 'splitbutton',
		text : 'Plano',
		itemId : 'botaoPlano',
		resizable : true,
		scale : 'medium',
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
	}, {
		xtype : 'tbfill'
	}, {
		xtype : 'button',
		text : 'New user',
		icon : 'resources/assets/plus-circle.png',
		itemId : 'botaoRegisto',
		scale : 'medium'
	}, {
		xtype : 'splitbutton',
		text : 'Log in',
		itemId : 'botaoLogin',
		resizable : true,
		scale : 'medium',
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
