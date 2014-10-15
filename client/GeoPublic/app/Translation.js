Ext.define('GeoPublic.Translation', {}, function() {
	console.log('Get translation array');
	var Loader = Ext.Loader, wasLoading = Loader.isLoading;
	Loader.loadScriptFile('/translation', Ext.emptyFn, Ext.emptyFn, null, true);
	Loader.isLoading = wasLoading;
});
