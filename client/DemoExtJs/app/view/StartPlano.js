Ext.define('DemoExtJs.view.StartPlano', {
	extend : 'Ext.panel.Panel',
	alias : 'widget.startplano',
	width : 280,
	frame : true,
	ui : 'light',
	layout : {
		type : 'vbox',
		padding : '0 0 10 0', // not working...
		align : 'stretch'
	},
	bodyPadding: 10,
	initComponent : function() {
		var me = this;
		// console.debug(this.initialConfig);
		// console.log('Abrir com o plano ' + this.initialConfig.idplano + ' denominado ' + this.initialConfig.designacao);
		this.idplano = this.initialConfig.idplano;
		// this.itemId = 'StartPlano-' + this.initialConfig.id;
		this.title = this.initialConfig.designacao;
		this.descricao = this.initialConfig.descricao;

		this.items = [/*{
		 xtype : 'image',
		 src : 'resources/images/startpanel/plpa.jpg',
		 shrinkWrap : 0,
		 width : 200,
		 height : 200
		 }, */
		{
			html : this.initialConfig.designacao,
			padding : '0 0 10 0'
		}, {
			html : ' De: ' + Ext.util.Format.date(this.initialConfig.inicio, "d M Y"),
			padding : '0 0 10 0'
		}, {
			html : 'Até: ' + Ext.util.Format.date(this.initialConfig.fim, "d M Y"),
			padding : '0 0 10 0'
		}, {
			html : 'Responsável: ' + this.initialConfig.responsavel,
			padding : '0 0 10 0'
		}, {
			html : 'Contacto: <a href="' + this.initialConfig.email + '">' + this.initialConfig.email + '</a>',
			padding : '0 0 20 0'
		}, {
			xtype : 'button',
			// itemId : 'planplpa',
			text : 'Apresentação do plano'
		}];
		this.callParent(arguments);
	}
});
