/*
 *
 */
Ext.define('DemoExtJs.controller.TopHeader', {
	extend : 'Ext.app.Controller',
	// Ext.ComponentQuery.query('topheader button#botaoLogin')
	refs : [{
		selector : 'topheader button#botaoLogin',
		ref : 'botaoLogin' // gera um getBotaoLogin
	}, {
		selector : 'topheader button#botaoLogout',
		ref : 'botaoLogout' // gera um getBotaoLogout
	}, {
		selector : 'topheader button#botaoRegisto',
		ref : 'botaoRegisto' // gera um getBotaoRegisto
	}, {
		selector : 'topheader splitbutton',
		ref : 'botaoMenu' // gera um getBotaoMenu
	}, {
		selector : 'viewport > tabpanel',
		ref : 'painelPrincipal' // gera um getPainelPrincipal
	}],
	init : function() {
		console.log('O controlador está a arrancar...');
		this.control({
			"topheader button#botaoRegisto" : {
				click : this.onButtonClickRegisto
			},
			"topheader button#botaoLogin" : {
				click : this.onButtonClickLogin
			},
			"topheader splitbutton #botaoLastAccess" : {
				click : this.onButtonLastAccess
			},
			"topheader splitbutton #botaoPerfil" : {
				click : this.onButtonClickPerfil
			},
			"topheader splitbutton #botaoLogout" : {
				click : this.onButtonClickLogout
			},
			"topheader splitbutton" : {
				click : this.onButtonMenu
			},
			"login form button#lost" : {
				click : this.onButtonClickLostPassword
			},
			"login form button#entrar" : {
				click : this.onButtonClickEntrar
			},
			"login form button#cancelar" : {
				click : this.onButtonClickCancelar
			},
			"registo form button#entrar" : {
				click : this.onButtonClickRegistar
			},
			"registo form button#cancelar" : {
				click : this.onButtonClickCancelar
			},
			"lostpassword form button#entrar" : {
				click : this.onButtonClickSendLostPassword
			},
			"lostpassword form button#cancelar" : {
				click : this.onButtonClickCancelar
			},
			"login form textfield" : {
				// é disparado tanto em field.name = "user" como em field.name = "password"
				specialkey : this.onTextfieldSpecialKey
			} /* ,
			 "demo-cookies toolbar button" : {
			 click : this.onButtonClickAuthentificate
			 } */
		});
		this.application.on({
			scope : this,
			loginComSucesso : this.onLogin,
			logoutComSucesso : this.onLogout
		});
	},
	onLaunch : function() {
		console.log('...O controlador arrancou.');
		this.getBotaoMenu().menu.disable();
	},

	onLogout : function() {
		console.log('Vamos reagir ao evento logoutComSucesso');
		this.getBotaoRegisto().setDisabled(false);
		this.getBotaoLogin().setText('Iniciar sessão');
		this.getBotaoMenu().menu.disable();
		// eventualment fechar views que sejam restritas a utilizadores, como a vista do perfil
		if (DemoExtJs.LoggedInUser) {
			DemoExtJs.LoggedInUser = null;
		}
	},
	onLogin : function() {
		console.log('Vamos reagir ao evento loginComSucesso');
		this.getBotaoRegisto().setDisabled(true);
		if (DemoExtJs.LoggedInUser) {
			this.getBotaoLogin().setText(DemoExtJs.LoggedInUser.data.nome);
			this.getBotaoMenu().menu.enable();
		}
		// Mostra o menu, só por curiosidade...
		// this.getBotaoMenu().showMenu();
	},
	onButtonLastAccess : function(button, e, options) {
		Ext.Msg.show({
			title : 'Registo de entradas',
			msg : 'Falta abrir o store, que tem o auo a off.',
			icon : Ext.Msg.INFO,
			buttons : Ext.Msg.OK
		});

		var mainPanel = this.getPainelPrincipal();
		var newTab = mainPanel.items.findBy(function(tab) {
			return tab.title === 'Last access';
		});
		if (!newTab) {
			if (Ext.ClassManager.getNameByAlias('widget.grid-sessao') != "") {
				newTab = mainPanel.add({
					xtype : 'grid-sessao',
					closable : true,
					title : 'Last access'
				});
			} else {
				console.log("Erro! The class " + 'widget.grid-sessao' + " does not exist!");
			}
		}
		mainPanel.setActiveTab(newTab);
	},
	onButtonClickLostPassword : function(button, e, options) {
		button.up('login').close();
		Ext.create('DemoExtJs.view.Users.LostPassword').show();
	},
	onButtonClickRegisto : function(button, e, options) {
		var win = Ext.create('DemoExtJs.view.Users.Registo');
		win.show();
	},
	onButtonMenu : function(button, e, options) {
		console.log('onButtonMenu');
	},
	onButtonClickPerfil : function(button, e, options) {
		console.log('Vamos mostrar e permitir atualizar o perfil do utilizador');
		var mainPanel = this.getPainelPrincipal();
		var newTab = mainPanel.items.findBy(function(tab) {
			return tab.title === 'Profile';
		});
		if (!newTab) {
			if (Ext.ClassManager.getNameByAlias('widget.profile') != "") {
				newTab = mainPanel.add({
					xtype : 'profile',
					closable : true,
					title : 'Profile'
				});
			} else {
				console.log("Erro! The class " + 'widget.profile' + " does not exist!");
			}
		}
		mainPanel.setActiveTab(newTab);
	},
	onButtonClickLogin : function(button, e, options) {
		console.log('Vamos autenticar um utilizador, se não estiver já loginado');
		// passar a verificar o objeto global DemoExtJs.LoggedInUser
		// se fechar o browser sem sair (e se tinha o recordar clicado) pode recuperar a sessão antiga
		// ao entrar, verifico no servidor que é uma sessão conhecida e devoldo os dados do utilizador para este objeto
		// var user = Ext.state.Manager.get("utilizador");
		if (DemoExtJs.LoggedInUser == null) {
			var win = Ext.create('DemoExtJs.view.Users.Login');
			win.show();
		} else {
			console.log('Utilizador atual ' + DemoExtJs.LoggedInUser.data.nome + ' com o email ' + DemoExtJs.LoggedInUser.data.email);
			ExtRemote.DXFormTest.testMe({
				test : true
			}, function(result, event) {
				// you can grab useful info from event
				console.log('Invoquei ExtRemote.DXFormTest.testMe');
			});
		}
	},

	onButtonClickLogout : function(button, e, options) {
		var me = this;
		console.log('logout!');
		ExtRemote.DXLogin.deauthenticate({}, function(result, event) {
			// result == event.result
			console.debug(result);
			// console.debug(event);
			if (result.success) {
				Ext.Msg.alert(result.message);
				// Ext.create('DemoExtJs.model.Utilizador', result.data[0]);
				DemoExtJs.LoggedInUser = null;
				me.application.fireEvent('logoutComSucesso');
			} else {
				Ext.Msg.alert('Something wrong with logout', Ext.encode(result));
			}
		});
	},

	onButtonClickSendLostPassword : function(button, e, options) {
		var me = this;
		console.log('registo submit');

		var formPanel = button.up('form'), registo = button.up('lostpassword');
		var email = formPanel.down('textfield[name=email]').getValue();

		if (formPanel.getForm().isValid()) {
			ExtRemote.DXLogin.reset({
				email : email
			}, function(result, event) {
				if (result.success) {
					Ext.Msg.alert('Successul', Ext.encode(result) + '<br/>' + 'Foi enviado um email para ' + email);
				} else {
					Ext.Msg.alert('Problems with password', result.message);
				}
				registo.close();
			});
		} else {
			Ext.Msg.alert('Preenchimento incorreto', 'Reveja o preenchimento dos campos, pois os dados não são considerados válidos.');
		}
	},

	onButtonClickRegistar : function(button, e, options) {
		var me = this;
		console.log('registo submit');

		var formPanel = button.up('form'), registo = button.up('registo');
		var email = formPanel.down('textfield[name=email]').getValue(), name = formPanel.down('textfield[name=name]').getValue(), password = formPanel.down('textfield[name=password]').getValue(), password2x = formPanel.down('textfield[name=password2x]').getValue();
		var sha1 = CryptoJS.SHA1(password).toString();
		if (formPanel.getForm().isValid()) {
			// Ext.get(login.getEl()).mask("A validar a identificação... Aguarde...", 'loading');
			console.log('Vai tentar com o registo com ' + email + ' e a password = ' + password + ' codificada = ' + sha1);
			ExtRemote.DXLogin.registration({
				email : email,
				name : name,
				password : sha1
			}, function(result, event) {
				// result == event.result
				console.debug(result);
				// console.debug(event);
				if (result.success) {
					Ext.Msg.alert('Successul registered', Ext.encode(result) + '<br/>' + 'Foi enviado um email para ' + email);
				} else {
					Ext.Msg.alert('Problems with registration', Ext.encode(result));
				}
				registo.close();
			});
		} else {
			Ext.Msg.alert('Preenchimento incorreto', 'Reveja o preenchimento dos campos, pois os dados não são considerados válidos.');
		}
	},

	onButtonClickEntrar : function(button, e, options) {
		var me = this;
		console.log('login submit');
		var formPanel = button.up('form'), login = button.up('login');
		var email = formPanel.down('textfield[name=email]').getValue(), pass = formPanel.down('textfield[name=password]').getValue();
		var remember = formPanel.down('checkbox[name=remember]').checked;
		if (remember) {
			console.log('Para recordar...');
		} else {
			console.log('NÃO recordar NESTE COMPUTADOR...');
		}
		var sha1 = CryptoJS.SHA1(pass).toString();
		if (formPanel.getForm().isValid()) {
			// Ext.get(login.getEl()).mask("A validar a identificação... Aguarde...", 'loading');
			console.log('Vai tentar com o login com ' + email + ' e a password = ' + pass + ' codificada = ' + sha1);
			ExtRemote.DXLogin.authenticate({
				email : email,
				password : sha1,
				remember : remember
			}, function(result, event) {
				// result == event.result
				console.debug(result);
				// console.debug(event);
				if (result.success) {
					// We have a valid user data
					Ext.Msg.alert('Successul login', Ext.encode(result));
					DemoExtJs.LoggedInUser = Ext.create('DemoExtJs.model.Utilizador', result.data[0]);
					/*
					 * se remember, altero o cookie para sobreviver mais tempo
					 * se o cookie sobreviver, ele será loginado na próxima vez
					 * não preciso de usar o local storage ou qualquer outro cookie
					 */
					me.application.fireEvent('loginComSucesso');
					login.close();
				} else {
					Ext.Msg.alert('Invalid login', Ext.encode(result));
				}
			});
		}
	},
	onButtonClickCancelar : function(button, e, options) {
		button.up('form').getForm().reset();
		button.up('window').close();
	},
	onTextfieldSpecialKey : function(field, e, options) {
		if (e.getKey() == e.ENTER) {
			console.log('Carregou no ENTER');
			var entrar = field.up('form').down('button#entrar');
			entrar.fireEvent('click', entrar, e, options);
		}
	}
});
