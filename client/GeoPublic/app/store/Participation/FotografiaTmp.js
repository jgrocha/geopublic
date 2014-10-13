Ext.define('GeoPublic.store.Participation.FotografiaTmp', {
	extend : 'Ext.data.Store',
	requires : ['GeoPublic.model.Participation.FotografiaTmp'],
	autoLoad : false, // true, // false,
	remoteSort : true, //enable remote filter
	remoteFilter : true, //enable remote sorting
	// pageSize: 5,
	autoSync: true, // false, // preciso de encher o store antes de o gravar...
	model : 'GeoPublic.model.Participation.FotografiaTmp'
});