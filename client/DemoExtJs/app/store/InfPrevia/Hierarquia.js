Ext.define('DemoExtJs.store.InfPrevia.Hierarquia', {
	extend : 'Ext.data.TreeStore',
	autoLoad : false,
	model : 'DemoExtJs.model.InfPrevia.Hierarquia',
	proxy : {
		type : 'memory'
	},
	folderSort : true
});
