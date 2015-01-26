Ext.define('GeoPublic.controller.Participation.Contribution', {
    extend: 'Ext.app.Controller',
    stores: ['Ocorrencia'],
    // Ext.ComponentQuery.query('contribution form#photos filefield#instantaneo')
    refs: [{
        selector: 'contribution',
        ref: 'contribution' // gera um getContribution
    }, {
        selector: 'contribution form#detail',
        ref: 'formContribution' // gera um getFormContribution
    }, {
        selector: 'contribution toolbar#contributiontb tbtext',
        ref: 'contributionCoordinates' // gera um getContributionCoordinates()
    }, {
        selector: 'contribution toolbar button#gravar',
        ref: 'buttonGravar' // gera um getButtonGravar()
    }, {
        selector: 'contribution form#photos',
        ref: 'formPhotos' // gera um getFormPhotos
    }, {
        selector: 'contribution fotografiatmp',
        ref: 'fotografiatmp' // gera um getFotografiatmp, panel com dataview
    }, {
        selector: 'contribution fotografiatmp dataview',
        ref: 'dataview' // gera um getDataview
    }, {
        ref: 'comboplano', // this.getComboplano()
        selector: 'app-main-map-panel combo#plano'
    }, {
        ref: 'mapa',
        selector: 'app-main-map-panel'
    }, {
        ref: 'todasDiscussoes',
        selector: 'activity #flow'
    }],
    init: function () {
        this.control({
            "contribution form#detail": {
                fieldvaliditychange: this.updateErrorState
            },
            "contribution toolbar button#gravar": {
                click: this.onButtonGravar
            },
            "contribution": {
                beforeexpand: this.onContributionBeforeExpand
            },
            "contribution toolbar button#limpar": {
                click: this.onButtonLimpar
            },
            "contribution toolbar button#redigir": {
                // click: this.onButtonRedigir,
                toggle: this.onToggleButtonRedigir
            },
            "contribution form#photos filefield#instantaneo": {
                change: this.onButtonUpload
            },
            "contribution form#photos button#remove": {
                click: this.onButtonRemoverInstantaneo
            },
            "discussion tool[type=gear]": {
                click: this.onEditParticipation
            },
            "discussion tool[type=close]": {
                click: this.onRemoveParticipation
            }
        });
        this.listen({
            controller: {
                '*': {
                    featureAdded: this.onFeatureAdded // me.fireEvent('featureAdded') in GeoPublic.controller.MainMapPanel
                }
            }
        });
    },
    /*
     Este método também existe em controller/.../Discussion.js
     Existe uma ligeira diferença, pois este não seleciona o feature (e a discussão)
     Este métodp é invocado quendo se edita uma participação
     */
    onCenterFeature: function (tool, e) {
        // console.log(arguments);
        var ocorrencia = tool.up('panel').idocorrencia;
        var feature = tool.up('panel').feature;
        console.log('Contribution.onCenterFeature - Vai centrar na ocorrência ' + ocorrencia);
        if (feature) {
            var mapa = feature.layer.map;
            var layer = feature.layer;
            var control = mapa.getControlsBy("id", "selectCtrl")[0];
            if (control) {
                control.unselectAll();
                // control.select(feature);
                mapa.zoomToExtent(feature.geometry.getBounds(), closest = true);
            } else {
                console.log('PROBLEMA: Não encontro o control no mapa');
            }
        }
    },
    onToggleButtonRedigir: function (button, pressed) {
        console.log('Contribution.onToggleButtonRedigir - Vai propor nova redação na ocorrência ');

        var regulamento = button.up('discussao-regulamento');
        var proposta = regulamento.proposta;
        var idsec = '#' + regulamento.down('#secretaria').id;

        if (pressed) {
            $(idsec).mergely('rhs', proposta);
            $(idsec).mergely('cm', 'rhs').setOption('readOnly', false);
            $(idsec).mergely('options', {autoupdate: true});
            $(idsec).mergely('update');
        } else {
            $(idsec).mergely('options', {autoupdate: false});
            $(idsec).mergely('update');
            $(idsec).mergely('clear', 'rhs');
            $(idsec).mergely('cm', 'rhs').setOption('readOnly', true);
        }
    },
    onButtonRedigir: function (button, e) {
        console.log('Contribution.onButtonRedigir - Vai propor nova redação na ocorrência ');

        // TODO
        var regulamento = button.up('discussao-regulamento');
        var proposta = regulamento.proposta;
        var idsec = '#' + regulamento.down('#secretaria').id;

        $(idsec).mergely('rhs', proposta);
        $(idsec).mergely('cm', 'rhs').setOption('readOnly', false);
        $(idsec).mergely('options', {autoupdate: true});
        $(idsec).mergely('update');
    },
    onEditParticipation: function (tool, e) {
        // console.log('Editar a sua participação: ' + tool.up('panel').idocorrencia + ' do utilizador ' + tool.up('panel').idutilizador);
        var me = this;
        // eventualmente limpar alguma edição anterior
        var contribution = tool.up('activitynew').down('contribution');
        var activity = contribution.up('activitynew');
        var contributionForm = contribution.down('form#detail');
        contribution.expand(true);

        var mapPanel = null;
        var featureId = null;
        if (activity.geodiscussao) {
            mapPanel = tool.up('discussao-geografica').down('mapa');
            // centrar na participação, para poder editar a componente geográfica
            me.onCenterFeature(tool, e);
            featureId = tool.up('panel').feature.id;
            contributionForm.featureoriginal = tool.up('panel').feature;
        }
        me.limparFormulario(contribution, mapPanel);

        contributionForm.getForm().setValues({
            idocorrencia: tool.up('panel').idocorrencia,
            feature: featureId, // not fid
            titulo: tool.up('panel').title,
            idtipoocorrencia: tool.up('panel').idtipoocorrencia,
            participacao: tool.up('panel').participacao
        });

        // Mudar o título do painel...
        // Depois é preciso reverter o título
        contribution.setTitle('Edit participation'.translate());
        // Mudar o botão do painel...
        // Depois é preciso reverter o botão
        // console.log(this.getButtonGravar());

        var buttonGravar = contribution.down('button#gravar');
        buttonGravar.setText('Update'.translate());

        if (activity.geodiscussao) {
            var f = tool.up('panel').feature;
            // console.log(f);
            // console.log('Vou remover a propriedade fid');
            delete f.fid;
            var novo = new OpenLayers.LonLat(f.geometry.x, f.geometry.y).transform(f.layer.map.getProjectionObject(), new OpenLayers.Projection("EPSG:4326"));
            // contribution toolbar#contributiontb tbtext
            var contributionCoordinates = contribution.down('toolbar#contributiontb').down('tbtext#coordinates');
            contributionCoordinates.setText(novo.lon.toFixed(5) + ' ' + novo.lat.toFixed(5));
        } else {
            // TODO
            var idsec = '#' + activity.up('discussao-regulamento').down('#secretaria').id;
            var proposta = tool.up('panel').proposta;
            if (Ext.isDefined(proposta) && proposta.length > 0) {
                console.log('Existe proposta para editar', proposta.substr(0, 40));
            } else {
                console.log('Não existe proposta para editar');
                proposta = $(idsec).mergely('get', 'lhs');
            }
            $(idsec).mergely('rhs', proposta);
        }
        var params = {idocorrencia: tool.up('panel').idocorrencia};
        ExtRemote.DXParticipacao.prepareEditOcorrencia(params, function (result, event) {
            if (result.success) {
                // console.log('Porreio. As fotos foram copiadas para a tmp.');
                // depois do copiar as fotografias para a tabela tmp...
                contribution.down('fotografiatmp').getStore().load();
            } else {
                // console.log('Deu raia a copiar as fotos para a temp.');
            }
        });
    },
    onRemoveParticipation: function (tool, e) {
        // painel de discussão; não o formulário...
        // console.log('Remover a sua participação: ' + tool.up('panel').idocorrencia + ' do utilizador ' + tool.up('panel').idutilizador);
        var me = this;
        Ext.Msg.confirm('Attention', 'Are you sure you want to delete this participation?', function (buttonId, text, opt) {
            if (buttonId == 'yes') {
                var id = tool.up('panel').idocorrencia;
                var feature = tool.up('panel').feature;
                var params = {idocorrencia: id};
                ExtRemote.DXParticipacao.destroyOcorrencia(params, function (result, event) {
                    if (result.success) {
                        Ext.example.msg('Success', 'Participation was successfully removed');
                        // console.log('Porreio. A participação foi removida.');
                        // tenho que destruir a discussão e o feature do OpenLayers
                        // Remover esta discussão da lista

                        var vitima = null;
                        // activity #flow
                        var todasDiscussoes = tool.up('activitynew').down('#flow');
                        console.log(todasDiscussoes);

                        todasDiscussoes.query('discussion').forEach(function (c) {
                            console.log('Vai comparar com a discussão: ' + c.idocorrencia + ' ' + c.title + ' com o id ' + id);
                            if (c.idocorrencia == id) {
                                vitima = c;
                                // console.log('Encontrada! Vai remover a discussão: ' + c.title);
                            }
                        });
                        if (vitima) {
                            console.log('Vai remover o painel', vitima);
                            todasDiscussoes.remove(vitima);
                            if (feature) {
                                var mapa = feature.layer.map;
                                var layer = feature.layer;
                                layer.removeFeatures([feature]);
                            }
                        }
                    } else {
                        // console.log('Deu raia a remover a participação.');
                        Ext.MessageBox.show({
                            title: 'Error'.translate(),
                            msg: 'Error deleting participation'.translate(),
                            icon: Ext.MessageBox.ERROR,
                            buttons: Ext.Msg.OK
                        });
                    }
                });
            }
        });
    },
    onFeatureAdded: function (event, contrib) {
        // TODO
        var f = event.feature;
        console.log("onFeatureAdded ", f);
        var form = contrib.down('form#detail');
        var buttonGravar = contrib.down('button#gravar');
        console.log(form.getForm().isValid() ? 'sim' : 'nao');
        if (form.getForm().isValid()) {
            buttonGravar.enable();
        } else {
            buttonGravar.disable();
        }
    },
    updateErrorState: function (form, field, valid) {
        // console.log("updateErrorState ");
        // manually bind button to form
        // console.log(arguments);
        var buttonGravar = form.up('contribution').down('button#gravar');
        if (form.up('activitynew').geodiscussao) {
            var fid = form.getForm().findField('feature').getValue();
            // console.log('fid = ' + fid);
            // console.log(form.getForm().isValid() ? 'sim' : 'nao');
            if (fid && form.getForm().isValid()) {
                buttonGravar.enable();
            } else {
                buttonGravar.disable();
            }
        } else {
            if (form.getForm().isValid()) {
                buttonGravar.enable();
            } else {
                buttonGravar.disable();
            }
        }
    },
    onContributionBeforeExpand: function (p, animate, eOpts) {
        // console.log("onContributionBeforeExpand: só abre se o utilizador estiver logginado");
        if (GeoPublic.LoggedInUser) {
            var plano = p.up('activitynew').idplano;
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
    onButtonRemoverInstantaneo: function (button, e, options) {
        // console.log("onButtonRemoverInstantaneo");
        // contribution fotografiatmp dataview
        var dv = button.up('contribution').down('fotografiatmp').down('dataview');
        var selNodes = dv.getSelectedNodes();
        var selRecs = dv.getRecords(selNodes);
        var fotografiaTmp = button.up('contribution').down('fotografiatmp');
        fotografiaTmp.getStore().remove(selRecs);
    },
    onButtonUpload: function (button, e, options) {
        var me = this;
        var formPhotos = button.up('contribution').down('form#photos');
        console.log("onButtonUpload", formPhotos);
        formPhotos.getForm().submit({
            waitMsg: 'Uploading your photo...'.translate(),
            success: function (fp, o) {
                console.log(o.result);
                // Ext.Msg.alert('Success', 'Your photo has been uploaded.<br> File size:' + o.result.size + ' bytes.');
                // posso ler o store com as foto inseridas até agora...
                var fotografiaTmp = button.up('contribution').down('fotografiatmp');
                fotografiaTmp.getStore().load();
            },
            failure: function (form, action) {
                console.log(arguments);
                Ext.MessageBox.show({
                    title: 'Error',
                    msg: 'Error uploading file'.translate(),
                    icon: Ext.MessageBox.ERROR,
                    buttons: Ext.Msg.OK
                });
            }
        });
    },
    onButtonGravar: function (button, e, options) {
        var me = this;
        var contribution = button.up('contribution');
        var activity = contribution.up('activitynew');
        var contributionForm = contribution.down('form#detail');

        // this getValues get all values of the form#detail
        var params = contributionForm.getForm().getValues(false, true, false, false);
        // console.log(params);

        if (activity.geodiscussao) {
            console.log('Gravar participação em geodiscussao');
            var mapPanel = button.up('discussao-geografica').down('mapa');
            var fid = contributionForm.getForm().findField('feature').getValue();
            if (fid) {
                var report = mapPanel.map.getLayersByName('Report')[0];
                var f = report.getFeatureById(fid);
                var ponto = f.geometry;

                // var ponto = this.getMapa().map.getExtent().toGeometry().getCentroid();
                var parser = new OpenLayers.Format.GeoJSON();
                var pontoasjson = parser.write(ponto);
                // console.log(pontoasjson);

                var id = contributionForm.getForm().findField('idocorrencia').getValue();
                if (parseInt(id, 10) > 0) {
                    // console.log('Vamos alterar a ocorrência ' + id);
                    // Gravo
                    // e depois como atualizo a discussao?
                    // i) destruo a discussão anterior (só esta e mais nenhuma)
                    // ii) leio apenas esta discussão
                    Ext.apply(params, {
                        idocorrencia: id,
                        the_geom: pontoasjson
                    });
                    ExtRemote.DXParticipacao.updateOcorrencia(params, function (result, event) {
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
                            contributionForm.featureoriginal = null;
                            me.limparFormulario(contribution, mapPanel);

                            // ao alterar os campos, o updateErrorState desactiva o form
                            // this.getButtonGravar().disable();

                            // Remover esta discussão da lista
                            var vitima = null;
                            var todasDiscussoes = activity.down('#flow');
                            todasDiscussoes.query('discussion').forEach(function (c) {
                                // console.log('Vai comparar com a discussão: ' + c.idocorrencia + ' ' + c.title + ' com o id ' + id);
                                if (c.idocorrencia == id) {
                                    vitima = c;
                                    // console.log('Encontrada! Vai remover a discussão: ' + c.title);
                                }
                            });
                            if (vitima) {
                                todasDiscussoes.remove(vitima);
                            }

                            // acrescentar esta ocorrência
                            // o ponto já está no mapa :-)
                            // pode-se remover que vai ser acrescentado outro quando se ler o store
                            // Ao ler o store, estamos a acrescentar ocorrencias :-)

                            var ostore = activity.up('discussao-geografica').getStoreOcorrencias();
                            ostore.load({
                                params: {
                                    id: id
                                }
                            });
                        } else {
                            Ext.Msg.alert('Error'.translate(), 'Error saving changes'.translate());
                        }
                    });
                } else {
                    // console.log('Vamos gravar uma nova ocorrência');
                    var plano = activity.idplano;
                    // console.log(params);
                    Ext.apply(params, {
                        idplano: plano,
                        idestado: 1, // todo
                        the_geom: pontoasjson
                    });
                    // console.log(params);
                    ExtRemote.DXParticipacao.createOcorrencia(params, function (result, event) {
                        if (result.success) {
                            Ext.Msg.alert('Successo', 'As alterações foram gravadas com sucesso.');
                            // console.log(result.data[0].id);
                            // console.log(result.dataphoto);
                            // associar o id ao fid do novo feature inserido no openlayers

                            // f.fid = result.data[0].id;
                            // f.state = null;
                            // limpar o formulário!
                            me.limparFormulario(contribution, mapPanel);

                            // ao alterar os campos, o updateErrorState desactiva o form
                            // this.getButtonGravar().disable();

                            // acrescentar esta ocorrência
                            // o ponto já está no mapa :-)
                            // pode-se remover que vai ser acrescentado outro quando se ler o store
                            // Ao ler o store, estamos a acrescentar ocorrencias :-)

                            var ostore = activity.up('discussao-geografica').getStoreOcorrencias();
                            ostore.load({
                                params: {
                                    id: result.data[0].id
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
        } else {
            console.log('Gravar participação em discussão de paleio...');
            // TODO
            var idsec = '#' + activity.up('discussao-regulamento').down('#secretaria').id;
            var proposta = $(idsec).mergely('get', 'rhs');
            var diff = $(idsec).mergely('diff');
            if (diff.length > 0) {
                console.log(diff.substr(0, 100));
            } else {
                console.log('Sem redação proposta. Não adianta gravar.');
                proposta = '';
            }
            var id = contributionForm.getForm().findField('idocorrencia').getValue();
            if (parseInt(id, 10) > 0) {
                // console.log('Vamos alterar a ocorrência ' + id);
                // Gravo
                // e depois como atualizo a discussao?
                // i) destruo a discussão anterior (só esta e mais nenhuma)
                // ii) leio apenas esta discussão
                Ext.apply(params, {
                    idocorrencia: id,
                    proposta: proposta
                });
                ExtRemote.DXParticipacao.updateOcorrencia(params, function (result, event) {
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
                        // contributionForm.featureoriginal = null;
                        me.limparFormulario(contribution, null);

                        // ao alterar os campos, o updateErrorState desactiva o form
                        // this.getButtonGravar().disable();

                        // Remover esta discussão da lista
                        var vitima = null;
                        var todasDiscussoes = activity.down('#flow');
                        todasDiscussoes.query('discussion').forEach(function (c) {
                            // console.log('Vai comparar com a discussão: ' + c.idocorrencia + ' ' + c.title + ' com o id ' + id);
                            if (c.idocorrencia == id) {
                                vitima = c;
                                // console.log('Encontrada! Vai remover a discussão: ' + c.title);
                            }
                        });
                        if (vitima) {
                            todasDiscussoes.remove(vitima);
                        }

                        // acrescentar esta ocorrência
                        // o ponto já está no mapa :-)
                        // pode-se remover que vai ser acrescentado outro quando se ler o store
                        // Ao ler o store, estamos a acrescentar ocorrencias :-)

                        var ostore = activity.up('discussao-regulamento').getStoreOcorrencias();
                        ostore.load({
                            params: {
                                id: id
                            }
                        });
                    } else {
                        Ext.Msg.alert('Error'.translate(), 'Error saving changes'.translate());
                    }
                });
            } else {
                // console.log('Vamos gravar uma nova ocorrência');
                var plano = activity.idplano;
                // console.log(params);
                Ext.apply(params, {
                    idplano: plano,
                    idestado: 1, // TODO
                    proposta: proposta
                });
                // console.log(params);
                ExtRemote.DXParticipacao.createOcorrencia(params, function (result, event) {
                    if (result.success) {
                        Ext.Msg.alert('Successo', 'As alterações foram gravadas com sucesso.');
                        // console.log(result.data[0].id);
                        // console.log(result.dataphoto);
                        // associar o id ao fid do novo feature inserido no openlayers

                        // f.fid = result.data[0].id;
                        // f.state = null;
                        // limpar o formulário!
                        me.limparFormulario(contribution, null);

                        // ao alterar os campos, o updateErrorState desactiva o form
                        // this.getButtonGravar().disable();

                        // acrescentar esta ocorrência
                        // o ponto já está no mapa :-)
                        // pode-se remover que vai ser acrescentado outro quando se ler o store
                        // Ao ler o store, estamos a acrescentar ocorrencias :-)

                        var ostore = activity.up('discussao-regulamento').getStoreOcorrencias();
                        ostore.load({
                            params: {
                                id: result.data[0].id
                            }
                        });
                    } else {
                        Ext.Msg.alert('Error', 'Error saving changes');
                    }
                });
            }
        }
    },
    limparFormulario: function (contribution, mapPanel) {
        var formContribution = contribution.down('form#detail');

        if (contribution.geodiscussao) {
            console.log('Vamos limpar uma contribuição geográfica!');
            var report = mapPanel.map.getLayersByName('Report')[0];
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
            var idocorrencia = formContribution.getForm().findField('idocorrencia').getValue();
            if (idocorrencia > 0) {
                // console.log('Estava em modo de edição da ocorrência ' + idocorrencia);
                // Vai limpar o feature que etava em modo temporário
                // isto, sem fid.
                // o feature pode ter sido mudado, quero po-lo na posição original.
                var old = formContribution.featureoriginal;
                // console.log('Recuperar o feature existente?');
                // console.debug(old);
                if (old) {
                    // console.log('Vamos recuperar o feature tal como estava antes de editar');
                    old.fid = idocorrencia;
                    report.addFeatures([old]);
                    formContribution.featureoriginal = null;
                } else {
                    // console.log('O feature foi editado e gravado. Fixe.');
                }
            } else {
                // console.log('Estava em modo de novo');
            }
            var coordinates = contribution.down('tbtext#coordinates');
            coordinates.setText('Location missing'.translate());
        } else {
            // limpa rhs e põe a readOnly
            var idsec = '#' + contribution.up('discussao-regulamento').down('#secretaria').id;
            $(idsec).mergely('options', {autoupdate: false});
            $(idsec).mergely('update');
            $(idsec).mergely('clear', 'rhs');
            $(idsec).mergely('cm', 'rhs').setOption('readOnly', true);
        }

        Ext.each(formContribution.getForm().getFields().items, function (field) {
            field.setValue('');
        });

        formContribution.getForm().clearInvalid();

        var formFotografiaTmp = contribution.down('fotografiatmp');
        formFotografiaTmp.getStore().removeAll();

        // If the user was editing the participation, we must revert the panel title and button title
        contribution.setTitle('New participation'.translate());
        contribution.down('button#gravar').setText('Participate'.translate());
    },
    onButtonLimpar: function (button, e, options) {
        var contribution = button.up('contribution');
        var mapPanel = null;
        if (contribution.geodiscussao) {
            mapPanel = button.up('discussao-geografica').down('mapa');
        }
        this.limparFormulario(contribution, mapPanel);

        var task = new Ext.util.DelayedTask(function () {
            contribution.collapse(true);
        });
        task.delay(2500);
    }
});
