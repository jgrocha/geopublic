Ext.define('GeoPublic.controller.Estatisticas.Estatisticas', {
	extend : 'Ext.app.Controller',
	stores : ['Estatisticas.Promotor', 'Estatisticas.Plano', 'Estatisticas.ChartByType', 'Estatisticas.ChartByState', 'Estatisticas.ChartByAtividade'], // getEstatisticasPromotorStore(), getEstatisticasPlanoStore()
	// Ext.ComponentQuery.query('grid-promotor gridpanel#promotor button#remove')
	refs : [{
		selector : 'estatisticas gridpanel#promotor',
		ref : 'gridPromotor' // gera um getGridPromotor
	}, {
        selector : 'estatisticas gridpanel#plano',
        ref : 'gridPlano' // gera um getGridPlano
    }, {
        selector : 'estatisticas form#detalhes',
        ref : 'formDetalhes' // gera um getFormDetalhes()
    }],
	init : function() {
        console.log('init GeoPublic.controller.Estatisticas.Estatisticas');
		this.control({
            'estatisticas' : {
                'afterrender': this.onEstatisticasAfterRender
            },
            'estatisticas gridpanel#promotor' : {
                selectionchange : this.onGridPromotorSelect
            },
			"estatisticas gridpanel#plano" : {
                // itemclick : this.onGridPlanoItemClick
                selectionchange : this.onGridPlanoSelect
			}
		});
        this.getEstatisticasPromotorStore().addListener("load", this.onEstatisticasPromotorStoreLoad, this);
        this.getEstatisticasPlanoStore().addListener("load", this.onEstatisticasPlanoStoreLoad, this);
	},
    onEstatisticasAfterRender: function (panel, eOpts) {
        console.log('onEstatisticasAfterRender');
        this.getEstatisticasPromotorStore().load();
    },
    onEstatisticasPromotorStoreLoad: function(store, records) {
        console.log('onEstatisticasPromotorStoreLoad: ' + records.length + ' registos foram devolvidos');
        var sm = this.getGridPromotor().getSelectionModel();
        if (store.getCount() > 0) {
            sm.select(0);
        }
    },
    onEstatisticasPlanoStoreLoad: function(store, records) {
        console.log('onEstatisticasPlanoStoreLoad: ' + records.length + ' registos foram devolvidos');
        var sm = this.getGridPlano().getSelectionModel();
        if (store.getCount() > 0) {
            sm.select(0);
        }
    },
    onGridPromotorSelect : function(selModel, selection) {
        if (selection.length == 1) {
            console.log('Ler os planos do promotor ', selection[0].data.id, ' meramente para fins estatísticos');
            var store = this.getEstatisticasPlanoStore();
            store.load({
                id : selection[0].data.id
            });
        }
    },
    onGridPlanoSelect : function(selModel, selection) {
        console.log('onGridPlanoSelect', selection);
        if (selection.length == 1) {
            var form = this.getFormDetalhes();
            form.getForm().loadRecord(selection[0]);

            var storeByState = this.getEstatisticasChartByStateStore();
            storeByState.load({
                params: {
                    idplano : selection[0].data.id
                }
            });

            /*
             var storeByType = this.getEstatisticasChartByTypeStore();
             storeByType.load({
             params: {
             idplano : selection[0].data.id
             }
             });
             */

            var storeByAtividade = this.getEstatisticasChartByAtividadeStore();
            storeByAtividade.load({
                params: {
                    idplano : selection[0].data.id
                }
            });
        }
    },
    onGridPlanoItemClick : function(dataview, record, item, index, e, eOpts) {
		console.log('onPlanoGridItemClick', record);
		var form = this.getFormDetalhes();
		form.getForm().loadRecord(record);
		// form.enable();

        var storeByState = this.getEstatisticasChartByStateStore();
        storeByState.load({
            params: {
                idplano : record.data.id
            }
        });

        /*
        var storeByType = this.getEstatisticasChartByTypeStore();
        storeByType.load({
            params: {
                idplano : record.data.id
            }
        });
        */

        var storeByAtividade = this.getEstatisticasChartByAtividadeStore();
        storeByAtividade.load({
            params: {
                idplano : record.data.id
            }
        });

	},
	onLaunch : function() {
		var me = this;
		console.log('...O controlador GeoPublic.controller.Estatisticas.Estatisticas arrancou.');
	}
});
