Ext.define('GeoPublic.controller.Mapa', {
    extend: 'Ext.app.Controller',
    // stores: ['PromotorCombo', 'PlanoCombo', 'TipoOcorrenciaCombo', 'Ocorrencia', 'Participation.EstadoCombo'], // getPromotorComboStore()
    // requires: ['GeoExt.Action'],
    zoomLevelEdit: 12,
    firsttime: 0,
    refs: [{
            ref: 'geocoder',
            selector: 'app-main-map-panel toolbar gx_geocodercombo#geocoder'
        }],
    init: function () {
        // <debug>
        console.log('O controlador GeoPublic.controller.Mapa init...');
        // </debug>
        this.control({
            'mapa': {
                'beforerender': this.onMapPanelBeforeRender
                // 'afterrender': this.onMapPanelAfterRender
            }
        }, this);

    },
    onMapPanelBeforeRender: function (mapPanel, options) {
        console.log('onMapPanelBeforeRender');
        var me = this;
        var map = mapPanel.map;

        //<debug>
        // variáveis globais para debug
        mapDebug = map;
        mapPanelDebug = mapPanel;
        //</debug>

        var locationLayer = new OpenLayers.Layer.Vector("Location", {
            displayInLayerSwitcher: false,
            projection: new OpenLayers.Projection("EPSG:4326"),
            styleMap: new OpenLayers.Style({
                externalGraphic: "resources/images/marker.png",
                graphicYOffset: -25,
                graphicHeight: 25,
                graphicTitle: "${name}"
            })
        });
        map.addLayer(locationLayer);
        me.getGeocoder().layer = locationLayer;
    }
});
