Ext.define('GeoPublic.controller.Participation.Contribution', {
	extend : 'Ext.app.Controller',
	stores : ['Ocorrencia'],
	// Ext.ComponentQuery.query('contribution form#photos filefield#instantaneo')
	refs : [{
		selector: 'contribution',
		ref: 'contribution' // gera um getContribution
	}, {
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
			},
			"discussion tool[type=gear]" : {
				click : this.onEditParticipation
			},
			"discussion tool[type=close]" : {
				click : this.onRemoveParticipation
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
	/*
	Este método também existe em controller/.../Discussion.js
	Existe uma ligeira diferença, pois este não seleciona o feature (e a discussão)
	 */
	onCenterFeature : function(tool, e) {
		// console.log(arguments);
		var ocorrencia = tool.up('panel').idocorrencia;
		console.log('Vai centrar na ocorrência ' + ocorrencia);
		var mapa = this.getMapa().map;
		var layer = mapa.getLayersByName('Report')[0];
		var feature = tool.up('panel').feature;
		this.getMapa().selectCtrl.unselectAll();
		// this.getMapa().selectCtrl.select(feature);
		mapa.zoomToExtent(feature.geometry.getBounds(), closest = true);
	},
	onEditParticipation : function(tool, e) {
		// console.log('Editar a sua participação: ' + tool.up('panel').idocorrencia + ' do utilizador ' + tool.up('panel').idutilizador);
		var me = this;
		// eventualmente limpar alguma edição anterior
		me.onButtonLimpar(null, e, null);

		// centrar na participação, para poder editar a componente geográfica
		me.onCenterFeature(tool, e);

		this.getContribution().expand(true);
		this.getFormContribution().getForm().setValues({
			idocorrencia : tool.up('panel').idocorrencia,
			feature : tool.up('panel').feature.id, // not fid
			titulo: tool.up('panel').title,
			idtipoocorrencia: tool.up('panel').idtipoocorrencia,
			participacao: tool.up('panel').participacao
		});
		this.getFormContribution().featureoriginal = tool.up('panel').feature;

		// Mudar o título do painel...
		// Depois é preciso reverter o título
		this.getContribution().setTitle('Edit participation'.translate());
		// Mudar o botão do painel...
		// Depois é preciso reverter o botão
		// console.log(this.getButtonGravar());
		this.getButtonGravar().setText('Update'.translate());

		var f = tool.up('panel').feature;
		// console.log(f);
		// console.log('Vou remover a propriedade fid');
		delete f.fid;
		var novo = new OpenLayers.LonLat(f.geometry.x, f.geometry.y).transform(f.layer.map.getProjectionObject(), new OpenLayers.Projection("EPSG:4326"));
		this.getContributionCoordinates().setText(novo.lon.toFixed(5) + ' ' + novo.lat.toFixed(5));

		var params = { idocorrencia: tool.up('panel').idocorrencia};
		ExtRemote.DXParticipacao.prepareEditOcorrencia(params, function(result, event) {
			if (result.success) {
				// console.log('Porreio. As fotos foram copiadas para a tmp.');
				// depois do copiar as fotografias para a tablea tmp...
				me.getFotografiatmp().store.load();
			} else {
				// console.log('Deu raia a copiar as fotos para a temp.');
			}
		});
	},
	onRemoveParticipation : function(tool, e) {
		// console.log('Remover a sua participação: ' + tool.up('panel').idocorrencia + ' do utilizador ' + tool.up('panel').idutilizador);
		var me = this;
		Ext.Msg.confirm( 'Attention', 'Are you sure you want to delete this participation?', function( buttonId, text, opt ) {
			if( buttonId=='yes' ) {
				var id = tool.up('panel').idocorrencia;
				var feature = tool.up('panel').feature;
				var params = { idocorrencia: id};
				ExtRemote.DXParticipacao.destroyOcorrencia(params, function(result, event) {
					if (result.success) {
						Ext.example.msg('Success', 'Participation was successfully removed');
						// console.log('Porreio. A participação foi removida.');
						// tenho que destruir a discussão e o feature do OpenLayers
						// Remover esta discussão da lista
						var vitima = null;
						me.getTodasDiscussoes().query('discussion').forEach(function (c) {
							// console.log('Vai comparar com a discussão: ' + c.idocorrencia + ' ' + c.title + ' com o id ' + id);
							if (c.idocorrencia == id) {
								vitima = c;
								// console.log('Encontrada! Vai remover a discussão: ' + c.title);
							}
						});
						if (vitima) {
							var report = me.getMapa().map.getLayersByName('Report')[0];
							report.removeFeatures([feature]);
							me.getTodasDiscussoes().remove(vitima);
						}
					} else {
						// console.log('Deu raia a remover a participação.');
						Ext.MessageBox.show({
							title : 'Error'.translate(),
							msg : 'Error deleting participation'.translate(),
							icon : Ext.MessageBox.ERROR,
							buttons : Ext.Msg.OK
						});
					}
				});

			}
		});
	},
	onFeatureAdded : function() {
		// console.log("onFeatureAdded ");
		var form = this.getFormContribution();
		// console.log(form.getForm().isValid() ? 'sim' : 'nao');
		if (form.getForm().isValid()) {
			this.getButtonGravar().enable();
		} else {
			this.getButtonGravar().disable();
		}
	},
	updateErrorState : function(form, field, valid) {
		// console.log("updateErrorState ");
		// manually bind button to form
		// console.log(arguments);
		var fid = form.getForm().findField('feature').getValue();
		// console.log('fid = ' + fid);
		// console.log(form.getForm().isValid() ? 'sim' : 'nao');
		if (fid && form.getForm().isValid()) {
			this.getButtonGravar().enable();
		} else {
			this.getButtonGravar().disable();
		}
	},
	onContributionBeforeExpand : function(p, animate, eOpts) {
		// console.log("onContributionBeforeExpand: só abre se o utilizador estiver logginado");
		if (GeoPublic.LoggedInUser) {
			var plano = this.getComboplano().getValue();
			if (plano) {
				return true;
			} else {
				Ext.example.msg('Participation'.translate(), 'You need to choose a plan to participate'.translate());
				return false;
			}
		} else {
			Ext.example.msg('Participation'.translate(), 'You need to authenticate to participate'.translate());
			return false;
		}
	},
	onButtonRemoverInstantaneo : function(button, e, options) {
		// console.log("onButtonRemoverInstantaneo");
		var selNodes = this.getDataview().getSelectedNodes();
		var selRecs = this.getDataview().getRecords(selNodes);
		this.getFotografiatmp().store.remove(selRecs);
	},
	onButtonUpload : function(button, e, options) {
		var me = this;
		// console.log("onButtonUpload");
		me.getFormPhotos().getForm().submit({
			waitMsg : 'Uploading your photo...'.translate(),
			success : function(fp, o) {
				// console.log(o.result);
				// Ext.Msg.alert('Success', 'Your photo has been uploaded.<br> File size:' + o.result.size + ' bytes.');
				// posso ler o store com as foto inseridas até agora...
				me.getFotografiatmp().store.load();
			},
			failure : function(form, action) {
				// console.log(arguments);
				Ext.MessageBox.show({
					title : 'Error',
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
		// console.log(fid);
		if (fid) {
			var report = me.getMapa().map.getLayersByName('Report')[0];
			var f = report.getFeatureById(fid);
			var ponto = f.geometry;

			// var ponto = this.getMapa().map.getExtent().toGeometry().getCentroid();
			var parser = new OpenLayers.Format.GeoJSON();
			var pontoasjson = parser.write(ponto);
			// console.log(pontoasjson);

			var id = me.getFormContribution().getForm().findField('idocorrencia').getValue();
			if (parseInt(id, 10) > 0) {
				// console.log('Vamos alterar a ocorrência ' + id);
				// Gravo
				// e depois como atualizo a discussao?
				// i) destruo a discussão anterior (só esta e mais nenhuma)
				// ii) leio apenas esta discussão
				Ext.apply(params, {
					idocorrencia : id,
					the_geom : pontoasjson
				});
				ExtRemote.DXParticipacao.updateOcorrencia(params, function(result, event) {
					if (result.success) {
						Ext.example.msg('Success'.translate(), 'Changes were successfully saved');
						// Ext.Msg.alert('Successo', 'As alterações foram gravadas com sucesso.');
						// console.log(result.data[0].id);
						// console.log(result.dataphoto);
						// associar o id ao fid do novo feature inserido no openlayers
						// pode ter havido alteração do feature
						// f.fid = id;
						// f.state = null;
						// limpar o formulário!

						// se fizemos alterações, não precisamos de recuperar o feature original
						// quando se faz o limpar
						me.getFormContribution().featureoriginal = null;
						me.onButtonLimpar(button, e, options);

						// ao alterar os campos, o updateErrorState desactiva o form
						// this.getButtonGravar().disable();

						// Remover esta discussão da lista
						var vitima = null;
						me.getTodasDiscussoes().query('discussion').forEach(function (c) {
							// console.log('Vai comparar com a discussão: ' + c.idocorrencia + ' ' + c.title + ' com o id ' + id);
							if (c.idocorrencia == id) {
								vitima = c;
								// console.log('Encontrada! Vai remover a discussão: ' + c.title);
							}
						});
						if (vitima) {
							me.getTodasDiscussoes().remove(vitima);
						}

						// acrescentar esta ocorrência
						// o ponto já está no mapa :-)
						// pode-se remover que vai ser acrescentado outro quando se ler o store
						// Ao ler o store, estamos a acrescentar ocorrencias :-)

						var ostore = me.getOcorrenciaStore();
						ostore.load({
							params : {
								id : id
							}
						});
					} else {
						Ext.Msg.alert('Error'.translate(), 'Error saving changes'.translate());
					}
				});
			} else {
				// console.log('Vamos gravar uma nova ocorrência');
				var plano = me.getComboplano().getValue();
				// console.log(params);
				Ext.apply(params, {
					idplano : plano,
					idestado : 1, // todo
					the_geom : pontoasjson
				});
				// console.log(params);
				ExtRemote.DXParticipacao.createOcorrencia(params, function(result, event) {
					if (result.success) {
						Ext.Msg.alert('Successo', 'As alterações foram gravadas com sucesso.');
						// console.log(result.data[0].id);
						// console.log(result.dataphoto);
						// associar o id ao fid do novo feature inserido no openlayers

						// f.fid = result.data[0].id;
						// f.state = null;
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
						Ext.Msg.alert('Error', 'Error saving changes');
					}
				});
			}
		} else {
			Ext.Msg.alert('Attention'.translate(), 'You must provide the location on the map'.translate());
		}
	},
	onButtonLimpar : function(button, e, options) {
		var me = this;

		var report = me.getMapa().map.getLayersByName('Report')[0];
		var n = report.features.length;
		var toremove = [];
		// console.log('Limpar os features temporarios. Percorrer ' + n + ' features existentes.');
		for (var i = 0; i < n; i++) {
			if (report.features[i].fid == null) {
				// console.log('Remove: ', report.features[i].id);
				toremove.push(report.features[i]);
			}
		}
		report.removeFeatures(toremove);

		var idocorrencia = me.getFormContribution().getForm().findField('idocorrencia').getValue();
		if (idocorrencia > 0) {
			// console.log('Estava em modo de edição da ocorrência ' + idocorrencia);
			// Vai limpar o feature que etava em modo temporário
			// isto, sem fid.
			// o feature pode ter sido mudado, quero po-lo na posição original.
			var old = me.getFormContribution().featureoriginal;
			// console.log('Recuperar o feature existente?');
			// console.debug(old);
			if (old) {
				// console.log('Vamos recuperar o feature tal como estava antes de editar');
				old.fid = idocorrencia;
				report.addFeatures([old]);
				me.getFormContribution().featureoriginal = null;
			} else {
				// console.log('O feature foi editado e gravado. Fixe.');
			}
		} else {
			// console.log('Estava em modo de novo');
		}

		Ext.each(this.getFormContribution().getForm().getFields().items, function(field) {
			field.setValue('');
		});

		this.getFormContribution().getForm().clearInvalid();

		this.getFotografiatmp().store.removeAll();
		this.getContributionCoordinates().setText('Location missing'.translate());

		// If the user was editing the participation, we must revert the panel title and button title
		this.getContribution().setTitle('New participation'.translate());
		this.getButtonGravar().setText('Participate'.translate());

		/*
		Faz sentido collapsar o form se e só se se carregar no botão limpar.
		Como onButtonLimpar é chamado em vários sítios, é preciso testar quem o chamou para se poder colapsar.

		var task = new Ext.util.DelayedTask(function(){
			me.getContribution().collapse(true);
		});
		task.delay(1000);
		*/

	}
});
