Ext.define('GeoPublic.view.Estatisticas.Graficos', {
	extend : 'Ext.panel.Panel',
    requires: ['GeoPublic.view.Estatisticas.ChartByState', 'GeoPublic.view.Estatisticas.ChartByType', 'GeoPublic.view.Estatisticas.ChartByAtividade'],
	alias : 'widget.graficos',
	title : 'Gráficos',
	minHeight : 290,
	// itemId : 'estatisticas',
    layout: {
        type:'vbox',
        padding:'5',
        align:'center'
    },
	defaults : {
		margin : '10 0 0 0'
	},
	initComponent : function() {
		var me = this;
		console.debug(this.initialConfig);

		console.log('Abrir com o plano ' + this.initialConfig.idplano + ' denominado ' + this.initialConfig.designacao);

		// this.itemId = 'StartPlanoDescricao-' + this.initialConfig.id;
		this.items = [{
            xtype : 'startpanelchartbyatividade',
            layout : 'fit',
            width : 600,
            height : 280,
            config : {
                idplano : 1 // this.idplano
            }
        }, {
			xtype : 'startpanelchartbystate',
			layout : 'fit',
			width : 600,
			height : 320,
			config : {
				idplano : 1 // this.idplano
			}
		}, {
            xtype : 'startpanelchartbytype',
            layout : 'fit',
            width : 600,
            height : 420,
            config : {
                idplano : 1 // this.idplano
            }
        }];
		this.callParent(arguments);
	}
});
