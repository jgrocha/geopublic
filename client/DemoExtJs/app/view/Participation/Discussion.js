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
		// flex : 1,
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
	frame : true,
	margin : '5 5 5 5',
	// title : 'Discussao Nº X',
	initComponent : function() {
		var me = this;
		console.debug(this.initialConfig);
		console.log('Abrir com a discussao ' + this.initialConfig.id_ocorrencia);
		this.title = this.initialConfig.titulo;
		this.idocorrencia = this.initialConfig.id_ocorrencia;
		this.idplano = this.initialConfig.idplano;
		this.idpromotor = this.initialConfig.idpromotor;
		this.numcomentarios = this.initialConfig.numcomentarios;
		
		// http://localhost/extjs/docs/index.html#!/api/Ext.XTemplate
		var tpl = new Ext.XTemplate(//
		'<tpl for=".">', //
		'<p><img src="{fotografia}" align="left"><b>{nome}</b> {comentario}<br/>Em {datacriacao}</p>', //
		'</tpl>' //
		);
		this.items = [{
			html : this.initialConfig.participacao
		}, {
			xtype : 'fotografia',
			config : {
				idocorrencia : this.idocorrencia,
				idplano : this.idplano,
				idpromotor : this.idpromotor
			}
		}, {
			loaded : false, // carregou os comentários?
			numcomments : me.numcomentarios,			
			frame : false,
			title : me.numcomentarios + ' comentários',
			// bodyCls: 'comment-panel',
			ui : 'comment-panel', // defined in sass/src/view/Viewport.scss
			itemId : 'commentlist',
			collapsible : true,
			collapsed : true,
			hideCollapseTool : true,
			titleCollapse : true,
			// html : 'Lista com todos os comentários existentes',
			tpl : tpl,
			/*
			 * Há 38 minutos
			 * Há 3 hrs
			 * Ontem, às 20:16:56
			 * 11 de setembro, às 20:16:56
			 * var d = new Date('2014-09-23T20:16:56.223Z')
			 * Ext.util.Format.date('2014-09-23T20:16:56.223Z', "d M H:i")
			 * Ext.util.Format.date('2014-09-23T20:16:56.223Z', "d M H:i")
			 * "23 Set 21:16"
			 */
            // prepareData: function(data) {} só para dataviews!
			data : [ /*{
				"data" : [{
					"id" : 38,
					"comentario" : "Sempre tive uma atrção especial pelo Jardim da Enferma. Faço o que estiver ao meu alcance para o recuperar.\nAquele abraço!",
					"datacriacao" : "2014-09-23T20:16:56.223Z",
					"haquantotempo" : {
						"days" : 1,
						"hours" : 1,
						"minutes" : 56,
						"seconds" : 33
					},
					"fotografia" : "uploaded_images/profiles/32x32/31_ee201c208a968b4ac27ea7f662e34db2.jpg",
					"nome" : "Gustavo Bastos"
				}, {
					"id" : 39,
					"comentario" : "Pode-se corrigir um comentário anterior? É que escrivi mal e queria corrigir. Obrigado pela atenção.",
					"datacriacao" : "2014-09-23T20:26:11.699Z",
					"haquantotempo" : {
						"days" : 1,
						"hours" : 1,
						"minutes" : 47,
						"seconds" : 18
					},
					"fotografia" : "uploaded_images/profiles/32x32/31_ee201c208a968b4ac27ea7f662e34db2.jpg",
					"nome" : "Gustavo Bastos"
				}, {
					"id" : 40,
					"comentario" : "Continuo a dar grolhas sem querer e ninguém me ajuda? Preciso de saber se há maneira de alterar os comentário. Obrigado!",
					"datacriacao" : "2014-09-23T20:42:30.149Z",
					"haquantotempo" : {
						"days" : 1,
						"hours" : 1,
						"minutes" : 30,
						"seconds" : 59
					},
					"fotografia" : "uploaded_images/profiles/32x32/31_ee201c208a968b4ac27ea7f662e34db2.jpg",
					"nome" : "Gustavo Bastos"
				}]
			} */]
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