Ext.define('GeoPublic.view.DiscussaoRegulamento', {
    extend: 'Ext.container.Container',
    requires : ['GeoPublic.view.Participation.ActivityNew', 'GeoPublic.store.Ocorrencia'],
    alias: 'widget.discussao-regulamento',
    layout: 'border',
    closable: true,
    // title: 'Regime Jurídico da Urbanização e Edificação',
    // style : 'padding:5px',
    initComponent: function () {
        var me = this;
        //<debug>
        console.log(this.initialConfig);
        //</debug>

        me.itemId = 'discussao-regulamento-' + me.idplano;
        var storeId = me.itemId + '-ocorrencia-store';
        //<debug>
        console.log('Ler as discussões de ', storeId, me.itemId);
        //</debug>
        me.store = Ext.StoreManager.lookup(storeId); // Ext.StoreManager.lookup(storeId);
        if (!Ext.isDefined(me.store)) {
            me.store = Ext.create('GeoPublic.store.Ocorrencia', Ext.apply({storeId: me.storeId, autoDestroy: true}));
        }

        var storeEstadoId = me.itemId + '-estadoocorrencia-store';
        //<debug>
        console.log('Ler os estados possíveis de ', storeEstadoId, me.itemId);
        //</debug>
        me.storeEstado = Ext.StoreManager.lookup(storeEstadoId); // Ext.StoreManager.lookup(storeId);
        if (!Ext.isDefined(me.storeEstado)) {
            me.storeEstado = Ext.create('GeoPublic.store.Participation.EstadoCombo', Ext.apply({storeId: storeEstadoId, autoDestroy: true}));
        }
        me.storeEstado.load({
            params: {
                idplano: me.idplano
            }
        });

        this.mergelycriado = false;
        this.iddivcompare = 'compare-' + this.initialConfig.idplano;

        this.items = [{
            region: 'center',
            collapsible: false,
            // html: 'Janela com o texto do regulamento',
            layout: 'border',
            items: [{
                xtype: 'component',
                itemId: 'secretaria',
                layout: 'fit',
                region: 'center',
                // style: {background: 'red'},
                id: this.iddivcompare,
                config : {
                    idplano : this.initialConfig.idplano,
                    idpromotor : this.initialConfig.idpromotor,
                    title: this.initialConfig.designacao,
                    designacao: this.initialConfig.designacao,
                    descricao: this.initialConfig.descricao,
                    proposta: this.initialConfig.proposta,
                    alternativeproposta: this.initialConfig.alternativeproposta
                }
            }]
        }, {
            xtype: 'activitynew',
            region: 'east',
            // collapsible : false,
            split: true,
            width: 400,
            config : {
                idplano : this.initialConfig.idplano,
                idpromotor : this.initialConfig.idpromotor,
                geodiscussao : false
            }
        }];
        this.callParent(arguments);
    },
    getStoreOcorrencias: function () {
        return this.store;
    },
    getStoreEstado: function () {
        return this.storeEstado;
    }
});
