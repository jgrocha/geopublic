Ext.define('GeoPublic.view.BackOffice.Sessao', {
    extend: 'Ext.container.Container',
    xtype: 'grid-sessao',
    requires: ['Ext.grid.Panel', 'Ext.grid.column.Number', 'Ext.form.field.Number',
        'Ext.toolbar.Paging', 'Ext.form.field.Checkbox',
        'Ext.grid.column.Action',
        'Ext.ux.LiveSearchGridPanel',
        'Ext.ux.grid.FiltersFeature'],
    title: 'Last access'.translate(),
    layout: 'border',
    style: 'padding:5px',

    initComponent: function () {
        var estore = Ext.getStore('BackOffice.Sessao');
        estore.proxy.setExtraParam("userid", GeoPublic.LoggedInUser.data.id);
        estore.load();
        var filtersCfg = {
            ftype: 'filters',
            autoReload: true, // false,
            local: false,
            encode: true,
            menuFilterText : 'Filter'.translate()
        };

        this.items = [{
            xtype: 'gridpanel',
            region: 'center',
            // itemId: 'todoGrid',
            store: 'BackOffice.Sessao',
            features: [filtersCfg],
            dockedItems: [{
                xtype: 'pagingtoolbar',
                store: 'BackOffice.Sessao', // same store GridPanel is using
                dock: 'bottom',
                displayInfo: true
            }],
            columns: [{
                dataIndex: 'id',
                text: 'User ID'.translate(),
                width: 80,
                filter: {
                    type: 'numeric'
                }
            }, {
                dataIndex: 'datalogin',
                xtype: 'datecolumn', // fundamental :-)
                text: 'Login date'.translate(),
                width: 160,
                format: 'Y-m-d H:i:s',
                filter: {
                    type: 'date',
                    afterText: 'After day'.translate(),
                    beforeText: 'Before day'.translate(),
                    dateFormat: 'Y-m-d',
                    onText: 'On day'.translate()
                }
            }, {
                dataIndex: 'ip',
                text: 'IP address'.translate(),
                width: 120,
                filter: {
                    type: 'string'
                }
            }, {
                dataIndex: 'hostname',
                text: 'Hostname'.translate(),
                width: 180,
                filter: {
                    type: 'string'
                }
            }, {
                dataIndex: 'browser',
                text: 'Browser'.translate(),
                flex: 1,
                filter: {
                    type: 'string'
                }
            }]
        }];
        this.callParent(arguments);
    }
});
