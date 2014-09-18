Ext.define('DemoExtJs.view.Participation.Discussion', {
	extend : 'Ext.panel.Panel',
	xtype : 'discussion',
	/*
	layout : {
		type : 'vbox',
		padding : '5',
		align : 'stretch'
	},
	*/
	layout: 'fit',
	title : 'Discussao Nº X',
	items : [{
		title : 'O que existe',
		html : 'Detalhes da contribuição submetida'
	}, {
		title : 'Comentários',
		html : 'Lista com todos os comentários existentes'
	}, {
		title : 'Comentar',
		html : 'Form para comentar'
	}]
});