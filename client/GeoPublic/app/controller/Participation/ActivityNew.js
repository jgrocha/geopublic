Ext.define('GeoPublic.controller.Participation.ActivityNew', {
    extend: 'Ext.app.Controller',
    requires: ['GeoPublic.store.Ocorrencia', 'GeoPublic.view.Participation.Discussion'],
    // stores : ['Ocorrencia'], // getOcorrenciaStore() hummm...
    // Ext.ComponentQuery.query('profile checkbox')
    refs: [{
        ref: 'todasDiscussoes', // getTodasDiscussoes
        selector: 'activity #flow'
    }],
    init: function () {
        console.log('O controlador GeoPublic.controller.Participation.ActivityNew init...');
        this.control({
            'activitynew': {
                'afterrender': this.onActivityNewPanelAfterRender
            }
        }, this);
    },
    onLaunch: function () {
        console.log('...O controlador GeoPublic.controller.Participation.ActivityNew onLaunch.');
    },
    onOcorrenciaStoreLoad: function (store, records) {
        console.log('onOcorrenciaStoreLoad ' + records.length);
        // o scope passado é o do painel
        // this === panel
        var me = this;
        // console.log(this);
        var start = 0;
        var limit = records.length <= 10 ? records.length : 10;
        for (var i = start; i < limit; i++) {
            // criar os paineis de discussao
            var newDiscussion = new GeoPublic.view.Participation.Discussion({
                id_ocorrencia: records[i].data.id,
                idplano: records[i].data.idplano,
                idpromotor: 5126,
                idestado: records[i].data.idestado,
                idtipoocorrencia: records[i].data.idtipoocorrencia,
                titulo: records[i].data.titulo,
                participacao: records[i].data.participacao,
                datacriacao: records[i].data.datacriacao,
                numcomments: records[i].data.numcomentarios,
                fotografia: records[i].data.fotografia,
                days: records[i].data.days,
                hours: records[i].data.hours,
                minutes: records[i].data.minutes,
                seconds: records[i].data.seconds,
                nome: records[i].data.nome,
                idutilizador: records[i].data.idutilizador,
                feature: null
            });
            me.down('#flow').add(newDiscussion);
            // me.getTodasDiscussoes().insert(0, newDiscussion);
            // me.getTodasDiscussoes().doLayout();
        }
        me.down('#flow').doLayout();
    },
    onActivityNewPanelAfterRender: function (panel, options) {
        console.log('controlador GeoPublic.controller.Participation.ActivityNew onActivityNewPanelAfterRender');

        var store = panel.getStore();
        store.on({
            scope: panel,
            load: this.onOcorrenciaStoreLoad
        });
        store.load({
            params: {
                idplano: panel.idplano
            }
        });
        // panel.updateLayout();
    }
});