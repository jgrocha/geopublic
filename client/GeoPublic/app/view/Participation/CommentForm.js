Ext.define('GeoPublic.view.Participation.CommentForm', {
	extend : 'Ext.form.Panel',
	requires : ['GeoPublic.model.Participation.EstadoOcorrencia', 'GeoPublic.store.Participation.EstadoCombo'],
	stores : ['Participation.EstadoCombo'],
	alias : 'widget.commentform',
	api : {
		submit : 'ExtRemote.DXParticipacao.createComment'
	},
	initComponent : function() {
		this.items = [{
			xtype : 'hiddenfield',
			name : 'idocorrencia',
			value : this.initialConfig.config.idocorrencia
		}, {
			xtype : 'textareafield',
			grow : true,
			name : 'comentario',
			emptyText : 'O seu comentário...',
			anchor : '100%',
			height : 60,
			allowBlank: false,
			minLength: 5,
			allowOnlyWhitespace: false
			// afterLabelTextTpl : '<span style="color:red;font-weight:bold" data-qtip="Obrigatório">*</span>'
		}];
		this.dockedItems = [{
			xtype : 'toolbar',
			// flex : 1,
			dock : 'bottom',
			layout : {
				pack : 'end',
				type : 'hbox',
				align: 'bottom'
			},
			items : [{
				xtype : 'combo',
				// itemId : 'estado',
				name : 'idestado', // o que é submetido no form...
				width : 220,
				editable : false,
				valueField : 'id',
				displayField : 'estado',
				emptyText : 'Novo estado...',
				forceSelection : true,
				triggerAction : 'all',
				store : 'Participation.EstadoCombo',
				queryMode : 'local',
				labelStyle: 'color:' + this.initialConfig.config.color, // saber esta cor...
				labelAlign: 'top',
				fieldLabel: 'Estado: ' + this.initialConfig.config.estado,
				labelWidth: 96,
				labelSeparator: '',
				listConfig: {
					getInnerTpl: function() {
						return '<div data-qtip="{significado}">{estado}</div>';
					}
				}
			}, {
				xtype : 'tbfill'
			}, {
				xtype : 'button',
				itemId : 'gravar',
				formBind : true,
				icon : 'resources/assets/pencil.png',
				text : 'Comentar'
			}]
		}];
		this.callParent(arguments);
	}
});