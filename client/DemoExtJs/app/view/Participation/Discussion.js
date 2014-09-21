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
		'<tpl for=".">', //
		'<p>{comentario} por {idutilizador}</p>', //
		'</tpl></p>' //
		);

		this.items = [{
			html : this.initialConfig.participacao
		}, {
			xtype : 'fotografia',
			config : {
				idocorrencia : this.idocorrencia
			}
		}, {
			loaded : false, // carregou os comentários?
			numcomments : 0,
			title : 'Comentários',
			itemId : 'commentlist',
			collapsible : true,
			collapsed : true,
			hideCollapseTool : true,
			titleCollapse : true,
			// html : 'Lista com todos os comentários existentes',
			tpl : tpl,
			data : [/*{
			 "id" : 4,
			 "comentario" : "Mais um tiro no escuro",
			 "datacriacao" : "2014-09-18T21:21:23.104Z",
			 "datamodificacao" : "2014-09-18T21:21:23.104Z",
			 "idocorrencia" : 1,
			 "idutilizador" : 31,
			 "idestado" : 1
			 }, {
			 "id" : 5,
			 "comentario" : "Uau! Leu bem este tiro. Boa pontaria",
			 "datacriacao" : "2014-09-18T22:14:32.238Z",
			 "datamodificacao" : "2014-09-18T22:14:32.238Z",
			 "idocorrencia" : 1,
			 "idutilizador" : 31,
			 "idestado" : 1
			 }, {
			 "id" : 6,
			 "comentario" : "Maravilhoso!",
			 "datacriacao" : "2014-09-18T22:14:44.191Z",
			 "datamodificacao" : "2014-09-18T22:14:44.191Z",
			 "idocorrencia" : 1,
			 "idutilizador" : 31,
			 "idestado" : 1
			 }*/ ]
		}, {
			xtype : 'comment',
			config : {
				idocorrencia : this.initialConfig.id_ocorrencia
			}
		}];
		this.callParent(arguments);
	}
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