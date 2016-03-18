Ext.define('GeoPublic.controller.Participation.Discussion', {
    extend: 'Ext.app.Controller',
    requires: ['GeoPublic.view.Participation.Comment'],
    // stores : ['Participation.EstadoCombo'], // getParticipationEstadoComboStore()
    // Ext.ComponentQuery.query('commentform toolbar button#gravar')
    refs: [{
        ref: 'mapa',
        selector: 'app-main-map-panel'
    }],
    init: function () {
        this.control({
            "commentform toolbar button#gravar": {
                click: this.onButtonGravarComentario // action: 'save', // 'update'
            },
            "commentform toolbar button#limpar": {
                click: this.onButtonLimparFormComentario // action: 'save', // 'update'
            },
            /*
             "discussion tool[type=search]" : {
             click : this.onCenterFeature
             },
             */
            "discussion toolbar#botoes-participacao button": {
                click: this.onToolbarButtonParticipacao
            },
            "discussion toolbar#botoes-comentarios button": {
                click: this.onToolbarButtonComentarios
            },
            "discussion toolbar#botoes-participacao button[action=view-comments]": {
                toggle: this.onShowComments
            },
            "discussion commentlist": {
                beforeexpand: this.onCommentListBeforeExpand,
                expand: this.onExpand
            }
        })
    },
    onShowComments: function (button, pressed) {
        // var ocorrencia = button.up('panel#discussion-panel').idocorrencia;
        var ocorrencia = button.up('discussion');
        var commentlist = ocorrencia.down('commentlist');
        if (pressed) {
            commentlist.toggleCollapse(true); // expand(true);
        } else {
            commentlist.toggleCollapse(true); // collapse(true);
        }
    },
    onToolbarButtonComentarios: function (button, pressed) {
        var ocorrencia = button.up('discussion');
        var activity = button.up('activitynew');
        switch (button.action) {
            case "edit-comment":
                this.onEditComment(button);
                break;
            case "delete-comment":
                this.onRemoveComment(button);
                break;
            case "favorite":
                break;
            default:
                break;
        }
    },
    onEditComment: function (tool, e) {
        //<debug>
        console.log('Editar o comentário: ' + tool.up('comment').idcomentario);
        //</debug>
        var me = this;
        // eventualmente limpar alguma edição anterior
        var ocorrencia = tool.up('discussion');
        var commentForm = ocorrencia.down('commentform');
        // hack
        commentForm.commentToEdit = tool.up('comment');
        commentForm.getForm().setValues({
            // idocorrencia: tool.up('comment').idocorrencia, // não é preciso alterar
            idcomentario: tool.up('comment').idcomentario,
            comentario: tool.up('comment').comentario
        });

        // Mudar o botão do painel...
        // Depois é preciso reverter o botão
        // console.log(this.getButtonGravar());

        var buttonGravar = commentForm.down('button#gravar');
        buttonGravar.setText('Update'.translate());
        buttonGravar.action = 'update';
    },
    onRemoveComment: function (tool) {
        // painel de discussão; não o formulário...
        // console.log('Remover a sua participação: ' + tool.up('panel').idocorrencia + ' do utilizador ' + tool.up('panel').idutilizador);
        var me = this;
        var todosComentarios = tool.up('commentlist');
        var discussion = todosComentarios.up('discussion');
        Ext.Msg.confirm('Attention'.translate(), 'Are you sure you want to delete this comment?'.translate(), function (buttonId, text, opt) {
            if (buttonId == 'yes') {
                var idcomentario = tool.up('comment').idcomentario;
                var params = {idcomentario: idcomentario};
                ExtRemote.DXParticipacao.destroyComment(params, function (result, event) {
                    if (result.success) {
                        Ext.example.msg('Success'.translate(), 'Comment was successfully removed'.translate());
                        // tenho que destruir o comentário na lista de comentários
                        // Remover este comentário da lista
                        var vitima = null;
                        todosComentarios.query('comment').forEach(function (c) {
                            if (c.idcomentario == idcomentario) {
                                vitima = c;
                            }
                        });
                        if (vitima) {
                            //<debug>
                            console.log('Vai remover o painel', vitima);
                            //</debug>
                            todosComentarios.remove(vitima);
                        }
                        // diminuir contador
                        todosComentarios.numcomments = todosComentarios.numcomments - 1;
                        discussion.down('button[action=view-comments]').setText(todosComentarios.numcomments + ' ' + 'comments'.translate());
                    } else {
                        Ext.MessageBox.show({
                            title: 'Error'.translate(),
                            msg: 'Error deleting comment'.translate(),
                            icon: Ext.MessageBox.ERROR,
                            buttons: Ext.Msg.OK
                        });
                    }
                });
            }
        });
    },
    onToolbarButtonParticipacao: function (button, pressed) {
        // console.log('-------> cliclou em ------>', button.action);
        // var ocorrencia = button.up('panel#discussion-panel').idocorrencia;
        var ocorrencia = button.up('discussion');
        var activity = button.up('activitynew');

        switch (button.action) {
            /*
             case "edit-participation": // handled by controller/Participation/Contribution.js
             break;
             case "delete-participation": // handled by controller/Participation/Contribution.js
             break;
             */
            case "center-participation": // ALSO handled by controller/Participation/Contribution.js
                var feature = ocorrencia.feature;
                //<debug>
                console.log('Discussion.onCenterFeature - Vai centrar no feature ', feature);
                console.log('Mostrar ocorrência geográfica', ocorrencia);
                //</debug>
                if (feature) {
                    var mapa = feature.layer.map;
                    var layer = feature.layer;
                    var control = mapa.getControlsBy("id", "selectCtrl")[0];
                    if (control) {
                        control.unselectAll();
                        control.select(feature);
                        mapa.zoomToExtent(feature.geometry.getBounds(), closest = true);
                    } else {
                        console.log('Error: OpenLayers control not found');
                    }
                }
                break;
            case "view-proposal":
                //<debug>
                console.log('Mostrar ocorrência NÃO geográfica', ocorrencia.idocorrencia);
                console.log('Informação que tenho: ', ocorrencia);
                //</debug>
                var informacao = activity.up('discussao-regulamento').down('#informacao-lhs');
                // Mostrar a nova redação, se existir...
                // O ideal seria só mostrar a ferramenta se existir uma proposta de redação
                var proposta = ocorrencia.proposta;
                if (Ext.isDefined(proposta) && proposta.length > 0) {
                    // Mostrar, sem deixar mexer
                    var idsec = '#' + activity.up('discussao-regulamento').down('#secretaria').id;
                    $(idsec).mergely('options', {autoupdate: true, change_timeout: 150});
                    $(idsec).mergely('update');
                    $(idsec).mergely('rhs', proposta);
                    $(idsec).mergely('cm', 'rhs').setOption('readOnly', true);
                    informacao.update('Redação proposta por: ' + ocorrencia.nome);
                } else {
                    informacao.update('');
                }
                break;
            default:
                break;
        }
    },
    onExpand: function (p, eOpts) {
        /*
        not needed any more
        was necessary to check if the event was fired
        event not fired when panel has no contents
        TODO
         */
        p.doLayout();
    },
    onCommentListBeforeExpand: function (p, animate, eOpts) {
        // console.log('GeoPublic.controller.Participation.Discussion onOcorrenciaBeforeExpand');
        var d = p.up('discussion');
        var o = d.idocorrencia;
        // console.debug(p);
        if (!p.loaded) {
            // p.header.getEl().setStyle('cursor', 'default');
            // p.removeAll(true);
            ExtRemote.DXParticipacao.readComment(o, function (result, event) {
                if (result.success) {
                    // console.log(result.data);
                    // result.data é um array...
                    // tenho que mudar cada componente do array...
                    // "haquantotempo": {"hours":2,"minutes":41,"seconds":59}

                    Ext.Array.each(result.data, function (rec, index, comments) {
                        // SELECT c.id, c.comentario, c.datacriacao, now()-c.datacriacao as haquantotempo, u.fotografia, u.nome, e.estado, e.color
                        // console.log(rec);
                        var datacriacao = Ext.Date.parse(rec.datacriacao, 'c');
                        //var tempo = 'Há ';
                        var tempo = '';
                        if (!rec.haquantotempo.days) {
                            rec.haquantotempo.days = 0;
                        }
                        if (!rec.haquantotempo.hours) {
                            rec.haquantotempo.hours = 0;
                        }
                        if (!rec.haquantotempo.minutes) {
                            rec.haquantotempo.minutes = 0;
                        }
                        if (rec.haquantotempo.days > 0) {
                            //tempo += rec.haquantotempo.days + ' dias (' + Ext.Date.format(datacriacao, 'l') + '), às ' + Ext.Date.format(datacriacao, 'H:i');
                            tempo = Ext.String.format('{0} days ago ({1} at {2})'.translate(), rec.haquantotempo.days, Ext.Date.format(datacriacao, 'l'), Ext.Date.format(datacriacao, 'H:i') );
                        } else {
                            if (rec.haquantotempo.hours > 0) {
                                //tempo += rec.haquantotempo.hours + ':' + rec.haquantotempo.minutes;
                                tempo = Ext.String.format('{0}:{1} ago'.translate(), rec.haquantotempo.hours, rec.haquantotempo.minutes );
                            } else {
                                if (rec.haquantotempo.minutes > 0) {
                                    //tempo += rec.haquantotempo.minutes + ' minutos';
                                    tempo = Ext.String.format('{0} minutes ago'.translate(), rec.haquantotempo.minutes );
                                    // tempo += rec.haquantotempo.seconds + ' segundos';
                                } else {
                                    //tempo += 'menos de 1 minuto';
                                    tempo = 'Less than 1 minute'.translate();
                                }
                            }
                        }

                        /*
                         this.id = this.initialConfig.id;
                         this.idutilizador = this.initialConfig.idutilizador; // quem lançou o comentário
                         this.idresponsavel = this.initialConfig.idresponsavel; // id responsável por este plano
                         */
                        var newComment = new GeoPublic.view.Participation.Comment({
                            // SELECT c.id, c.comentario, c.datacriacao, now()-c.datacriacao as haquantotempo, u.fotografia, u.nome, e.estado, e.color
                            idcomentario: rec.id,
                            comentario: rec.comentario,
                            tempo: tempo,
                            fotografia: rec.fotografia,
                            nome: rec.nome,
                            estado: rec.estado,
                            cor: rec.color,
                            idutilizador: rec.idutilizador,
                            idresponsavel: rec.idresponsavel
                        });
                        p.add(newComment);
                        // p.insert(0, newComment);
                    });
                    p.doLayout();
                    // pode ser que entretanto tenham entrado mais comentários...
                    // TODO
                    // alterar o botão para além do título (eventualmente deixar de usar o título)
                    p.numcomments = parseInt(result.total);
                    // p.setTitle(p.numcomments + ' comentários');
                    d.down('button[action=view-comments]').setText(p.numcomments + ' ' + 'comments'.translate());
                    p.loaded = true;
                } else {
                    console.log('Error retriving comments');
                }
            });
        }
        return true;
    },
    /*
     Este método é invocado pelo utilizador
     */
    onCenterFeature: function (tool, e) {
        // console.log(arguments);
        var ocorrencia = tool.up('panel').idocorrencia;
        var activity = tool.up('activitynew');
        if (activity.geodiscussao) {
            var feature = tool.up('panel').feature;
            //<debug>
            console.log('Discussion.onCenterFeature - Vai centrar na ocorrência ' + ocorrencia, feature);
            console.log('Mostrar ocorrência geográfica', ocorrencia);
            //</debug>
            if (feature) {
                var mapa = feature.layer.map;
                var layer = feature.layer;
                var control = mapa.getControlsBy("id", "selectCtrl")[0];
                if (control) {
                    control.unselectAll();
                    control.select(feature);
                    mapa.zoomToExtent(feature.geometry.getBounds(), closest = true);
                } else {
                    console.log('OpenLayers control not found');
                }
            }
        } else {
            //<debug>
            console.log('Mostrar ocorrência NÃO geográfica', ocorrencia);
            console.log('Informação que tenho: ', tool.up('panel'));
            //</debug>
            var informacao = activity.up('discussao-regulamento').down('#informacao-lhs');

            // Mostrar a nova redação, se existir...
            // O ideal seria só mostrar a ferramenta se existir uma proposta de redação
            var proposta = tool.up('panel').proposta;
            if (Ext.isDefined(proposta) && proposta.length > 0) {
                // Mostrar, sem deixar mexer
                var idsec = '#' + activity.up('discussao-regulamento').down('#secretaria').id;
                $(idsec).mergely('options', {autoupdate: true, change_timeout: 150});
                $(idsec).mergely('update');
                $(idsec).mergely('rhs', proposta);
                $(idsec).mergely('cm', 'rhs').setOption('readOnly', true);
                informacao.update('Redação proposta por: ' + tool.up('panel').nome);
            } else {
                informacao.update('');
            }
        }
    },
    onButtonLimparFormComentario: function (button, e, options) {
        //<debug>
        console.log('Limpar o form');
        //</debug>
        var me = this;
        var d = button.up('discussion');
        var activity = d.up('activitynew');
        var fc = button.up('form').getForm();
        var buttonGravar = button.up('form').down('button#gravar');
        buttonGravar.setText('Comment'.translate());
        buttonGravar.action = 'save'; // 'update'
        // var params = fc.getValues(false, false, false, false);
        var comboBox = button.up('form').down('combo');
        // Por o valor relativo ao estado da ocorrencia
        comboBox.setValue(d.idestado);
        fc.findField('comentario').setValue('');
        // truque para saber que painel de comentário está a ser editado
        var commentForm = button.up('commentform');
        delete commentForm.commentToEdit;
    },
    onButtonGravarComentario: function (button, e, options) {
        var me = this;
        var d = button.up('discussion');
        var activity = d.up('activitynew');
        var fc = button.up('form').getForm();
        var params = fc.getValues(false, false, false, false);

        var comentar = button.up('form').down('button#gravar');

        var tempo = 'Less than 1 minute'.translate(); // 'Há menos de 1 minuto';
        var p = button.up('discussion').down('commentlist');
        // console.debug(p);

        if (button.action == 'save') { // else 'update'
            delete params.idcomentario;
            //<debug>
            console.log('Gravar comentário');
            //</debug>
            ExtRemote.DXParticipacao.createComment(params, function (result, event) {
                if (result.success) {

                    // Ext.Msg.alert('Successo', 'O seu comentário foi registado. Obrigado pela participação.');
                    // limpar o formulário!
                    // fc.findField('comentario').setValue('');
                    // reset() clear the field and removes the validation reminder
                    fc.reset();
                    var comboBox = button.up('form').down('combo');
                    // comboBox.clearValue();

                    // alterar a cor do feature em função da alteração do estado
                    // se houve alteração do estado...
                    var cor = '';
                    var estadoTexto = '';

                    if (params.idestado) {
                        var novo = params.idestado;
                        // var estado = me.getParticipationEstadoComboStore().findRecord('id', novo);
                        var estadoStore = button.up('discussion').estadoStore;
                        var estado = estadoStore.findRecord('id', novo);
                        cor = estado.get('color');
                        estadoTexto = estado.get('estado');
                        // Qual é a nova cor?
                        if (activity.geodiscussao) {
                            d.feature.attributes['color'] = cor;
                            d.feature.layer.drawFeature(d.feature);
                        }
                        fc.findField('comentario').setValue('');
                        // atualiza do estado no painel
                        d.idestado = novo;
                        d.estado = estadoTexto;
                        d.color = cor;
                        comboBox.setValue(novo);
                    } else {
                        // Vai buscar o estado anterior ao painel...
                        cor = d.color;
                        estadoTexto = d.estado;
                        //<debug>
                        console.log('Aproveitar estado guardado: ', d.color, d.estado);
                        //</debug>
                    }
                    // atualizar o form dos comentários
                    // comboBox.labelEl.setStyle('color', d.color);
                    // comboBox.setFieldLabel('Estado: ' + d.estado);
                    if (p.loaded) {
                        // junto este aos comentários existentes
                        var newComment = new GeoPublic.view.Participation.Comment({
                            // SELECT c.id, c.comentario, c.datacriacao, now()-c.datacriacao as haquantotempo, u.fotografia, u.nome, e.estado, e.color
                            idcomentario: result.data[0].id,
                            comentario: result.data[0].comentario,
                            tempo: tempo,
                            fotografia: result.data[0].fotografia,
                            nome: result.data[0].nome,
                            estado: result.data[0].estado,
                            cor: result.data[0].color,
                            idutilizador: result.data[0].idutilizador,
                            idresponsavel: result.data[0].idresponsavel
                        });
                        p.add(newComment);
                        // p.insert(0, newComment);
                        p.doLayout();

                        p.numcomments = p.numcomments + 1;
                        d.down('button[action=view-comments]').setText(p.numcomments + ' ' + 'comments'.translate());
                        // p.setTitle(p.numcomments + ' comentários');
                    } else {
                        // Abre os comentários
                        p.expand(true);
                    }
                    // TODO
                    // Há algumas coisas a serem feitas em repetido,
                    // que podem ser tiradas desde onButtonGravarComentario
                    // pois estão no onButtonLimparFormComentario
                    me.onButtonLimparFormComentario(button, e, options);
                } else {
                    Ext.Msg.alert('Erro', 'Ocorreu um erro ao registar o seu comentário.');
                }
            });
        } else {
            //<debug>
            console.log('Actualizar comentário');
            //</debug>
            ExtRemote.DXParticipacao.updateComment(params, function (result, event) {
                if (result.success) {
                    // Ext.Msg.alert('Successo', 'O seu comentário foi registado. Obrigado pela participação.');
                    // limpar o formulário!
                    // fc.findField('comentario').setValue('');
                    // reset() clear the field and removes the validation reminder
                    fc.reset();
                    var comboBox = button.up('form').down('combo');
                    // comboBox.clearValue();

                    var p = button.up('discussion').down('commentlist');
                    // console.debug(p);

                    // alterar a cor do feature em função da alteração do estado
                    // se houve alteração do estado...
                    var cor = '';
                    var estadoTexto = '';

                    if (params.idestado) {
                        var novo = params.idestado;
                        // var estado = me.getParticipationEstadoComboStore().findRecord('id', novo);
                        var estadoStore = button.up('discussion').estadoStore;
                        var estado = estadoStore.findRecord('id', novo);
                        cor = estado.get('color');
                        estadoTexto = estado.get('estado');
                        // Qual é a nova cor?
                        if (activity.geodiscussao) {
                            d.feature.attributes['color'] = cor;
                            d.feature.layer.drawFeature(d.feature);
                        }
                        fc.findField('comentario').setValue('');
                        // atualiza do estado no painel
                        d.idestado = novo;
                        d.estado = estadoTexto;
                        d.color = cor;
                        comboBox.setValue(novo);
                    } else {
                        // Vai buscar o estado anterior ao painel...
                        cor = d.color;
                        estadoTexto = d.estado;
                        //<debug>
                        console.log('Aproveitar estado guardado: ', d.color, d.estado);
                        //</debug>
                    }
                    var commentForm = button.up('commentform');
                    var commenthtml = '<b>' + commentForm.commentToEdit.nome + '</b> - <i>' + tempo + '</i><br/>' + result.data[0].comentario;
                    commentForm.commentToEdit.down('#comment-body').update(commenthtml);
                    // se voltar a editar...
                    commentForm.commentToEdit.comentario = result.data[0].comentario;
                    delete commentForm.commentToEdit;
                    comentar.action = 'save'; // 'update'
                    // TODO
                    // algumas coisas podem ser eliminadas, pois o LimparFormComentario já faz...
                    me.onButtonLimparFormComentario(button, e, options);
                } else {
                    Ext.Msg.alert('Error'.translate(), 'Error updating comment'.translate());
                }
            });
        }
    }
});
