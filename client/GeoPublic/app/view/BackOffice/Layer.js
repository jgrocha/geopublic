Ext.define('GeoPublic.view.BackOffice.Layer', {
    extend: 'Ext.container.Container',
    xtype: 'layer',
    requires : ['Ext.grid.Panel', 'Ext.grid.column.Number', 'Ext.form.field.Number', 'Ext.form.field.Date', 'Ext.toolbar.Paging', 'Ext.form.field.Checkbox', 'Ext.grid.column.Action', 'Ext.grid.plugin.RowEditing', 'Ext.form.field.HtmlEditor', 'Ext.ux.grid.FiltersFeature'],
    title: 'Camadas do mapa',
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
            menuFilterText: 'Filtrar'
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
                text: 'Ord',
                width: 60,
                filter: {
                    type: 'numeric'
                },
                editor : {
                    xtype : 'numberfield',
                    allowBlank : true
                }
            }, {
                dataIndex: 'titulo',
                text: 'Designação',
                width: 120,
                filter: {
                    type: 'string'
                },
                editor : {
                    xtype : 'textfield',
                    allowBlank : false
                }
            }, {
                dataIndex: 'layer',
                text: 'Nome do layer',
                width: 120,
                filter: {
                    type: 'string'
                },
                editor : {
                    xtype : 'textfield',
                    allowBlank : true
                }
            }, {
                dataIndex: 'grupo',
                text: 'Grupo',
                width: 120,
                hidden: true,
                filter: {
                    type: 'string'
                },
                editor : {
                    xtype : 'textfield',
                    allowBlank : true
                }
            }, {
                dataIndex: 'url',
                text: 'Url',
                flex: 1,
                filter: {
                    type: 'string'
                },
                editor : {
                    xtype : 'textfield',
                    allowBlank : true
                }
            }, {
                dataIndex: 'tipo',
                text: 'Tipo de geometria',
                width: 120,
                filter: {
                    type: 'string'
                },
                editor : {
                    xtype : 'textfield',
                    allowBlank : true
                }
            }, {
                dataIndex: 'srid',
                text: 'SRID',
                width: 60,
                filter: {
                    type: 'int'
                },
                editor : {
                    xtype : 'numberfield',
                    allowBlank : true
                }
            }, {
                dataIndex: 'estilo',
                text: 'Estilo',
                width: 120,
                filter: {
                    type: 'string'
                },
                editor : {
                    xtype : 'textfield',
                    allowBlank : true
                }
            }, {
                dataIndex: 'qtip',
                text: 'Tooltip',
                width: 120,
                hidden: true,
                filter: {
                    type: 'string'
                },
                editor : {
                    xtype : 'textfield',
                    allowBlank : true
                }
            }, {
                dataIndex: 'base',
                text: 'Base',
                width: 60,
                filter: {
                    type: 'boolean',
                    yesText: 'Sim',
                    noText: 'Não'
                },
                editor : {
                    xtype : 'checkbox'
                }
            }, {
                dataIndex: 'singletile',
                text: 'Single',
                width: 60,
                hidden: true,
                filter: {
                    type: 'boolean',
                    yesText: 'Sim',
                    noText: 'Não'
                },
                editor : {
                    xtype : 'checkbox'
                }
            }, {
                dataIndex: 'visivel',
                text: 'Visível',
                width: 60,
                filter: {
                    type: 'boolean',
                    yesText: 'Sim',
                    noText: 'Não'
                },
                editor : {
                    xtype : 'checkbox'
                }
            }, {
                dataIndex: 'activo',
                text: 'Activo',
                width: 60,
                filter: {
                    type: 'boolean',
                    yesText: 'Sim',
                    noText: 'Não'
                },
                editor : {
                    xtype : 'checkbox'
                }
            }, {
                dataIndex: 'observacoes',
                text: 'Observações',
                flex: 2,
                filter: {
                    type: 'string'
                },
                editor : {
                    xtype : 'textfield',
                    allowBlank : true
                }
            }],
            tbar : [{
                itemId : 'add',
                text : 'Adiciona',
                icon : 'resources/images/icons/fam/add.png'
            }, {
                itemId : 'remove',
                text : 'Apaga',
                icon : 'resources/images/icons/fam/delete.gif',
                disabled : true
            }],
            selType : 'rowmodel',
            // http://stackoverflow.com/questions/7750529/extjs-4-row-editor-grid-how-to-change-update-button-text
            plugins : [Ext.create('Ext.grid.plugin.RowEditing', {
                saveBtnText : 'Alterar',
                cancelBtnText : 'Descartar',
                // clicksToEdit: 1, //this changes from the default double-click activation to single click activation
                errorSummary : false //disables display of validation messages if the row is invalid
            })]
        });

        this.items = [grid];

        // add some buttons to bottom toolbar just for demonstration purposes
        grid.child('pagingtoolbar').add([
            '->',
            {
                text: 'Filtros ativos',
                tooltip: 'Ver que filtros estão a ser utilizados',
                handler: function () {
                    var data = Ext.encode(grid.filters.getFilterData());
                    Ext.Msg.alert('Filtros ativos', data);
                }
            }, {
                text: 'Limpar filtros',
                tooltip: 'Descarta todos os filtros existentes',
                handler: function () {
                    grid.filters.clearFilters();
                }
            }
        ]);
        this.callParent(arguments);
    }
});
