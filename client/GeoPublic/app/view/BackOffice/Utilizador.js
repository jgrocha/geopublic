Ext.define('GeoPublic.view.BackOffice.Utilizador', {
    extend: 'Ext.container.Container',
    alias: 'widget.grid-utilizador',
    requires: ['Ext.grid.Panel', 'Ext.grid.column.Number', 'Ext.form.field.Number',
        'Ext.toolbar.Paging', 'Ext.form.field.Checkbox',
        'Ext.grid.column.Action',
        'Ext.ux.LiveSearchGridPanel',
        'Ext.ux.grid.FiltersFeature',
        'Ext.grid.plugin.CellEditing'],
    stores: ['BackOffice.GrupoCombo'],
    title: 'Utilizadores',
    layout: 'border',
    style: 'padding:5px',

    initComponent: function () {
        var ustore = Ext.getStore('BackOffice.Utilizador');
        // ustore.proxy.setExtraParam("userid", GeoPublic.LoggedInUser.data.id);
        ustore.load();
        var filtersCfg = {
            ftype: 'filters',
            autoReload: true, // false,
            local: false,
            encode: true,
            menuFilterText: 'Filtrar'
        };

        this.items = [{
            xtype: 'gridpanel',
            region: 'center',
            itemId: 'utilizador',
            store: 'BackOffice.Utilizador',
            features: [filtersCfg],
            dockedItems: [{
                xtype: 'pagingtoolbar',
                store: 'BackOffice.Utilizador', // same store GridPanel is using
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
                dataIndex: 'idgrupo',
                text: 'Grupo',
                width: 80,
                filter: {
                    type: 'numeric'
                },
                editor: {
                    xtype: 'combobox',
                    triggerAction: 'all',
                    store: 'BackOffice.GrupoCombo',
                    editable: false,
                    displayField: 'nome',
                    valueField: 'id'
                },
                renderer: function (value, metaData, record) {
                    var editor = metaData.column.getEditor(record);
                    var storeRecord = editor.store.getById(value);
                    if (storeRecord)
                        return storeRecord.data[editor.displayField];
                    else
                        return null;
                }
            }, {
                dataIndex: 'nome',
                text: 'Nome',
                width: 120,
                filter: {
                    type: 'string'
                }
            }, {
                dataIndex: 'email',
                text: 'Email',
                width: 140,
                filter: {
                    type: 'string'
                }
            }, {
                dataIndex: 'datacriacao',
                xtype: 'datecolumn', // fundamental :-)
                text: 'Criado em',
                width: 150,
                format: 'Y-m-d H:i:s',
                filter: {
                    type: 'date',
                    afterText: 'Depois de',
                    beforeText: 'Antes de',
                    dateFormat: 'Y-m-d',
                    onText: 'No dia'
                }
            }, {
                dataIndex: 'ultimologin',
                xtype: 'datecolumn', // fundamental :-)
                text: 'Último login',
                width: 150,
                format: 'Y-m-d H:i:s',
                filter: {
                    type: 'date',
                    afterText: 'Depois de',
                    beforeText: 'Antes de',
                    dateFormat: 'Y-m-d',
                    onText: 'No dia'
                }
            }, {
                dataIndex: 'ativo',
                xtype: 'checkcolumn',
                text: 'Can login?',
                width: 90,
                filter: {
                    type: 'boolean',
                    yesText: 'Sim',
                    noText: 'Não'
                },
                editor: {
                    xtype: 'checkbox'
                }
            }, {
                dataIndex: 'moderator',
                xtype: 'checkcolumn',
                text: 'Moderator',
                width: 90,
                filter: {
                    type: 'boolean',
                    yesText: 'Sim',
                    noText: 'Não'
                },
                disabled: true
            }],
            tbar: [{
                itemId: 'remove',
                text: 'Apaga',
                icon: 'resources/images/icons/fam/delete.gif',
                disabled: true
            }],
            selType: 'rowmodel',
            plugins: [{
                ptype: 'cellediting'
            }]
        }];
        this.callParent(arguments);
    }
});
