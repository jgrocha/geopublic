Ext.define('GeoPublic.DirectAPI', {
	/*
	 Require Ext.Direct classes
	 */
	requires : ['Ext.direct.*']
}, function() {
	var Loader = Ext.Loader, wasLoading = Loader.isLoading;

	//Loading API
	Loader.loadScriptFile('directapi', Ext.emptyFn, Ext.emptyFn, null, true);
	// Loader.loadScriptFile('/ppgis.js', Ext.emptyFn, Ext.emptyFn, null, true);
	Loader.isLoading = wasLoading;
	/*
	 Add provider. Name must match settings on serverside
	 */
	Ext.direct.Manager.addProvider(ExtRemote.REMOTING_API);
}); 