Ext.define('DemoExtJs.controller.StartPanel', {
	extend : 'Ext.app.Controller',
	requires : ['DemoExtJs.view.StartPlano', 'DemoExtJs.view.StartPlanoDescricao'],
	stores : ['PromotorCombo', 'PlanoCombo', 'Participation.ChartByState', 'Participation.ChartByType'], 
	// getPromotorComboStore(), getPlanoComboStore(), getParticipationChartByStateStore(), getParticipationChartByTypeStore()
	refs : [{
		selector : 'viewport > tabpanel',
		ref : 'painelPrincipal' // gera um getPainelPrincipal
	}, {
		selector : 'viewport > tabpanel > startpanel',
		ref : 'startPanel' // gera um getStartPanel
	}, {
		selector : 'viewport > tabpanel > startpanel #promotorbar',
		ref : 'promotorBar' // gera um getPromotorBar
	}, {
		selector : 'viewport > tabpanel > startpanel #circlebar',
		ref : 'circleBar' // gera um getCircleBar
	}, {
		selector : 'viewport > tabpanel > startpanel #planbar',
		ref : 'planBar' // gera um getPlanBar
	}, {
		selector : 'viewport > tabpanel > startpanel #readybar',
		ref : 'readyBar' // gera um getReadyBar
	}, {
		selector : 'viewport > tabpanel > startpanel tabpanel#planpresentationbar',
		ref : 'planPresentationBar' // gera um getPlanPresentationBar
	}, {
		ref : 'combopromotor', // this.getCombopromotor()
		selector : 'app-main-map-panel combo#promotor'
	}, {
		ref : 'comboplano', // this.getComboplano()
		selector : 'app-main-map-panel combo#plano'
	}],
	init : function() {
		console.log('O controlador DemoExtJs.controller.BemVindoPanel init...');
		this.getPlanoComboStore().on({
			scope : this,
			load : this.showPlanos
		});
		this.application.on({
			scope : this,
			newComment : this.onNewComment,
			newParticipation : this.onNewParticipation
		});
		this.control({
			'startpanel' : {
				// 'beforerender' : this.onBemVindoPanelBeforeRender,
				// 'render' : this.onStartPanelRender
				'afterrender' : this.onStartPanelRender
			},
			'startpanel startpromotor button' : {
				'click' : this.onPromotorClick
			},
			'startpromotor' : {
				'clickPlano' : this.onClickPlano
			},
			'startplano' : {
				'clickApresentacao' : this.onPlanDetailsClick
			},
			'startpanel startplano button' : {
				'click' : this.onPlanDetailsClickOld
			}
		}, this);
		this.listen({
			controller : {
				'*' : {
					showPromotores : this.showPlanos, // this.fireEvent('showPromotores'); in DemoExtJs.controller.MainMapPanel
					showPlanDetails : this.onPlanSelectMapPanel // this.fireEvent('showPlanDetails'); in DemoExtJs.controller.MainMapPanel
				}
			}
		});
	},
	onNewComment : function(data) {
		console.log('onNewComment');
		console.log(arguments);
		var pcomments = this.getCircleBar().down('container#commentscircle');
		pcomments.update(data.numeros.comments + ' Comentários');
	},
	onNewParticipation : function(data) {
		console.log('onNewParticipation');
		console.log(arguments);
		var pparticipations = this.getCircleBar().down('container#participationscircle');
		pparticipations.update(data.numeros.participations + ' Participações');
	},
	onPlanSelectMapPanel : function() {
		var plano = this.getComboplano().getValue();
		if (plano) {
			var rec = this.getPlanoComboStore().findRecord('id', plano);
			if (rec) {
				var designacao = rec.get('designacao');
				var descricao = rec.get('descricao');
			}
			console.log('Tudo ok para mudar!');
			this.showPlanDetails(plano, designacao, descricao);
		}
	},
	showPlanDetails : function(idplano, designacao, descricao) {
		var tp = this.getPlanPresentationBar();

		if (tp.idplano != idplano) {
			tp.idplano = idplano;

			tp.removeAll(true);

			var newDescricao = new DemoExtJs.view.StartPlanoDescricao({
				idplano : idplano,
				descricao : descricao,
				designacao : designacao
			});
			tp.add(newDescricao);

			/*
			 * Abre o store...
			 */
			this.getParticipationChartByTypeStore().load({
				params : {
					idplano : idplano
				}
			});
			
			this.getParticipationChartByStateStore().load({
				params : {
					idplano : idplano
				}
			});
			
			var newEstatisticas = new DemoExtJs.view.StartPlanoEstatisticas({
				idplano : idplano,
				descricao : descricao,
				designacao : designacao
			});
			tp.add(newEstatisticas);

			tp.doLayout();
			tp.setActiveTab(0);

			tp.setVisible(true);

			// readybar
			var p = this.getReadyBar();
			p.setVisible(true);

			// seleciona este plano na ComboBox do mapa...
			console.log('Mudar a combo do mapa para o plano ' + idplano);
			// para não entrar em ciclo...
			if (this.getComboplano().getValue() != idplano) {
				this.getComboplano().setValue(idplano);
			}
		}
		// scroll!
		var pos = tp.getOffsetsTo(this.getStartPanel())[1];
		this.getStartPanel().body.scroll('top', pos, true);
	},
	onPlanDetailsClick : function(startplano) {
		this.showPlanDetails(startplano.idplano, startplano.title, startplano.descricao);
	},
	/* deprecated */
	onPlanDetailsClickOld : function(button, e, options) {
		var startplano = button.up('startplano');
		this.showPlanDetails(startplano.idplano, startplano.title, startplano.descricao);
	},
	onClickPlano : function(promoterPanel) {
		console.log('onClickPlano');
		// console.log(arguments);
		// Calma!
		// Tem que sincronizar com as combos do MapPanel
		// Aqui é o mesmo que escolher um valor na combo (e vice versa)
		// var p = button.up('startpanel').down('#planbar');
		var p = this.getPlanBar();
		p.setVisible(true);
		// seleciona este promotor na ComboBox do mapa...
		// var escolhido = button.up('startpromotor').idpromotor;
		var escolhido = promoterPanel.idpromotor;
		// setting the combo will call showPlanos
		this.getCombopromotor().setValue(escolhido);
	},
	/* deprecated :-) */
	onPromotorClick : function(button, e, options) {
		// Calma!
		// Tem que sincronizar com as combos do MapPanel
		// Aqui é o mesmo que escolher um valor na combo (e vice versa)
		var p = button.up('startpanel').down('#planbar');
		p.setVisible(true);
		// seleciona este promotor na ComboBox do mapa...
		var escolhido = button.up('startpromotor').idpromotor;
		// setting the combo will call showPlanos
		this.getCombopromotor().setValue(escolhido);
	},

	showPlanos : function() {
		var me = this;
		console.log('showPlanos');

		var bar = me.getPlanBar();
		var tab = bar.up('tabpanel');

		bar.removeAll(true);

		this.getPlanoComboStore().each(function(rec) {

			// rec.id is dangerous, because the new object DemoExtJs.view.StartPlano gets this id
			// copy of the object, without id, using idplano instead
			var plano = Ext.apply({}, rec.data, {
				idplano : rec.data.id
			});
			delete plano.id;
			// console.log(plano);

			var newPlano = new DemoExtJs.view.StartPlano(plano);
			bar.add(newPlano);
			bar.doLayout();

		});

		// mostrar o tabpainel (superior) // tabplanbar
		if (!tab.isVisible()) {
			tab.setVisible(true);
		}

		var pos = tab.getOffsetsTo(tab.up('startpanel'))[1];
		tab.up('startpanel').body.scroll('top', pos, true);

		// volta a esconder os detalhes do plano, se entretanto ficaram visíveis
		var p = this.getPlanPresentationBar();
		p.setVisible(false);
		p.idplano = null;

		// readybar
		var p = this.getReadyBar();
		p.setVisible(false);
	},
	showPromotores : function() {
		var me = this;
		console.log('showPromotores');
		// Calma!
		// Antes de mostrar os promotores, tem que os carregar né?
		// Tenho um getPromotorComboStore()
		/*
		 * 	fields : [{
		 name : 'id', type : 'int'
		 }, {
		 name : 'designacao',		 type : 'string'
		 }, {
		 name : 'email',		 type : 'string'
		 }, {
		 name : 'site',		 type : 'string'
		 }, {
		 name : 'dataregisto',		 type : 'date'
		 }],
		 */
		var bar = me.getPromotorBar();
		if (bar.items.length == 0) {
			this.getPromotorComboStore().each(function(rec) {
				// console.log(rec.get('designacao'));
				var promotor = Ext.apply({}, rec.data, {
					idpromotor : rec.data.id
				});
				delete promotor.id;
				var newPromotor = new DemoExtJs.view.StartPromotor(promotor);
				bar.add(newPromotor);
				bar.doLayout();
			});
		}
		// mostrar o painel :-)
		if (!bar.isVisible()) {
			bar.setVisible(true);
			/*
			 bar.getEl().fadeIn({
			 opacity : 1, //can be any value between 0 and 1 (e.g. .5)
			 easing : 'easeOut',
			 duration : 500
			 });
			 */
		}
		// limpar os detalhes...
	},
	onStartPanelRender : function(panel) {
		var me = this;
		var ppromotores = panel.down('#circlebar container#promotorescircle');
		ppromotores.getEl().on('click', function() {
			me.showPromotores();
		});
		var pparticipe = panel.down('#readybar container#participecircle');
		pparticipe.getEl().on('click', function() {
			me.getPainelPrincipal().setActiveTab(1);
		});

		// get updated data...
		ExtRemote.DXParticipacao.numeros({}, function(result, event) {
			if (result.success) {
				// console.log(result.data);
				// ppromotores.update(result.data.promoters + ' Promotores');

				// Promotores
				var inicioPromoters = 1;
				var updatePromotor = function() {
					if (inicioPromoters <= result.data.promoters) {
						ppromotores.update(inicioPromoters + ' Promotores');
						inicioPromoters = inicioPromoters + 1;
					} else {
						clearInterval(intPromotor);
					}
				};
				var intPromotor = setInterval(function() {
					updatePromotor();
				}, 200);

				// Planos
				var pplans = panel.down('#circlebar container#planoscircle');
				var inicioPlans = 1;
				var updatePlan = function() {
					if (inicioPlans <= result.data.plans) {
						pplans.update(inicioPlans + ' Planos');
						inicioPlans = inicioPlans + 1;
					} else {
						clearInterval(intPlan);
					}
				};
				var intPlan = setInterval(function() {
					updatePlan();
				}, 300);

				// Participações
				var pparticipations = panel.down('#circlebar container#participationscircle');
				var inicioParticipations = 1;
				var updateParticipation = function() {
					if (inicioParticipations <= result.data.participations) {
						pparticipations.update(inicioParticipations + ' Participações');
						inicioParticipations = inicioParticipations + 1;
					} else {
						clearInterval(intParticipation);
					}
				};
				var intParticipation = setInterval(function() {
					updateParticipation();
				}, 100);

				// Comments
				var pcomments = panel.down('#circlebar container#commentscircle');
				var inicioComments = 1;
				var updateComment = function() {
					if (inicioComments <= result.data.comments) {
						pcomments.update(inicioComments + ' Comentários');
						inicioComments = inicioComments + 1;
					} else {
						clearInterval(intComment);
					}
				};
				var intComment = setInterval(function() {
					updateComment();
				}, 50);

			} else {
				console.log('Problemas na recuperação dos números de participação');
			}
		});

	}
});
