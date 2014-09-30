Ext.define('DemoExtJs.view.StartPanel', {
	extend : 'Ext.panel.Panel',
	alias : 'widget.startpanel',
	title : 'Bem vindo',
	autoScroll : true,
	width : 900,
	initComponent : function() {
		this.callParent(arguments);
	},
	layout : {
		type : 'vbox',
		padding : '5',
		align : 'center'
	},
	defaults : {
		margin : '0 0 5 0'
	},
	items : [{
		title : 'Participação cívica',
		itemId : 'participationbar',
		width : 900,
		autoScroll : true,
		loader : {
			url : 'resources/guiarapido/introducao.html',
			autoLoad : true
		},
	}, {
		width : 900,
		itemId : 'circlebar',
		layout : {
			type : 'hbox',
			padding : '5',
			pack : 'center',
			align : 'middle'
		},
		defaults : {
			margin : '0 5 0 0'
		},
		items : [{
			xtype : 'container',
			itemId : 'promotorescircle',
			cls : 'circle',
			width : 150,
			height : 150,
			html : '1 Promotores'
		}, {
			xtype : 'container',
			itemId : 'planoscircle',
			cls : 'circle',
			width : 150,
			height : 150,
			html : '1 Planos'
		}, {
			xtype : 'container',
			cls : 'circle',
			width : 150,
			height : 150,
			html : '156 Participações'
		}, {
			xtype : 'container',
			cls : 'circle',
			width : 150,
			height : 150,
			html : '120 Comentários'
		}]
	}, {
		title : 'Promotores',
		width : 900,
		autoScroll : true,
		itemId : 'promotorbar',
		hidden : true,
		layout : {
			type : 'hbox',
			padding : '5',
			pack : 'left', // 'center',
			align : 'left' // 'middle'
		},
		defaults : {
			margin : '0 10 0 0'
		},
		items : []
	}, {
		xtype : 'tabpanel',
		itemId : 'planbar',
		hidden : true,
		plain : true, // remover o fundo da barra dos panels
		items : [{
			title : 'Planos em discussão',
			width : 900,
			layout : {
				type : 'hbox',
				padding : '5',
				pack : 'left', // 'center',
				align : 'middle'
			},
			defaults : {
				margin : '0 10 0 0'
			},
			items : [{
				title : 'Plano Local de Promoção das Acessibilidades',
				width : 280,
				frame : true,
				ui : 'light',
				layout : {
					type : 'vbox',
					padding : '5',
					align : 'center'
				},
				items : [{
					xtype : 'image',
					src : 'resources/images/startpanel/plpa.jpg',
					shrinkWrap : 0,
					width : 200,
					height : 200
				}, {
					html : 'De: 2014-07-01'
				}, {
					html : 'Até: 2014-10-31'
				}, {
					html : 'Responsável: Gil Nadais'
				}, {
					html : 'Contacto: <a href="mailto:apoio@cm-agueda.pt">apoio@cm-agueda.pt</a>'
				}, {
					xtype : 'button',
					itemId : 'planplpa',
					text : 'O plano em números'
				}]
			}]
		}, {
			title : 'Planos já discutidos',
			disabled : true
		}]
	}, {
		title : 'Plano Local de Promoção das Acessibilidades',
		itemId : 'planpresentationbar',
		hidden : true,
		width : 900,
		autoScroll : true,
		loader : {
			url : 'resources/guiarapido/plpa.html',
			autoLoad : true
		}
	}, {
		// title : 'Gráficos',
		itemId : 'estatisticas',
		hidden : true,
		width : 900,
		layout : {
			type : 'hbox',
			padding : '5',
			pack : 'left', // 'center',
			align : 'middle'
		},
		defaults : {
			margin : '0 10 0 0'
		},
		items : [{
			xtype : 'startpanelchartbytype',
			layout : 'fit',
			width : 560,
			height : 280
		}, {
			xtype : 'startpanelchartbystate',
			layout : 'fit',
			width : 280,
			height : 280
		}]
	}, {
		width : 900,
		itemId : 'readybar',
		title : 'Preparado?',
		hidden : true,
		layout : {
			type : 'hbox',
			padding : '5',
			pack : 'center',
			align : 'middle'
		},
		defaults : {
			margin : '0 5 0 0'
		},
		items : [{
			width : 700,
			autoScroll : true,
			loader : {
				url : 'resources/guiarapido/participar.html',
				autoLoad : true
			},
		}, {
			xtype : 'container',
			itemId : 'participecircle',
			cls : 'circle',
			width : 150,
			height : 150,
			html : 'Participar'
		}]
	}]
});
