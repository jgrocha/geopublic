Ext.define('DemoExtJs.Application', {
	name : 'DemoExtJs',
	requires : ['DemoExtJs.DirectAPI', 'Ext.util.Cookies', 'Ext.ux.DataTip'],
	extend : 'Ext.app.Application',
	views : ['MethodCall', 'FormActions', 'GridActions', 'FormUpload', 'TreeActions', 'Cookies', 'TopHeader', 'GridSessao', 'Users.Profile'],
	controllers : ['Main', 'TopHeader'],
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

		// será que consigo fazer este alive se só existir um cookie do lado de cá que tenha sido enviado para o servidor?
		ExtRemote.DXLogin.alive({}, function(result, event) {
			console.log('------------------- ALIVE --------------------');
			// console.debug(result);
			// console.debug(event);
			if (result.success) {
				// We have a valid user data
				Ext.Msg.alert('Successul login', Ext.encode(result));
				DemoExtJs.LoggedInUser = Ext.create('DemoExtJs.model.Utilizador', result.data[0]);
				// console.log(DemoExtJs.LoggedInUser);
				me.fireEvent('loginComSucesso');
			} else {
				me.fireEvent('logoutComSucesso');
			}
		});

	}
});
