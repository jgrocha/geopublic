Ext.define('GeoPublic.view.Participation.Discussion', {
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
		// console.debug(this.initialConfig);
		console.log('Abrir com a discussao ', this.initialConfig);
		this.title = this.initialConfig.titulo;
		this.idtipoocorrencia = this.initialConfig.idtipoocorrencia;
		this.idocorrencia = this.initialConfig.id_ocorrencia;
		this.idplano = this.initialConfig.idplano;
		this.idpromotor = this.initialConfig.idpromotor;
		this.idestado = this.initialConfig.idestado;
		this.estado = this.initialConfig.estado;
		this.color = this.initialConfig.color;
		this.numcomments = this.initialConfig.numcomments;
		this.idutilizador = this.initialConfig.idutilizador;
		this.feature = this.initialConfig.feature;
		this.participacao = this.initialConfig.participacao;

		this.tools = [];

		var showComments = false;
		if (GeoPublic.LoggedInUser) {
			showComments = true;

			if (GeoPublic.LoggedInUser.data.id == this.idutilizador) {
				// console.log('Mostra botões para a participação ' + this.initialConfig.id_ocorrencia);
				this.tools.push({
					type : 'gear',
					tooltip : 'Edit participation'.translate()
				});
				if (this.numcomments == 0) {
					this.tools.push({
						type : 'close',
						tooltip : 'Delete participation'.translate()
					});
				}
			}
		}

		/*
		 // http://localhost/extjs/docs/index.html#!/api/Ext.XTemplate
		 var tpl = new Ext.XTemplate(//
		 '<tpl for=".">', //
		 '<p><img src="{fotografia}" align="left"><b>{nome}</b> {comentario}<br/>Em {datacriacao}</p>', //
		 '</tpl>' //
		 );
		 */

		/*
		Ocultar estas tools em função do número de comentários e do idutilizador
		 */
        if (this.initialConfig.geodiscussao) {
            this.tools.push({
                type : 'search',
                tooltip : 'Center on map'.translate()
            });
            console.log('Painel geodiscussao');
        } else {
            if ((this.initialConfig.proposta) && (this.initialConfig.proposta.length > 0)) {
                this.tools.push({
                    type : 'search',
                    tooltip : 'Redação proposta'
                });
            }
            console.log('Painel discussao paleio');
        }
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
				idocorrencia : this.idocorrencia,
				idestado : this.idestado,
				estado : this.estado,
				color: this.color,
                estadoStore: this.initialConfig.estadoStore
			}
		}];
		this.callParent(arguments);
	}
});