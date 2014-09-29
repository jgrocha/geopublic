Ext.define('DemoExtJs.view.Participation.CommentForm', {
	extend : 'Ext.form.Panel',
	requires : ['DemoExtJs.model.Participation.EstadoOcorrencia', 'DemoExtJs.store.Participation.EstadoCombo'],
	store : 'Participation.EstadoCombo',
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
			afterLabelTextTpl : '<span style="color:red;font-weight:bold" data-qtip="Obrigatório">*</span>'
		}];
		this.callParent(arguments);
	},
	dockedItems : [{
		xtype : 'toolbar',
		// flex : 1,
		dock : 'bottom',
		layout : {
			pack : 'end',
			type : 'hbox'
		},
		items : [{
			xtype : 'combo',
			// itemId : 'estado',
			name : 'idestado', // o que é submetido no form...
			width : 140,
			editable : false,
			valueField : 'id',
			displayField : 'estado',
			emptyText : 'Novo estado...',
			forceSelection : true,
			triggerAction : 'all',
			store : 'Participation.EstadoCombo',
			queryMode : 'local'
		}, {
			xtype : 'tbfill'
		}, {
			xtype : 'button',
			itemId : 'gravar',
			formBind : true,
			icon : 'resources/assets/pencil.png',
			text : 'Comentar'
		}]
	}]
});