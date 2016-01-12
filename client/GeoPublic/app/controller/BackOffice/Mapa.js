Ext.define('GeoPublic.controller.BackOffice.Mapa', {
    extend: 'Ext.app.Controller',
    zoomLevelEdit: 12,
    refs: [{
        ref: 'editor',
        selector: 'grid-promotor #planoForm'
    }],
    init: function () {
        this.control({
            'map-limits': {
                'beforerender': this.onMapaBeforeRender
            }
        }, this);
    },
    onMapaBeforeRender: function (mapPanel, options) {
        console.log('onMapPanelBeforeRender');
        var me = this;
        var map = mapPanel.map;
        var osmlayer = new OpenLayers.Layer.OSM(
            'OSM',
            ['http://a.tile.openstreetmap.org/${z}/${x}/${y}.png',
                'http://b.tile.openstreetmap.org/${z}/${x}/${y}.png',
                'http://c.tile.openstreetmap.org/${z}/${x}/${y}.png']
        );
        map.addLayer(osmlayer);

        /*
        osmlayer.events.register("loadend", map, function (e) {
            console.log('loadend osmlayer');
        });
        */

        if (mapPanel.the_geom) {
            var parser = new OpenLayers.Format.GeoJSON();
            var polygon = parser.read(mapPanel.the_geom, "Geometry");
            // create some attributes for the feature
            var attributes = {name: "Limits"};
            var feature = new OpenLayers.Feature.Vector(polygon, attributes);
            var bboxpolygon = new OpenLayers.Layer.Vector("Limites do Plano", {
                displayInLayerSwitcher: true,
                isBaseLayer: false,
                styleMap: new OpenLayers.Style({
                    fillOpacity: 0,
                    strokeColor: "#00ccee",
                    strokeDashstyle: 'dot',
                    strokeWidth: 2
                })
            });
            bboxpolygon.addFeatures([feature]);
            map.addLayer(bboxpolygon);

            /*
            bboxpolygon.events.register("loadend", map, function (e) {
                console.log('loadend bboxpolygon');
                map.zoomToExtent(bboxpolygon.getDataExtent(), closest = true);
            });
            */

        }

        var vectors = new OpenLayers.Layer.Vector("Vector Layer");
        map.addLayer(vectors);
        var insertPolygon = new OpenLayers.Control.DrawFeature(vectors, OpenLayers.Handler.RegularPolygon,
            {handlerOptions: {irregular: true}});
        map.addControl(insertPolygon);
        insertPolygon.activate();
        insertPolygon.events.on({
            featureadded: function (event) {
                //<debug>
                console.log('insertPolygon.events.on featureadded');
                //</debug>
                var f = event.feature;
                var str = parser.write(f.geometry);
                console.log('GeoJSON: ' + str);

                var form = me.getEditor();
                form.getForm().findField('the_geom').setValue(str);
            }
        });

    }
});
