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
		margin : '0 0 50 0'
	},
	items : [{
		title : 'Participação cívica',
		itemId : 'participationbar',
		width : 900,
		autoScroll : true,
		bodyPadding : 10,
		loader : {
			url : 'resources/guiarapido/participacaocivica.html',
			autoLoad : true
		}
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
			html : '2 Promotores'
		}, {
			xtype : 'container',
			itemId : 'planoscircle',
			cls : 'circle',
			width : 150,
			height : 150,
			html : '3 Planos'
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
		bodyPadding : 10,
		itemId : 'promotorbar',
		hidden : true,
		layout : {
			type : 'hbox',
			padding : '0 0 20 0',
			pack : 'left', // 'center',
			align : 'left' // 'middle'
		},
		defaults : {
			margin : '0 10 0 0'
		},
		items : []
	}, {
		xtype : 'tabpanel',
		itemId : 'tabplanbar',
		hidden : true,
		plain : true, // remover o fundo da barra dos panels
		items : [{
			title : 'Planos em discussão',
			width : 900,
			itemId : 'planbar',
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
				xtype : 'startplano'
			}, {
				xtype : 'startplano'
			}, {
				xtype : 'startplano'
			}]
		}, {
			title : 'Planos já discutidos',
			disabled : true
		}]
	}, {
		xtype : 'tabpanel',
		itemId : 'planpresentationbar',
		width : 900,
		// hidden : true,
		plain : true, // remover o fundo da barra dos panels
		idplano : null,
		items : [/*
		 * to be added later
		 */]
	}, {
		width : 900,
		itemId : 'readybar',
		title : 'Participar',
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
			}
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
