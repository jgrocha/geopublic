Ext.define('GeoPublic.controller.DiscussaoGeografica', {
    extend: 'Ext.app.Controller',
    requires: ['GeoPublic.store.Ocorrencia'],
    // stores: ['Ocorrencia'],
    init: function () {
        this.control({
            'discussao-geografica': {
                // 'beforerender' : this.onBemVindoPanelBeforeRender,
                // 'render' : this.onStartPanelRender
                'afterrender': this.onDiscussaoGeograficaAfterRender,
                'beforedestroy': this.onBeforeDestroy
            }
        }, this);
    },
    onBeforeDestroy: function (panel, eOpts) {
        var store = panel.getStoreOcorrencias();
        //<debug>
        console.log('Vou morrer!', panel.itemId);
        console.log('Também Vou morrer!', store.storeId);
        //</debug>
        store.un({
            scope: panel,
            load: this.onOcorrenciaStoreLoad
        });
    },
    onOcorrenciaStoreLoad: function (store, records) {
        //<debug>
        console.log('onOcorrenciaStoreLoad ' + records.length);
        console.log(store.proxy.extraParams);
        //</debug>

        var pageCount = store.getCount();
        var total = store.getTotalCount();
        // console.log('this.numOcorrenciasLoaded = ' + this.numOcorrenciasLoaded + ' ' + pageCount + ' of ' + total);
        this.numOcorrenciasLoaded += pageCount;

        // o scope passado é o do painel
        // this === panel
        var me = this;
        // console.log(this);


        var report = me.down('mapa').map.getLayersByName('Report')[0];
        // report.destroyFeatures();
        var parser = new OpenLayers.Format.GeoJSON();
        
        var start = 0;
        // var total = records.length;
        //var limit = total <= 10 ? total : 10;
        var limit = pageCount;
        for (var i = start; i < limit; i++) {

            var f = null;
            if (records[i].data.geojson) {
                // geometry, attributes, style
                f = new OpenLayers.Feature.Vector(parser.read(records[i].data.geojson, "Geometry"), {
                    color: records[i].data.color,
                    icon: records[i].data.icon,
                    iconselected: records[i].data.icon.replace(/\.png$/, '-selected.png'),
                    title: records[i].data.titulo
                });
                // f.style.fillColor = records[i].data.color;
                f.fid = records[i].data.id;
                f.attributes["idplano"] = records[i].data.idplano;
                f.attributes["idpromotor"] = me.idpromotor;
                f.attributes["idestado"] = records[i].data.idestado;
                f.attributes["estado"] = records[i].data.estado;
                f.attributes["idtipoocorrencia"] = records[i].data.idtipoocorrencia;
                f.attributes["titulo"] = records[i].data.titulo;
                f.attributes["participacao"] = records[i].data.participacao;
                f.attributes["datacriacao"] = records[i].data.datacriacao;
                f.attributes["numcomments"] = records[i].data.numcomentarios;
                f.attributes["fotografia"] = records[i].data.fotografia;
                f.attributes["days"] = records[i].data.days;
                f.attributes["hours"] = records[i].data.hours;
                f.attributes["minutes"] = records[i].data.minutes;
                f.attributes["seconds"] = records[i].data.seconds;
                f.attributes["nome"] = records[i].data.nome;
                f.attributes["idutilizador"] = records[i].data.idutilizador;
                report.addFeatures([f]);
            } else {
                console.log('A ocorrência', records[i].data.titulo, 'não tem componente geográfica');
            }

            if (i < limit) {
                var newDiscussion = new GeoPublic.view.Participation.Discussion({
                    id_ocorrencia: records[i].data.id,
                    idplano: records[i].data.idplano,
                    idpromotor: me.idpromotor,
                    idestado: records[i].data.idestado,
                    estado: records[i].data.estado,
                    idtipoocorrencia: records[i].data.idtipoocorrencia,
                    titulo: records[i].data.titulo,
                    participacao: records[i].data.participacao,
                    datacriacao: records[i].data.datacriacao,
                    numcomments: records[i].data.numcomentarios,
                    numfotografias: records[i].data.numfotografias,
                    fotografia: records[i].data.fotografia,
                    days: records[i].data.days,
                    hours: records[i].data.hours,
                    minutes: records[i].data.minutes,
                    seconds: records[i].data.seconds,
                    nome: records[i].data.nome,
                    idutilizador: records[i].data.idutilizador,
                    proposta: null,
                    feature: f, // pode ser null
                    estadoStore: me.getStoreEstado(),
                    geodiscussao: true,
                    moderador: me.email
                });
                // me.down('#flow').add(newDiscussion);
                me.down('#flow').insert(0, newDiscussion);
                if (f) {
                    f.discussion = newDiscussion;
                }
            } else {
                f.discussion = null;
            }
        }
        me.down('#flow').doLayout();

        if (this.numOcorrenciasLoaded < total) {
            // console.log('Ler mais ocorrências');
            store.load({
                params: {
                    idplano: records[0].data.idplano,
                    start: this.numOcorrenciasLoaded,
                    limit: this.numOcorrenciasPerPage
                }
            });
        } else {
            // console.log('Não vai ler mais ocorrências');
        }

    },
    onDiscussaoGeograficaAfterRender: function (panel) {
        var me = this;
        var store = panel.getStoreOcorrencias();
        panel.numOcorrenciasLoaded = 0;
        panel.numOcorrenciasPerPage = 5;
        store.on({
            scope: panel,
            load: this.onOcorrenciaStoreLoad
        });

        var estore = panel.getStoreEstado();
        estore.on({
            scope: panel,
            load: this.onEstadoOcorrenciaStoreLoad
        });
        estore.load({
            params: {
                idplano: panel.idplano
            }
        });

        var task = new Ext.util.DelayedTask(function(){
            store.load({
                params: {
                    idplano: panel.idplano,
                    start: 0,
                    limit: 5
                }
            });
        });
        task.delay(500);

    },
    onEstadoOcorrenciaStoreLoad: function (store, records) {
        // console.log('onEstadoOcorrenciaStoreLoad ' + records.length);
        // console.log(store);
    }
});
