Ext.define('DemoExtJs.store.PromotorCombo', {
	extend : 'Ext.data.Store',
	requires : ['DemoExtJs.model.Promotor'],
	autoLoad : true, // só pode ler este store depois de ter um utilizador autenticado
	remoteSort : false, //enable remote filter
	remoteFilter : false, //enable remote sorting
	// pageSize: 5,
	autoSync: false, // if operating on model directly this will make double POSTs!
	model : 'DemoExtJs.model.Promotor'
	// storeId: 'Sessao' // If store Id matches it's class name, may be skipped.
}); 