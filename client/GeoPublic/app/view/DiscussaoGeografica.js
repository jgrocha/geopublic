Ext.define('GeoPublic.view.DiscussaoGeografica', {
    extend: 'Ext.container.Container',
    requires : ['GeoPublic.view.Participation.ActivityNew', 'GeoPublic.view.Mapa', 'GeoPublic.store.Ocorrencia', 'GeoPublic.store.Participation.EstadoCombo'],
    alias: 'widget.discussao-geografica',
    layout: 'border',
    closable: true,
    glyph: 0xf041,
    // title: 'Regime Jurídico da Urbanização e Edificação',
    // style : 'padding:5px',
    initComponent: function () {
        var me = this;
        //<debug>
        console.log('GeoPublic.view.DiscussaoGeografica: this.initialConfig');
        console.log(this.initialConfig);
        //</debug>

        // me.itemId = 'discussao-geografica-' + me.idplano;
        var storeId = 'discussao-geografica-' + me.idplano + '-ocorrencia-store';
        //<debug>
        console.log('Ler as discussões de ', storeId);
        //</debug>
        me.store = Ext.StoreManager.lookup(storeId); // Ext.StoreManager.lookup(storeId);
        if (!Ext.isDefined(me.store)) {
            me.store = Ext.create('GeoPublic.store.Ocorrencia', Ext.apply({storeId: storeId, autoDestroy: true}));
        }

        var storeEstadoId = 'discussao-geografica-' + me.idplano + '-estadoocorrencia-store';
        //<debug>
        console.log('Ler os estados possíveis de ', storeEstadoId);
        //</debug>
        me.storeEstado = Ext.StoreManager.lookup(storeEstadoId); // Ext.StoreManager.lookup(storeId);
        if (!Ext.isDefined(me.storeEstado)) {
            me.storeEstado = Ext.create('GeoPublic.store.Participation.EstadoCombo', Ext.apply({storeId: storeEstadoId, autoDestroy: false}));
            // ao destruir uma discussão com este store na combo, o store era destruído
            // tem mesmo que ser autoDestroy: false
        }

        /*
        // TODO
        // load do store
        this.getFotografiatmp().store.load();
        */

        this.items = [{
            region: 'center',
            xtype: 'mapa',
            collapsible: false,
            // html: 'Janela com o mapa de suporte à discussão do aplno ' + this.initialConfig.designacao,
            config : {
                idplano : this.initialConfig.idplano,
                idpromotor : this.initialConfig.idpromotor,
                title: this.initialConfig.designacao,
                designacao: this.initialConfig.designacao,
                descricao: this.initialConfig.descricao,
                the_geom: this.initialConfig.the_geom
            }
        }, {
            xtype: 'activitynew',
            region: 'east',
            // collapsible : false,
            split: true,
            width: 420,
            config : {
                idplano : this.initialConfig.idplano,
                idpromotor : this.initialConfig.idpromotor,
                closed : this.initialConfig.closed,
                geodiscussao : true
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
