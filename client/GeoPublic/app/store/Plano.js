Ext.define('GeoPublic.store.Plano', {
	extend : 'Ext.data.Store',
	requires : ['GeoPublic.model.Plano'],
	autoLoad : false, // só pode ler este store depois de ter um promotor selecionado
	remoteSort : false, //enable remote filter
	remoteFilter : true, //enable remote sorting
	// pageSize: 5,
	autoSync: true, // if operating on model directly this will make double POSTs!
	model : 'GeoPublic.model.Plano'
}); 