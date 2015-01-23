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
				// 'render' : this.onStartPanelRender
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
                cmsettings: {
                    readOnly: false,
                    lineWrapping: true,
                    width: 'auto'
                },
                lhs: function (setValue) {
                    setValue(panel.proposta);
                },
                rhs: function (setValue) {
                    // setValue(proposta);
                    setValue(panel.proposta);
                }
            });
            panel.mergelycriado = true;
        }

    },
    onDiscussaoRegulamentoAfterRender : function(panel) {
        var me = this;
        // console.log('onDiscussaoRegulamentoAfterRender', panel.getWidth());

        var largura = panel.down('component#secretaria').getWidth();
        var altura = panel.down('component#secretaria').getHeight();
        console.log('onDiscussaoRegulamentoAfterRender Mergely component#secretaria: ', largura, altura);

        /*
        // Ext.ComponentQuery.query('#compare25')

        */



    }
});
