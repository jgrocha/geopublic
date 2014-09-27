Ext.define('DemoExtJs.view.Promotor', {
	extend : 'Ext.container.Container',
	alias : 'widget.grid-promotor',
	requires : ['Ext.grid.Panel', 'Ext.grid.column.Number', 'Ext.form.field.Number', 'Ext.toolbar.Paging', 'Ext.form.field.Checkbox', 'Ext.grid.column.Action', 'Ext.grid.plugin.RowEditing'],
	layout : 'border',
	title : 'Entidades',
	bodyPadding : 10,
	items : [{
		xtype : 'gridpanel',
		itemId : 'promotor',
		region : 'north',
		height : 140,
		split : true,
		frame : true,
		store : 'Promotor',
		columns : [{
			dataIndex : 'id',
			header : 'Id',
			width : 40
		}, {
			dataIndex : 'designacao',
			header : 'Entidade promotora',
			width : 280,
			editor : {
				xtype : 'textfield',
				allowBlank : false
			}
		}, {
			dataIndex : 'email',
			header : 'Email',
			flex : 1,
			editor : {
				xtype : 'textfield',
				allowBlank : false
			}
		}, {
			dataIndex : 'site',
			header : 'Site',
			flex : 1,
			editor : {
				xtype : 'textfield',
				allowBlank : true
			}
		}, {
			dataIndex : 'dataregisto',
			xtype : 'datecolumn', // fundamental :-)
			header : 'Data de registo',
			width : 140,
			format : 'Y-m-d H:i:s',
			editor : {
				xtype : 'datefield',
				format : 'Y-m-d H:i:s',
				submitFormat : 'c'
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
	}, {
		xtype : 'gridpanel',
		itemId : 'plano',
		region : 'center',
		frame : true,
		store : 'Plano',
		columns : [{
			dataIndex : 'id',
			header : 'Id',
			width : 40
		}, {
			dataIndex : 'idpromotor',
			header : 'IdP',
			width : 40
		}, {
			dataIndex : 'designacao',
			header : 'Plano ou Projeto',
			width : 240,
			editor : {
				xtype : 'textfield',
				allowBlank : false
			}
		}, {
			dataIndex : 'descricao',
			header : 'Descrição do plano ou projeto',
			flex : 1,
			editor : {
				xtype : 'textfield',
				allowBlank : false
			}
		}, {
			dataIndex : 'responsavel',
			header : 'Responsável',
			width : 120,
			editor : {
				xtype : 'textfield',
				allowBlank : false
			}
		}, {
			dataIndex : 'email',
			header : 'Email',
			width : 120,
			editor : {
				xtype : 'textfield',
				allowBlank : false
			}
		}, {
			dataIndex : 'site',
			header : 'Site',
			width : 120,
			editor : {
				xtype : 'textfield',
				allowBlank : true
			}
		}, {
			dataIndex : 'inicio',
			xtype : 'datecolumn', // fundamental :-)
			header : 'De',
			width : 140,
			format : 'Y-m-d H:i:s',
			editor : {
				xtype : 'datefield',
				format : 'Y-m-d H:i:s',
				submitFormat : 'c'
			}
		}, {
			dataIndex : 'fim',
			xtype : 'datecolumn', // fundamental :-)
			header : 'Até',
			width : 140,
			format : 'Y-m-d H:i:s',
			editor : {
				xtype : 'datefield',
				format : 'Y-m-d H:i:s',
				submitFormat : 'c'
			}
		}, {
			dataIndex : 'the_geom',
			header : 'Cobertura geográfica',
			width : 120,
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
	}, {
		region : 'south',
		layout : 'column',
		height : 400,
		bodyPadding : 10,
		autoScroll : true,
		split : true,
		items : [{
			xtype : 'gridpanel',
			itemId : 'tipoocorrencia',
			// region : 'center',
			columnWidth : 0.5,
			split : true,
			frame : true,
			store : 'TipoOcorrencia',
			columns : [{
				dataIndex : 'id',
				header : 'Id',
				width : 40
			}, {
				dataIndex : 'idplano',
				header : 'Plano',
				width : 40
			}, {
				dataIndex : 'designacao',
				header : 'Tipo de Ocorrência',
				flex : 1,
				editor : {
					xtype : 'textfield',
					allowBlank : false
				}
			}, {
				dataIndex : 'ativa',
				header : 'Em uso',
				width : 80,
				editor : {
					xtype : 'checkbox'
					// align : 'center' //doesn't seem to work.
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
				cancelBtnText : 'Descartar'
				// clicksToEdit: 1, //this changes from the default double-click activation to single click activation
				// errorSummary: false //disables display of validation messages if the row is invalid
			})]
		}, {
			xtype : 'gridpanel',
			itemId : 'estadoocorrencia',
			columnWidth : 0.5,
			split : true,
			store : 'Participation.EstadoOcorrencia',
			frame : true,
			columns : [{
				dataIndex : 'id',
				header : 'Id',
				width : 40
			}, {
				dataIndex : 'idplano',
				header : 'Plano',
				width : 40
			}, {
				dataIndex : 'estado',
				header : 'Estado',
				width : 80,
				editor : {
					xtype : 'textfield',
					allowBlank : false
				}
			}, {
				dataIndex : 'significado',
				header : 'Significado',
				flex : 1,
				editor : {
					xtype : 'textfield',
					allowBlank : true
				}
			}, {
				dataIndex : 'color',
				header : 'Cor',
				width : 80,
				editor : {
					xtype : 'textfield',
					allowBlank : true
				}
			}, {
				dataIndex : 'icon',
				header : 'Caminho',
				width : 80,
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
				cancelBtnText : 'Descartar'
				// clicksToEdit: 1, //this changes from the default double-click activation to single click activation
				// errorSummary: false //disables display of validation messages if the row is invalid
			})],
			viewConfig : {
				listeners : {
					refresh : function(view) {
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
							// set background color to all row td elements
							for (var j = 0; j < cells.length; j++) {
								// console.log(cells[j]);
								Ext.fly(cells[j]).setStyle('background-color', color);
							}
						}
					}
				}
			}
		}]
	}]
});
