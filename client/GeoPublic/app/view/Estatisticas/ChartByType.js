Ext.define('GeoPublic.view.Estatisticas.ChartByType', {
    extend: 'Ext.chart.Chart',
    alias: 'widget.startpanelchartbytype',
    animate: true,
    shadow: true,
    axes: [{
        type: 'Numeric',
        position: 'bottom',
        fields: ['count'],
        label: {
            renderer: Ext.util.Format.numberRenderer('0')
        },
        title: 'Número de participações',
        grid: true,
        minimum: 0,
        adjustMaximumByMajorUnit: true
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
    store: 'Estatisticas.ChartByType',
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
        yField: ['count']
    }],
    initComponent: function () {
        this.callParent(arguments);
    }
});
