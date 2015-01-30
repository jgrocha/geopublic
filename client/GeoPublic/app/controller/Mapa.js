Ext.define('GeoPublic.controller.Mapa', {
    extend: 'Ext.app.Controller',
    // stores: ['PromotorCombo', 'PlanoCombo', 'TipoOcorrenciaCombo', 'Ocorrencia', 'Participation.EstadoCombo'], // getPromotorComboStore()
    // requires: ['GeoExt.Action'],
    zoomLevelEdit: 12,
    firsttime: 0,
    init: function () {
        // <debug>
        console.log('O controlador GeoPublic.controller.Mapa init...');
        // </debug>
        this.control({
            'mapa': {
                'beforerender': this.onMapaBeforeRender,
                'afterrender': this.onMapaAfterRender
            },
            "contribution toolbar button#local": {
                click: this.onButtonLocal
            }
        }, this);
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
                        geodiscussao : true
                    });
                    f.discussion = newDiscussion;
                    // o método add só adiciona se ainda não existe no painel
                    // p.add(newDiscussion);
                    p.insert(0, newDiscussion);
                    if (f.attributes["numcomments"] > 0) {
                        // give feedback to user
                        newDiscussion.down('commentlist').header.getEl().setStyle('cursor', 'pointer');
                    }
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
                    event.feature.attributes["title"] = 'Nova participação'.translate();
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
        map.events.register('zoomend', this, function (event) {
            var zLevel = map.getZoom();
            console.log('Zoom level: ', zLevel);

            if (this.firsttime) {
                this.firsttime = 0;
                // this is only necessary if a plan is selected in the startpanel and the map was never rendered before
                var parser = new OpenLayers.Format.GeoJSON();
                if (mapPanel.the_geom) {
                    var polygon = parser.read(mapPanel.the_geom, "Geometry");
                    //<debug>
                    console.log('Vou fazer zoom ao plano ');
                    console.log(polygon.getBounds());
                    //</debug>
                    map.zoomToExtent(polygon.getBounds(), true);
                }
            }
        });
    }
});
