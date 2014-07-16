Ext.define('DemoExtJs.Application', {
	name : 'DemoExtJs',
	requires : ['DemoExtJs.DirectAPI', 'Ext.grid.plugin.RowEditing', 'Ext.form.Label', 'Ext.util.Cookies', 'Ext.ux.DataTip', 'GeoExt.panel.Map', 'Ext.button.Split', 'Ext.grid.column.Date', 'Ext.state.LocalStorageProvider'],
	extend : 'Ext.app.Application',
	views : ['BemVindoPanel', 'MainMapPanel', 'Promotor', 'MethodCall', 'FormActions', 'GridActions', 'FormUpload', 'TreeActions', 'Cookies', 'TopHeader', 'Users.GridSessao', 'Users.Profile', 'InfPrevia.WindowConfrontacao', 'InfPrevia.Hierarquia'],
	controllers : ['Main', 'TopHeader', 'Users.Profile', 'MainMapPanel', 'BemVindoPanel', 'Promotor', 'Plano', 'TipoOcorrencia', 'InfPrevia.WindowConfrontacao', 'InfPrevia.Hierarquia'],
	models : ['TodoItem', 'Utilizador', 'Sessao', 'Promotor', 'Plano', 'TipoOcorrencia'],
	stores : ['Todo', 'Tree', 'Sessao', 'Promotor', 'Plano', 'TipoOcorrencia'],
	init : function() {
		var me = this;
		hello.init({
			facebook : '1425420377699726',
			google : '171807226739-pl2lsvoh70jeqqtkcdrqpo9j8urfdcij.apps.googleusercontent.com',
			windows : '0000000048117A44'
		});
		var sessionstart = function(auth) {
			console.log('Bem vindo!  Vou pedir os seus dados à rede ' + auth.network);
			var api_me_error = function() {
				console.log("Erro ao invocar a api \"me\" da rede " + auth.network);
			};
			var api_me = function(response) {
				response["network"] = auth.network;
				console.log(Ext.encode(response));
				ExtRemote.DXLogin.social(response, function(result, event) {
					if (result.success) {
						Ext.Msg.alert('Successul login', Ext.encode(result));
						DemoExtJs.LoggedInUser = Ext.create('DemoExtJs.model.Utilizador', result.data[0]);
						DemoExtJs.LoggedInUser["login"] = auth.network;
						me.fireEvent('loginComSucesso');
					} else {
						Ext.Msg.alert('Invalid login', Ext.encode(result));
					}
				});
			};
			hello(auth.network).api("me").success(api_me).error(api_me_error);
		};
		var sessionend = function(auth) {
			console.log("Session has ended. Auth: " + auth.network);
			console.log(auth);
			ExtRemote.DXLogin.deauthenticate({}, function(result, event) {
				if (result.success) {
					Ext.Msg.alert(result.message);
					me.fireEvent('logoutComSucesso');
				} else {
					Ext.Msg.alert('Something wrong with logout', Ext.encode(result));
				}
			});
		};
		hello.on("auth.logout", sessionend);
		hello.on("auth.login", sessionstart);

		/*
		 hello.on("auth.failed", function() {
		 console.log(arguments);
		 });
		 hello.on("auth", function() {
		 console.log(arguments);
		 });
		 */

	},
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

		// será que consigo fazer este alive se só existir um cookie do lado de cá que tenha sido enviado para o servidor?

		ExtRemote.DXLogin.alive({}, function(result, event) {
			console.log('------------------- ALIVE --------------------');
			// console.debug(result);
			// console.debug(event);
			if (result.success) {
				// We have a valid user data
				// Ext.Msg.alert('Successul login', Ext.encode(result));
				DemoExtJs.LoggedInUser = Ext.create('DemoExtJs.model.Utilizador', result.data[0]);
				DemoExtJs.LoggedInUser["login"] = "local";

				// console.log(DemoExtJs.LoggedInUser);
				me.fireEvent('loginComSucesso');
			} /* else {
			 me.fireEvent('logoutComSucesso');
			 } */
		});

	}
});
