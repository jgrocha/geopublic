/*
    This file is generated and updated by Sencha Cmd. You can edit this file as
    needed for your application, but these edits will have to be merged by
    Sencha Cmd when upgrading.
*/

Ext.Loader.addClassPathMappings({
  "GeoExt": "geoext2/src/GeoExt"
});

Ext.require([
    // We need to require this class, even though it is used by Ext.EventObjectImpl
    // see: http://www.sencha.com/forum/showthread.php?262124-Missed-(-)-dependency-reference-to-a-Ext.util.Point-in-Ext.EventObjectImpl
    'Ext.util.Point'
]);

Ext.application({
    name: 'DemoExtJs',

    extend: 'DemoExtJs.Application',

    autoCreateViewport: true
});
