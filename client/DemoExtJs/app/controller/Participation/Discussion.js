Ext.define('DemoExtJs.controller.Participation.Discussion', {
	extend : 'Ext.app.Controller',
	stores : ['Participation.EstadoCombo'], // getParticipationEstadoComboStore()
	// Ext.ComponentQuery.query('comment toolbar button#gravar')
	refs : [],
	init : function() {
		this.control({
			"comment toolbar button#gravar" : {
				click : this.onButtonGravar
			},
			"discussion toolbar button#refresh" : {
				click : this.onButtonRefresh
			},
			"discussion commentlist" : {
				beforeexpand : this.onOcorrenciaBeforeExpand
				// expand : this.onOcorrenciaExpand
			}
		});
	},
	onOcorrenciaBeforeExpand : function(p, animate, eOpts) {
		// console.log('DemoExtJs.controller.Participation.Discussion onOcorrenciaBeforeExpand');
		var o = p.up('discussion').idocorrencia;
		// console.debug(p);
		if (!p.loaded) {
			ExtRemote.DXParticipacao.readComment(o, function(result, event) {
				if (result.success) {
					// console.log(JSON.stringify(result.data));
					// console.log(result.total);
					p.update(result.data);
					p.numcomments = parseInt(result.total);
					p.setTitle(p.numcomments + ' comentários');
					p.loaded = true;
				} else {
					console.log('Problemas no refresh');
				}
			});
		}
	},
	onButtonGravar : function(button, e, options) {
		var me = this;
		var fc = button.up('form').getForm();
		var params = fc.getValues(false, false, false, false);

		ExtRemote.DXParticipacao.createComment(params, function(result, event) {
			if (result.success) {
				// Ext.Msg.alert('Successo', 'O seu comentário foi registado. Obrigado pela participação.');
				// limpar o formulário!
				fc.findField('comentario').setValue('');

				// console.log(result.data);
				// console.log(JSON.stringify(result.data));
				// console.log(result.data[0].id);

				var p = button.up('discussion').down('commentlist');
				console.debug(p);
				// junto este aos comentários existentes
				if (p.numcomments > 0) {
					p.data.push(result.data[0]);
					p.update(p.data);
				} else {
					p.update(result.data[0]);
				}
				p.numcomments = p.numcomments + 1;
				p.setTitle(p.numcomments + ' comentários');

				// alterar a cor do feature em função da alteração do estado
				// se houve alteração do estado...
				if (params.idestado) {
					var novo = params.idestado;
					var estado = me.getParticipationEstadoComboStore().findRecord('id', novo);
					var cor = estado.get('color');
					var d = button.up('discussion');
					// Qual é a nova cor?
					d.feature.attributes['color'] = cor;
					d.feature.layer.drawFeature(d.feature);
				}
			} else {
				Ext.Msg.alert('Erro', 'Ocorreu um erro ao registar o seu comentário.');
			}
		});
	},
	onButtonRefresh : function(button, e, options) {
		var o = button.up('discussion').idocorrencia;
		var p = button.up('panel');
		// console.log(p);

		ExtRemote.DXParticipacao.readComment(o, function(result, event) {
			if (result.success) {
				console.log(JSON.stringify(result.data));
				console.log(result.total);

				p.update(result.data);

			} else {
				console.log('Problemas no refresh');
			}
		});

	}
});
