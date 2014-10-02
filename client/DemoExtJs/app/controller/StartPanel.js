Ext.define('DemoExtJs.controller.StartPanel', {
	extend : 'Ext.app.Controller',
	requires : ['DemoExtJs.view.StartPlano', 'DemoExtJs.view.StartPlanoDescricao'],
	stores : ['PromotorCombo', 'PlanoCombo'], // getPromotorComboStore(), getPlanoComboStore()
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
		this.control({
			'startpanel' : {
				// 'beforerender' : this.onBemVindoPanelBeforeRender,
				// 'render' : this.onStartPanelRender
				'afterrender' : this.onStartPanelRender
			},
			'startpanel startpromotor button' : {
				'click' : this.onPromotorClick
			},
			'startpanel startplano button' : {
				'click' : this.onPlanDetailsClick
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
				descricao : descricao,
				designacao : designacao
			});
			tp.add(newDescricao);

			var newEstatisticas = new DemoExtJs.view.StartPlanoEstatisticas({
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
	onPlanDetailsClick : function(button, e, options) {
		var startplano = button.up('startplano');
		this.showPlanDetails(startplano.idplano, startplano.title, startplano.descricao);
	},

	onPromotorClick : function(button, e, options) {
		// Calma!
		// Tem que sincronizar com as combos do MapPanel
		// Aqui é o memso que escolher um valor na combo (e vice versa)

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

		/*
		 * 		name : 'id',		type : 'int'
		 }, {
		 name : 'idpromotor',		type : 'int'
		 }, {
		 name : 'designacao',		type : 'string'
		 }, {
		 name : 'descricao',		type : 'string'
		 }, {
		 name : 'responsavel',		type : 'string'
		 }, {
		 name : 'email',		type : 'string'
		 }, {
		 name : 'site',		type : 'string'
		 }, {
		 name : 'inicio',		type : 'date'
		 }, {
		 name : 'fim',		type : 'date'
		 }, {
		 name : 'the_geom',		type : 'string'
		 */

		this.getPlanoComboStore().each(function(rec) {

			// rec.id is dangerous, because the new object DemoExtJs.view.StartPlano gets this id
			var plano = Ext.apply({}, rec.data, {
				idplano : rec.data.id
			});
			delete plano.id;
			console.log(plano);

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
				console.log(rec.get('designacao'));
				// criar os paineis de discussao
				var newPromotor = new DemoExtJs.view.StartPromotor({
					idpromotor : rec.get('id'),
					designacao : rec.get('designacao'),
					site : rec.get('site')
				});
				bar.add(newPromotor);
				// this.getTodasDiscussoes().insert(0, newPromotor);
				bar.doLayout();
			});
		}
		// mostrar o painel :-)
		if (!bar.isVisible()) {
			bar.setVisible(true);
		}

		// limpar os detalhes...

	},
	onStartPanelRender : function(panel) {
		var me = this;
		var pc = panel.down('#circlebar container#promotorescircle');
		pc.getEl().on('click', function() {
			me.showPromotores();
		});
		var pc = panel.down('#readybar container#participecircle');
		pc.getEl().on('click', function() {
			me.getPainelPrincipal().setActiveTab(1);
		});
	}
});
