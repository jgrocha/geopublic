#### Sample application that shows different scenarios when connecting ExtJs 4.2+ application to backend via Ext.Direct:

  * Direct method call
  
  * Form load / submit

  * Grid CRUD operations

  * Form file upload

  * Tree root / child dynamic load

  * Cookie (Session data)

Note: Adjust your server path in file DirectAPI.js to match deployment environment.
By default it's pointing to 'http://localhost:3000/directapi'

Important! If you are using mongodb as your backend, you have to add mapping for id field!

Example:

```js
fields: [
    {
        name: 'id',
        mapping: '_id' // <- this is important
    },
    {
        name: 'text'
    },
    {
        name: 'complete',
        type: 'boolean'
    }
],
```
 
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

### MapFish Print ou GeoServer Print Module

Ver qual é melhor


