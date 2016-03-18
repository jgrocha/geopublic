Ext.define('GeoPublic.view.BackOffice.Layer', {
    extend: 'Ext.container.Container',
    stores: ['BackOffice.Plano'],
    alias: 'widget.layer',
    requires: ['Ext.grid.Panel', 'Ext.grid.column.Number',
        'Ext.form.field.Number', 'Ext.form.field.Date', 'Ext.toolbar.Paging',
        'Ext.form.field.Checkbox', 'Ext.grid.column.Action',
        'Ext.grid.plugin.RowEditing', 'Ext.form.field.HtmlEditor',
        'Ext.ux.grid.FiltersFeature'],
    title: 'Layers'.translate(),
    layout: 'border',
    style: 'padding:5px',
    glyph: 0xf0c9, // fa-bars

    initComponent: function () {
        var estore = Ext.getStore('BackOffice.Layer');
        // estore.proxy.setExtraParam("userid", GeoPublic.LoggedInUser.data.id);
        estore.load();
        var filtersCfg = {
            ftype: 'filters',
            autoReload: true, // false,
            local: false,
            encode: true,
            menuFilterText: 'Filter'.translate()
        };

        var grid = Ext.create('Ext.grid.Panel', {
            itemId: 'grid-layer',
            region: 'center',
            // itemId: 'todoGrid',
            store: 'BackOffice.Layer',
            features: [filtersCfg],
            dockedItems: [{
                xtype: 'pagingtoolbar',
                store: 'BackOffice.Layer', // same store GridPanel is using
                dock: 'bottom',
                displayInfo: true
            }],
            columns: [{
                dataIndex: 'id',
                text: 'Id',
                width: 60,
                hidden: true,
                filter: {
                    type: 'numeric'
                }
            }, {
                dataIndex: 'ord',
                text: 'Order'.translate(),
                width: 60,
                filter: {
                    type: 'numeric'
                },
                editor: {
                    xtype: 'numberfield',
                    allowBlank: true
                }
            }, {
                dataIndex: 'titulo',
                text: 'Layer label'.translate(),
                width: 120,
                filter: {
                    type: 'string'
                },
                editor: {
                    xtype: 'textfield',
                    allowBlank: false
                }
            }, {
                dataIndex: 'layer',
                text: 'Layer name'.translate(),
                width: 120,
                filter: {
                    type: 'string'
                },
                editor: {
                    xtype: 'textfield',
                    allowBlank: true
                }
            }, {
                dataIndex: 'grupo',
                text: 'Group'.translate(),
                width: 120,
                hidden: true,
                filter: {
                    type: 'string'
                },
                editor: {
                    xtype: 'textfield',
                    allowBlank: true
                }
            }, {
                dataIndex: 'url',
                text: 'Url'.translate(),
                flex: 1,
                filter: {
                    type: 'string'
                },
                editor: {
                    xtype: 'textfield',
                    allowBlank: true
                }
            }, {
                dataIndex: 'tipo',
                text: 'Geometry'.translate(),
                width: 120,
                filter: {
                    type: 'string'
                },
                editor: {
                    xtype: 'textfield',
                    allowBlank: true
                }
            }, {
                dataIndex: 'srid',
                text: 'ETRS'.translate(),
                width: 60,
                filter: {
                    type: 'int'
                },
                editor: {
                    xtype: 'numberfield',
                    allowBlank: true
                }
            }, {
                dataIndex: 'estilo',
                text: 'Style'.translate(),
                width: 80,
                filter: {
                    type: 'string'
                },
                editor: {
                    xtype: 'textfield',
                    allowBlank: true
                }
            }, {
                dataIndex: 'qtip',
                text: 'Tooltip'.translate(),
                width: 120,
                hidden: true,
                filter: {
                    type: 'string'
                },
                editor: {
                    xtype: 'textfield',
                    allowBlank: true
                }
            }, {
                dataIndex: 'base',
                xtype: 'checkcolumn',
                text: 'Base'.translate(),
                width: 60,
                filter: {
                    type: 'boolean',
                    yesText: 'Sim',
                    noText: 'Não'
                },
                editor: {
                    xtype: 'checkbox'
                }
            }, {
                dataIndex: 'singletile',
                xtype: 'checkcolumn',
                text: 'Single'.translate(),
                width: 60,
                hidden: true,
                filter: {
                    type: 'boolean',
                    yesText: 'Sim',
                    noText: 'Não'
                },
                editor: {
                    xtype: 'checkbox'
                }
            }, {
                dataIndex: 'visivel',
                xtype: 'checkcolumn',
                text: 'Visible'.translate(),
                width: 60,
                filter: {
                    type: 'boolean',
                    yesText: 'Yes'.translate(),
                    noText: 'No'.translate()
                },
                editor: {
                    xtype: 'checkbox'
                }
            }, {
                dataIndex: 'activo',
                xtype: 'checkcolumn',
                text: 'Active'.translate(),
                width: 60,
                filter: {
                    type: 'boolean',
                    yesText: 'Yes'.translate(),
                    noText: 'No'.translate()
                },
                editor: {
                    xtype: 'checkbox'
                }
            }, {
                dataIndex: 'idplano',
                text: 'Plan'.translate(),
                width: 180,
                filter: {
                    type: 'numeric'
                },
                editor: {
                    xtype: 'combobox',
                    //queryMode: 'local',
                    triggerAction: 'all',
                    store: 'BackOffice.Plano',
                    editable: false,
                    displayField: 'designacao',
                    valueField: 'id',
                    listeners: {
                        beforequery: function(queryEvent, eOpts) {
                            queryEvent.combo.store.proxy.extraParams = {
                                mode: 1,
                                func: 'combobox' // just for debug
                            }
                        }
                    }
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
                dataIndex: 'observacoes',
                text: 'Observations'.translate(),
                hidden: true,
                flex: 2,
                filter: {
                    type: 'string'
                },
                editor: {
                    xtype: 'textfield',
                    allowBlank: true
                }
            }],
            tbar: [{
                itemId: 'add',
                text: 'Add'.translate(),
                icon: 'resources/images/icons/fam/add.png'
            }, {
                itemId: 'remove',
                text: 'Remove'.translate(),
                icon: 'resources/images/icons/fam/delete.gif',
                disabled: true
            }],
            selType: 'rowmodel',
            plugins: [{
                ptype: 'rowediting' // enable row editing
            }]
        });

        this.items = [grid];

        // add some buttons to bottom toolbar just for demonstration purposes
        grid.child('pagingtoolbar').add([
            '->',
            {
                text: 'Active filters'.translate(),
                //tooltip: 'Ver que filtros estão a ser utilizados',
                handler: function () {
                    var data = Ext.encode(grid.filters.getFilterData());
                    Ext.Msg.alert('Active filters'.translate(), data);
                }
            }, {
                text: 'Clear filters'.translate(),
                //tooltip: 'Descarta todos os filtros existentes',
                handler: function () {
                    grid.filters.clearFilters();
                }
            }
        ]);
        this.callParent(arguments);
    }
});
