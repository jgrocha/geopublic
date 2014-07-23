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
		html : 'Informação Prévia'
	}, {
		xtype : 'combo',
		itemId : 'promotor',
		width : 240,
		editable : false,
		valueField : 'id',
		displayField : 'designacao',
		emptyText : 'Escolha um promotor...',
		forceSelection : true,
		triggerAction : 'all',
		store : 'PromotorCombo',
		queryMode : 'local'
	}, {
		xtype : 'combo',
		itemId : 'plano',
		width : 240,
		editable : false,
		valueField : 'id',
		displayField : 'designacao',
		emptyText : 'Escolha o plano...',
		forceSelection : true,
		triggerAction : 'all',
		store : 'PlanoCombo',
		queryMode : 'local'
		/*
		border : 5,
		style : {
			borderColor : 'red',
			borderStyle : 'solid'
		}
		*/
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
