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
                toggle: this.onToggleButtonRedigir
            },
            "contribution form#photos filefield#instantaneo": {
                change: this.onButtonUpload
            },
            "contribution form#photos button#remove": {
                click: this.onButtonRemoverInstantaneo
            },
            /*
            "discussion tool[type=gear]": {
                click: this.onEditParticipation
            },
             "discussion tool[type=close]": {
             click: this.onRemoveParticipation
             },
            */
            "discussion toolbar#botoes-participacao button[action=edit-participation]" : {
                click : this.onEditParticipation
            },
            "discussion toolbar#botoes-participacao button[action=delete-participation]": {
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
        var ocorrencia = tool.up('discussion').idocorrencia;
        var feature = tool.up('discussion').feature;
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

        // vai-se buscar o documento original?
        // se for uma edição, vai-se buscar a proposta do utilizador

        var regulamento = button.up('discussao-regulamento');
        var informacao = regulamento.down('#informacao-lhs');
        var mensagem = '';

        var proposta = regulamento.proposta;

        var contributionForm = button.up('contribution').down('form#detail');
        console.log(contributionForm);

        var propostaexistente = contributionForm.propostaoriginal;
        if (Ext.isDefined(propostaexistente) && propostaexistente.length > 0) {
            console.log('Existe proposta para editar (onToggleButtonRedigir)', propostaexistente.substr(0, 40));
            proposta = contributionForm.propostaoriginal;
            mensagem = 'A sua redação anterior foi recuperada e pode ser melhorada.<br/>Se fizer mais edições, as mesmas serão registadas, quando escolher Alterar a participação.';
        }

        var idsec = '#' + regulamento.down('#secretaria').id;

        if (pressed) {
            button.setText('Cancelar redação');
            $(idsec).mergely('rhs', proposta);
            $(idsec).mergely('cm', 'rhs').setOption('readOnly', false);
            $(idsec).mergely('options', {autoupdate: true, change_timeout: 150});

            if (mensagem == ''){
                informacao.update('Aproveite este lado para redigir as alterações pretendidas.<br/>Quando gravar, estas alterações ficam registadas e associadas à sua participação.');
            } else {
                informacao.update(mensagem);
            }

        } else {
            button.setText('Propor redação');
            console.log('Vamos inventar!', idsec);
            // change_timeout: 150
            $(idsec).mergely('unmarkup');
            $(idsec).mergely('clear', 'rhs');
            $(idsec).mergely('cm', 'rhs').setOption('readOnly', true);
            $(idsec).mergely('options', {autoupdate: false, change_timeout: 3600000});

            informacao.update('');
        }
    },
    onEditParticipation: function (tool, e) {
        //<debug>
        console.log('Editar a sua participação: ' + tool.up('discussion').idocorrencia + ' do utilizador ' + tool.up('discussion').idutilizador);
        //</debug>
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
            featureId = tool.up('discussion').feature.id;
            contributionForm.featureoriginal = tool.up('discussion').feature;
        }
        me.limparFormulario(contribution, mapPanel);

        contributionForm.getForm().setValues({
            idocorrencia: tool.up('discussion').idocorrencia,
            feature: featureId, // not fid
            titulo: tool.up('discussion').title,
            idtipoocorrencia: tool.up('discussion').idtipoocorrencia,
            participacao: tool.up('discussion').participacao
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
            var f = tool.up('discussion').feature;
            // console.log(f);
            // console.log('Vou remover a propriedade fid');
            delete f.fid;
            var novo = new OpenLayers.LonLat(f.geometry.x, f.geometry.y).transform(f.layer.map.getProjectionObject(), new OpenLayers.Projection("EPSG:4326"));
            // contribution toolbar#contributiontb tbtext
            var contributionCoordinates = contribution.down('toolbar#contributiontb').down('tbtext#coordinates');
            contributionCoordinates.setText(novo.lon.toFixed(5) + ' ' + novo.lat.toFixed(5));
        } else {
            var idsec = '#' + activity.up('discussao-regulamento').down('#secretaria').id;
            var proposta = tool.up('discussion').proposta;
            var informacao = activity.up('discussao-regulamento').down('#informacao-lhs');
            if (Ext.isDefined(proposta) && proposta.length > 0) {
                //<debug>
                console.log('Existe proposta para editar', proposta.substr(0, 40));
                //</debug>
                contributionForm.propostaoriginal = proposta;
                // o toggle trata do resto
                var btnredigir = contribution.down('button#redigir');
                /*
                 if (btnredigir.pressed) {
                 console.log('O toggle redigir está em baixo, mas não devia...');
                 btnredigir.toggle();
                 // btnredigir.toggle(false); // força
                 }
                 */
                btnredigir.toggle(true);
            } else {
                contributionForm.propostaoriginal = '';
                informacao.update('A sua participação anterior não continha nenhuma proposta de redação alternativa. Pode contribuir com uma nova redação, clicando no botão <i>Propor redação</i>, no formulário.');
            }
        }
        var params = {idocorrencia: tool.up('discussion').idocorrencia};
        ExtRemote.DXParticipacao.prepareEditOcorrencia(params, function (result, event) {
            if (result.success) {
                // console.log('Porreio. As fotos foram copiadas para a tmp.');
                // depois do copiar as fotografias para a tabela tmp...
                contribution.down('fotografiatmp').getStore().load();
            } else {
                //<debug>
                console.log('Deu raia a copiar as fotos para a temp.');
                //</debug>
            }
        });
    },
    onRemoveParticipation: function (tool, e) {
        // painel de discussão; não o formulário...
        // console.log('Remover a sua participação: ' + tool.up('panel').idocorrencia + ' do utilizador ' + tool.up('panel').idutilizador);
        var me = this;
        Ext.Msg.confirm('Attention'.translate(), 'Are you sure you want to delete this participation?'.translate(), function (buttonId, text, opt) {
            if (buttonId == 'yes') {
                var id = tool.up('discussion').idocorrencia;
                var feature = tool.up('discussion').feature;
                var params = {idocorrencia: id};
                ExtRemote.DXParticipacao.destroyOcorrencia(params, function (result, event) {
                    if (result.success) {
                        Ext.example.msg('Success'.translate(), 'Participation was successfully removed'.translate());
                        // console.log('Porreio. A participação foi removida.');
                        // tenho que destruir a discussão e o feature do OpenLayers
                        // Remover esta discussão da lista
                        var vitima = null;
                        // activity #flow
                        var todasDiscussoes = tool.up('activitynew').down('#flow');
                        //<debug>
                        console.log(todasDiscussoes);
                        //</debug>
                        todasDiscussoes.query('discussion').forEach(function (c) {
                            //<debug>
                            console.log('Vai comparar com a discussão: ' + c.idocorrencia + ' ' + c.title + ' com o id ' + id);
                            //</debug>
                            if (c.idocorrencia == id) {
                                vitima = c;
                            }
                        });
                        if (vitima) {
                            //<debug>
                            console.log('Vai remover o painel', vitima);
                            //</debug>
                            todasDiscussoes.remove(vitima);
                            if (feature) {
                                var mapa = feature.layer.map;
                                var layer = feature.layer;
                                layer.removeFeatures([feature]);
                            }
                        }
                    } else {
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
        //<debug>
        console.log("onButtonUpload", formPhotos);
        //</debug>
        formPhotos.getForm().submit({
            waitMsg: 'Uploading your photo...'.translate(),
            success: function (fp, o) {
                //<debug>
                console.log(o.result);
                //</debug>
                // Ext.Msg.alert('Success', 'Your photo has been uploaded.<br> File size:' + o.result.size + ' bytes.');
                // posso ler o store com as foto inseridas até agora...
                var fotografiaTmp = button.up('contribution').down('fotografiatmp');
                fotografiaTmp.getStore().load();
            },
            failure: function (form, action) {
                //<debug>
                console.log(arguments);
                //</debug>
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
        //<debug>
        console.log('Parâmetros do form:', params);
        //</debug>
        if (activity.geodiscussao) {
            //<debug>
            console.log('Gravar participação em geodiscussao');
            //</debug>
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
                            Ext.Msg.alert('Success'.translate(), 'Your participation was saved'.translate());
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
                            Ext.Msg.alert('Error'.translate(), 'Error saving changes'.translate());
                        }
                    });
                }
            } else {
                Ext.Msg.alert('Attention'.translate(), 'You must provide the location on the map'.translate());
            }
        } else {
            //<debug>
            console.log('Gravar participação em discussão de paleio...');
            //</debug>
            // TODO
            var idsec = '#' + activity.up('discussao-regulamento').down('#secretaria').id;
            var proposta = $(idsec).mergely('get', 'rhs');

            var diff = $(idsec).mergely('diff');
            if ((proposta.length > 0) && (diff.length > 0)) {
                //<debug>
                console.log('Vamos aproveitar a proposta', diff.substr(0, 100));
                //</debug>
            } else {
                //<debug>
                console.log('NÃO Vamos aproveitar a proposta.');
                //</debug>
                proposta = '';
            }
            var id = contributionForm.getForm().findField('idocorrencia').getValue();
            if (parseInt(id, 10) > 0) {
                console.log('Vamos alterar a ocorrência ' + id);
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
                        Ext.example.msg('Success'.translate(), 'Changes were successfully saved'.translate());
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
                        console.log('Limpar o formlário');
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
                                console.log('Encontrada! Vai remover a discussão: ' + c.title);
                            }
                        });
                        if (vitima) {
                            todasDiscussoes.remove(vitima);
                        }
                        var ostore = activity.up('discussao-regulamento').getStoreOcorrencias();
                        ostore.load({
                            params: {
                                id: id
                            }
                        });
                        console.log('Está gravado! Mandei ler o store ocorrências.');
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
                        Ext.Msg.alert('Success'.translate(), 'Your participation was saved'.translate());
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
                        Ext.Msg.alert('Error'.translate(), 'Error saving changes'.translate());
                    }
                });
            }
        }
    },
    limparFormulario: function (contribution, mapPanel) {
        var formContribution = contribution.down('form#detail');

        if (contribution.geodiscussao) {
            //<debug>
            console.log('Vamos limpar uma contribuição geográfica!');
            //</debug>
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
            formContribution.propostaoriginal = '';
            var btnredigir = contribution.down('button#redigir');
            if (btnredigir.pressed) {
                //<debug>
                console.log('O toggle redigir está em baixo');
                //</debug>
                btnredigir.toggle();
                // btnredigir.toggle(false); // força
            } else {
                // limpa rhs e põe a readOnly
                var idsec = '#' + contribution.up('discussao-regulamento').down('#secretaria').id;
                // cf. com onToggleButtonRedigir
                $(idsec).mergely('unmarkup');
                $(idsec).mergely('clear', 'rhs');
                $(idsec).mergely('cm', 'rhs').setOption('readOnly', true);
                $(idsec).mergely('options', {autoupdate: false, change_timeout: 3600000});
            }

            var informacao = contribution.up('discussao-regulamento').down('#informacao-lhs');
            informacao.update('');
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
