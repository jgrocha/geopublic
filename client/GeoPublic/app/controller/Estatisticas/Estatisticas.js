Ext.define('GeoPublic.controller.Estatisticas.Estatisticas', {
    extend: 'Ext.app.Controller',
    stores: ['Estatisticas.Promotor', 'Estatisticas.Plano', 'Estatisticas.ChartByType', 'Estatisticas.ChartByState', 'Estatisticas.ChartByAtividade'], // getEstatisticasPromotorStore(), getEstatisticasPlanoStore()
    // Ext.ComponentQuery.query('grid-promotor gridpanel#promotor button#remove')
    refs: [{
        selector: 'estatisticas gridpanel#promotor',
        ref: 'gridPromotor' // gera um getGridPromotor
    }, {
        selector: 'estatisticas gridpanel#plano',
        ref: 'gridPlano' // gera um getGridPlano
    }, {
        selector: 'estatisticas form#detalhes',
        ref: 'formDetalhes' // gera um getFormDetalhes()
    }, {
        selector: 'estatisticas graficos startpanelchartbytype',
        ref: 'charByType' // gera um getCharByType()
    }],
    init: function () {
        this.control({
            'estatisticas': {
                'afterrender': this.onEstatisticasAfterRender
            },
            'estatisticas gridpanel#promotor': {
                selectionchange: this.onGridPromotorSelect
            },
            "estatisticas gridpanel#plano": {
                // itemclick : this.onGridPlanoItemClick
                selectionchange: this.onGridPlanoSelect
            }
        });
        this.getEstatisticasPromotorStore().addListener("load", this.onEstatisticasPromotorStoreLoad, this);
        this.getEstatisticasPlanoStore().addListener("load", this.onEstatisticasPlanoStoreLoad, this);
        this.getEstatisticasChartByTypeStore().addListener("load", this.onEstatisticasChartByTypeStoreLoad, this);
    },
    onEstatisticasAfterRender: function (panel, eOpts) {
        this.getEstatisticasPromotorStore().load();
    },
    onEstatisticasChartByTypeStoreLoad: function (store, records) {
        if (store.getCount() > 0) {
            this.getCharByType().setVisible(true);
        } else {
            this.getCharByType().setVisible(false);
        }
    },
    onEstatisticasPromotorStoreLoad: function (store, records) {
        var sm = this.getGridPromotor().getSelectionModel();
        if (store.getCount() > 0) {
            sm.select(0);
        }
    },
    onEstatisticasPlanoStoreLoad: function (store, records) {
        var sm = this.getGridPlano().getSelectionModel();
        if (store.getCount() > 0) {
            sm.select(0);
        }
    },
    onGridPromotorSelect: function (selModel, selection) {
        if (selection.length == 1) {
            var store = this.getEstatisticasPlanoStore();
            store.load({
                id: selection[0].data.id
            });
        }
    },
    onGridPlanoSelect: function (selModel, selection) {
        if (selection.length == 1) {
            var form = this.getFormDetalhes();
            form.getForm().loadRecord(selection[0]);
            var storeByState = this.getEstatisticasChartByStateStore();
            storeByState.load({
                params: {
                    idplano: selection[0].data.id
                }
            });
            var storeByAtividade = this.getEstatisticasChartByAtividadeStore();
            storeByAtividade.load({
                params: {
                    idplano: selection[0].data.id
                }
            });
            // manda-se ler o store. Se retornar linhas, mostra-se o gráfico no evento onload
            var storeByType = this.getEstatisticasChartByTypeStore();
            storeByType.load({
                params: {
                    idplano: selection[0].data.id
                }
            });
        }
    }
});
