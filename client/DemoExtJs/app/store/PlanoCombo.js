Ext.define('DemoExtJs.store.PlanoCombo', {
	extend : 'Ext.data.Store',
	requires : ['DemoExtJs.model.Plano'],
	autoLoad : false, // só pode ler este store depois de ter um promotor selecionado
	remoteSort : false, //enable remote filter
	remoteFilter : false, //enable remote sorting
	// pageSize: 5,
	autoSync: false, // if operating on model directly this will make double POSTs!
	model : 'DemoExtJs.model.Plano'	
}); 