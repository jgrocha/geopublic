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
		width : 48,
		height : 48,
		alt : 'Câmara Municipal de Águeda',
		title : 'Câmara Municipal de Águeda',
		src : 'resources/images/1minuto_48x48.png' // 'resources/images/logo_cmagueda.png' // 'http://www.sencha.com/img/20110215-feat-html5.png'
	}, {
		xtype : 'label',
		html : 'Informação Prévia no minuto<br/>Câmara Municipal de Águeda',
		style : {
			'font-size' : '12px', // The javascript constant.
			'font-weight' : 'bold'
		}
	}, /* {
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
	 }, */
	{
		xtype : 'tbfill'
	}, {
		xtype : 'button',
		text : 'Novo utilizador',
		icon : 'resources/assets/plus-circle.png',
		itemId : 'botaoRegisto',
		scale : 'medium'
	}, {
		xtype : 'splitbutton',
		text : 'Iniciar sessão',
		itemId : 'botaoLogin',
		resizable : true,
		scale : 'medium',
		menu : [{
			text : 'Últimos acessos',
			itemId : 'botaoLastAccess'
		}, {
			text : 'Mensagens'
		}, {
			text : 'Dados pessoais',
			itemId : 'botaoPerfil'
		}, {
			text : 'Sair',
			icon : 'resources/assets/logout.png',
			itemId : 'botaoLogout'
		}]
	}]
});
