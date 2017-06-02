Ext.define('GeoPublic.controller.Mapa', {
    extend: 'Ext.app.Controller',
    requires: ['GeoPublic.view.Participation.AllDcoments'],
    // stores: ['PromotorCombo', 'PlanoCombo', 'TipoOcorrenciaCombo', 'Ocorrencia', 'Participation.EstadoCombo'], // getPromotorComboStore()
    //stores: ['Layer', 'Participation.DocumentCombo'], // getParticipationDocumentComboStore()
    stores: ['Layer' ], // getParticipationDocumentComboStore()
    // requires: ['GeoExt.Action'],
    zoomLevelEdit: 12,
    firsttime: 1,
    refs: [{
        selector: 'viewport > tabpanel',
        ref: 'painelPrincipal' // gera um getPainelPrincipal
    }],
    init: function () {
        // <debug>
        console.log('O controlador GeoPublic.controller.Mapa init...');
        // </debug>
        this.control({
            'mapa': {
                'beforerender': this.onMapaBeforeRender
                // it is called by onMapaBeforeRender
                // 'afterrender': this.onMapaAfterRender
            },
            "contribution toolbar button#local": {
                click: this.onButtonLocal
            },
            "mapa button#allDocuments": {
                click: this.onButtonAllDocuments
            }
        }, this);
    },
    onButtonAllDocuments: function (button, e, options) {
        // console.log('onButtonAllDocuments');
        var me = this;
        //var storeDocuments = this.getParticipationDocumentComboStore();

        var mapa = button.up('discussao-geografica').down('mapa');
        var theTitle = Ext.util.Format.ellipsis(mapa.designacao, 20) + " ( " + "Documents".translate() + ")";

        // id: menu-grid-sessao
        var classe = 'all-documents';

        var tabPanel = me.getPainelPrincipal();
        var pos = tabPanel.items.findIndex('title', theTitle);
        if (pos > -1) {
            me.getPainelPrincipal().setActiveTab(pos);
        } else {
            var sepTab = tabPanel.child('#separador');
            var sepTabIndex = tabPanel.items.findIndex('id', sepTab.id);

            me.getPainelPrincipal().insert(sepTabIndex, {
                xtype: classe,
                title: theTitle,
                config: {
                    idplano: mapa.idplano
                    //store: storeDocuments
                },
                closable: true
            });

            me.getPainelPrincipal().setActiveTab(sepTabIndex);
        }

        /*
         var check = Ext.ComponentQuery.query(classe);
         var newTab = null;
         if (check.length > 0) {
         // A componente já foi criada
         // Selecionar o tab correspondente
         console.log('A classe ' + classe + ' já foi instanciada.');
         newTab = mainPanel.items.findBy(function (tab) {
         return tab.xtype === classe;
         });
         if (newTab) {
         mainPanel.setActiveTab(newTab);
         }
         } else {
         console.log('Vamos criar a classe ' + classe);
         if (Ext.ClassManager.getNameByAlias('widget.' + classe) != "") {
         newTab = mainPanel.add({
         xtype: classe,
         title: theTitle,
         config: {
         store: storeDocuments
         },
         closable: true
         });
         mainPanel.setActiveTab(newTab);
         // perfeito! Não serve para nada, pois no servidor uso o userid da sessão
         // este código tem que passar para dentro da componente...
         // this.getSessaoStore().proxy.setExtraParam("userid", GeoPublic.LoggedInUser.data.id);
         // this.getSessaoStore().load();
         } else {
         console.log("Erro! The class " + 'widget.' + classe + " does not exist (yet)!");
         }
         }
         */
    },
    onButtonLocal: function (button, e, options) {
        var mapa = button.up('discussao-geografica').down('mapa');
        // console.log('onButtonLocal', button, mapa);

        var selectCtrl = mapa.map.getControlsBy("id", "selectCtrl")[0];
        var highlightCtrl = mapa.map.getControlsBy("id", "highlightCtrl")[0];
        var insertPoint = mapa.map.getControlsBy("id", "insertPoint")[0];

        if (button.pressed) {
            highlightCtrl.deactivate();
            selectCtrl.deactivate();
            insertPoint.activate();
        } else {
            insertPoint.cancel();
            highlightCtrl.activate();
            selectCtrl.activate();
            insertPoint.deactivate();
        }
    },
    onMapaBeforeRender: function (mapPanel, options) {
        // console.log('onMapPanelBeforeRender');
        var me = this;
        var map = mapPanel.map;

        //<debug>
        // variáveis globais para debug
        mapDebug = map;
        mapPanelDebug = mapPanel;
        //</debug>

        /*
        var storeDocuments = this.getParticipationDocumentComboStore();
        storeDocuments.load({
            params: {
                idplano: mapPanel.idplano
            }
        });
        */

        var layers = [];
        var store = this.getLayerStore();
        store.load({
            params: {
                filter: '[{"type":"boolean","value":true,"field":"activo"}, {"type":"numeric","value":' + mapPanel.idplano + ',"field":"idplano", "comparison":"eq"}]',
                sort: [{property: 'ord', direction: 'ASC'}]
            },
            callback: function (records, operation, success) {
                //<debug>
                console.log(records.length + ' layers foram devolvidos');
                //</debug>
                var total = records.length;
                var novolayer = {};
                for (var i = 0; i < total; i++) {
                    // console.log(records[i].data);
                    // console.log(records[i].data.url.trim().split(/ *, */));

                    switch (records[i].data.tipo) {
                        case 'WMTS':
                            novolayer = new OpenLayers.Layer.WMTS({
                                name: records[i].data.titulo,
                                // only in OL3
                                // url: 'http://{a-d}.geomaster.pt/mapproxy/wmts/mapquest/{TileMatrixSet}/{TileMatrix}/{TileCol}/{TileRow}.png',
                                url: records[i].data.url.trim().split(/ *, */),
                                layer: records[i].data.layer,
                                matrixSet: 'pt_tm_06',
                                format: 'image/png',
                                isBaseLayer: records[i].data.base,
                                style: records[i].data.estilo,
                                requestEncoding: 'REST',
                                visibility: records[i].data.visivel,
                                attribution: records[i].data.observacoes // works?
                            });
                            break;
                        case 'WMS':
                            novolayer = new OpenLayers.Layer.WMS(
                                records[i].data.titulo,
                                records[i].data.url.trim().split(/ *, */),
                                {
                                    styles: records[i].data.estilo,
                                    layers: records[i].data.layer,
                                    format: 'image/png',
                                    transparent: true
                                }, {
                                    buffer: 0,
                                    visibility: records[i].data.visivel,
                                    displayOutsideMaxExtent: true,
                                    isBaseLayer: records[i].data.base,
                                    yx: {'EPSG:3763': false},
                                    attribution: records[i].data.observacoes
                                });
                            break;
                        case 'OSM':
                            novolayer = new OpenLayers.Layer.OSM(
                                records[i].data.titulo,
                                records[i].data.url.trim().split(/ *, */), {
                                    attribution: records[i].data.observacoes
                                });
                            break;
                        case 'Stamen':
                            novolayer = new OpenLayers.Layer.Stamen(records[i].data.layer, {
                                attribution: records[i].data.observacoes
                            });
                            break;
                        default:
                            // console.log('Tipo desconhecido: ' + records[i].data.tipo);
                            break;
                    }
                    layers.push(novolayer);
                }
                map.addLayers(layers);

                // var baseOSM = new OpenLayers.Layer.OSM("MapQuest-OSM Tiles", ["http://otile1.mqcdn.com/tiles/1.0.0/map/${z}/${x}/${y}.jpg", "http://otile2.mqcdn.com/tiles/1.0.0/map/${z}/${x}/${y}.jpg", "http://otile3.mqcdn.com/tiles/1.0.0/map/${z}/${x}/${y}.jpg", "http://otile4.mqcdn.com/tiles/1.0.0/map/${z}/${x}/${y}.jpg"]);
                // var baseAerial = new OpenLayers.Layer.OSM("MapQuest Open Aerial Tiles", ["http://otile1.mqcdn.com/tiles/1.0.0/sat/${z}/${x}/${y}.jpg", "http://otile2.mqcdn.com/tiles/1.0.0/sat/${z}/${x}/${y}.jpg", "http://otile3.mqcdn.com/tiles/1.0.0/sat/${z}/${x}/${y}.jpg", "http://otile4.mqcdn.com/tiles/1.0.0/sat/${z}/${x}/${y}.jpg"]);
                // map.addLayers([baseOSM, baseAerial]);

                var defaultStyle = new OpenLayers.Style({
                    'pointRadius': 14,
                    //'fillColor': '${color}',
                    'title': '${title}',
                    'externalGraphic': '${icon}'
                });

                // onhover + when the user clicks the button to add a point to the map...
                var temporaryStyle = new OpenLayers.Style({
                    'pointRadius': 14, // {Number} Pixel point radius.  Default is 6.
                    //'fillColor': '#00FF00',
                    'externalGraphic': 'resources/images/target.png'
                });

                // when selected, either on the map on on the button to show on the map
                var selectStyle = new OpenLayers.Style({
                    //cursor: "crosshair",
                    'pointRadius': 14, // não está a fazer nada... // {Number} Pixel point radius.  Default is 6.
                    'externalGraphic': '${iconselected}'
                    //'strokeColor': '#FFBB09',
                    //'strokeWidth': 2,  // dafault 1
                    //'graphicWidth': 20,
                    //'graphicHeight': 20
                });

                var styleMap = new OpenLayers.StyleMap({
                    'default': defaultStyle,
                    'temporary': temporaryStyle,
                    'select': selectStyle
                });

                var report = new OpenLayers.Layer.Vector("Report", {
                    styleMap: styleMap,
                    displayInLayerSwitcher: false
                });

                map.addLayer(report);

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
                mapPanel.down('toolbar gx_geocodercombo#geocoder').layer = locationLayer;
                // me.getGeocoder().layer = locationLayer;

                var parser = new OpenLayers.Format.GeoJSON();
                var polygon = parser.read(mapPanel.the_geom, "Geometry");
                // create some attributes for the feature
                var attributes = {idplano: mapPanel.idplano, name: "Limits"};
                var feature = new OpenLayers.Feature.Vector(polygon, attributes);
                var bboxpolygon = new OpenLayers.Layer.Vector("Plan scope".translate(), {
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

                this.onMapaAfterRender(mapPanel, {});

            },
            scope: this
        });

    },

    onMapaAfterRender: function (mapPanel, options) {
        // console.log('onMapPanelAfterRender');
        var me = this;
        var map = mapPanel.map;
        var report = map.getLayersByName('Report')[0];
        this.firsttime = 1;
        mapPanel.selectCtrl = new OpenLayers.Control.SelectFeature(report, {
            id: 'selectCtrl',
            clickout: true,
            onSelect: function (f) {
                //<debug>
                console.log('o feature ' + f.fid + ' foi selecionado');
                //</debug>
                var newDiscussion = null;
                var discussaogeografia = mapPanel.up('discussao-geografica');
                var p = discussaogeografia.down('activitynew #flow');
                // var p = me.getTodasDiscussoes();
                if (f.discussion) {
                    //<debug>
                    console.log('Já existe a discussão ' + f.fid);
                    //</debug>
                    newDiscussion = f.discussion;
                    // faz scroll!
                    // var pos = newDiscussion.getOffsetsTo(p)[1];
                    // p.body.scroll('top', pos, true);
                } else {
                    //<debug>
                    console.log('Criar a discussão ' + f.fid);
                    //</debug>
                    // criar os paineis de discussao
                    newDiscussion = new GeoPublic.view.Participation.Discussion({
                        id_ocorrencia: f.fid,
                        idplano: f.attributes["idplano"],
                        idpromotor: f.attributes["idpromotor"],
                        idestado: f.attributes["idestado"],
                        estado: f.attributes["estado"],
                        color: f.attributes["color"],
                        idtipoocorrencia: f.attributes["idtipoocorrencia"],
                        titulo: f.attributes["titulo"],
                        participacao: f.attributes["participacao"],
                        datacriacao: f.attributes["datacriacao"],
                        numcomments: f.attributes["numcomments"],
                        numfotografias: f.attributes["numfotografias"],
                        fotografia: f.attributes["fotografia"],
                        days: f.attributes["days"],
                        hours: f.attributes["hours"],
                        minutes: f.attributes["minutes"],
                        seconds: f.attributes["seconds"],
                        nome: f.attributes["nome"],
                        idutilizador: f.attributes["idutilizador"],
                        proposta: null,
                        feature: f,
                        estadoStore: discussaogeografia.getStoreEstado(),
                        geodiscussao: true
                    });
                    f.discussion = newDiscussion;
                    // o método add só adiciona se ainda não existe no painel
                    // p.add(newDiscussion);
                    p.insert(0, newDiscussion);
                    /*
                     if (f.attributes["numcomments"] > 0) {
                     // give feedback to user
                     newDiscussion.down('commentlist').header.getEl().setStyle('cursor', 'pointer');
                     }
                     */
                }
                // faz scroll!
                var pos = newDiscussion.getOffsetsTo(p)[1];
                p.body.scroll('top', pos, true);
                // visual feedback
                newDiscussion.setUI('discussion-framed');
                var task = new Ext.util.DelayedTask(function () {
                    newDiscussion.setUI('default-framed');
                });
                task.delay(2000);
            },
            onUnselect: function (f) {
                //<debug>
                console.log('o feature ' + f.fid + ' foi deselecionado');
                //</debug>
            }
        });
        mapPanel.highlightCtrl = new OpenLayers.Control.SelectFeature(report, {
            id: 'highlightCtrl',
            hover: true,
            highlightOnly: true,
            renderIntent: "temporary"
        });
        mapPanel.insertPoint = new OpenLayers.Control.DrawFeature(report, OpenLayers.Handler.Point, {
            id: 'insertPoint',
            'displayClass': 'olControlDrawFeaturePoint'
        });
        var toolbar = new OpenLayers.Control.Panel({
            displayClass: 'customEditingToolbar'
        });
        toolbar.addControls([mapPanel.selectCtrl, mapPanel.highlightCtrl, mapPanel.insertPoint]);
        map.addControl(toolbar);
        report.events.on({
            beforefeatureadded: function (event) {
                // console.log('report.beforefeatureadded');
                // console.log(arguments);
                // console.debug(event.feature);
                if (!event.feature.attributes["title"]) {
                    event.feature.attributes["title"] = 'New participation'.translate();
                }
                if (!event.feature.attributes["icon"]) {
                    event.feature.attributes["icon"] = 'resources/images/target.png';
                    //event.feature.attributes["icon"] = 'resources/images/community_16x16.png';
                }
            }
        });
        /*
         * 		color : records[i].data.color,
         *		icon : records[i].data.icon,
         *		title : records[i].data.titulo
         */
        mapPanel.insertPoint.events.on({
            featureadded: function (event) {
                //<debug>
                console.log('mapPanel.insertPoint.events.on featureadded');
                //</debug>
                // console.log(arguments);
                var f = event.feature;
                var contrib = mapPanel.up('discussao-geografica').down('activitynew').down('contribution');

                // console.log(f);

                // vou ver se já existia um ponto marcado (mas não gravado)
                // Percorrer TODOS os features
                var n = f.layer.features.length;
                var toremove = [];
                // console.log('Limpar os features temporarios. Percorrer ' + n + ' features existentes.');
                // Excepto este acabado de inserir!
                for (var i = 0; i < n; i++) {
                    // console.log(f.layer.features[i].id, f.layer.features[i].fid);
                    // remover dentro deste ciclo?
                    if ((f.layer.features[i].fid == null) && (f.layer.features[i].id != f.id)) {
                        // console.log('Remove: ', f.layer.features[i].id, f.layer.features[i].fid);
                        toremove.push(f.layer.features[i]);
                    }
                }
                f.layer.removeFeatures(toremove);

                var formulario = contrib.down('form#detail');
                formulario.getForm().setValues({
                    feature: f.id
                });
                // Mostrar as coordenadas no form
                // console.log('Mudar as coordenadas' + f.geometry.toString());
                // console.log(me.getContributionCoordinates());
                // converter coordenadas e formatar...
                // console.log(f);
                var novo = new OpenLayers.LonLat(f.geometry.x, f.geometry.y).transform(f.layer.map.getProjectionObject(), new OpenLayers.Projection("EPSG:4326"));
                // console.log(novo);

                //  selector: 'contribution toolbar#contributiontb tbtext',
                var textocoordenadas = contrib.down('tbtext#coordinates');
                textocoordenadas.setText(novo.lon.toFixed(5) + ' ' + novo.lat.toFixed(5));

                // check if the Save button can be enabled
                me.fireEvent('featureAdded', event, contrib);

                // event.feature
                // event.feature.state === "Insert"
                // selector: 'activity contribution toolbar button#local'
                var botao = contrib.down('button#local');
                if (botao.pressed) {
                    botao.toggle(false);
                    // -- a ordem é importante...
                    mapPanel.highlightCtrl.activate();
                    mapPanel.selectCtrl.activate();
                    mapPanel.insertPoint.deactivate();
                }
            }
        });
        // -- a ordem destes dois é importante
        mapPanel.highlightCtrl.activate();
        mapPanel.selectCtrl.activate();

        //<debug>
        map.events.register('zoomend', this, function (event) {
            var zLevel = map.getZoom();
            // console.log('Zoom level: ', zLevel);
        });
        //</debug>

        this.fireEvent('mapRendered', mapPanel);

    }
});
