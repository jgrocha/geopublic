Ext.define('GeoPublic.store.Participation.Fotografia', {
	extend : 'Ext.data.Store',
	requires : ['GeoPublic.model.Participation.Fotografia'],
	autoLoad : false,
	remoteSort : true, //enable remote filter
	remoteFilter : true, //enable remote sorting
	// pageSize: 5,
	autoSync: false, // preciso de encher o store antes de o gravar...
	model : 'GeoPublic.model.Participation.Fotografia'
}); 