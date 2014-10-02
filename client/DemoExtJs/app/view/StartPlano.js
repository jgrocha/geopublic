Ext.define('DemoExtJs.view.StartPlano', {
	extend : 'Ext.panel.Panel',
	alias : 'widget.startplano',

	width : 280,
	frame : true,
	ui : 'light',
	layout : {
		type : 'vbox',
		padding : '10',
		align : 'center'
	},

	initComponent : function() {
		var me = this;
		// console.debug(this.initialConfig);
		// console.log('Abrir com o plano ' + this.initialConfig.idplano + ' denominado ' + this.initialConfig.designacao);
		this.idplano = this.initialConfig.idplano;
		// this.itemId = 'StartPlano-' + this.initialConfig.id;
		this.title = this.initialConfig.designacao;
		this.descricao = this.initialConfig.descricao;
		
		this.items = [{
			xtype : 'image',
			src : 'resources/images/startpanel/plpa.jpg',
			shrinkWrap : 0,
			width : 200,
			height : 200
		}, {
			html : ' De: ' + Ext.util.Format.date(this.initialConfig.inicio, "d M Y") 
		}, {
			html : 'Até: ' + Ext.util.Format.date(this.initialConfig.fim, "d M Y") 
		}, {
			html : 'Responsável: ' + this.initialConfig.responsavel,
		}, {
			html : 'Contacto: <a href="' + this.initialConfig.email + '">' + this.initialConfig.email + '</a>'
		}, {
			xtype : 'button',
			// itemId : 'planplpa',
			text : 'Apresentação do plano'
		}];
		this.callParent(arguments);
	}
});
