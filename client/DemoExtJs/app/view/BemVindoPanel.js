Ext.define('DemoExtJs.view.BemVindoPanel', {
	extend : 'Ext.panel.Panel',
	xtype : 'bem-vindo-panel',
	title : 'Bem vindo',
	layout : 'column',
	autoScroll : true,
	defaultType : 'container',
	items : [{
		columnWidth : 1 / 4,
		padding : '10 10 10 10',
		items : [{
			title : 'Sobre a Informação Prévia no minuto',
			// bodyStyle:{ "background-color":"#f5f5eb" },
			loader : {
				url : 'resources/guiarapido/sobre.html',
				autoLoad : true
			}
		}]
	}, {
		columnWidth : 1 / 2,
		padding : '10 10 10 10', // top, right, bottom, left
		items : [{
			itemId : 'wizard',
			height : 400,
			layout : 'card',
			items : [{
				title : 'Guia rápido',
				autoScroll : true,
				loader : {
					url : 'resources/guiarapido/introducao.html',
					autoLoad : true
				}
			}, {
				title : 'Guia rápido',
				autoScroll : true,
				loader : {
					url : 'resources/guiarapido/registo.html',
					autoLoad : true
				}
			}, {
				title : 'Guia rápido',
				autoScroll : true,
				loader : {
					url : 'resources/guiarapido/navegar.html',
					autoLoad : true
				}
			}, {
				title : 'Guia rápido',
				autoScroll : true,
				loader : {
					url : 'resources/guiarapido/procurar.html',
					autoLoad : true
				}
			}, {
				title : 'Guia rápido',
				autoScroll : true,
				loader : {
					url : 'resources/guiarapido/desenhar.html',
					autoLoad : true
				}
			}, {
				title : 'Guia rápido',
				autoScroll : true,
				loader : {
					url : 'resources/guiarapido/upload.html',
					autoLoad : true
				}
			}, {
				title : 'Guia rápido',
				autoScroll : true,
				loader : {
					url : 'resources/guiarapido/consultar.html',
					autoLoad : true
				}
			}, {
				title : 'Guia rápido',
				autoScroll : true,
				loader : {
					url : 'resources/guiarapido/imprimir.html',
					autoLoad : true
				}
			}, {
				title : 'Guia rápido',
				autoScroll : true,
				loader : {
					url : 'resources/guiarapido/terminar.html',
					autoLoad : true
				}
			}],
			bbar : [{
				text : 'Saltar o Guia',
				itemId : 'saltar'
			}, '->', {
				text : 'Anterior',
				itemId : 'previous',
				disabled : true
			}, {
				text : 'Seguinte',
				itemId : 'next'
			}]
		} /*, {
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
		 } */ ]
	}, {
		columnWidth : 1 / 4,
		margin : '10 10 10 10',
		items : [{
			title : 'Notícias sobre a aplicação',
			html : '<h3>Versão beta</h3><p>2014-07-25 - Foi lançada a versão beta.</p>'
		}]
	}]
});
