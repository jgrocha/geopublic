/*
O meu primeiro fiddle :-)
 */
Ext.define('GeoPublic.view.Estatisticas.ChartByAtividade', {
    extend: 'Ext.chart.Chart',
    alias: 'widget.startpanelchartbyatividade',
    animate: true,
    shadow: true,
    axes: [{
        type: 'Numeric',
        position: 'bottom',
        fields: ['count'],
        label: {
            renderer: Ext.util.Format.numberRenderer('0')
        },
        title: 'Count'.translate(),
        grid: true,
        majorTickSteps: 1,
        minimum: 0
        // maximum: 15
    }, {
        type: 'Category',
        position: 'left',
        fields: ['type']
        // title : 'Tipo de Ocorrência'
    }],
    theme: 'Base:gradients',
    background: {
        gradient: {
            id: 'backgroundGradient',
            angle: 45,
            stops: {
                0: {
                    color: '#ffffff'
                },
                100: {
                    color: '#eaf1f8'
                }
            }
        }
    },
    store: 'Estatisticas.ChartByAtividade',
    series: [{
        type: 'bar',
        axis: 'bottom',
        highlight: true,
        tips: {
            trackMouse: true,
            width: 140,
            height: 28,
            renderer: function (storeItem, item) {
                this.setTitle(storeItem.get('type') + ': ' + storeItem.get('count') + ' participações');
            }
        },
        label: {
            display: 'insideEnd',
            field: 'count',
            renderer: Ext.util.Format.numberRenderer('0'),
            orientation: 'horizontal',
            color: '#333',
            'text-anchor': 'middle'
        },
        xField: 'type',
        yField: ['count'],
        renderer: function(sprite, record, attr, index, store) {
            return Ext.apply(attr, {
                fill: 'rgb(249, 153, 0)'
            });
        }
    }],
    initComponent: function () {
        this.callParent(arguments);
    }
});
