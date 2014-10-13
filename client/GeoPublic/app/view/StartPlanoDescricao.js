Ext.define('GeoPublic.view.StartPlanoDescricao', {
	extend : 'Ext.panel.Panel',
	alias : 'widget.startplanodescricao',
	minHeight : 290,

	initComponent : function() {
		var me = this;
		console.debug(this.initialConfig);

		console.log('Abrir com o plano ' + this.initialConfig.idplano + ' denominado ' + this.initialConfig.designacao);
		this.title = this.initialConfig.designacao;
		// this.itemId = 'StartPlanoDescricao-' + this.initialConfig.id;
		this.items = [{
			html : this.initialConfig.descricao
		}];
		this.callParent(arguments);
	}
});
