Ext.define('DemoExtJs.controller.BemVindoPanel', {
	extend : 'Ext.app.Controller',
	refs : [{
		selector : 'viewport > tabpanel',
		ref : 'painelPrincipal' // gera um getPainelPrincipal
	}, {
		selector : 'viewport > tabpanel > bem-vindo-panel',
		ref : 'painelBemVindo' // gera um getPainelBemVindo
	}, {
		selector : 'viewport > tabpanel > bem-vindo-panel panel#wizard',
		ref : 'wizard' // gera um getWizard
	}, {
		selector : 'bem-vindo-panel button#next',
		ref : 'next' // gera um getNext
	}, {
		selector : 'bem-vindo-panel button#previous',
		ref : 'previous' // gera um getPrevious
	}],
	init : function() {
		console.log('O controlador DemoExtJs.controller.BemVindoPanel init...');
		this.control({
			'bem-vindo-panel' : {
				'beforerender' : this.onBemVindoPanelBeforeRender,
				'afterrender' : this.onBemVindoPanelAfterRender
			},
			"bem-vindo-panel button#saltar" : {
				click : this.onButtonClickSaltar
			},
			"bem-vindo-panel button#next" : {
				click : this.onButtonClickNext
			},
			"bem-vindo-panel button#previous" : {
				click : this.onButtonClickPrevious
			}
		}, this);
	},
	onLaunch : function() {
		// console.log('...O controlador DemoExtJs.controller.BemVindoPanel onLaunch.');
	},
	onButtonClickSaltar : function(button, e, options) {
		console.log('onButtonClickSaltar');
		console.debug(this.getPainelPrincipal());
		this.getPainelPrincipal().setActiveTab(1);
	},
	onButtonClickNext : function(button, e, options) {
		// console.log('onButtonClickNext');
		var panel = this.getWizard();
		var layout = panel.getLayout();
		var active = panel.items.indexOf(layout.getActiveItem());
		if (active < panel.items.length - 1) {
			layout.setActiveItem(active + 1);
		}
		console.log('painel ' + panel.items.indexOf(layout.getActiveItem()) + ' de ' + panel.items.length);
		this.mostraBotoes(panel, layout, panel.items.indexOf(layout.getActiveItem()));
	},
	onButtonClickPrevious : function(button, e, options) {
		console.log('onButtonClickPrevious');
		var panel = this.getWizard();
		var layout = panel.getLayout();
		var active = panel.items.indexOf(layout.getActiveItem());
		if (active > 0) {
			layout.setActiveItem(active - 1);
		}
		console.log('painel ' + panel.items.indexOf(layout.getActiveItem()) + ' de ' + panel.items.length);
		this.mostraBotoes(panel, layout, panel.items.indexOf(layout.getActiveItem()));
	},
	onBemVindoPanelBeforeRender : function(bemVindoPanel, options) {
		var me = this;
		// console.log('controlador DemoExtJs.controller.BemVindoPanel onBemVindoPanelBeforeRender');
	},
	onBemVindoPanelAfterRender : function(bemVindoPanel, options) {
		var me = this;
		// console.log('controlador DemoExtJs.controller.BemVindoPanel onBemVindoPanelAfterRender');
		bemVindoPanel.updateLayout();
		var panel = this.getWizard();
		var layout = panel.getLayout();
		var active = panel.items.indexOf(layout.getActiveItem());
		this.mostraBotoes(panel, layout, active);
	},
	mostraBotoes : function(panel, layout, active) {
		var n = this.getNext();
		var p = this.getPrevious();
		p.setDisabled(active == 0);
		n.setDisabled(active == panel.items.length - 1);
	}
});
