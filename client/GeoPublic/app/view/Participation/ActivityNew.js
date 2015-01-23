Ext.define('GeoPublic.view.Participation.ActivityNew', {
    extend: 'Ext.container.Container',
    alias: 'widget.activitynew',
    layout: {
        type: 'vbox',
        align: 'stretch',
        pack: 'start'
    },
    bodyCls: 'activity-panel',
    requires: ['GeoPublic.store.Ocorrencia'],
    // http://stackoverflow.com/questions/27333787/best-practice-to-have-the-same-view-and-store-multiple-times-in-extjs-4
    // http://stackoverflow.com/questions/27368951/are-stores-created-in-the-initcomponent-function-memory-leaks-once-the-component
    initComponent: function () {
        var me = this;
        //<debug>
        console.log(me.initialConfig.config);
        //</debug>
        me.idplano = me.initialConfig.config.idplano;
        me.itemId = 'activity-' + me.idplano;
        var storeId = me.itemId + '-store';
        //<debug>
        console.log('Ler as discussões de ', storeId, me.itemId);
        //</debug>
        me.store = Ext.StoreManager.lookup(storeId); // Ext.StoreManager.lookup(storeId);
        if (!Ext.isDefined(me.store)) {
            me.store = Ext.create('GeoPublic.store.Ocorrencia', Ext.apply({storeId: me.storeId, autoDestroy: true}));
        } else {
            //<debug>
            console.log('Falhou o teste === null');
            //</debug>
        }
        //<debug>
        console.log(me.store);
        //</debug>

        me.items = [{
            xtype: 'contribution',
            collapsible: true,
            collapsed: true,
            titleCollapse: true
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
    },
    getStore: function () {
        return this.store;
    }
});
