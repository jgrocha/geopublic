Ext.define('GeoPublic.view.BackOffice.Mapa', {
    extend: 'GeoExt.panel.Map',
    alias: 'widget.map-limits',
    zoom: 16,
    stateful: false,
    initComponent: function () {
        if (this.the_geom) {
            var parser = new OpenLayers.Format.GeoJSON();
            var polygon = parser.read(this.the_geom, "Geometry");
            this.center = polygon.getBounds().getCenterLonLat();
        }
        var options = {
            controls: [new OpenLayers.Control.MousePosition({
                prefix: 'Coordinates'.translate() + ' <a href="http://spatialreference.org/ref/sr-org/7483/" target="_blank">EPSG:3857 (Web Mercator)</a>: ',
                suffix: ' (long, lat)',
                numDigits: 0
            }), new OpenLayers.Control.Navigation(), new OpenLayers.Control.PanZoom(), new OpenLayers.Control.LayerSwitcher()],
            projection: new OpenLayers.Projection("EPSG:900913"),
            units: 'm',
            numZoomLevels: 21
        };
        this.map = new OpenLayers.Map(options);
        this.callParent(arguments);
    }
});