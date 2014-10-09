Ext.define('DemoExtJs.store.Participation.ChartByState', {
	extend : 'Ext.data.Store',
	requires : ['DemoExtJs.model.Participation.ChartByState'],
	autoLoad : false,
	remoteSort : false, //enable remote filter
	remoteFilter : false, //enable remote sorting
	// pageSize: 5,
	autoSync: false, // if operating on model directly this will make double POSTs!
	model : 'DemoExtJs.model.Participation.ChartByState'
});