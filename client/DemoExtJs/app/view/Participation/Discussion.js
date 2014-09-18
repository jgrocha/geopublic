Ext.define('DemoExtJs.view.Comment', {
	extend : 'Ext.form.Panel',
	xtype : 'comment',
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
		flex : 1,
		dock : 'bottom',
		layout : {
			pack : 'end',
			type : 'hbox'
		},
		items : [{
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

Ext.define('DemoExtJs.view.Participation.Discussion', {
	extend : 'Ext.panel.Panel',
	xtype : 'discussion',
	/*
	layout : {
	type : 'vbox',
	padding : '5',
	align : 'stretch'
	},
	*/
	// layout: 'fit',
	title : 'Discussao Nº X',
	initComponent : function() {
		console.debug(this.initialConfig);
		console.log('Abrir com a discussao ' + this.initialConfig.id_ocorrencia);
		this.title = this.initialConfig.titulo;
		this.idocorrencia = this.initialConfig.id_ocorrencia;

		var tpl = new Ext.XTemplate(//
		'<tpl for="comentarios">', //
		'<p>{comentario} por {idutilizador}</p>', //
		'</tpl></p>' //
		);

		this.items = [{
			html : this.initialConfig.participacao
		}, {
			title : 'Comentários',
			html : 'Lista com todos os comentários existentes',
			tpl : tpl,
			data : {
				total : 5,
				comentarios : [{
					comentario : 'Joshua',
					idutilizador : 3
				}, {
					comentario : 'Matthew',
					idutilizador : 2
				}, {
					comentario : 'Solomon',
					idutilizador : 0
				}]
			},
			dockedItems : [{
				xtype : 'toolbar',
				flex : 1,
				dock : 'bottom',
				layout : {
					pack : 'end',
					type : 'hbox'
				},
				items : [{
					xtype : 'tbfill'
				}, {
					xtype : 'button',
					itemId : 'refresh',
					formBind : true,
					icon : 'resources/assets/arrow-circle-double-135.png',
					text : 'Refresh'
				}]
			}]
		}, {
			xtype : 'comment',
			config : {
				idocorrencia : this.initialConfig.id_ocorrencia
			}
		}];
		this.callParent(arguments);
	},
});

/*
 * 				id_ocorrencia : records[i].data.id,
 idplano : records[i].data.idplano,
 idestado : records[i].data.idestado,
 idtipoocorrencia : records[i].data.idtipoocorrencia,
 titulo : records[i].data.titulo,
 participacao : records[i].data.participacao,
 datacriacao : records[i].data.datacriacao
 */