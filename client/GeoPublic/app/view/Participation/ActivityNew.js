Ext.define('GeoPublic.view.Participation.ActivityNew', {
    extend: 'Ext.container.Container',
    alias: 'widget.activitynew',
    layout: {
        type: 'vbox',
        align: 'stretch',
        pack: 'start'
    },
    bodyCls: 'activity-panel',
    initComponent: function () {
        var me = this;
        me.idplano = me.initialConfig.config.idplano;
        me.itemId = 'activity-' + me.idplano;
        me.geodiscussao = me.initialConfig.config.geodiscussao;
        me.items = [{
            xtype: 'contribution',
            collapsible: true,
            collapsed: true,
            titleCollapse: true,
            config : {
                idplano : me.initialConfig.config.idplano,
                idpromotor : me.initialConfig.config.idpromotor,
                geodiscussao: me.initialConfig.config.geodiscussao
            }
        }, {
            flex: 1,
            defaultType: 'container',
            itemId: 'flow',
            autoScroll: true,
            items: [{
                layout: 'fit',
                // minWidth : 200,
                // minHeight : 200,
                defaultType: 'container',
                items: [/*{
                 xtype : 'discussion'
                 }, {
                 xtype : 'discussion'
                 }, {
                 xtype : 'discussion'
                 }, {
                 xtype : 'discussion'
                 }, {
                 xtype : 'discussion'
                 }, {
                 xtype : 'discussion'
                 }, {
                 xtype : 'discussion'
                 } */]
            }]

        }];
        me.callParent(arguments);
    }
});
