#### GeoPublic application

This application is written in Javascript, using the ExtJS 4, GeoExt and Opnelayers.

  * Install [Sencha Cmd](http://www.sencha.com/products/sencha-cmd/download)

  * Install node
  
  * Get (ExtJS)[https://www.sencha.com/products/extjs/download/ext-js-4.2.1/2281]
  
  * Import git project in Eclipse, from (GitHub)[https://github.com/jgrocha/geopublic]

  * Copy Ext to ...
  
  * Copy OpenLayers to ...
  
  * Copy GeoExt2 to ...
 
### GeoExt 2

Changed sencha.cfg

```
app.classpath=${app.dir}/app,${app.dir}/app.js,${app.dir}/resources/js,${app.dir}/geoext2/src
```

Changed app.js

```js
Ext.Loader.addClassPathMappings({
  "GeoExt": "geoext2/src/GeoExt"
});

Ext.require([
    // We need to require this class, even though it is used by Ext.EventObjectImpl
    // see: http://www.sencha.com/forum/showthread.php?262124-Missed-(-)-dependency-reference-to-a-Ext.util.Point-in-Ext.EventObjectImpl
    'Ext.util.Point'
]);
```

### OpenLayers and proj4js

Not managed by sencha app

### MapProxy

Está a ser utilizado o MapProxy para servir tiles do OpenStreetMap reprojetados no EPSG:3763.

```
Ext.apply(String.prototype, (function() {
	function uc(str, p1) {
		return p1.toUpperCase();
	}

	function lc(str, p1) {
		return p1.toLowerCase();
	}

	var camelRe = /-([a-z])/g,
	    titleRe = /((?:\s|^)[a-z])/g,
	    capsRe = /^([a-z])/,
	    decapRe = /^([A-Z])/,
	    leadAndTrailWS = /^\s*([^\s]*)?\s*/,
	    result;

	return {

		translate : function() {
			var s = this.valueOf();
			console.log('TRANSLATE: ' + s);
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
		},

		leftPad : function(val, size, ch) {
			result = String(val);
			if (!ch) {
				ch = " ";
			}
			while (result.length < size) {
				result = ch + result;
			}
			return result;
		},

		camel : function(s) {
			return this.replace(camelRe, uc);
		},

		title : function(s) {
			return this.replace(titleRe, uc);
		},

		capitalize : function() {
			return this.replace(capsRe, uc);
		},

		decapitalize : function() {
			return this.replace(decapRe, lc);
		},

		startsWith : function(prefix) {
			return this.substr(0, prefix.length) == prefix;
		},

		endsWith : function(suffix) {
			var start = this.length - suffix.length;
			return (start > -1) && (this.substr(start) == suffix);
		},

		equalsIgnoreCase : function(other) {
			return (this.toLowerCase() == other.toLowerCase());
		},

		/**
		 * Remove leading and trailing whitespace.
		 */
		normalize : function() {
			return leadAndTrailWS.exec(this)[1] || '';
		},

		/**
		 * Case insensitive String equality test
		 */
		equalsIgnoreCase : function(other) {
			return (this.toLowerCase() == (String(other).toLowerCase()));
		}
	};
})());
```