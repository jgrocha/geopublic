Ext.define('DemoExtJs.store.Participation.Fotografia', {
	extend : 'Ext.data.Store',
	requires : ['DemoExtJs.model.Participation.Fotografia'],
	autoLoad : false,
	remoteSort : true, //enable remote filter
	remoteFilter : true, //enable remote sorting
	// pageSize: 5,
	autoSync: true, // if operating on model directly this will make double POSTs!
	model : 'DemoExtJs.model.Participation.Fotografia'
}); 