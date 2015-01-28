Ext.define('GeoPublic.controller.StartPanel', {
    extend: 'Ext.app.Controller',
    requires: ['GeoPublic.view.StartPlano', 'GeoPublic.view.StartPlanoDescricao', 'GeoPublic.view.DiscussaoRegulamento', 'GeoPublic.view.DiscussaoGeografica'],
    stores: ['PromotorCombo', 'PlanoCombo', 'Participation.ChartByState', 'Participation.ChartByType'],
    // getPromotorComboStore(), getPlanoComboStore(), getParticipationChartByStateStore(), getParticipationChartByTypeStore()
    refs: [{
        selector: 'viewport > tabpanel',
        ref: 'painelPrincipal' // gera um getPainelPrincipal
    }, {
        selector: 'viewport > tabpanel > startpanel',
        ref: 'startPanel' // gera um getStartPanel
    }, {
        selector: 'viewport > tabpanel > startpanel #promotorbar',
        ref: 'promotorBar' // gera um getPromotorBar
    }, {
        selector: 'viewport > tabpanel > startpanel #circlebar',
        ref: 'circleBar' // gera um getCircleBar
    }, {
        selector: 'viewport > tabpanel > startpanel #planbar',
        ref: 'planBar' // gera um getPlanBar
    }, {
        selector: 'viewport > tabpanel > startpanel #readybar',
        ref: 'readyBar' // gera um getReadyBar
    }, {
        selector: 'viewport > tabpanel > startpanel #planpresentationbar',
        ref: 'planPresentationBar' // gera um getPlanPresentationBar
    }],
    init: function () {
        console.log('O controlador GeoPublic.controller.BemVindoPanel init...');
        this.getPromotorComboStore().on({
            scope: this,
            load: this.onPromotorComboStoreLoad
        });
        this.getPlanoComboStore().on({
            scope: this,
            load: this.showPlanos
        });
        this.application.on({
            scope: this,
            newComment: this.onNewComment,
            newParticipation: this.onNewParticipation
        });
        this.control({
            'startpanel': {
                // 'beforerender' : this.onBemVindoPanelBeforeRender,
                // 'render' : this.onStartPanelRender
                'afterrender': this.onStartPanelRender
            },
            'startpanel startpromotor button#planosdisponiveis': {
                'click': this.onPromotorClick
            },
            'startpromotor': {
                'clickPlano': this.onClickPlano
            },
            'startplano button#apresentacao': {
                'click': this.onMostraApresentacaoPlano
            },
            'startplanodescricao button#regras': {
                'click': this.onMostraRegras
            },
            'startpanel #readybar button#participa': {
                'mouseover': this.onMouseOverParticipa,
                'mouseout': this.onMouseOutParticipa,
                'click': this.onParticipe
            }
        }, this);
    },
    onMouseOverParticipa: function (b) {
        b.setText('Participar');
    },
    onMouseOutParticipa: function (b) {
        b.setText('');
    },
    onPromotorComboStoreLoad: function (store, records) {
        var me = this;
        console.log('Promotores: ', records.length);
        var bar = me.getPromotorBar();
        var start = 0;
        var total = records.length;
        if (records.length == 1) {
            // Do not show the institutions
            // Show the available plas for the only one insitution
            bar.setVisible(false);
            var escolhido = records[0].data.id;
            var store = this.getPlanoComboStore();
            store.load({
                id: escolhido
            });
        } else {
            for (var i = start; i < total; i++) {
                var promotor = Ext.apply({}, records[i].data, {
                    idpromotor: records[i].data.id
                });
                delete promotor.id;
                var newPromotor = new GeoPublic.view.StartPromotor(promotor);
                console.log(records[i].get('designacao'));
                bar.add(newPromotor);
            }
            bar.doLayout();
            bar.getEl().fadeIn({
                opacity: 1, //can be any value between 0 and 1 (e.g. .5)
                easing: 'easeIn', // 'easeOut',
                duration: 1500
            });
            /*
             var pos = bar.getOffsetsTo(this.getStartPanel())[1];
             this.getStartPanel().body.scroll('top', pos, true);
             */
        }
    },

    onNewComment: function (data) {
        console.log('onNewComment');
        console.log(arguments);
        var pcomments = this.getCircleBar().down('container#commentscircle');
        pcomments.update(data.numeros.comments + ' Comentários');
    },
    onNewParticipation: function (data) {
        console.log('Participation numbers have changed (more or less participations)');
        // console.log(arguments);
        var pparticipations = this.getCircleBar().down('container#participationscircle');
        pparticipations.update(data.numeros.participations + ' Participações');
    },
    onMostraRegras: function (button, e, options) {
        console.log('onMostraRegras');

        var p = this.getReadyBar();
        // p.setVisible(true);

        // scroll!
        var pos = p.getOffsetsTo(this.getStartPanel())[1];
        this.getStartPanel().body.scroll('top', pos, true);

        p.getEl().fadeIn({
            opacity: 1, //can be any value between 0 and 1 (e.g. .5)
            easing: 'easeIn', // 'easeOut',
            duration: 1500
        });

    },
    onMostraApresentacaoPlano: function (button, e, options) {
        console.log('onMostraApresentacaoPlano');
        var startplano = button.up('startplano');
        this.showPlanDetails(startplano.idplano, startplano.idpromotor, startplano.title, startplano.descricao, startplano.the_geom, startplano.proposta, startplano.alternativeproposta);
        // esconde a #readybar, se visível
        var p = this.getReadyBar();
        // p.setVisible(false);
        p.getEl().fadeIn({
            opacity: 0, //can be any value between 0 and 1 (e.g. .5)
            easing: 'easeIn', // 'easeOut',
            duration: 1500
        });

    },
    showPlanDetails: function (idplano, idpromotor, designacao, descricao, the_geom, proposta, alternativeproposta) {
        var tp = this.getPlanPresentationBar();

        if (tp.idplano != idplano) {
            tp.idplano = idplano;

            tp.removeAll(true);

            var newDescricao = new GeoPublic.view.StartPlanoDescricao({
                idplano: idplano,
                idpromotor: idpromotor,
                descricao: descricao,
                designacao: designacao,
                the_geom: the_geom,
                proposta: proposta,
                alternativeproposta: alternativeproposta
            });
            tp.add(newDescricao);

            // tp.setVisible(true);

            tp.getEl().fadeIn({
                opacity: 1, //can be any value between 0 and 1 (e.g. .5)
                easing: 'easeIn', // 'easeOut',
                duration: 1500
            });

            /*
             * Abre o store...
             */

            /*
             this.getParticipationChartByTypeStore().load({
             params: {
             idplano: idplano
             }
             });

             this.getParticipationChartByStateStore().load({
             params: {
             idplano: idplano
             }
             });

             var newEstatisticas = new GeoPublic.view.StartPlanoEstatisticas({
             idplano: idplano,
             descricao: descricao,
             designacao: designacao
             });
             tp.add(newEstatisticas);

             tp.doLayout();
             tp.setActiveTab(0);

             tp.setVisible(true);
             */

            // readybar
            /*
             var p = this.getReadyBar();
             p.setVisible(true);
             */

            /*
             // seleciona este plano na ComboBox do mapa...
             console.log('Mudar a combo do mapa para o plano ' + idplano);
             // para não entrar em ciclo...
             if (this.getComboplano().getValue() != idplano) {
             this.getComboplano().setValue(idplano);
             }
             */
        }
        // scroll!
        var pos = tp.getOffsetsTo(this.getStartPanel())[1];
        this.getStartPanel().body.scroll('top', pos, true);
    },
    onClickPlano: function (promoterPanel) {
        console.log('onClickPlano');
        // console.log(arguments);
        // Calma!
        // Tem que sincronizar com as combos do MapPanel
        // Aqui é o mesmo que escolher um valor na combo (e vice versa)
        // var p = button.up('startpanel').down('#planbar');
        var p = this.getPlanBar();
        // p.setVisible(true);
        p.getEl().fadeIn({
            opacity: 1, //can be any value between 0 and 1 (e.g. .5)
            easing: 'easeIn', // 'easeOut',
            duration: 1500
        });

        // seleciona este promotor na ComboBox do mapa...
        // var escolhido = button.up('startpromotor').idpromotor;
        var escolhido = promoterPanel.idpromotor;

        var store = this.getPlanoComboStore();
        store.load({
            id: escolhido
        });

        // setting the combo will call showPlanos
        // this.getCombopromotor().setValue(escolhido);
        // UPDATE
        // this.showPlanos();
    },
    /* deprecated :-) */
    onPromotorClick: function (button, e, options) {
        console.log('onPromotorClick');
        // Calma!
        // Tem que sincronizar com as combos do MapPanel
        // Aqui é o mesmo que escolher um valor na combo (e vice versa)
        var p = button.up('startpanel').down('#planbar');
        // p.setVisible(true);
        p.getEl().fadeIn({
            opacity: 1, //can be any value between 0 and 1 (e.g. .5)
            easing: 'easeIn', // 'easeOut',
            duration: 1500
        });
        // seleciona este promotor na ComboBox do mapa...
        var escolhido = button.up('startpromotor').idpromotor;

        var store = this.getPlanoComboStore();
        store.load({
            id: escolhido
        });
    },

    showPlanos: function (store, records) {
        var me = this;
        console.log('showPlanos @ GeoPublic.controller.StartPanel');

        var bar = me.getPlanBar();
        bar.removeAll(true);

        store.each(function (rec) {
            // rec.id is dangerous, because the new object GeoPublic.view.StartPlano gets this id
            // copy of the object, without id, using idplano instead
            var plano = Ext.apply({}, rec.data, {
                idplano: rec.data.id
            });
            delete plano.id;
            //<debug>
            console.log('Aplano antes de abrir');
            console.log(plano);
            //</debug>

            var newPlano = new GeoPublic.view.StartPlano(plano);
            bar.add(newPlano);
        });
        bar.doLayout();

        bar.getEl().fadeIn({
            opacity: 1, //can be any value between 0 and 1 (e.g. .5)
            easing: 'easeIn', // 'easeOut',
            duration: 1500
        });

        var pos = bar.getOffsetsTo(bar.up('startpanel'))[1];
        bar.up('startpanel').body.scroll('top', pos, true);

        // volta a esconder os detalhes do plano, se entretanto ficaram visíveis
        var p = this.getPlanPresentationBar();
        // p.setVisible(false);
        p.getEl().fadeIn({
            opacity: 0, //can be any value between 0 and 1 (e.g. .5)
            easing: 'easeIn', // 'easeOut',
            duration: 1500
        });

        p.idplano = null;

        // readybar
        var p = this.getReadyBar();
        // p.setVisible(false);
        p.getEl().fadeIn({
            opacity: 0, //can be any value between 0 and 1 (e.g. .5)
            easing: 'easeIn', // 'easeOut',
            duration: 1500
        });
    },
    showPromotores: function () {
        var me = this;
        //<debug>
        console.log('showPromotores');
        //</debug>
        var bar = me.getPromotorBar();
        var newPromotor = {};
        if (bar.items.length == 0) {
            this.getPromotorComboStore().each(function (rec) {
                // console.log(rec.get('designacao'));
                var promotor = Ext.apply({}, rec.data, {
                    idpromotor: rec.data.id
                });
                delete promotor.id;
                newPromotor = new GeoPublic.view.StartPromotor(promotor);
                bar.add(newPromotor);
                bar.doLayout();
            });
        }
        // mostrar o painel :-)
        // tinha que consultar a opacidade!
        // if (!bar.isVisible()) {
        // bar.setVisible(true);
        bar.getEl().fadeIn({
            opacity: 1, //can be any value between 0 and 1 (e.g. .5)
            easing: 'easeIn', // 'easeOut',
            duration: 1500
        });

        // }
        var pos = bar.getOffsetsTo(this.getStartPanel())[1];
        this.getStartPanel().body.scroll('top', pos, true);

        // limpar os detalhes?
    },
    /*
     * Carregar no botão participar
     */
    onParticipe: function (el) {
        var me = this;
        var plano = me.getPlanPresentationBar().down('startplanodescricao');
        if (plano) {
            // console.log(plano);
            var tabPanel = me.getPainelPrincipal();
            var pos = tabPanel.items.findIndex('title', plano.designacao);
            if (pos > -1) {
                // já existe e está aberto
                me.getPainelPrincipal().setActiveTab(pos);
            } else {
                // vamos criar um novo tab para discutir um dado plano
                var sepTab = tabPanel.child('#separador');
                var sepTabIndex = tabPanel.items.findIndex('id', sepTab.id);
                if (plano.proposta.length > 0) {
                    me.getPainelPrincipal().insert(sepTabIndex, Ext.create(GeoPublic.view.DiscussaoRegulamento, {
                        itemId: 'discussion-' + plano.idplano,
                        idplano: plano.idplano,
                        idpromotor: plano.idpromotor,
                        title: plano.designacao,
                        designacao: plano.designacao,
                        descricao: plano.descricao,
                        // the_geom: plano.the_geom,
                        proposta: plano.proposta,
                        alternativeproposta: plano.alternativeproposta
                    }));
                } else {
                    me.getPainelPrincipal().insert(sepTabIndex, Ext.create(GeoPublic.view.DiscussaoGeografica, {
                        itemId: 'discussion-' + plano.idplano,
                        idplano: plano.idplano,
                        idpromotor: plano.idpromotor,
                        title: plano.designacao,
                        designacao: plano.designacao,
                        descricao: plano.descricao,
                        the_geom: plano.the_geom
                        // proposta: plano.proposta,
                        // alternativeproposta: plano.alternativeproposta
                    }));
                }
                me.getPainelPrincipal().setActiveTab(sepTabIndex);
            }
        } else {
            console.log('Faltam os detalhes do plano');
        }
    },
    onStartPanelRender: function (panel) {
        var me = this;
        var ppromotores = panel.down('#circlebar container#promotorescircle');
        ppromotores.getEl().on('click', function () {
            me.showPromotores();
        });

        /*
         var pparticipe = panel.down('#readybar container#participecircle');

         pparticipe.getEl().on({
         scope: me,
         click: this.onParticipe
         });
         */

        // me.showPromotores();

        /*
         // get updated data...
         ExtRemote.DXParticipacao.numeros({}, function (result, event) {
         if (result.success) {
         // console.log(result.data);
         // ppromotores.update(result.data.promoters + ' Promotores');

         // Promotores
         var inicioPromoters = 1;
         var updatePromotor = function () {
         if (inicioPromoters <= result.data.promoters) {
         ppromotores.update(inicioPromoters + ' Promotores');
         inicioPromoters = inicioPromoters + 1;
         } else {
         clearInterval(intPromotor);
         }
         };
         var intPromotor = setInterval(function () {
         updatePromotor();
         }, 200);

         // Planos
         var pplans = panel.down('#circlebar container#planoscircle');
         var inicioPlans = 1;
         var updatePlan = function () {
         if (inicioPlans <= result.data.plans) {
         pplans.update(inicioPlans + ' Planos');
         inicioPlans = inicioPlans + 1;
         } else {
         clearInterval(intPlan);
         }
         };
         var intPlan = setInterval(function () {
         updatePlan();
         }, 300);

         // Participações
         var pparticipations = panel.down('#circlebar container#participationscircle');
         var inicioParticipations = 1;
         var updateParticipation = function () {
         if (inicioParticipations <= result.data.participations) {
         pparticipations.update(inicioParticipations + ' Participações');
         inicioParticipations = inicioParticipations + 1;
         } else {
         clearInterval(intParticipation);
         }
         };
         var intParticipation = setInterval(function () {
         updateParticipation();
         }, 100);

         // Comments
         var pcomments = panel.down('#circlebar container#commentscircle');
         var inicioComments = 1;
         var updateComment = function () {
         if (inicioComments <= result.data.comments) {
         pcomments.update(inicioComments + ' Comentários');
         inicioComments = inicioComments + 1;
         } else {
         clearInterval(intComment);
         }
         };
         var intComment = setInterval(function () {
         updateComment();
         }, 50);

         } else {
         console.log('Problemas na recuperação dos números de participação');
         }
         });
         */
    }
});
