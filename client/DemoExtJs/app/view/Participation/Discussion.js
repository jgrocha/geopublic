Ext.define('DemoExtJs.view.Participation.Discussion', {
	extend : 'Ext.panel.Panel',
	alias : 'widget.discussion',
	ui : 'default', // it will be changed to discussion-framed when that participation is selected
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
		console.log('Abrir com a discussao ' + this.initialConfig.id_ocorrencia + ' com ' + this.initialConfig.numcomments + ' comentarios');
		this.title = this.initialConfig.titulo;
		this.idocorrencia = this.initialConfig.id_ocorrencia;
		this.idplano = this.initialConfig.idplano;
		this.idpromotor = this.initialConfig.idpromotor;
		this.numcomments = this.initialConfig.numcomments;

		var showComments = false;
		if (DemoExtJs.LoggedInUser) {
			showComments = true;
		}

		/*
		 // http://localhost/extjs/docs/index.html#!/api/Ext.XTemplate
		 var tpl = new Ext.XTemplate(//
		 '<tpl for=".">', //
		 '<p><img src="{fotografia}" align="left"><b>{nome}</b> {comentario}<br/>Em {datacriacao}</p>', //
		 '</tpl>' //
		 );
		 */

		this.tools = [{
			type : 'search',
			tooltip : 'Localização da participação'
		}];

		// http://docs.sencha.com/extjs/4.2.2/#!/api/Ext.Date
		var tempo = 'Há ';
		if (this.initialConfig.days > 0) {
			tempo += this.initialConfig.days + ' dias (' + Ext.Date.format(this.initialConfig.datacriacao, 'l') + '), às ' + Ext.Date.format(this.initialConfig.datacriacao, 'H:i');
		} else {
			if (this.initialConfig.hours > 0) {
				tempo += this.initialConfig.hours + ':' + this.initialConfig.minutes;
			} else {
				if (this.initialConfig.minutes > 0) {
					tempo += this.initialConfig.minutes + ' minutos';
					// tempo += this.initialConfig.seconds + ' segundos';
				} else {
					tempo += 'menos de 1 minuto';
				}
			}
		}

		this.items = [{
			html : this.initialConfig.participacao + '<p><img src="' + this.initialConfig.fotografia + '" align="left" height="32" width="32">Por <b>' + this.initialConfig.nome + '</b><br/>' + tempo + '</p>'
		}, {
			xtype : 'fotografia',
			config : {
				idocorrencia : this.idocorrencia,
				idplano : this.idplano,
				idpromotor : this.idpromotor
			}
		}, {
			xtype : 'commentlist',
			config : {
				idocorrencia : this.idocorrencia,
				numcomments : this.numcomments,
				idplano : this.idplano,
				idpromotor : this.idpromotor
			}
		}, {
			xtype : 'commentform',
			hidden : !showComments,
			config : {
				idocorrencia : this.idocorrencia
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