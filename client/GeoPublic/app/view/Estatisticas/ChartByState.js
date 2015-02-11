Ext.define('GeoPublic.view.Estatisticas.ChartByState', {
    extend: 'Ext.chart.Chart',
    alias: 'widget.startpanelchartbystate',
    animate: true,
    shadow: true,
    legend: {
        position: 'right'
    },
    insetPadding: 60,
    // theme: 'Base:gradients',
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
    store: 'Estatisticas.ChartByState',
    series: [{
        type: 'pie',
        field: 'count',
        showInLegend: true,
        donut: 35,
        /*
         tips : {
         trackMouse : true,
         width : 140,
         height : 28,
         renderer : function(storeItem, item) {
         //calculate percentage.
         var total = 0;
         this.store.each(function(rec) {
         total += rec.get('count');
         });
         this.setTitle(storeItem.get('state') + ': ' + Math.round(storeItem.get('count') / total * 100) + '%');
         }
         },
         */
        highlight: {
            segment: {
                margin: 20
            }
        },
        label: {
            field: 'state',
            display: 'rotate',
            contrast: true,
            font: '12px Arial'
        }
    }],
    items: [/*{
        type: 'text',
        text: 'Estado das participações',
        font: '14px Arial',
        width: 280,
        height: 30,
        x: 50, //the sprite x position
        y: 10 //the sprite y position
    }*/],
    initComponent: function () {
        this.callParent(arguments);
    }
});
