Ext.define('GeoPublic.store.Participation.ChartByType', {
	extend : 'Ext.data.Store',
	requires : ['GeoPublic.model.Participation.ChartByType'],
	autoLoad : false,
	remoteSort : false, //enable remote filter
	remoteFilter : false, //enable remote sorting
	// pageSize: 5,
	autoSync: false, // if operating on model directly this will make double POSTs!
	model : 'GeoPublic.model.Participation.ChartByType'
});