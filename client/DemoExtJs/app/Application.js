Ext.define('DemoExtJs.Application', {
	name : 'DemoExtJs',
	requires : ['DemoExtJs.DirectAPI', 'Ext.util.Cookies', 'Ext.ux.DataTip'],
	extend : 'Ext.app.Application',
	views : ['MethodCall', 'FormActions', 'GridActions', 'FormUpload', 'TreeActions', 'Cookies', 'TopHeader', 'GridSessao', 'Users.Profile'],
	controllers : ['Main', 'TopHeader', 'Users.Profile'],
	models : ['TodoItem', 'Utilizador', 'Sessao'],
	stores : ['Todo', 'Tree', 'Sessao'],
	launch : function() {
		var me = this;
		// Ext.tip.QuickTipManager.init();
		Ext.QuickTips.init();
		console.log('... tudo carregado e pronto a funcionar (app/Application.js).');
		if (Ext.supports.LocalStorage) {
			Ext.state.Manager.setProvider(Ext.create('Ext.state.LocalStorageProvider'));
			console.log('Vai usar local storage HTML 5');
		} else {
			Ext.state.Manager.setProvider(Ext.create('Ext.state.CookieProvider'));
			console.log('Vai usar cookies');
		}

		// ver se vem alguma action a caminho...
		// http://development.localhost.lan/?action=reset&error=O%20token%20n%C3%A3o%20existe

		var params = Ext.Object.fromQueryString(document.location.search);
		console.log('params', params);
		if (Ext.Object.getKeys(params).length > 0) {
			switch (params.action) {
				case 'registo':
					if (params.error) {
						Ext.Msg.show({
							title : 'Problemas com o registo',
							msg : 'O seu registo pode não ter sido bem sucedido.<br/>O servidor retornou a seguinte mensagem:<br/><b>' + params.error + '</b>',
							icon : Ext.Msg.ERROR,
							buttons : Ext.Msg.OK
						});
					} else {
						Ext.Msg.show({
							title : 'Email confirmado',
							msg : 'Inicie a sessão com os dados com que se registou.',
							icon : Ext.Msg.INFO,
							buttons : Ext.Msg.OK
						});
					}
					break;
				case 'reset':
					if (params.error) {
						Ext.Msg.show({
							title : 'Problemas na alteração da senha',
							msg : 'A sua senha pode não ter sido alterada.<br/>O servidor retornou a seguinte mensagem:<br/><b>' + params.error + '</b>',
							icon : Ext.Msg.ERROR,
							buttons : Ext.Msg.OK
						});
					} else {
						Ext.Msg.show({
							title : 'Senha alterada',
							msg : 'A sua senha foi alterada. Consulte o seu email.',
							icon : Ext.Msg.INFO,
							buttons : Ext.Msg.OK
						});
					}
					break;
				default:
					console.log("action desconhecida");
					break;
			}
		}

		// Here we subscribe to the auth.authResponseChange JavaScript event. This event is fired
		// for any authentication related change, such as login, logout or session refresh. This means that
		// whenever someone who was previously logged out tries to log in again, the correct case below
		// will be handled.
		FB.Event.subscribe('auth.authResponseChange', function(response) {
			// Here we specify what we do with the response anytime this event occurs.
			if (response.status === 'connected') {
				// The response object is returned with a status field that lets the app know the current
				// login status of the person. In this case, we're handling the situation where they
				// have logged in to the app.
				me.connected();
			} else if (response.status === 'not_authorized') {
				// In this case, the person is logged into Facebook, but not into the app, so we call
				// FB.login() to prompt them to do so.
				// In real-life usage, you wouldn't want to immediately prompt someone to login
				// like this, for two reasons:
				// (1) JavaScript created popup windows are blocked by most browsers unless they
				// result from direct interaction from people using the app (such as a mouse click)
				// (2) it is a bad experience to be continually prompted to login upon page load.
				FB.login();
			} else {
				// In this case, the person is not logged into Facebook, so we call the login()
				// function to prompt them to do so. Note that at this stage there is no indication
				// of whether they are logged into the app. If they aren't then they'll see the Login
				// dialog right after they log in to Facebook.
				// The same caveats as above apply to the FB.login() call here.
				FB.login();
			}
		});

		// será que consigo fazer este alive se só existir um cookie do lado de cá que tenha sido enviado para o servidor?
		ExtRemote.DXLogin.alive({}, function(result, event) {
			console.log('------------------- ALIVE --------------------');
			// console.debug(result);
			// console.debug(event);
			if (result.success) {
				// We have a valid user data
				// Ext.Msg.alert('Successul login', Ext.encode(result));
				DemoExtJs.LoggedInUser = Ext.create('DemoExtJs.model.Utilizador', result.data[0]);
				// console.log(DemoExtJs.LoggedInUser);
				me.fireEvent('loginComSucesso');
			} else {
				me.fireEvent('logoutComSucesso');
			}
		});

	},
	// Here we run a very simple test of the Graph API after login is successful.
	// Não preciso do meu alive nestas circunstâncias!
	connected : function() {
		var me = this;
		console.log('Bem vindo!  Fetching your information.... ');
		FB.api('/me', function(response) {
			console.log('Good to see you, ' + response.name + '.');
			console.log(response);
			ExtRemote.DXLogin.facebook(response, function(result, event) {
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
					me.fireEvent('loginComSucesso');
				} else {
					Ext.Msg.alert('Invalid login', Ext.encode(result));
				}
			});
		});
	}
});
