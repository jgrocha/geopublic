Ext.define('GeoPublic.controller.Participation.Contribution', {
	extend : 'Ext.app.Controller',
	stores : ['Ocorrencia'],
	// Ext.ComponentQuery.query('contribution form#photos filefield#instantaneo')
	refs : [{
		selector : 'contribution form#detail',
		ref : 'formContribution' // gera um getFormContribution
	}, {
		selector : 'contribution toolbar#contributiontb tbtext',
		ref : 'contributionCoordinates' // gera um getContributionCoordinates()
	}, {
		selector : 'contribution toolbar button#gravar',
		ref : 'buttonGravar' // gera um getButtonGravar()
	}, {
		selector : 'contribution form#photos',
		ref : 'formPhotos' // gera um getFormPhotos
	}, {
		selector : 'contribution fotografiatmp',
		ref : 'fotografiatmp' // gera um getFotografiatmp, panel com dataview
	}, {
		selector : 'contribution fotografiatmp dataview',
		ref : 'dataview' // gera um getDataview
	}, {
		ref : 'comboplano', // this.getComboplano()
		selector : 'app-main-map-panel combo#plano'
	}, {
		ref : 'mapa',
		selector : 'app-main-map-panel'
	}, {
		ref : 'todasDiscussoes',
		selector : 'activity #flow'
	}],
	init : function() {
		this.control({
			"contribution form#detail" : {
				fieldvaliditychange : this.updateErrorState
			},
			"contribution toolbar button#gravar" : {
				click : this.onButtonGravar
			},
			"contribution" : {
				beforeexpand : this.onContributionBeforeExpand
			},
			"contribution toolbar button#limpar" : {
				click : this.onButtonLimpar
			},
			"contribution form#photos filefield#instantaneo" : {
				change : this.onButtonUpload
			},
			"contribution form#photos button#remove" : {
				click : this.onButtonRemoverInstantaneo
			}
		});
		this.listen({
			controller : {
				'*' : {
					changePlan : this.onButtonLimpar, // this.fireEvent('changePlan'); in GeoPublic.controller.MainMapPanel
					featureAdded : this.onFeatureAdded // me.fireEvent('featureAdded') in GeoPublic.controller.MainMapPanel
				}
			}
		});
	},
	onFeatureAdded : function() {
		console.log("onFeatureAdded ");
		var form = this.getFormContribution();
		console.log(form.getForm().isValid() ? 'sim' : 'nao');
		if (form.getForm().isValid()) {
			this.getButtonGravar().enable();
		} else {
			this.getButtonGravar().disable();
		}
	},
	updateErrorState : function(form, field, valid) {
		console.log("updateErrorState ");
		// manually bind button to form
		// console.log(arguments);
		var fid = form.getForm().findField('feature').getValue();
		console.log('fid = ' + fid);
		console.log(form.getForm().isValid() ? 'sim' : 'nao');
		if (fid && form.getForm().isValid()) {
			this.getButtonGravar().enable();
		} else {
			this.getButtonGravar().disable();
		}
	},
	onContributionBeforeExpand : function(p, animate, eOpts) {
		console.log("onContributionBeforeExpand: só abre se o utilizador estiver logginado");
		if (GeoPublic.LoggedInUser) {
			var plano = this.getComboplano().getValue();
			if (plano) {
				return true;
			} else {
				Ext.example.msg('Participar', 'Para participar, tem que ter um plano selecionado.');
				return false;
			}
		} else {
			Ext.example.msg('Participar', 'Para participar, tem que se autenticar.');
			return false;
		}
	},
	onButtonRemoverInstantaneo : function(button, e, options) {
		console.log("onButtonRemoverInstantaneo");
		var selNodes = this.getDataview().getSelectedNodes();
		var selRecs = this.getDataview().getRecords(selNodes);
		this.getFotografiatmp().store.remove(selRecs);
	},
	onButtonUpload : function(button, e, options) {
		var me = this;
		console.log("onButtonUpload");
		me.getFormPhotos().getForm().submit({
			waitMsg : 'Uploading your photo...'.translate(),
			success : function(fp, o) {
				console.log(o.result);
				// Ext.Msg.alert('Success', 'Your photo has been uploaded.<br> File size:' + o.result.size + ' bytes.');
				// posso ler o store com as foto inseridas até agora...
				me.getFotografiatmp().store.load();
			},
			failure : function(form, action) {
				console.log(arguments);
				Ext.MessageBox.show({
					title : 'EXCEPTION',
					msg : 'Error uploading file'.translate(),
					icon : Ext.MessageBox.ERROR,
					buttons : Ext.Msg.OK
				});
			}
		});
	},
	onButtonGravar : function(button, e, options) {
		var me = this;
		// this getValues get all values of the form#detail
		var params = me.getFormContribution().getForm().getValues(false, true, false, false);
		// console.log(params);
		var fid = me.getFormContribution().getForm().findField('feature').getValue();
		if (fid) {
			var report = me.getMapa().map.getLayersByName('Report')[0];
			var f = report.getFeatureById(fid);
			var ponto = f.geometry;
			// var ponto = this.getMapa().map.getExtent().toGeometry().getCentroid();
			var parser = new OpenLayers.Format.GeoJSON();
			var pontoasjson = parser.write(ponto);
			var plano = me.getComboplano().getValue();
			// console.log(params);
			Ext.apply(params, {
				idplano : plano,
				idestado : 1,
				the_geom : pontoasjson
			});
			ExtRemote.DXParticipacao.createOcorrencia(params, function(result, event) {
				if (result.success) {
					Ext.Msg.alert('Successo', 'As alterações foram gravadas com sucesso.');
					// console.log(result.data[0].id);
					// console.log(result.dataphoto);
					// associar o id ao fid do novo feature inserido no openlayers
					f.fid = result.data[0].id;
					f.state = null;
					// limpar o formulário!
					me.onButtonLimpar(button, e, options);

					// ao alterar os campos, o updateErrorState desactiva o form
					// this.getButtonGravar().disable();

					// acrescentar esta ocorrência
					// o ponto já está no mapa :-)
					// pode-se remover que vai ser acrescentado outro quando se ler o store
					// Ao ler o store, estamos a acrescentar ocorrencias :-)

					var ostore = me.getOcorrenciaStore();
					ostore.load({
						params : {
							id : result.data[0].id
						}
					});
				} else {
					Ext.Msg.alert('Erro', 'Ocorreu um erro ao gravar as alterações.');
				}
			});
		} else {
			Ext.Msg.alert('Atenção', 'Tem que indicar a localização da ocorrência.');
		}
	},
	onButtonLimpar : function(button, e, options) {
		Ext.each(this.getFormContribution().getForm().getFields().items, function(field) {
			field.setValue('');
		});

		this.getFormContribution().getForm().clearInvalid();

		this.getFotografiatmp().store.removeAll();
		this.getContributionCoordinates().setText('Sem localização');

		/*
		 * Mesmo que limpe o form, quero manter estes valores
		 * Só mudam, quando se escolher outro promotor ou plano
		 Ext.each(this.getFormPhotos().getForm().getFields().items, function(field) {
		 field.setValue('');
		 });
		 */
	}
});
