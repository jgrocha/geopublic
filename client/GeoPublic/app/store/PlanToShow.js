Ext.define('GeoPublic.store.PlanToShow', {
	extend : 'Ext.data.Store',
	requires : ['GeoPublic.model.Plano'],
	autoLoad : false, // só pode ler este store depois de ter um promotor selecionado
	remoteSort : false, //enable remote filter
	remoteFilter : false, //enable remote sorting
	// pageSize: 5,
	autoSync: false, // if operating on model directly this will make double POSTs!
	model : 'GeoPublic.model.Plano'	
}); 