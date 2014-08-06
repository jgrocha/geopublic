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
			bodyStyle : {
				'color' : '#666666'
			},
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
			height : 600,
			layout : 'card',
			items : [{
				title : 'Guia rápido',
				autoScroll : true,
				bodyStyle : {
					"background-image" : "url(resources/images/1minuto_fundo_500x500.png)",
					"background-repeat" : "no-repeat",
					"background-position" : "center"
				},
				loader : {
					url : 'resources/guiarapido/introducao.html',
					autoLoad : true
				}
			}, {
				title : 'Guia rápido',
				autoScroll : true,
				bodyStyle : {
					"background-image" : "url(resources/images/1minuto_fundo_500x500.png)",
					"background-repeat" : "no-repeat",
					"background-position" : "center"
				},
				loader : {
					url : 'resources/guiarapido/registo.html',
					autoLoad : true
				}
			}, {
				title : 'Guia rápido',
				autoScroll : true,
				bodyStyle : {
					"background-color" : "purple"
				},
				bodyStyle : {
					"background-image" : "url(resources/images/1minuto_fundo_500x500.png)",
					"background-repeat" : "no-repeat",
					"background-position" : "center"
				},
				loader : {
					url : 'resources/guiarapido/navegar.html',
					autoLoad : true
				}
			}, {
				title : 'Guia rápido',
				autoScroll : true,
				bodyStyle : {
					"background-image" : "url(resources/images/1minuto_fundo_500x500.png)",
					"background-repeat" : "no-repeat",
					"background-position" : "center"
				},
				loader : {
					url : 'resources/guiarapido/procurar.html',
					autoLoad : true
				}
			}, {
				title : 'Guia rápido',
				autoScroll : true,
				bodyStyle : {
					"background-image" : "url(resources/images/1minuto_fundo_500x500.png)",
					"background-repeat" : "no-repeat",
					"background-position" : "center"
				},
				loader : {
					url : 'resources/guiarapido/desenhar.html',
					autoLoad : true
				}
			}, {
				title : 'Guia rápido',
				autoScroll : true,
				bodyStyle : {
					"background-image" : "url(resources/images/1minuto_fundo_500x500.png)",
					"background-repeat" : "no-repeat",
					"background-position" : "center"
				},
				loader : {
					url : 'resources/guiarapido/upload.html',
					autoLoad : true
				}
			}, {
				title : 'Guia rápido',
				autoScroll : true,
				bodyStyle : {
					"background-image" : "url(resources/images/1minuto_fundo_500x500.png)",
					"background-repeat" : "no-repeat",
					"background-position" : "center"
				},
				loader : {
					url : 'resources/guiarapido/consultar.html',
					autoLoad : true
				}
			}, {
				title : 'Guia rápido',
				autoScroll : true,
				bodyStyle : {
					"background-image" : "url(resources/images/1minuto_fundo_500x500.png)",
					"background-repeat" : "no-repeat",
					"background-position" : "center"
				},
				loader : {
					url : 'resources/guiarapido/imprimir.html',
					autoLoad : true
				}
			}, {
				title : 'Guia rápido',
				autoScroll : true,
				bodyStyle : {
					"background-image" : "url(resources/images/1minuto_fundo_500x500.png)",
					"background-repeat" : "no-repeat",
					"background-position" : "center"
				},
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
		}]
	}, {
		columnWidth : 1 / 4,
		margin : '10 10 10 10',
		items : [{
			title : 'Notícias sobre a aplicação',
			bodyStyle : {
				'color' : '#666666'
			},
			html : '<h3>Versão beta</h3><p>2014-08-06 - Foi lançada a versão beta.</p>' + '<h3>Versão alfa</h3><p>2014-07-25 - Foi lançada a versão alfa.</p>'
		}]
	}]
});
