Ext.define('GeoPublic.view.BackOffice.Promotor', {
    extend: 'Ext.container.Container',
    alias: 'widget.grid-promotor',
    requires: ['Ext.grid.Panel', 'Ext.grid.column.Number', 'Ext.form.field.Number',
        'Ext.form.field.Date', 'Ext.toolbar.Paging', 'Ext.form.field.Checkbox', 'Ext.grid.column.Action',
        'Ext.grid.plugin.RowEditing', 'Ext.form.field.HtmlEditor',
        'Ext.grid.column.CheckColumn'],
    layout: 'border',
    title: 'Institutions'.translate(),
    bodyPadding: 10,
    items: [{
        xtype: 'gridpanel',
        itemId: 'promotor',
        region: 'north',
        height: 140,
        split: true,
        frame: true,
        store: 'Promotor',
        columns: [/*{
         dataIndex : 'id',
         header : 'Id',
         width : 40
         },*/  {
            dataIndex: 'designacao',
            header: 'Institution'.translate(),
            width: 280,
            editor: {
                xtype: 'textfield',
                allowBlank: false
            }
        }, {
            dataIndex: 'email',
            header: 'Email'.translate(),
            flex: 1,
            editor: {
                xtype: 'textfield',
                allowBlank: false
            }
        }, {
            dataIndex: 'site',
            header: 'Site'.translate(),
            flex: 1,
            editor: {
                xtype: 'textfield',
                allowBlank: true
            }
        }, {
            dataIndex: 'dataregisto',
            xtype: 'datecolumn', // fundamental :-)
            header: 'Registration date'.translate(),
            width: 140,
            format: 'Y-m-d H:i:s',
            editor: {
                xtype: 'datefield',
                format: 'Y-m-d H:i:s',
                submitFormat: 'c'
            }
        }, {
            dataIndex: 'logotipo',
            header: 'Logo'.translate(),
            width: 140,
            disabled: true
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
        }, '->', {
            xtype: 'form',
            api: {
                submit: 'ExtRemote.DXFormUploads.filesubmitphotoprofile'
            },
            items: [{
                xtype: 'filefield',
                name: 'photo',
                itemId: 'photo',
                // fieldLabel : 'Photo',
                labelWidth: 50,
                msgTarget: 'side',
                allowBlank: true,
                //anchor : '40%',
                buttonText: 'Choose photo'.translate(),
                buttonOnly: true,
                disabled: true
            }]
        }, {
            itemId: 'viewLogo',
            text: 'View logo',
            icon: 'resources/images/icons/fam/information.png',
            disabled: true
        }],
        selType: 'rowmodel',
        selModel: {allowDeselect: true},
        // http://stackoverflow.com/questions/7750529/extjs-4-row-editor-grid-how-to-change-update-button-text
        plugins: [Ext.create('Ext.grid.plugin.RowEditing', {
            saveBtnText: 'Update'.translate(),
            cancelBtnText: 'Cancel'.translate(),
            // clicksToEdit: 1, //this changes from the default double-click activation to single click activation
            errorSummary: false //disables display of validation messages if the row is invalid
        })]
    }, {
        title: 'Plans under discussion'.translate(),
        region: 'center',
        layout: {
            type: 'hbox',
            pack: 'start',
            align: 'stretch'
        },
        items: [{
            xtype: 'gridpanel',
            itemId: 'plano',
            flex: 1,
            frame: true,
            store: 'Plano',
            columns: [/*{
             dataIndex : 'id',
             header : 'Id',
             width : 40
             }, {
             dataIndex : 'idpromotor',
             header : 'IdP',
             width : 40
             },*/ {
                dataIndex: 'designacao',
                header: 'Plan'.translate(),
                width: 240,
                editor: {
                    xtype: 'textfield',
                    allowBlank: false
                }
            }, /* {
             dataIndex : 'descricao',
             header : 'Descrição do plano ou projeto',
             flex : 1,
             editor : {
             xtype : 'textfield',
             allowBlank : false
             }
             },*/
                {
                    dataIndex: 'responsavel',
                    header: 'Responsible'.translate(),
                    width: 120,
                    editor: {
                        xtype: 'textfield',
                        allowBlank: false
                    }
                }, {
                    dataIndex: 'email',
                    header: 'Email'.translate(),
                    width: 120,
                    editor: {
                        xtype: 'textfield',
                        allowBlank: false
                    }
                }, {
                    dataIndex: 'site',
                    header: 'Site'.translate(),
                    width: 120,
                    editor: {
                        xtype: 'textfield',
                        allowBlank: true
                    }
                }, {
                    dataIndex: 'inicio',
                    xtype: 'datecolumn', // fundamental :-)
                    header: 'From'.translate(),
                    width: 140,
                    format: 'Y-m-d H:i:s',
                    editor: {
                        xtype: 'datefield',
                        format: 'Y-m-d H:i:s',
                        submitFormat: 'c'
                    }
                }, {
                    dataIndex: 'fim',
                    xtype: 'datecolumn', // fundamental :-)
                    header: 'Until'.translate(),
                    width: 140,
                    format: 'Y-m-d H:i:s',
                    editor: {
                        xtype: 'datefield',
                        format: 'Y-m-d H:i:s',
                        submitFormat: 'c'
                    }
                }, {
                    dataIndex: 'alternativeproposta',
                    xtype: 'checkcolumn',
                    header: 'Non-geographic'.translate(),
                    width: 90,
                    editor: {
                        xtype: 'checkbox',
                        cls: 'x-grid-checkheader-editor'
                        // align : 'center' //doesn't seem to work.
                    }
                }, {
                    dataIndex: 'active',
                    xtype: 'checkcolumn',
                    header: 'Active'.translate(),
                    width: 60,
                    editor: {
                        xtype: 'checkbox',
                        cls: 'x-grid-checkheader-editor'
                        // align : 'center' //doesn't seem to work.
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
            selModel: {allowDeselect: true},
            // http://stackoverflow.com/questions/7750529/extjs-4-row-editor-grid-how-to-change-update-button-text
            plugins: [Ext.create('Ext.grid.plugin.RowEditing', {
                saveBtnText: 'Update'.translate(),
                cancelBtnText: 'Cancel'.translate(),
                // clicksToEdit: 1, //this changes from the default double-click activation to single click activation
                errorSummary: false //disables display of validation messages if the row is invalid
            })]
        }, {
            xtype: 'tabpanel',
            plain: true,
            items: [{
                xtype: 'form',
                split: true,
                disabled: true,
                width: 600,
                itemId: 'planoForm',
                bodyPadding: 10,
                title: 'Plan description'.translate(),
                items: [{
                    xtype: 'htmleditor',
                    anchor: '100%',
                    name: 'descricao'
                }, {
                    xtype: 'textfield',
                    fieldLabel: 'Geographic scope'.translate(),
                    labelAlign: 'top',
                    anchor: '100%',
                    name: 'the_geom'
                }],
                dockedItems: [{
                    xtype: 'toolbar',
                    dock: 'bottom',
                    items: [{
                        xtype: 'button',
                        itemId: 'updateDescricaoPlano',
                        icon: 'resources/images/icons/fam/accept.png',
                        text: 'Update plan'.translate()
                    }, {
                        xtype: 'button',
                        itemId: 'planLimits',
                        icon: 'resources/assets/pencil.png',
                        text: 'Select limits on map'.translate()
                    }]

                }]
            }, {
                itemId: 'separador',
                tabConfig: {
                    xtype: 'tbfill'
                }
            }, {
                xtype: 'form',
                split: true,
                disabled: true,
                width: 600,
                itemId: 'proposalForm',
                bodyPadding: 10,
                title: 'Proposal'.translate(),
                items: [{
                    xtype: 'htmleditor',
                    anchor: '100%',
                    name: 'proposta'
                }],
                dockedItems: [{
                    xtype: 'toolbar',
                    dock: 'bottom',
                    items: [{
                        xtype: 'button',
                        itemId: 'updatePlanProposal',
                        icon: 'resources/images/icons/fam/accept.png',
                        text: 'Update proposal'.translate()
                    }]

                }]
            }]
        }]
    }, {
        region: 'south',
        layout: {
            type: 'hbox',
            pack: 'start',
            align: 'stretch'
        },
        height: 380,
        bodyPadding: 10,
        autoScroll: true,
        split: true,
        items: [{
            xtype: 'gridpanel',
            itemId: 'tipoocorrencia',
            // region : 'center',
            width: 600,
            split: true,
            frame: true,
            store: 'TipoOcorrencia',
            columns: [{
                dataIndex: 'id',
                header: 'Id',
                width: 40
            }, {
                dataIndex: 'idplano',
                header: 'Plan'.translate(),
                width: 40
            }, {
                dataIndex: 'designacao',
                header: 'Type'.translate(),
                flex: 1,
                editor: {
                    xtype: 'textfield',
                    allowBlank: false
                }
            }, {
                dataIndex: 'ativa',
                xtype: 'checkcolumn',
                header: 'Active'.translate(),
                width: 80,
                editor: {
                    xtype: 'checkbox',
                    cls: 'x-grid-checkheader-editor'
                    // align : 'center' //doesn't seem to work.
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
            selModel: {allowDeselect: true},
            // http://stackoverflow.com/questions/7750529/extjs-4-row-editor-grid-how-to-change-update-button-text
            plugins: [Ext.create('Ext.grid.plugin.RowEditing', {
                saveBtnText: 'Update'.translate(),
                cancelBtnText: 'Cancel'.translate()
                // clicksToEdit: 1, //this changes from the default double-click activation to single click activation
                // errorSummary: false //disables display of validation messages if the row is invalid
            })]
        }, {
            xtype: 'gridpanel',
            itemId: 'estadoocorrencia',
            flex: 1,
            split: true,
            store: 'Participation.EstadoOcorrencia',
            frame: true,
            columns: [{
                dataIndex: 'id',
                header: 'Id',
                width: 40
            }, {
                dataIndex: 'idplano',
                header: 'Plan'.translate(),
                width: 40
            }, {
                dataIndex: 'estado',
                header: 'State'.translate(),
                width: 80,
                editor: {
                    xtype: 'textfield',
                    allowBlank: false
                }
            }, {
                dataIndex: 'significado',
                header: 'Meaning'.translate(),
                flex: 1,
                editor: {
                    xtype: 'textfield',
                    allowBlank: true
                }
            }, {
                dataIndex: 'color',
                header: 'Color'.translate(),
                width: 80,
                editor: {
                    xtype: 'textfield',
                    allowBlank: true
                }
            }, {
                dataIndex: 'icon',
                header: 'Path'.translate(),
                width: 80,
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
            selModel: {allowDeselect: true},
            // http://stackoverflow.com/questions/7750529/extjs-4-row-editor-grid-how-to-change-update-button-text
            plugins: [Ext.create('Ext.grid.plugin.RowEditing', {
                saveBtnText: 'Update'.translate(),
                cancelBtnText: 'Cancel'.translate()
                // clicksToEdit: 1, //this changes from the default double-click activation to single click activation
                // errorSummary: false //disables display of validation messages if the row is invalid
            })],
            viewConfig: {
                listeners: {
                    refresh: function (view) {
                        // get all grid view nodes
                        var nodes = view.getNodes();
                        for (var i = 0; i < nodes.length; i++) {
                            var node = nodes[i];
                            // get node record
                            var record = view.getRecord(node);
                            // get color from record data
                            var color = record.get('color');
                            // get all td elements
                            var cells = Ext.get(node).query('td');

                            /*
                             // set background color to all row td elements
                             for (var j = 0; j < cells.length; j++) {
                             // console.log(cells[j]);
                             Ext.fly(cells[j]).setStyle('background-color', color);
                             }
                             */

                            // Só da coluna 4
                            Ext.fly(cells[4]).setStyle('background-color', color);
                        }
                    }
                }
            }
        }]
    }]
});