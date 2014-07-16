Ext.define('DemoExtJs.view.InfPrevia.Hierarquia', {
	extend : 'Ext.window.Window',
	alias : 'widget.hierarquia',
	// autoShow : true,
	height : 200,
	width : 440,
	title : "Classes de espaços",
	modal : true,
	closable : true,
	closeAction : 'hide', // 'destroy', // 'hide',
	initComponent : function() {
		// console.debug(this.initialConfig);
		console.debug(this.root);
		// console.debug(this.down('treepanel'));
		// store.setRootNode(this.root);
		this.callParent(arguments);
	},
	items : [{
		xtype : 'treepanel',
		store : 'InfPrevia.Hierarquia'
	}]
});
