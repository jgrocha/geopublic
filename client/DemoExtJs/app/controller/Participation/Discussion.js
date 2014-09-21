Ext.define('DemoExtJs.controller.Participation.Discussion', {
	extend : 'Ext.app.Controller',
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
			"discussion #commentlist" : {
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
	y : [{
		"id" : 27,
		"comentario" : "Na verdade, há qualquer problema.",
		"datacriacao" : "2014-09-19T22:00:25.288Z",
		"datamodificacao" : "2014-09-19T22:00:25.288Z",
		"idocorrencia" : 3,
		"idutilizador" : 31,
		"idestado" : 1
	}],
	onButtonGravar : function(button, e, options) {
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

				var p = button.up('discussion').down('#commentlist');
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
