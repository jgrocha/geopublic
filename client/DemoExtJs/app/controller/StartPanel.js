Ext.define('DemoExtJs.controller.StartPanel', {
	extend : 'Ext.app.Controller',
	stores : ['Promotor'], // getPromotorStore()
	refs : [{
		selector : 'viewport > tabpanel',
		ref : 'painelPrincipal' // gera um getPainelPrincipal
	}, {
		selector : 'viewport > tabpanel > startpanel',
		ref : 'startPanel' // gera um getStartPainel
	}, {
		selector : 'viewport > tabpanel > startpanel #promotorbar',
		ref : 'promotorBar' // gera um getPromotorBar
	}, {
		selector : 'viewport > tabpanel > startpanel #planbar',
		ref : 'planBar' // gera um getPlanBar
	}, {
		selector : 'viewport > tabpanel > startpanel #planpresentationbar',
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
		this.control({
			'startpanel' : {
				// 'beforerender' : this.onBemVindoPanelBeforeRender,
				// 'render' : this.onStartPanelRender
				'afterrender' : this.onStartPanelRender
			},
			'startpanel startpromotor button' : {
				'click' : this.onPromotorClick
			},
			'startpanel button#planplpa' : {
				'click' : this.onButtonPlpaClick
			}
		}, this);
	},
	onButtonPlpaClick : function(button, e, options) {
		var p = button.up('startpanel').down('#planpresentationbar');
		p.setVisible(true);
		
		// estatisticas
		var p = button.up('startpanel').down('#estatisticas');
		p.setVisible(true);
		// readybar
		var p = button.up('startpanel').down('#readybar');
		p.setVisible(true);
		
		// seleciona este plano na ComboBox do mapa...
		this.getComboplano().setValue(1);

		// scroll! ah! boa! funciona (mas vai para o último p...)
		var pos = p.getOffsetsTo(button.up('startpanel'))[1];
		button.up('startpanel').body.scroll('top', pos, true);
	},
	onPromotorClick : function(button, e, options) {
		var p = button.up('startpanel').down('#planbar');
		p.setVisible(true);
		// seleciona este promotor na ComboBox do mapa...
		var escolhido = button.up('startpromotor').idpromotor;
		this.getCombopromotor().setValue(escolhido);
	},
	showPromotores : function(panel) {
		var me = this;
		console.log(me.getPromotorBar());
		// Calma!
		// Antes de mostrar os promotores, tem que os carregar né?
		// Tenho um getPromotorStore()
		/*
		 * 	fields : [{
		 name : 'id',
		 type : 'int'
		 }, {
		 name : 'designacao',
		 type : 'string'
		 }, {
		 name : 'email',
		 type : 'string'
		 }, {
		 name : 'site',
		 type : 'string'
		 }, {
		 name : 'dataregisto',
		 type : 'date'
		 }],
		 */
		if (me.getPromotorBar().items.length == 0) {
			this.getPromotorStore().each(function(rec) {
				console.log(rec.get('designacao'));
				// criar os paineis de discussao
				var newPromotor = new DemoExtJs.view.StartPromotor({
					idpromotor : rec.get('id'),
					designacao : rec.get('designacao'),
					site : rec.get('site')
				});
				me.getPromotorBar().add(newPromotor);
				// this.getTodasDiscussoes().insert(0, newPromotor);
				me.getPromotorBar().doLayout();
			});
		}
		// mostrar o painel :-)
		var p = panel.down('#promotorbar');
		if (!p.isVisible()) {
			p.setVisible(true);
		}
	},
	onStartPanelRender : function(panel) {
		var me = this;
		var pc = panel.down('#circlebar container#promotorescircle');
		pc.getEl().on('click', function() {
			me.showPromotores(panel);
		});
		var pc = panel.down('#readybar container#participecircle');
		pc.getEl().on('click', function() {
			me.getPainelPrincipal().setActiveTab(1);
		});
	}
});
