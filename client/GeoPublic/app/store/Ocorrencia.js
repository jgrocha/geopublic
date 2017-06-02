Ext.define('GeoPublic.store.Ocorrencia', {
	// extend : 'GeoExt.data.FeatureStore',
	extend : 'Ext.data.Store',
	model : 'GeoPublic.model.Ocorrencia',
	autoLoad : false,
	autoSync : true,
	//
	remoteSort: true, //enable remote filter
	remoteFilter: true, //enable remote sorting
	pageSize: 100
});