Ext.define('GeoPublic.controller.DiscussaoRegulamento', {
    extend: 'Ext.app.Controller',
    requires: ['GeoPublic.store.Ocorrencia'],
    // stores: ['Ocorrencia'],
    refs: [{ // Ext.ComponentQuery.query('app-main-map-panel toolbar')
        selector: 'viewport > tabpanel',
        ref: 'painelPrincipal' // gera um getPainelPrincipal
    }],
    init: function () {
        this.application.on({
            scope: this,
            loginComSucesso: this.onLoginComSucesso,
            logoutComSucesso: this.onLogoutComSucesso
        });
        this.control({
            'discussao-regulamento': {
                // 'beforerender' : this.onBemVindoPanelBeforeRender,
                'beforeactivate': this.onDiscussaoRegulamentoBeforeActivate,
                'resize': this.onDiscussaoRegulamentoResize,
                'afterrender': this.onDiscussaoRegulamentoAfterRender
            }
        }, this);},
    onLoginComSucesso: function () {
        var me = this;
        // console.log('GeoPublic.controller.DiscussaoRegulamento ' + 'onLoginComSucesso ');

        var tabPanel = me.getPainelPrincipal();
        // console.log('Existem ', tabPanel.items.length);
        for (var i = tabPanel.items.length-1; i>= 0; i--) {
            if (tabPanel.items.items[i].xtype.search(/^discussao-/) != -1) {
                //<debug>
                console.log('Vou remover o tab', i, tabPanel.items.items[i].xtype);
                //</debug>
                tabPanel.remove(i);
                var mesg = 'The discussion was closed on your login'.translate();
                mesg += '<br/>';
                mesg += 'You can reopen the discussion with participation privileges'.translate();
                Ext.example.msg('Discussion panel closed'.translate(), mesg);
            }
        }
    },
    onLogoutComSucesso: function () {
        var me = this;
        // console.log('GeoPublic.controller.DiscussaoRegulamento ' + 'onLogoutComSucesso ');

        var tabPanel = me.getPainelPrincipal();
        // console.log('Existem ', tabPanel.items.length);
        for (var i = tabPanel.items.length-1; i>= 0; i--) {
            if (tabPanel.items.items[i].xtype.search(/^discussao-/) != -1) {
                //<debug>
                console.log('Vou remover o tab', i, tabPanel.items.items[i].xtype);
                //</debug>
                tabPanel.remove(i);
                var mesg = 'The discussion was closed on your logout'.translate();
                mesg += '<br/>';
                mesg += 'You can reopen the discussion with read only privileges'.translate();
                Ext.example.msg('Discussion panel closed'.translate(), mesg);
            }
            // profile
            if (tabPanel.items.items[i].xtype == 'profile') {
                //<debug>
                console.log('Vou remover o tab', i, tabPanel.items.items[i].xtype);
                //</debug>
                tabPanel.remove(i);
                var mesg = 'The profile was closed on your logout'.translate();
                Ext.example.msg('Profile panel closed'.translate(), mesg);
            }
        }
    },
    onDiscussaoRegulamentoResize: function (panel) {
        var me = this;
        // console.log('onDiscussaoRegulamentoResize', panel.iddivcompare);
        var largura = panel.down('component#secretaria').getWidth();
        var altura = panel.down('component#secretaria').getHeight();
        // console.log('onDiscussaoRegulamentoResize Mergely component#secretaria: ', largura, altura);
        var idsec = '#' + panel.iddivcompare;
        if (!panel.mergelycriado) {
            $(idsec).mergely({
                width: 'auto', // largura,
                height: 'auto', // altura,
                autoupdate: false, // depois muda-se...
                change_timeout: 3600000, // depois muda-se...
                cmsettings: {
                    readOnly: true,
                    lineWrapping: true,
                    width: 'auto'
                },
                lhs: function (setValue) {
                    setValue(panel.proposta);
                },
                rhs: function (setValue) {
                    setValue('');
                    // setValue(panel.proposta);
                }
            });
            panel.mergelycriado = true;
            // $(idsec).mergely('cm', 'rhs').setOption('readOnly', false);
        }
    },
    onDiscussaoRegulamentoBeforeActivate: function (panel, eOpts) {
        var idsec = '#' + panel.iddivcompare;
        // console.log('onDiscussaoRegulamentoBeforeActivate', idsec);
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
        //
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

    },
    onEstadoOcorrenciaStoreLoad: function (store, records) {
        // console.log('onEstadoOcorrenciaStoreLoad ' + records.length);
        // console.log(store);
    },
    onOcorrenciaStoreLoad: function (store, records) {
        //<debug>
        console.log('onOcorrenciaStoreLoad ' + records.length);
        //</debug>
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
                numfotografias: records[i].data.numfotografias,
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
                geodiscussao: false,
                moderador: me.email
            });
            // me.down('#flow').add(newDiscussion);
            me.down('#flow').insert(0, newDiscussion);
        }
        me.down('#flow').doLayout();
        // console.log('onOcorrenciaStoreLoad terminou');
    }
});
