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

		/*
		 // http://localhost/extjs/docs/index.html#!/api/Ext.XTemplate
		 var tpl = new Ext.XTemplate(//
		 '<tpl for=".">', //
		 '<p><img src="{fotografia}" align="left"><b>{nome}</b> {comentario}<br/>Em {datacriacao}</p>', //
		 '</tpl>' //
		 );
		 */

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
			xtype : 'commentlist',
			config : {
				idocorrencia : this.idocorrencia,
				numcomments : this.numcomments,
				idplano : this.idplano,
				idpromotor : this.idpromotor
			}
		}, {
			xtype : 'commentform',
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