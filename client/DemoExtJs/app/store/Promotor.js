Ext.define('DemoExtJs.store.Promotor', {
	extend : 'Ext.data.Store',
	requires : ['DemoExtJs.model.Promotor'],
	autoLoad : true,
	remoteSort : false, //enable remote filter
	remoteFilter : false, //enable remote sorting
	// pageSize: 5,
	autoSync: true, // if operating on model directly this will make double POSTs!
	model : 'DemoExtJs.model.Promotor'
	// storeId: 'Sessao' // If store Id matches it's class name, may be skipped.
}); 