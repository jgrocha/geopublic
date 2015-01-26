Ext.define('GeoPublic.controller.DiscussaoRegulamento', {
	extend : 'Ext.app.Controller',
    requires : ['GeoPublic.store.Ocorrencia'],
    // stores: ['Ocorrencia'],
	init : function() {
        /*
        this.getOcorrenciaStore().on({
            scope: this,
            load: this.onOcorrenciaStoreLoad
        });
        */
		this.control({
			'discussao-regulamento' : {
				// 'beforerender' : this.onBemVindoPanelBeforeRender,
				'beforeactivate' : this.onDiscussaoRegulamentoBeforeActivate,
                'resize' : this.onDiscussaoRegulamentoResize,
                'afterrender' : this.onDiscussaoRegulamentoAfterRender
			}
		}, this);
	},
    onDiscussaoRegulamentoResize : function(panel) {
        var me = this;
        console.log('onDiscussaoRegulamentoResize', panel.iddivcompare);
        var largura = panel.down('component#secretaria').getWidth();
        var altura = panel.down('component#secretaria').getHeight();
        console.log('onDiscussaoRegulamentoResize Mergely component#secretaria: ', largura, altura);
        var idsec = '#' + panel.iddivcompare;
        if (!panel.mergelycriado) {
            $(idsec).mergely({
                width: 'auto', // largura,
                height: 'auto', // altura,
                autoupdate: false, // depois muda-se...
                cmsettings: {
                    readOnly: true,
                    lineWrapping: true,
                    width: 'auto'
                },
                lhs: function (setValue) {
                    setValue(panel.proposta);
                } /*,
                rhs: function (setValue) {
                    setValue('');
                    // setValue(panel.proposta);
                } */
            });
            panel.mergelycriado = true;
            // $(idsec).mergely('cm', 'rhs').setOption('readOnly', false);
        }
    },
    onDiscussaoRegulamentoBeforeActivate: function (panel, eOpts) {
        var idsec = '#' + panel.iddivcompare;
        console.log('onDiscussaoRegulamentoBeforeActivate', idsec);
        $(idsec).mergely('resize');
    },
    onDiscussaoRegulamentoAfterRender: function (panel) {
        var me = this;
        var store = panel.getStoreOcorrencias();
        store.on({
            scope: panel,
            load: this.onOcorrenciaStoreLoad
        });
        store.load({
            params: {
                idplano: panel.idplano
            }
        });
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
                fotografia: records[i].data.fotografia,
                days: records[i].data.days,
                hours: records[i].data.hours,
                minutes: records[i].data.minutes,
                seconds: records[i].data.seconds,
                nome: records[i].data.nome,
                idutilizador: records[i].data.idutilizador,
                proposta: records[i].data.proposta,
                feature: null,
                estadoStore: me.getStoreEstado(),
                geodiscussao : false
            });
            me.down('#flow').add(newDiscussion);
        }
        me.down('#flow').doLayout();
    }
});
