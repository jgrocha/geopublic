Ext.define('DemoExtJs.store.Plano', {
	extend : 'Ext.data.Store',
	requires : ['DemoExtJs.model.Plano'],
	autoLoad : false, // só pode ler este store depois de ter um promotor selecionado
	remoteSort : false, //enable remote filter
	remoteFilter : true, //enable remote sorting
	// pageSize: 5,
	autoSync: true, // if operating on model directly this will make double POSTs!
	model : 'DemoExtJs.model.Plano'
}); 