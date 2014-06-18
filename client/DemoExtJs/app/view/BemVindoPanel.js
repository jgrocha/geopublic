Ext.define('DemoExtJs.view.BemVindoPanel', {
	extend : 'Ext.panel.Panel',
	xtype : 'bem-vindo-panel',
	title : 'Bem vindo',
	layout : 'column',
	autoScroll : true,
	defaultType : 'container',
	items : [{
		columnWidth : 1 / 3,
		padding : '5 0 5 5',
		items : [{
			title : 'A Panel',
			html : 'Ext.example.shortBogusMarkup'
		}, {
			title : 'A Panel',
			html : 'Ext.example.shortBogusMarkup'
		}]
	}, {
		columnWidth : 1 / 3,
		padding : '5 0 5 5',
		items : [{
			title : 'Outro Panel',
			html : 'Ext.example.shortBogusMarkup'
		}, {
			xtype : 'combo',
			itemId : 'promotor-bem-vindo-cbx',
			width : 240,
			editable : false,
			valueField : 'id',
			displayField : 'designacao',
			emptyText : 'Escolha um promotor...',
			forceSelection : true,
			triggerAction : 'all',
			store : 'PromotorCombo',
			queryMode : 'local'
		}]
	}, {
		columnWidth : 1 / 3,
		padding : 5,
		items : [{
			title : 'A Panel',
			html : 'Ext.example.shortBogusMarkup'
		}, {
			margin : '5 0 0 0',
			title : 'Another Panel',
			html : 'Ext.example.shortBogusMarkup'
		}]
	}]
});
