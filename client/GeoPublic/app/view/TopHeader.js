Ext.define('GeoPublic.view.TopHeader', {
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
		width : 48,
		height : 48,
		// alt : 'INSTITUTION'.translate(),
		// title : 'INSTITUTION'.translate(),
		src : 'resources/images/community_blue_48x48.png'.translate() // 'resources/images/logo_cmagueda.png' // 'http://www.sencha.com/img/20110215-feat-html5.png'
	}, {
		xtype : 'label',
		html : 'Have Your Say'.translate() + '<br/>' + 'Câmara Municipal de Águeda'.translate(),
		style : {
			'font-size' : '12px', // The javascript constant.
			'font-weight' : 'bold'
		}
	}, {
		xtype : 'tbfill'
	}, {
		xtype : 'button',
		text : 'New user'.translate(),
		icon : 'resources/assets/plus-circle.png',
		itemId : 'botaoRegisto',
		scale : 'medium'
	}, {
		xtype : 'splitbutton',
		text : 'Start session'.translate(),
		itemId : 'botaoLogin',
		resizable : true,
		scale : 'medium',
		menu : [{
			text : 'Last access'.translate(),
			itemId : 'botaoLastAccess'
		}, /*{
			text : 'Mensagens'.translate()
		}, */ {
			text : 'Profile'.translate(),
			itemId : 'botaoPerfil'
		}, {
			text : 'Logout'.translate(),
			icon : 'resources/assets/logout.png',
			itemId : 'botaoLogout'
		}]
	}]
});
