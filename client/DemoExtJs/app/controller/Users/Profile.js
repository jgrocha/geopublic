Ext.define('DemoExtJs.controller.Users.Profile', {
	extend : 'Ext.app.Controller',
	// Ext.ComponentQuery.query('profile checkbox')
	// views : [ 'Users.Profile' ],
	refs : [{
		selector : 'profile form#dados checkbox',
		ref : 'sexoCheckbox' // gera um getSexoCheckbox
	}, {
		selector : 'profile form#dados',
		ref : 'formDados' // gera um getFormDados
	}, {
		selector : 'profile form#home',
		ref : 'formHome' // gera um getFormHome
	}, {
		selector : 'avatar imagecomponent#imagecomponent32',
		ref : 'imageUm' // gera um getImageUm
	}, {
		selector : 'avatar imagecomponent#imagecomponent160',
		ref : 'imageDois' // gera um getImageDois
	}],
	init : function() {
		var map = null;
		this.control({
			"avatar button#upload" : {
				click : this.onButtonUpload
			},
			"profile form#dados button#gravar" : {
				click : this.onButtonGravar
			},
			"profile form#home button#gravar" : {
				click : this.onButtonGravarHome
			},
			"profile form#home button#limpar" : {
				click : this.onButtonGravarHome
			},
			"profile xpassword button#alterar" : {
				click : this.onButtonChangePassword
			},
			'avatar' : {
				afterrender : function(view) {
					// console.log('Está na hora de carregar o avatar');
					var photo = DemoExtJs.LoggedInUser.data.fotografia;
					// uploaded_images/profiles/32x32/31_5f66cde0f0ae3fdf99c9169f657a1834.png
					this.getImageUm().setSrc(photo);
					this.getImageDois().setSrc(photo.replace("/profiles/32x32/", "/profiles/160x160/"));
				}
			},
			'profile' : {
				afterrender : function(view) {
					// console.log('Está na hora de carregar o perfil');
					this.getFormDados().getForm().setValues(DemoExtJs.LoggedInUser.data);
					// latitude e longitude
					this.getFormHome().getForm().setValues(DemoExtJs.LoggedInUser.data);
				}
			},
			'home-map-panel' : {
				'beforerender' : this.onMapPanelBeforeRender
			}
		});
	},
	onMapPanelBeforeRender : function(mapPanel, options) {
		var me = this;

		var layers = [];
		map = mapPanel.map;
		// OpenLayers object creating

		var layerQuest = new OpenLayers.Layer.TMS('TMS mapquest', DemoExtJs.mapproxy, {
			layername : 'mapquest/pt_tm_06',
			type : 'png',
			tileSize : new OpenLayers.Size(256, 256)
		});

		layers.push(layerQuest);
		map.addLayers(layers);

		var markers = new OpenLayers.Layer.Markers("Markers");
		map.addLayer(markers);

		var size = new OpenLayers.Size(24, 24);
		var offset = new OpenLayers.Pixel(-(size.w / 2), -size.h);
		var icon = new OpenLayers.Icon('resources/images/heart24.png', size, offset);

		map.events.register("click", map, function(e) {
			var position = map.getLonLatFromPixel(e.xy);
			markers.clearMarkers();
			markers.addMarker(new OpenLayers.Marker(position, icon));
			console.log(position);
			me.getFormHome().getForm().setValues({
				longitude : (position.lon).toFixed(0),
				latitude : (position.lat).toFixed(0)
			});
		});

		if (Ext.isNumber(DemoExtJs.LoggedInUser.data.latitude) && Ext.isNumber(DemoExtJs.LoggedInUser.data.longitude)) {
			var home = new OpenLayers.LonLat(DemoExtJs.LoggedInUser.data.longitude, DemoExtJs.LoggedInUser.data.latitude);
			map.setCenter(home, 8);
			markers.addMarker(new OpenLayers.Marker(home, icon));
		} else {
			console.log(DemoExtJs.LoggedInUser.data.longitude);
			console.log(Ext.isNumber(DemoExtJs.LoggedInUser.data.longitude));
			// pode eventualmente pedir a localização ao browser
			map.setCenter(new OpenLayers.LonLat(-26557, 100814), 4);
		}
		// for debug // fica com global, para se usar na consola
		mapLocalizacao = map;
	},
	onButtonUpload : function(button, e, options) {
		var me = this;
		console.log("onButtonUpload");
		button.up('form').getForm().submit({
			waitMsg : 'Uploading your photo...',
			callback : function(fp, o) {

			},
			success : function(fp, o) {
				console.log(me.getImageUm());
				// uploaded_images/profiles/32x32/31_5f66cde0f0ae3fdf99c9169f657a1834.png
				me.getImageUm().setSrc(o.result.name32);
				me.getImageDois().setSrc(o.result.name160);

				Ext.Msg.alert('Success', 'Your photo "' + o.result.name + '" has been uploaded.<br> File size:' + o.result.size + ' bytes.');
			},
			failure : function(form, action) {
				console.log(arguments);
				Ext.MessageBox.show({
					title : 'EXCEPTION',
					msg : 'Error uploading file',
					icon : Ext.MessageBox.ERROR,
					buttons : Ext.Msg.OK
				});
			}
		});
	},
	onButtonCarregar : function(button, e, options) {
		console.log("onButtonCarregar");
		button.up('form').getForm().setValues(DemoExtJs.LoggedInUser.data);
		//
		var photo = DemoExtJs.LoggedInUser.data.fotografia;
		// uploaded_images/profiles/32x32/31_5f66cde0f0ae3fdf99c9169f657a1834.png
		this.getImageUm().setSrc(photo);
		this.getImageDois().setSrc(photo.replace("/profiles/32x32/", "/profiles/160x160/"));
	},
	onButtonCancelar : function(button, e, options) {
		console.log("onButtonCancelar");
	},
	onButtonChangePassword : function(button, e, options) {
		console.log("onButtonChangePassword");
		var params = button.up('form').getForm().getValues();
		console.log(params);
		var password = params.password;
		var password2x = params.password2x;
		var sha1 = CryptoJS.SHA1(password).toString();
		if (button.up('form').getForm().isValid()) {
			ExtRemote.DXLogin.update({
				password : sha1
			}, function(result, event) {
				console.debug(result);
				if (result.success) {
					Ext.Msg.alert('Senha alterada', 'A senha foi alterada.<br/>Use a nova senha a partir de agora, pois anterior ficou sem efeito.');
				} else {
					Ext.Msg.alert('Problemas a alterar a senha', result.message);
				}
			});
		} else {
			Ext.Msg.alert('Alteração não submetida', 'Reveja o preenchimento dos campos.');
		}
	},
	onButtonGravar : function(button, e, options) {
		// console.log("onButtonGravar");
		// var params = button.up('form').getForm().getValues();
		// only get changed values
		// getValues( [asString], [dirtyOnly], [includeEmptyText], [useDataValues] )
		// cf. http://localhost/extjs/docs/index.html#!/api/Ext.form.Basic-method-getValues
		var params = button.up('form').getForm().getValues(false, true, false, false);
		if (this.getSexoCheckbox().isDirty()) {
			console.log("Mexeu no sexo");
			params['masculino'] = this.getSexoCheckbox().checked ? "1" : "0";
		}
		// Se todos os browsers já suportassem ECMAScript 5, podia-se fazer:
		// Object.keys(obj).length === 0
		// http://kangax.github.io/es5-compat-table/
		var keys = [];
		for (var k in params) {
			keys.push(k);
		}
		// console.log(params, keys.length);
		if (keys.length !== 0) {
			ExtRemote.DXLogin.update(params, function(result, event) {
				if (result.success) {
					// recrio a cópia dos dados do utilizador no lado do cliente, com as alterações efetuadas
					// não preciso de fazer isto quando mudo a password
					// não sei se preciso de fazer isto quando mudo a fotografia!
					DemoExtJs.LoggedInUser = Ext.create('DemoExtJs.model.Utilizador', result.data[0]);
					Ext.Msg.alert('Successo', 'As alterações foram gravadas com sucesso.');
				} else {
					Ext.Msg.alert('Erro', 'Ocorreu um erro ao gravar as alterações.');
				}
			});
		}
	},
	onButtonGravarHome : function(button, e, options) {
		//<debug>
		console.log("onButtonGravarHome", button.itemId);
		//</debug>
		switch (button.itemId) {
			case 'gravar':
				if (button.up('form').getForm().isValid()) {
					var params = button.up('form').getForm().getValues();
					ExtRemote.DXLogin.updateLocation(params, function(result, event) {
						//<debug>
						console.debug(result);
						//</debug>
						if (result.success) {
							DemoExtJs.LoggedInUser.data.longitude = params.longitude;
							DemoExtJs.LoggedInUser.data.latitude = params.latitude;
							Ext.Msg.alert('Localização alterada', 'A sua localização foi alterada.');
						} else {
							Ext.Msg.alert('Problemas a alterar a localização', result.message);
						}
					});
				} else {
					Ext.Msg.alert('Alteração não submetida', 'Click no mapa para escolher a sua localização.');
				}
				break;
			case 'limpar':
				ExtRemote.DXLogin.updateLocation({
					latitude : null,
					longitude : null
				}, function(result, event) {
					//<debug>
					console.debug(result);
					//</debug>
					if (result.success) {
						// limpar o form!
						button.up('form').getForm().reset();
						// limpar as marcas do mapa!
						map.getLayersByName("Markers")[0].clearMarkers();
						// limpar a informação do objecto global
						DemoExtJs.LoggedInUser.data.longitude = null;
						DemoExtJs.LoggedInUser.data.latitude = null;
						Ext.Msg.alert('Localização alterada', 'A sua localização foi alterada.');
					} else {
						Ext.Msg.alert('Problemas a alterar a localização', result.message);
					}
				});
				break;
		}
	},
	onButtonChangeEmail : function(button, e, options) {
		Ext.Msg.alert('Alterar o email', 'Lamentamos, mas esta funcionalidade ainda não está disponível.');
	}
});
