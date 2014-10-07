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
