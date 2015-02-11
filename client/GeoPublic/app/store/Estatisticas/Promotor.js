Ext.define('GeoPublic.store.Estatisticas.Promotor', {
	extend : 'Ext.data.Store',
	requires : ['GeoPublic.model.Promotor'],
	autoLoad : false, // lia antes de arrancar com o controlador
	remoteSort : false, //enable remote filter
	remoteFilter : false, //enable remote sorting
	// pageSize: 5,
	autoSync: true, // if operating on model directly this will make double POSTs!
	model : 'GeoPublic.model.Promotor'
	// storeId: 'Sessao' // If store Id matches it's class name, may be skipped.
}); 