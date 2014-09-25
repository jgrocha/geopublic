Ext.define('DemoExtJs.view.BemVindoPanel', {
	extend : 'Ext.panel.Panel',
	xtype : 'bem-vindo-panel',
	title : 'Ajuda',
	layout : 'column',
	autoScroll : true,
	defaultType : 'container',
	items : [{
		columnWidth : 1 / 4,
		padding : '10 10 10 10',
		items : [{
			title : 'Sobre a Participação Cívica',
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
		bodyCls: 'guia-panel',
		items : [{
			itemId : 'wizard',
			height : 600,
			layout : 'card',
			
			items : [{
				title : 'Guia rápido',
				autoScroll : true,
				bodyStyle : {
					"background-image" : "url(resources/images/community_gray_500x500.png)",
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
					"background-image" : "url(resources/images/community_gray_500x500.png)",
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
					"background-image" : "url(resources/images/community_gray_500x500.png)",
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
					"background-image" : "url(resources/images/community_gray_500x500.png)",
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
					"background-image" : "url(resources/images/community_gray_500x500.png)",
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
					"background-image" : "url(resources/images/community_gray_500x500.png)",
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
					"background-image" : "url(resources/images/community_gray_500x500.png)",
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
					"background-image" : "url(resources/images/community_gray_500x500.png)",
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
					"background-image" : "url(resources/images/community_gray_500x500.png)",
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
			title : 'Novidades',
			bodyStyle : {
				'color' : '#666666'
			},
			html : '<h3>Código disponível</h3><p>O código desta aplicação está disponível no <a href="https://github.com/jgrocha/geopublic">GitHub</a></p>'
		}]
	}]
});
