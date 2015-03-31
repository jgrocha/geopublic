Ext.define('GeoPublic.view.BackOffice.Sessao', {
    extend: 'Ext.container.Container',
    xtype: 'grid-sessao',
    requires: ['Ext.grid.Panel', 'Ext.grid.column.Number', 'Ext.form.field.Number',
        'Ext.toolbar.Paging', 'Ext.form.field.Checkbox',
        'Ext.grid.column.Action',
        'Ext.ux.LiveSearchGridPanel',
        'Ext.ux.grid.FiltersFeature'],
    title: 'Últimos acessos',
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
            menuFilterText : 'Filtrar'
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
                text: 'Id Utilizador',
                width: 80,
                filter: {
                    type: 'numeric'
                }
            }, {
                dataIndex: 'datalogin',
                xtype: 'datecolumn', // fundamental :-)
                text: 'Data/hora de login',
                width: 140,
                format: 'Y-m-d H:i:s',
                filter: {
                    type: 'date',
                    afterText : 'Depois de',
                    beforeText : 'Antes de',
                    dateFormat : 'Y-m-d',
                    onText : 'No dia'
                }
            }, {
                dataIndex: 'ip',
                text: 'IP address',
                width: 120,
                filter: {
                    type: 'string'
                }
            }, {
                dataIndex: 'hostname',
                text: 'Nome da máquina',
                width: 180,
                filter: {
                    type: 'string'
                }
            }, {
                dataIndex: 'browser',
                text: 'Navegador',
                flex: 1,
                filter: {
                    type: 'string'
                }
            }]
        }];
        this.callParent(arguments);
    }
});
