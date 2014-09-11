Ext.define('DemoExtJs.view.Guia', {
	extend : 'Ext.ux.Wizard',
	alias : 'widget.guia',
	// title: 'A simple example for a wizard'
	headConfig : false, // true,
	sideConfig : false, // true,
	/*
	 // no headConfig suplied no header will be shown.
	 headConfig : {
	 // title: 'Simple Wizard Head title Example',
	 headerPosition : 'top',
	 position : 'top'// or bottom
	 ,
	 stepText : "<center>Step {0} of {1}: {2}</center>"
	 },

	 // no sideConfig suplied no header will be shown.
	 sideConfig : {
	 // title: 'Simple Wizard Side title Example',
	 headerPosition : 'left',
	 position : 'left' // or right
	 },
	 */
	width : 450, // 850,
	height : 400, // 800,
	closable : false,
	closeAction : 'hide',
	cardPanelConfig : {
		defaults : {
			baseCls : 'x-small-editor',
			bodyStyle : 'padding:40px 15px 5px 120px;background-color:#F6F6F6;',
			border : false
		},
		layout : 'card'
	},
	cards : [Ext.create('Ext.ux.wizard.Card', {
		title : 'Bem vindo!',
		showTitle : true,
		titleCls : '',
		titleStyle : 'font-size: 2.5em;',
		baseCls : 'rnd1',
		items : [{
			border : false,
			bodyStyle : 'background:none;',
			html : 'Bem vindo à plataforma de participação no <strong>Plano local de promoção da acessibilidade</strong>, ' + 'onde poderá contribuir para um concelho com plena acessibilidade para todos os membros da comunidade, <i>independentemente das suas diferenças físicas ou psicológicas</i>.' + '<br/><br/>' + 'Por favor clique no botão "Seguinte" para ver este guia passo a passo.'
		}, {
			xtype : 'image',
			src : 'resources/images/ppgis/plpa.jpg', // plpa.jpg
			height : 149,
			width : 168,
			border : true,
			// style : 'padding-left:60px',
			resizable : false
		}]
	}), new Ext.ux.wizard.Card({
		title : 'Navegue no mapa',
		showTitle : true,
		titleCls : '',
		titleStyle : 'font-size: 2.5em;',
		monitorValid : true,
		baseCls : 'rnd1',
		defaults : {
			labelStyle : 'font-size:12px'
		},
		fieldDefaults : {
			labelAlign : 'right',
			msgTarget : 'none',
			invalidCls : '' //unset the invalidCls so individual fields do not get styled as invalid
		},
		items : [{
			border : false,
			bodyStyle : 'background:none;padding-bottom:10px;',
			html : 'Para mover o mapa, arraste o mapa de um lado para o outro (com o botão do rato pressionado)'
		}, {
			border : false,
			bodyStyle : 'background:none;padding-bottom:10px;',
			html : 'Amplie e reduza o mapa rolando o botão do rato.<br/>' + 'Em alternativa, pode também usar os botão + e - que aparecem no canto superior esquerdo do mapa'
		}, {
			border : false,
			bodyStyle : 'background:none;padding-bottom:10px;',
			html : 'No lado direito, tem um painel "Informações" parcialmente oculto. ' + 'Abra-o e dentro do painel "Camadas" mostre e esconda as camadas que quer ver no mapa'
		}, {
			border : false,
			bodyStyle : 'background:none;padding-bottom:10px;',
			html : 'Procure uma rua ou local recorrendo à caixa de pequisa na barra superior do mapa'
		}]
	}), new Ext.ux.wizard.Card({
		title : 'Veja outras contruibuições',
		showTitle : true,
		titleCls : '',
		titleStyle : 'font-size: 2.5em;',
		monitorValid : true,
		baseCls : 'rnd1',
		// margins : '10 10 10 10',
		defaults : {
			labelStyle : 'font-size:11px'
		},
		items : [{
			border : false,
			bodyStyle : 'background:none;padding-bottom:10px;',
			html : 'As contribuições aparecem no mapa assinaladas com uma bandeirinha'
		}, {
			border : false,
			bodyStyle : 'background:none;padding-bottom:10px;',
			html : 'A janela com todas as contribuições está sempre presente'
		}, {
			border : false,
			bodyStyle : 'background:none;padding-bottom:10px;',
			html : 'Selecione uma contribuição nessa janela, para centrar o mapa nesse local'
		}, {
			border : false,
			bodyStyle : 'background:none;padding-bottom:10px;',
			html : 'Passe o rato sobre uma contribuição existente para ver os detalhes da mesma'
		}]
	}), new Ext.ux.wizard.Card({
		title : 'Participe!',
		showTitle : true,
		titleCls : '',
		titleStyle : 'font-size: 2.5em;',
		monitorValid : true,
		baseCls : 'rnd1',
		defaults : {
			labelStyle : 'font-size:12px'
		},
		fieldDefaults : {
			labelAlign : 'right',
			msgTarget : 'none',
			invalidCls : '' //unset the invalidCls so individual fields do not get styled as invalid
		},
		items : [{
			border : false,
			bodyStyle : 'background:none;padding-bottom:10px;',
			html : 'A sua contribuição é muito bem vinda'
		}, {
			border : false,
			bodyStyle : 'background:none;padding-bottom:10px;',
			html : 'Pode participar de duas formas:'
		}, {
			border : false,
			bodyStyle : 'background:none;padding-bottom:5px;padding-left:30px;',
			html : 'Submetendo uma nova contribuição'
		}, {
			border : false,
			bodyStyle : 'background:none;padding-bottom:5px;padding-left:30px;',
			html : 'Comentando uma contribuição já registada'
		}]
	}), new Ext.ux.wizard.Card({
		title : 'Nova contribuição',
		showTitle : true,
		titleCls : '',
		titleStyle : 'font-size: 2.5em;',
		monitorValid : true,
		baseCls : 'rnd1',
		defaults : {
			labelStyle : 'font-size:12px'
		},
		fieldDefaults : {
			labelAlign : 'right',
			msgTarget : 'none',
			invalidCls : '' //unset the invalidCls so individual fields do not get styled as invalid
		},
		items : [{
			border : false,
			bodyStyle : 'background:none;padding-bottom:10px;',
			html : 'Comece por centrar o mapa no local onde pretende contribuir'
		}, {
			border : false,
			bodyStyle : 'background:none;padding-bottom:10px;',
			html : 'Carregue no botão "Quero contribuir!" e clique no local pretendido'
		}, {
			border : false,
			bodyStyle : 'background:none;padding-bottom:10px;',
			html : 'Automaticamente aparece-lhe o formulário para descrever a sua participação'
		}, {
			border : false,
			bodyStyle : 'background:none;padding-bottom:10px;',
			html : 'Se clicou no local errado, pode cancelar esta participação para depois recomeçar'
		}]
	}), new Ext.ux.wizard.Card({
		title : 'Descreva a sua participação',
		showTitle : true,
		titleCls : '',
		titleStyle : 'font-size: 2.5em;',
		monitorValid : true,
		baseCls : 'rnd1',
		defaults : {
			labelStyle : 'font-size:12px'
		},
		fieldDefaults : {
			labelAlign : 'right',
			msgTarget : 'none',
			invalidCls : '' //unset the invalidCls so individual fields do not get styled as invalid
		},
		items : [{
			border : false,
			bodyStyle : 'background:none;padding-bottom:10px;',
			html : 'Comece por definir o assunto da sua participação, em 3 ou 4 palavras no máximo'
		}, {
			border : false,
			bodyStyle : 'background:none;padding-bottom:10px;',
			html : 'Detalhe a sua contribuição, com o texto que for necessário'
		}, {
			border : false,
			bodyStyle : 'background:none;padding-bottom:10px;',
			html : 'Preencha o seu nome, preferencialmente utilizando o primeiro e último nome'
		}, {
			border : false,
			bodyStyle : 'background:none;padding-bottom:10px;',
			html : 'Indique o seu email, para receber notificações sobre a sua participação' + '<ul>' + '<li>Receberá por email a notificação de que a mesma foi registada no sistema' + '<li>Sempre que a sua participação for comentada, será notificado por email' + '</ul>'
		}, {
			border : false,
			bodyStyle : 'background:none;padding-bottom:10px;',
			html : 'Carregue em "Contribuir" para avançar'
		}]
	}), new Ext.ux.wizard.Card({
		title : 'Ilustre a sua participação',
		showTitle : true,
		titleCls : '',
		titleStyle : 'font-size: 2.5em;',
		monitorValid : true,
		baseCls : 'rnd1',
		defaults : {
			labelStyle : 'font-size:12px'
		},
		fieldDefaults : {
			labelAlign : 'right',
			msgTarget : 'none',
			invalidCls : '' //unset the invalidCls so individual fields do not get styled as invalid
		},
		items : [{
			border : false,
			bodyStyle : 'background:none;padding-bottom:10px;',
			html : 'Se puder, antecipadamente tire uma fotografia ao local ou contexto da sua contribuição'
		}, {
			border : false,
			bodyStyle : 'background:none;padding-bottom:10px;',
			html : 'Se tem uma fotografia, carregue no botão para escolher a fotografia previamente guardada no computador'
		}, {
			border : false,
			bodyStyle : 'background:none;padding-bottom:10px;',
			html : 'Escolha "Enviar" para terminar a sua contribuição'
		}, {
			border : false,
			bodyStyle : 'background:none;padding-bottom:10px;',
			html : 'Se não tem uma fotografia a ilustrar a sua participação, salte este passo e escolha "Não enviar fotografia" para terminar a sua contribuição.'
		}]
	}), new Ext.ux.wizard.Card({
		title : 'Comentar contribuições existentes',
		showTitle : true,
		titleCls : '',
		titleStyle : 'font-size: 2.5em;',
		monitorValid : true,
		baseCls : 'rnd1',
		defaults : {
			labelStyle : 'font-size:12px'
		},
		fieldDefaults : {
			labelAlign : 'right',
			msgTarget : 'none',
			invalidCls : '' //unset the invalidCls so individual fields do not get styled as invalid
		},
		items : [{
			border : false,
			bodyStyle : 'background:none;padding-bottom:10px;',
			html : 'Pode acrescentar um comentário construtivo a qualquer contribuição anteriormente submetida'
		}, {
			border : false,
			bodyStyle : 'background:none;padding-bottom:10px;',
			html : 'Abra o dealhe dessa contribuição, passando o rato por cima da mesma'
		}, {
			border : false,
			bodyStyle : 'background:none;padding-bottom:10px;',
			html : 'Preencha o seu comentário e o seu nome (primeiro e último nome)'
		}, {
			border : false,
			bodyStyle : 'background:none;padding-bottom:10px;',
			html : 'Escolha "Comentar" para terminar'
		}]
	}), new Ext.ux.wizard.Card({
		title : 'Fim!',
		showTitle : true,
		titleCls : '',
		titleStyle : 'font-size: 2.5em;',
		monitorValid : true,
		baseCls : 'rnd1',
		items : [{
			border : false,
			bodyStyle : 'background:none;padding-bottom:10px;',
			html : 'Pronto para participar? '
		}, {
			border : false,
			bodyStyle : 'background:none;padding-bottom:10px;',
			html : 'Ao carregar em "Terminar" este guia será fechado'
		}, {
			border : false,
			bodyStyle : 'background:none;padding-bottom:10px;',
			html : 'Sempre que quiser, pode voltar a ver este guia passo a passo, carregando no botão "Guia passo a passo"'
		}, {
			border : false,
			bodyStyle : 'background:none;padding-bottom:10px;',
			html : 'Abra o painel lateral direito "informações" (que está parcialmente escondido) para informações mais detalhadas sobre o Plano local de promoção da acessibilidade”'
		}, {
			border : false,
			bodyStyle : 'background:none;padding-bottom:10px;',
			html : 'Contamos consigo!'
		}]
	})]
});
