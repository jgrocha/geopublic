Ext.define('GeoPublic.view.Participation.Contribution', {
	extend : 'Ext.panel.Panel',
	alias : 'widget.contribution',
	title : 'Nova participação',
	requires : ['Ext.form.action.DirectLoad', 'Ext.form.action.DirectSubmit', 'GeoPublic.view.Participation.Fotografia'],
	bodyPadding : 5, // o que está dentro
	frame : true,
	margin : '5 5 5 5',
	autoHeight : true,
	layout : {
		type : 'vbox',
		align : 'stretch'
	},
	items : [{
		xtype : 'form',
		itemId : 'detail',
		trackResetOnLoad : true, // saber que fields estão dirty
		autoWidth : true,
		items : [{
			xtype : 'hiddenfield',
			name : 'feature',
			allowBlank : false
		}, {
			xtype : 'textfield',
			// fieldLabel : 'titulo',
			emptyText : 'Título...',
			name : 'titulo',
			allowBlank : false,
			minLength : 5,
			allowOnlyWhitespace : false,
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
			height : 80,
			allowBlank : false,
			minLength : 5,
			allowOnlyWhitespace : false,
			afterLabelTextTpl : '<span style="color:red;font-weight:bold" data-qtip="Obrigatório">*</span>'
		}, {
			xtype : 'fotografiatmp' // serve para mostrar as fotografias a partir do store
		}]
	}, {
		autoWidth : true,
		xtype : 'form',
		itemId : 'photos',
		layout : {
			pack : 'start',
			type : 'hbox'
		},
		api : {
			submit : 'ExtRemote.DXFormTest.filesubmitinstantaneo'
		},
		items : [{
			xtype : 'hiddenfield',
			name : 'idplano'
		}, {
			xtype : 'hiddenfield',
			name : 'idpromotor'
		}, {
			xtype : 'filefield',
			name : 'instantaneo',
			itemId : 'instantaneo',
			// fieldLabel : 'Photo',
			// labelWidth : 50,
			msgTarget : 'side',
			allowBlank : true,
			// anchor : '40%',
			// icon : 'resources/assets/pencil.png',
			buttonOnly : true,
			buttonText : 'Adicionar imagem',
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
			// formBind : true,
			icon : 'resources/images/icons/fam/image_remove.png',
			text : 'Remover imagem'
		}]
	}],
	dockedItems : [{
		xtype : 'toolbar',
		itemId : 'contributiontb',
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
			xtype : 'tbtext',
			text : 'Sem localização'
		}, {
			xtype : 'tbfill'
		}, {
			xtype : 'button',
			itemId : 'limpar',
			// formBind : true,
			text : 'Limpar'
		}, {
			xtype : 'button',
			itemId : 'gravar',
			formBind : true, // mas já está fora do form#detail
			icon : 'resources/assets/pencil.png',
			text : 'Participar',
			disabled : true
		}]
	}]
});
