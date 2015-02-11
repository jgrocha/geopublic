Ext.define('GeoPublic.view.Estatisticas.Estatisticas', {
    extend: 'Ext.panel.Panel',
    requires: ['GeoPublic.view.Estatisticas.Graficos'],
    alias: 'widget.estatisticas',
    title: 'Statistics'.translate(),
    autoScroll: true,
    width: 900,
    initComponent: function () {
        this.callParent(arguments);
    },
    layout: {
        type: 'vbox',
        // padding : '5',
        align: 'center'
    },
    defaults: {
        margin: '0 0 20 0'
    },
    items: [{
        layout: 'column',
        width: 900,
        title: 'Estatísticas do envolvimento da população por plano',
        items: [{
            columnWidth: 1 / 3,
            padding: '10 10 10 10',
            xtype: 'gridpanel',
            itemId: 'promotor',
            store: 'Estatisticas.Promotor',
            columns: [{
                dataIndex: 'designacao',
                text: 'Instituição',
                flex: 1
            }],
            selType: 'rowmodel'
        }, {
            columnWidth: 1 / 3,
            padding: '10 10 10 10',
            height: 200,
            xtype: 'gridpanel',
            itemId: 'plano',
            store: 'Estatisticas.Plano',
            columns: [{
                dataIndex: 'designacao',
                text: 'Plano',
                flex: 1
            }],
            selType: 'rowmodel'
        }, {
            columnWidth: 1 / 3,
            padding: '10 10 10 10',
            xtype: 'form',
            bodyStyle: 'background-color: #FFDB4D', // amarelo claro
            // disabled : true,
            itemId: 'detalhes',
            layout: {
                type: 'vbox',
                align: 'stretch'  // Child items are stretched to full width
            },
            items: [{
                xtype: 'datefield',
                fieldLabel: 'From'.translate(),
                disabled: true,
                name: 'inicio' // , format : 'Y-m-d'
            },  {
                xtype: 'datefield',
                fieldLabel: 'Until'.translate(),
                disabled: true,
                name: 'fim' // , format : 'Y-m-d'
            }, {
                xtype: 'textfield',
                fieldLabel: 'Responsible'.translate(),
                disabled: true,
                name: 'responsavel'
            }, {
                xtype: 'textfield',
                fieldLabel: 'Contact'.translate(),
                disabled: true,
                name: 'email'
            }]
        }]
    }, {
        width: 900,
        xtype: 'graficos'
    } /*, {
        width: 900,
        title: 'Relatório do responsável',
        html: 'A todo o tamanho'
    }*/]
});
