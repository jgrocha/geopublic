Ext.define('GeoPublic.view.BackOffice.Permission', {
    extend: 'Ext.container.Container',
    alias: 'widget.permissoes',
    requires: ['Ext.grid.Panel', 'Ext.grid.column.Number', 'Ext.form.field.Number',
        'Ext.toolbar.Paging', 'Ext.form.field.Checkbox',
        'Ext.grid.column.Action',
        'Ext.ux.LiveSearchGridPanel',
        'Ext.ux.grid.FiltersFeature'],
    title: 'Permissões',
    layout: 'column',
    style: 'padding:5px',

    initComponent: function () {

        var gstore = Ext.getStore('BackOffice.Grupo');
        // gstore.proxy.setExtraParam("userid", GeoPublic.LoggedInUser.data.id);
        gstore.load();
        var mstore = Ext.getStore('BackOffice.Menu');
        // mstore.proxy.setExtraParam("userid", GeoPublic.LoggedInUser.data.id);
        mstore.load();
        var pstore = Ext.getStore('BackOffice.Permissao');
        // gstore.proxy.setExtraParam("userid", GeoPublic.LoggedInUser.data.id);
        pstore.load();

        var gridGrupo = {
            title: 'Grupos',
            columnWidth: .3,
            style: 'padding:5px',
            xtype: 'gridpanel',
            itemId: 'grid-group',
            region: 'center',
            // itemId: 'todoGrid',
            store: 'BackOffice.Grupo',
            dockedItems: [{
                xtype: 'pagingtoolbar',
                store: 'BackOffice.Grupo', // same store GridPanel is using
                dock: 'bottom',
                displayInfo: true
            }],
            columns: [{
                dataIndex: 'id',
                text: 'Id',
                width: 80,
                filter: {
                    type: 'numeric'
                }
            }, {
                dataIndex: 'nome',
                text: 'Nome',
                width: 120,
                filter: {
                    type: 'string'
                }
            }],
            selModel: {  allowDeselect: true }
        };

        var gridPermissao = {
            title: 'Permissões',
            columnWidth: .3,
            style: 'padding:5px',
            xtype: 'gridpanel',
            itemId: 'grid-permission',
            region: 'center',
            // itemId: 'todoGrid',
            store: 'BackOffice.Permissao',
            dockedItems: [{
                xtype: 'pagingtoolbar',
                store: 'BackOffice.Permissao', // same store GridPanel is using
                dock: 'bottom',
                displayInfo: true
            }],
            columns: [{
                dataIndex: 'idgrupo',
                text: 'Grupo',
                width: 80,
                hidden: true,
                filter: {
                    type: 'numeric'
                }
            }, {
                dataIndex: 'idmenu',
                text: 'Menu',
                width: 120,
                hidden: true,
                filter: {
                    type: 'string'
                }
            }, {
                dataIndex: 'nome',
                text: 'Group',
                width: 120,
                filter: {
                    type: 'string'
                }
            }, {
                dataIndex: 'titulo',
                text: 'Menu',
                width: 120,
                filter: {
                    type: 'string'
                }
            }]
        };

        var gridMenu = {
            title: 'Menus disponíveis',
            columnWidth: .4,
            style: 'padding:5px',
            xtype: 'gridpanel',
            itemId: 'grid-menu',
            region: 'center',
            // itemId: 'todoGrid',
            store: 'BackOffice.Menu',
            dockedItems: [{
                xtype: 'pagingtoolbar',
                store: 'BackOffice.Menu', // same store GridPanel is using
                dock: 'bottom',
                displayInfo: true
            }],
            columns: [{
                dataIndex: 'id',
                text: 'Id',
                width: 80,
                filter: {
                    type: 'numeric'
                }
            }, {
                dataIndex: 'titulo',
                text: 'Título',
                width: 120,
                filter: {
                    type: 'string'
                }
            }, {
                dataIndex: 'extjsview',
                text: 'Classe Javascript',
                width: 120,
                filter: {
                    type: 'string'
                }
            }]
        };

        this.items = [ gridGrupo, gridPermissao, gridMenu];
        this.callParent(arguments);
    }
});
