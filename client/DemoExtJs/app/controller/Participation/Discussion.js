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
			}
		});
	},
	onButtonGravar : function(button, e, options) {
		var fc = button.up('form').getForm();
		var params = fc.getValues(false, false, false, false);
		ExtRemote.DXParticipacao.createComment(params, function(result, event) {
			if (result.success) {
				Ext.Msg.alert('Successo', 'O seu comentário foi registado. Obrigado pela participação.');
				console.log(result.data[0].id);
				// limpar o formulário!
				fc.findField('comentario').setValue('');
			} else {
				Ext.Msg.alert('Erro', 'Ocorreu um erro ao registar o seu comentário.');
			}
		});

	},
	onButtonRefresh : function(button, e, options) {
		var o = button.up('discussion').idocorrencia;
		var p = button.up('panel');
		// console.log(p);
		
		/*
		var ana = {
			total : 5,
			comentarios : [{
				comentario : 'A pipoca mais doce',
				idutilizador : 3
			}, {
				comentario : 'O arrumadinho',
				idutilizador : 2
			}, {
				comentario : 'Benfica perdeu',
				idutilizador : 0
			}, {
				comentario : 'O Porto ganhou por 6 a zero',
				idutilizador : 0
			}]
		};
		p.update(ana);
		*/
		
		ExtRemote.DXParticipacao.readComment(o, function(result, event) {
			if (result.success) {
				console.log(result.data);
				console.log(result.total);
				
				p.update(result.data);
				
			} else {
				console.log('Problemas no refresh');
			}
		});
				
		
	}
});
