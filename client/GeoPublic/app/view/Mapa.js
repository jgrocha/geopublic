Ext.define('GeoPublic.view.Mapa', {
    extend: 'GeoExt.panel.Map',
    requires: ['GeoExt.form.field.GeocoderComboBox'], // , 'GeoExt.plugins.PrintExtent'],
    alias: 'widget.mapa',
    zoom: 16,
    stateful: false,

    initComponent: function () {
        // o estado [do mapa] é guardado num cookie
        this.stateId = 'mapa-' + this.initialConfig.config.idplano;

        this.idplano = this.initialConfig.config.idplano;
        this.idpromotor = this.initialConfig.config.idpromotor;
        this.title = this.initialConfig.config.designacao;
        this.designacao = this.initialConfig.config.designacao;
        this.descricao = this.initialConfig.config.descricao;
        this.the_geom = this.initialConfig.config.the_geom;
        var aux1 = this.initialConfig.config.the_geom;
        var aux2 = this.initialConfig.config.the_geom;
        // this.proposta = this.initialConfig.config.proposta;
        // this.alternativeproposta = this.initialConfig.config.alternativeproposta;

        var parser = new OpenLayers.Format.GeoJSON();
        var poly4326;
        var limite = '';
        if (this.the_geom) {
            var polygon = parser.read(aux1, "Geometry");
            //<debug>
            console.log('Vou fazer this.center ao plano ' + this.idplano);
            console.log(polygon.getBounds());
            console.log(polygon.getBounds().getCenterLonLat());
            //</debug>
            this.center = polygon.getBounds().getCenterLonLat();

            // These variables can not be initialized here.
            // they must be initialized in advance
            // thes variables are now global, initialized in the Application's init method
            //var fromProjection = new OpenLayers.Projection("EPSG:900913");
            //var toProjection = new OpenLayers.Projection("EPSG:4326");

            var geojson_format = new OpenLayers.Format.GeoJSON({
                'internalProjection': toProjection,
                'externalProjection': fromProjection
            });
            poly4326 = geojson_format.read(aux2, "Geometry").getBounds();
            limite = "http://nominatim.openstreetmap.org/search?format=json&bounded=1&viewboxlbrt=" + poly4326.left + ',' + poly4326.bottom + ',' + poly4326.right + ',' + poly4326.top;
        } else {
            limite = "http://nominatim.openstreetmap.org/search?format=json&bounded=1&viewboxlbrt=-8.559,40.495,-8.245,40.695";
        }

        var options = {
            controls: [new OpenLayers.Control.MousePosition({
                prefix: 'Coordinates'.translate() + ' <a href="http://spatialreference.org/ref/sr-org/7483/" target="_blank">EPSG:3857 (Web Mercator)</a>: ',
                suffix: ' (long, lat)',
                numDigits: 0
            }), new OpenLayers.Control.Navigation(), new OpenLayers.Control.PanZoom(), new OpenLayers.Control.LayerSwitcher(), new OpenLayers.Control.Attribution()],
            projection: new OpenLayers.Projection("EPSG:900913"), // "EPSG:900913"
            // displayProjection : new OpenLayers.Projection("EPSG:3763"),
            units: 'm',
            numZoomLevels: 21
        };

        this.map = new OpenLayers.Map(options);

        this.tbar = [{
            xtype: 'gx_geocodercombo',
            itemId: 'geocoder',
            emptyText: 'Search within the plan limits'.translate(),
            srs: "EPSG:4326",
            queryDelay: 500,
            url : limite,
            // url : "http://open.mapquestapi.com/nominatim/v1/search.php?format=json&bounded=1&viewboxlbrt=-8.559,40.495,-8.245,40.695",
            //url: "http://open.mapquestapi.com/nominatim/v1/search.php?format=json&bounded=1",
            width: 400
        }, {
            xtype : 'tbfill'
        }, /*{
            xtype : 'label',
            html : 'Useful documents'.translate(),
            style : {
                'font-size' : '12px', // The javascript constant.
                'font-weight' : 'bold'
            }
        }, {
            xtype : 'combo',
            name : 'iddocument', // o que é submetido no form...
            itemId : 'documentcombo',
            editable : false,
            valueField : 'id',
            displayField : 'name', // 'documento',
            emptyText : 'Choose a document...'.translate(),
            //forceSelection : true,
            triggerAction : 'all',
            store : 'Participation.DocumentCombo', // 'TipoOcorrenciaCombo',
            queryMode : 'local',
            //listConfig : {
            //    itemTpl : '<tpl for="."><div class="combo-superior-{isclass}"><span>{designacao}</span></div></tpl>'
            //},
            //afterLabelTextTpl : '<span style="color:red;font-weight:bold" data-qtip="Obrigatório">*</span>',
            //anchor : '100%',
            width: 400
        },*/ {
            itemId: 'allDocuments',
            text: 'All documents'.translate()
            //icon: 'resources/images/icons/fam/delete.gif',
            //disabled: true
        }];
        this.callParent(arguments);
    }
});