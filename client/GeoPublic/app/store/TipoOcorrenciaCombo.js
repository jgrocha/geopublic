Ext.define('GeoPublic.store.TipoOcorrenciaCombo', {
	extend : 'Ext.data.Store',
	requires : ['GeoPublic.model.TipoOcorrencia'],
	autoLoad : false, // só pode ler este store depois de ter um promotor selecionado
	remoteSort : false, //enable remote filter
	remoteFilter : false, //enable remote sorting
	// pageSize: 5,
	autoSync : false,
	model : 'GeoPublic.model.TipoOcorrencia'
});
