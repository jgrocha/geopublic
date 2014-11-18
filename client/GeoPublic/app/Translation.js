Ext.define('GeoPublic.Translation', {}, function() {
	console.log('Get translation array');
	var Loader = Ext.Loader,
	    wasLoading = Loader.isLoading;
	// Loader.loadScriptFile('/translation', Ext.emptyFn, Ext.emptyFn, null, true);
	// loadScriptFile( url, onLoad, onError, scope, synchronous )PRIVATE
	Loader.loadScriptFile('/translation', // URL of script
	function() {// callback fn when script is loaded
		console.log('loadScriptFile /translation ok');

		String.prototype.translate = function() {
			var s = this.valueOf();
			// console.log('TRANSLATE: ' + s);
			var t = {},
			    i = 0,
			    n = GeoPublic.Translation.length;
			while (i < n) {
				t = GeoPublic.Translation[i];
				// console.log(t);
				if (t.id == s) {
					return t.translation;
				}
				i++;
			}
			return s;
		};

	}, function() {// callback fn if load fails
		console.log('loadScriptFile /translation NOT ok');
	}, this, // scope of callbacks
	true);
	Loader.isLoading = wasLoading;
});
