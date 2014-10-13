Ext.define('GeoPublic.view.Users.Login', {
	extend : 'Ext.window.Window',
	alias : 'widget.login',
	// autoShow : true,
	// height : 420,
	width : 432,
	layout : {
		type : 'fit'
	},
	title : "Identifique-se",
	modal : true,
	closable : false,
	items : [{
		xtype : 'form',
		frame : false,
		defaultFocus : 'email',
		bodyPadding : 15,
		defaults : {
			xtype : 'textfield',
			// anchor : '100%',
			labelWidth : 60,
			allowBlank : false,
			vtype : 'alphanum',
			minLength : 3,
			msgTarget : 'under',
			minLengthText : 'O mínimo são {0} carateres'
		},
		items : [{
			xtype : 'fieldset',
			title : 'Use uma rede social',
			items : [{
				xtype : 'label',
				text : 'A sua rede social é uma forma conveniente de se identificar, sem ter que criar e recordar mais uma senha para este site.',
				style : 'display:block; padding:6px 0px 0px 0px' // top right bottom left
			}, {
				xtype : 'fieldset',
				layout : 'hbox',
				border : 0,
				items : [{
					xtype : 'button',
					text : 'Facebook',
					itemId : 'facebook',
					icon : 'resources/images/facebook/icon_facebook_24.png',
					margin : "0 10 0 0",
					scale : 'medium',
					style : 'background-size: cover;'
				}, {
					xtype : 'button',
					text : 'Google',
					itemId : 'google',
					icon : 'resources/images/google/google24.png',
					margin : "0 10 0 0", // Same as CSS ordering (top, right, bottom, left)
					scale : 'medium', // small 16x16, medium 24x24, large 32x32
					style : 'background-size: cover;',
					disabled : false
				} /*, {
					xtype : 'button',
					text : 'Microsoft',
					itemId : 'windows',
					icon : 'resources/images/windows/windows24.png',
					scale : 'medium',
					style : 'background-size: cover;',
					disabled : false
				} */]
			}, {
				xtype : 'label',
				html : '<b>Nada será publicado na rede social em seu nome.</b>',
				style : 'display:block; padding:0px 0px 6px 0px' // top right bottom left
			}]
		}, {
			margin : "20 0 0 0",
			xtype : 'fieldset',
			title : 'Use os dados do registo',
			items : [/* {
			 xtype : 'label',
			 text : 'Endereço de email com que se registou.',
			 style : 'display:block; padding:6px 6px 0px 0px' // top right bottom left
			 }, */
			{
				xtype : 'textfield',
				name : 'email',
				fieldLabel : 'Email',
				vtype : 'email',
				maxLength : 48,
				allowBlank : false,
				msgTarget : 'side'
			}, {
				xtype : 'textfield',
				inputType : 'password',
				name : 'password',
				fieldLabel : 'Senha',
				enableKeyEvents : true,
				// id : 'password',
				maxLength : 15,
				allowBlank : false,
				msgTarget : 'side'
			}, {
				xtype : 'checkbox',
				labelWidth : 160,
				fieldLabel : 'Estou no meu computador',
				name : 'remember'
			}, {
				xtype : 'label',
				html : 'Se está no seu computador, pode-se autenticar automaticamente durante uma semana.<br/>',
				style : 'display:block; padding:6px 0px 0px 0px' // top right bottom left
			}, {
				xtype : 'label',
				html : '<i>Não use esta opção se está num computador público.</i>',
				style : 'display:block; padding:6px 0px 0px 0px' // top right bottom left
			}]

		}
		/*, {
		 xtype : 'box',
		 // el : 'fb-login-button',
		 // https://developers.facebook.com/docs/plugins/login-button/
		 html : '<div class="fb-login-button" data-scope="basic_info,email" data-max-rows="1" data-size="medium" data-show-faces="true" data-auto-logout-link="true"></div>',
		 // data-show-faces="true" - Aparece "Jorge Gustavo Rocha uses Promoção da Acessibilidade" e a cara
		 autoShow : true
		 } */ ],
		dockedItems : [{
			xtype : 'toolbar',
			dock : 'bottom',
			items : [{
				xtype : 'button',
				itemId : 'lost',
				text : 'Perdi a senha'
			}, {
				xtype : 'tbfill'
			}, {
				xtype : 'button',
				itemId : 'cancelar',
				text : 'Cancelar'
			}, {
				xtype : 'button',
				itemId : 'entrar',
				formBind : true,
				text : 'Entrar'
			}]
		}]
	}] /*,
	 listeners : {
	 afterrender : function() {
	 console.log('GeoPublic.view.Users.Login afterrender');
	 // really important to have facebook button get rendered
	 FB.XFBML.parse();
	 }
	 } */
});
