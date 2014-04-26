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
