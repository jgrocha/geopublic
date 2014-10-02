Ext.define('DemoExtJs.view.StartPlanoEstatisticas', {
	extend : 'Ext.panel.Panel',
	alias : 'widget.startplanoestatisticas',
	title : 'Gráficos',
	minHeight: 290,
	// itemId : 'estatisticas',
	layout : {
		type : 'hbox',
		padding : '5',
		pack : 'left', // 'center',
		align : 'middle'
	},
	defaults : {
		margin : '0 10 0 0'
	},

	initComponent : function() {
		var me = this;
		console.debug(this.initialConfig);

		console.log('Abrir com o plano ' + this.initialConfig.idplano + ' denominado ' + this.initialConfig.designacao);

		// this.itemId = 'StartPlanoDescricao-' + this.initialConfig.id;
		this.items = [{
			xtype : 'startpanelchartbytype',
			layout : 'fit',
			width : 560,
			height : 280
		}, {
			xtype : 'startpanelchartbystate',
			layout : 'fit',
			width : 280,
			height : 280
		}];
		this.callParent(arguments);
	}
});
