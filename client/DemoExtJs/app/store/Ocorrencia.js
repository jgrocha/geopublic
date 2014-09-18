Ext.define('DemoExtJs.store.Ocorrencia', {
	// extend : 'GeoExt.data.FeatureStore',
	extend : 'Ext.data.Store',
	model : 'DemoExtJs.model.Ocorrencia',
	autoLoad : false,
	autoSync : true
});