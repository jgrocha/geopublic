Ext.define('GeoPublic.view.Participation.CommentForm', {
	extend : 'Ext.form.Panel',
	requires : ['GeoPublic.model.Participation.EstadoOcorrencia', 'GeoPublic.store.Participation.EstadoCombo'],
	// stores : ['Participation.EstadoCombo'],
	alias : 'widget.commentform',
	api : {
		submit : 'ExtRemote.DXParticipacao.createComment'
	},
    bodyStyle: 'background-color: #FFF6D2', // amarelo claro
    style: 'border-top: 1px solid #FFE066', // amarelo mais escuro
	initComponent : function() {
		this.items = [{
            xtype : 'hiddenfield',
            name : 'idocorrencia',
            value : this.initialConfig.config.idocorrencia
        }, {
            xtype : 'hiddenfield',
            name : 'idcomentario' // para editar
        }, {
			xtype : 'textareafield',
            margin: '10 10 10 42',
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
            style: 'background-color: #FFF6D2;',
            padding: '0 0 6 42',
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
				width : 140,
				editable : false,
				valueField : 'id',
                value: this.initialConfig.config.idestado,
				displayField : 'estado',
				emptyText : 'Novo estado...',
				forceSelection : true,
				triggerAction : 'all',
				store : this.initialConfig.config.estadoStore,
				queryMode : 'local',
				// labelStyle: 'color:' + this.initialConfig.config.color, // saber esta cor...
				// labelAlign: 'top',
				// fieldLabel: 'Estado: ' + this.initialConfig.config.estado,
				// labelWidth: 96,
				// labelSeparator: '',
				listConfig: {
					getInnerTpl: function() {
						return '<div data-qtip="{significado}">{estado}</div>';
					}
				}
			}, {
				xtype : 'tbfill'
			}, {
                xtype : 'button',
                itemId : 'limpar',
                // formBind : true,
                glyph: 0xf12d,
                text : 'Clear'.translate()
            }, {
				xtype : 'button',
				itemId : 'gravar',
                action: 'save', // 'update'
				formBind : true,
				icon : 'resources/assets/pencil.png',
				text : 'Comment'.translate()
			}]
		}];
		this.callParent(arguments);
	}
});