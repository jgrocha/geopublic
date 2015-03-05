Ext.define('GeoPublic.view.Mapa', {
    extend: 'GeoExt.panel.Map',
    requires: ['GeoExt.form.field.GeocoderComboBox'], // , 'GeoExt.plugins.PrintExtent'],
    alias: 'widget.mapa',
    // title : 'Mapa',
    // funciona!
    center: [-940328.71082446, 4949944.6827996], // coordenadas ESPG:900913
    zoom: 12,
    stateful: true,

    initComponent: function () {
        // o estado [do mapa] é guardado num cookie
        this.stateId = 'mapa-' + this.initialConfig.config.idplano;

        this.idplano = this.initialConfig.idplano;
        this.idpromotor = this.initialConfig.idpromotor;
        this.title = this.initialConfig.designacao;
        this.designacao = this.initialConfig.designacao;
        this.descricao = this.initialConfig.descricao;
        this.the_geom = this.initialConfig.the_geom;
        // this.proposta = this.initialConfig.proposta;
        // this.alternativeproposta = this.initialConfig.alternativeproposta;

        var options = {
            controls: [new OpenLayers.Control.MousePosition({
                prefix: 'Coordinates'.translate() + ' <a href="http://spatialreference.org/ref/sr-org/7483/" target="_blank">EPSG:3857 (Web Mercator)</a>: ',
                suffix: ' (long, lat)',
                numDigits: 0
            }), new OpenLayers.Control.Navigation(), new OpenLayers.Control.PanZoom(), new OpenLayers.Control.LayerSwitcher()],
            projection: new OpenLayers.Projection("EPSG:3857"), // "EPSG:900913"
            // displayProjection : new OpenLayers.Projection("EPSG:3763"),
            units: 'm'
        };
        this.map = new OpenLayers.Map(options);

        /*
         * Fim de
         */

        this.callParent(arguments);
    },
    tbar: [{
        xtype: 'gx_geocodercombo',
        itemId: 'geocoder',
        emptyText: 'Procurar por rua',
        srs: "EPSG:4326",
        queryDelay: 500,
        // url : "http://nominatim.openstreetmap.org/search?format=json&bounded=1&viewboxlbrt=-8.559,40.495,-8.245,40.695",
        // url : "http://open.mapquestapi.com/nominatim/v1/search.php?format=json&bounded=1&viewboxlbrt=-8.559,40.495,-8.245,40.695",
        url: "http://open.mapquestapi.com/nominatim/v1/search.php?format=json&bounded=1",
        width: 400
    }]
});