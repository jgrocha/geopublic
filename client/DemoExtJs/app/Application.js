Ext.define('DemoExtJs.Application', {
	name : 'DemoExtJs',
	requires : ['DemoExtJs.DirectAPI', 'Ext.util.Cookies', 'Ext.ux.DataTip'],
	extend : 'Ext.app.Application',
	views : ['MethodCall', 'FormActions', 'GridActions', 'FormUpload', 'TreeActions', 'Cookies', 'TopHeader', 'GridSessao'],
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

		ExtRemote.DXLogin.alive({
			username : 'alive'
		}, function(result, event) {
			console.log('------------------- ALIVE --------------------');
			// console.debug(result);
			// console.debug(event);
			if (result.success) {
				if (result.data.length > 0) {
					// We have a valid user data
					Ext.Msg.alert('Successul login', Ext.encode(result));
					DemoExtJs.LoggedInUser = Ext.create('DemoExtJs.model.Utilizador', result.data[0]);
					// console.log(DemoExtJs.LoggedInUser);
					me.fireEvent('loginComSucesso');
				} else {
					// We don't have a user...
					me.fireEvent('logoutComSucesso');
					// Ext.Msg.alert('Invalid login', Ext.encode(result));
				}
			} else {
				me.fireEvent('logoutComSucesso');
				// Ext.Msg.alert('Authentication not available', Ext.encode(result));
			}
		});

		/*
		 Agricultor.user = Ext.state.Manager.get("utilizador");
		 // rever esta parte...
		 // talvez seja melhor ir ver ao PHP se ainda tenho a sessão ativa
		 if (Agricultor.user == null) {
		 console.log('Antes NÃO estava loginado Agricultor.user == null');
		 // this.fireEvent('logoutComSucesso');
		 } else {
		 console.log('Antes estava loginado');
		 Ext.Ajax.request({
		 scope : this,
		 url : 'php/alive.php',
		 success : function(conn, response, options, eOpts) {
		 console.debug(conn);
		 var resultado = Ext.JSON.decode(conn.responseText);
		 if (resultado.success) {
		 // continuamos loginados
		 console.log('continuamos loginados');
		 this.fireEvent('loginComSucesso');
		 } else {
		 // perdemos a sessão do PHP
		 console.log('perdemos a sessão do PHP');
		 this.fireEvent('logoutComSucesso');
		 }
		 },
		 failure : function(conn, response, options, eOpts) {
		 Ext.Msg.show({
		 title : 'Erro na verificação da sessão',
		 msg : conn.responseText,
		 icon : Ext.Msg.ERROR,
		 buttons : Ext.Msg.OK
		 });
		 }
		 });
		 }
		 */
	}
});
