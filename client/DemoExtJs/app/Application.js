Ext.define('DemoExtJs.Application', {
	name : 'DemoExtJs',
	requires : ['DemoExtJs.DirectAPI', 'Ext.grid.plugin.RowEditing', 'Ext.form.Label', 'Ext.util.Cookies', 'Ext.ux.DataTip', 'GeoExt.panel.Map', 'Ext.button.Split', 'Ext.grid.column.Date', 'Ext.state.LocalStorageProvider', 'Ext.ux.Wizard', 'Ext.ux.wizard.Header', 'Ext.ux.wizard.CardLayout', 'Ext.ux.wizard.Card'],
	extend : 'Ext.app.Application',
	views : ['BemVindoPanel', 'MainMapPanel', 'Promotor', 'MethodCall', 'FormActions', 'GridActions', 'FormUpload', 'TreeActions', 'Cookies', 'TopHeader', 'Users.GridSessao', 'Users.Profile', 'InfPrevia.WindowConfrontacao', 'InfPrevia.Hierarquia', 'InfPrevia.UploadShapefile', 'Guia', 'MapaComProjeto', 'Activity', 'Participation.Contribution'],
	controllers : ['Main', 'TopHeader', 'Users.Profile', 'MainMapPanel', 'BemVindoPanel', 'Promotor', 'Plano', 'TipoOcorrencia', 'InfPrevia.WindowConfrontacao', 'InfPrevia.Hierarquia', 'InfPrevia.UploadShapefile'],
	models : ['TodoItem', 'Utilizador', 'Sessao', 'Promotor', 'Plano', 'TipoOcorrencia'],
	stores : ['Todo', 'Tree', 'Sessao', 'Promotor', 'Plano', 'TipoOcorrencia'],
	init : function() {
		var me = this;
		hello.init({
			// home facebook, menu lateral esq, no fundo; apps
			facebook : '267632140104504',
			// https://console.developers.google.com/project
			// https://console.developers.google.com/project/apps~root-fort-660/apiui/credential
			google : '1035320322765-nbhs2lnsb3abgp31s3o9jf1mb5llfhn0.apps.googleusercontent.com',
			// https://account.live.com/developers/applications/index
			// https://account.live.com/developers/applications/ApiSettings?id=0000000044124A09
			windows : '0000000044124A09' // '0000000048117A44'
		});
		var sessionstart = function(auth) {
			//<debug>
			console.log('Bem vindo!  Vou pedir os seus dados à rede ' + auth.network);
			//</debug>
			var api_me_error = function() {
				//<debug>
				console.log("Erro ao invocar a api \"me\" da rede " + auth.network);
				//</debug>
			};
			var api_me = function(response) {
				response["network"] = auth.network;
				//<debug>
				console.log(Ext.encode(response));
				//</debug>
				ExtRemote.DXLogin.social(response, function(result, event) {
					if (result.success) {
						// Ext.Msg.alert('Successul login', Ext.encode(result));
						DemoExtJs.LoggedInUser = Ext.create('DemoExtJs.model.Utilizador', result.data[0]);
						DemoExtJs.LoggedInUser["login"] = auth.network;
						me.fireEvent('loginComSucesso');
					} else {
						// Ext.Msg.alert('Não foi possível iniciar a sessão com estes dados.', Ext.encode(result));
						Ext.Msg.alert('Não foi possível iniciar a sessão com estes dados.');
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
					// Ext.Msg.alert(result.message);
					me.fireEvent('logoutComSucesso');
				} else {
					// Ext.Msg.alert('Something wrong with logout', Ext.encode(result));
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

		if (document.location.href.split('/')[2].indexOf('localhost') > -1) {
			DemoExtJs.geoserver = 'http://localhost:8080';
			DemoExtJs.mapproxy = 'http://localhost/mapproxy/tms/';

		} else {
			DemoExtJs.geoserver = 'http://cm-agueda.geomaster.pt:8080';
			DemoExtJs.mapproxy = ['http://a.geomaster.pt/mapproxy/tms/', 'http://b.geomaster.pt/mapproxy/tms/', 'http://c.geomaster.pt/mapproxy/tms/', 'http://d.geomaster.pt/mapproxy/tms/'];
		}
	},
	launch : function() {
		var me = this;
		// Ext.tip.QuickTipManager.init();
		Ext.QuickTips.init();
		//<debug>
		console.log('... tudo carregado e pronto a funcionar (app/Application.js).');
		//</debug>
		if (Ext.supports.LocalStorage) {
			Ext.state.Manager.setProvider(Ext.create('Ext.state.LocalStorageProvider'));
			//<debug>
			console.log('Vai usar local storage HTML 5');
			//</debug>
		} else {
			Ext.state.Manager.setProvider(Ext.create('Ext.state.CookieProvider'));
			//<debug>
			console.log('Vai usar cookies');
			//</debug>
		}

		// será que consigo fazer este alive se só existir um cookie do lado de cá que tenha sido enviado para o servidor?

		ExtRemote.DXLogin.alive({}, function(result, event) {
			//<debug>
			console.log('------------------- ALIVE --------------------');
			//</debug>
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
