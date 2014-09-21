Ext.define('DemoExtJs.view.Participation.Contribution', {
	extend : 'Ext.panel.Panel',
	xtype : 'contribution',
	title : 'Nova participação',
	requires : ['Ext.form.action.DirectLoad', 'Ext.form.action.DirectSubmit', 'DemoExtJs.view.Participation.Fotografia'],
	bodyPadding : 5,
	// autoScroll : true,
	items : [{
		xtype : 'form',
		itemId : 'detail',
		trackResetOnLoad : true, // saber que fields estão dirty
		// title : 'Dados',
		autoWidth : true,
		items : [{
			xtype : 'hiddenfield',
			name : 'feature'
		}, {
			xtype : 'textfield',
			// fieldLabel : 'titulo',
			emptyText : 'Título...',
			name : 'titulo',
			anchor : '100%'
		}, {
			xtype : 'combo',
			name : 'idtipoocorrencia', // o que é submetido no form...
			itemId : 'id_tipo_ocorrencia',
			editable : false,
			valueField : 'id',
			displayField : 'designacao',
			emptyText : 'Escolha um tipo...',
			forceSelection : true,
			triggerAction : 'all',
			store : 'TipoOcorrenciaCombo',
			queryMode : 'local',
			listConfig : {
				itemTpl : '<tpl for="."><div class="combo-superior-{isclass}"><span>{designacao}</span></div></tpl>'
			},
			afterLabelTextTpl : '<span style="color:red;font-weight:bold" data-qtip="Obrigatório">*</span>',
			anchor : '100%'
		}, {
			xtype : 'textareafield',
			// grow : true,
			name : 'participacao',
			// fieldLabel : 'Descrição',
			emptyText : 'Descreva a sua participação...',
			anchor : '100%',
			height : 120,
			afterLabelTextTpl : '<span style="color:red;font-weight:bold" data-qtip="Obrigatório">*</span>'
		} /*, {
			xtype : 'fotografia'
		}*/ ],
		dockedItems : [{
			xtype : 'toolbar',
			flex : 1,
			dock : 'bottom',
			layout : {
				pack : 'end',
				type : 'hbox'
			},
			items : [{
				xtype : 'button',
				itemId : 'local',
				// formBind : true,
				icon : 'resources/images/target.png',
				enableToggle : true,
				text : ''
			}, {
				xtype : 'filefield',
				name : 'instantaneo',
				itemId : 'instantaneo',
				// fieldLabel : 'Photo',
				labelWidth : 50,
				msgTarget : 'side',
				allowBlank : true,
				anchor : '40%',
				icon : 'resources/assets/pencil.png',
				buttonOnly : true,
				buttonText : '',
				buttonConfig : {
					iconCls : 'upload-icon'
				},
				listeners : {
					afterrender : function(cmp) {
						cmp.fileInputEl.set({
							accept : 'image/*'
						});
					}
				}
			}, {
				xtype : 'button',
				itemId : 'remove',
				formBind : true,
				icon : 'resources/images/icons/fam/image_remove.png',
				text : ''
			}, {
				xtype : 'tbfill'
			}, {
				xtype : 'button',
				itemId : 'limpar',
				formBind : true,
				text : 'Limpar'
			}, {
				xtype : 'button',
				itemId : 'gravar',
				formBind : true,
				icon : 'resources/assets/pencil.png',
				text : 'Participar'
			}]
		}]
	}]
});
