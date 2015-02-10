Ext.define('GeoPublic.controller.Users.Profile', {
    extend: 'Ext.app.Controller',
    // Ext.ComponentQuery.query('profile checkbox')
    // views : [ 'Users.Profile' ],
    refs: [{
        selector: 'profile form#dados',
        ref: 'formDados' // gera um getFormDados
    }, {
        selector: 'profile form#home',
        ref: 'formHome' // gera um getFormHome
    }, {
        selector: 'avatar imagecomponent#imagecomponent32',
        ref: 'imageUm' // gera um getImageUm
    }, {
        selector: 'avatar imagecomponent#imagecomponent160',
        ref: 'imageDois' // gera um getImageDois
    }, {
        selector: 'profile form#dados checkbox[name=masculino]',
        ref: 'checkMasculino' // gera um getCheckMasculino()
    }, {
        selector: 'profile form#dados checkbox[name=feminino]',
        ref: 'checkFeminino' // gera um getCheckFeminino()
    }],
    init: function () {
        var map = null;
        this.control({
            "avatar filefield#photo": {
                change: this.onButtonUpload
            },
            "profile form#dados checkbox": {
                change: this.onSexo
            },
            "profile form#dados button#gravar": {
                click: this.onButtonGravar
            },
            "profile form#home button#gravar": {
                click: this.onButtonGravarHome
            },
            "profile form#home button#limpar": {
                click: this.onButtonGravarHome
            },
            "profile xpassword button#alterar": {
                click: this.onButtonChangePassword
            },
            'avatar': {
                afterrender: function (view) {
                    // console.log('Está na hora de carregar o avatar');
                    var photo = GeoPublic.LoggedInUser.data.fotografia;
                    // uploaded_images/profiles/32x32/31_5f66cde0f0ae3fdf99c9169f657a1834.png
                    this.getImageUm().setSrc(photo);
                    this.getImageDois().setSrc(photo.replace("/profiles/32x32/", "/profiles/160x160/"));
                }
            },
            'profile': {
                afterrender: function (view) {
                    // console.log('Está na hora de carregar o perfil');
                    this.getFormDados().getForm().setValues(GeoPublic.LoggedInUser.data);

                    // ajustar o sexo...
                    console.log('afterrender', GeoPublic.LoggedInUser.data);
                    if (GeoPublic.LoggedInUser.data.masculino === false)
                        this.getCheckFeminino().setValue(true);
                    else
                        this.getCheckFeminino().setValue(false);
                    // latitude e longitude
                    this.getFormHome().getForm().setValues(GeoPublic.LoggedInUser.data);
                }
            },
            'home-map-panel': {
                'beforerender': this.onMapPanelBeforeRender
            }
        });
    },
    onSexo: function (field, newValue, oldValue, eOpts) {
        console.log(arguments);
        if (newValue) {
            if (field.name == 'masculino') {
                // põe o feminino a off
                this.getCheckFeminino().setValue(false);
            } else {
                this.getCheckMasculino().setValue(false);
            }
        }
    },
    onMapPanelBeforeRender: function (mapPanel, options) {
        var me = this;

        var map = mapPanel.map;
        // OpenLayers object creating

        /*
         var layerQuest = new OpenLayers.Layer.TMS('TMS mapquest', GeoPublic.mapproxy, {
         layername : 'mapquest/pt_tm_06',
         type : 'png',
         tileSize : new OpenLayers.Size(256, 256)
         });
         layers.push(layerQuest);
         */

        var baseOSM = new OpenLayers.Layer.OSM("MapQuest-OSM Tiles", ["http://otile1.mqcdn.com/tiles/1.0.0/map/${z}/${x}/${y}.jpg", "http://otile2.mqcdn.com/tiles/1.0.0/map/${z}/${x}/${y}.jpg", "http://otile3.mqcdn.com/tiles/1.0.0/map/${z}/${x}/${y}.jpg", "http://otile4.mqcdn.com/tiles/1.0.0/map/${z}/${x}/${y}.jpg"]);
        map.addLayer(baseOSM);

        var markers = new OpenLayers.Layer.Markers("Markers");
        map.addLayer(markers);

        var size = new OpenLayers.Size(24, 24);
        var offset = new OpenLayers.Pixel(-(size.w / 2), -size.h);
        var icon = new OpenLayers.Icon('resources/images/heart24.png', size, offset);

        map.events.register("click", map, function (e) {
            var position = map.getLonLatFromPixel(e.xy);
            markers.clearMarkers();
            markers.addMarker(new OpenLayers.Marker(position, icon));
            console.log(position);
            me.getFormHome().getForm().setValues({
                longitude: (position.lon).toFixed(0),
                latitude: (position.lat).toFixed(0)
            });
        });

        if (Ext.isNumber(GeoPublic.LoggedInUser.data.latitude) && Ext.isNumber(GeoPublic.LoggedInUser.data.longitude)) {
            var home = new OpenLayers.LonLat(GeoPublic.LoggedInUser.data.longitude, GeoPublic.LoggedInUser.data.latitude);
            map.setCenter(home, 8);
            markers.addMarker(new OpenLayers.Marker(home, icon));
        } else {
            console.log(GeoPublic.LoggedInUser.data.longitude);
            console.log(Ext.isNumber(GeoPublic.LoggedInUser.data.longitude));
            // pode eventualmente pedir a localização ao browser
            // map.setCenter(new OpenLayers.LonLat(-26557, 100814), 4);
        }
        // for debug // fica com global, para se usar na consola
        mapLocalizacao = map;
    },
    onButtonUpload: function (button, e, options) {
        var me = this;
        console.log("onButtonUpload");
        button.up('form').getForm().submit({
            waitMsg: 'Uploading your photo...',
            callback: function (fp, o) {

            },
            success: function (fp, o) {
                console.log(me.getImageUm());
                // uploaded_images/profiles/32x32/31_5f66cde0f0ae3fdf99c9169f657a1834.png
                me.getImageUm().setSrc(o.result.name32);
                me.getImageDois().setSrc(o.result.name160);

                Ext.Msg.alert('Success', 'Your photo "' + o.result.name + '" has been uploaded.<br> File size:' + o.result.size + ' bytes.');
            },
            failure: function (form, action) {
                console.log(arguments);
                Ext.MessageBox.show({
                    title: 'EXCEPTION',
                    msg: 'Error uploading file',
                    icon: Ext.MessageBox.ERROR,
                    buttons: Ext.Msg.OK
                });
            }
        });
    },
    onButtonCarregar: function (button, e, options) {
        console.log("onButtonCarregar");
        button.up('form').getForm().setValues(GeoPublic.LoggedInUser.data);
        //
        var photo = GeoPublic.LoggedInUser.data.fotografia;
        // uploaded_images/profiles/32x32/31_5f66cde0f0ae3fdf99c9169f657a1834.png
        this.getImageUm().setSrc(photo);
        this.getImageDois().setSrc(photo.replace("/profiles/32x32/", "/profiles/160x160/"));
    },
    onButtonCancelar: function (button, e, options) {
        console.log("onButtonCancelar");
    },
    onButtonChangePassword: function (button, e, options) {
        console.log("onButtonChangePassword");
        var params = button.up('form').getForm().getValues();
        console.log(params);
        var password = params.password;
        var password2x = params.password2x;
        var sha1 = CryptoJS.SHA1(password).toString();
        // var sha1 = hex_sha1(password).toLowerCase();
        if (button.up('form').getForm().isValid()) {
            ExtRemote.DXLogin.update({
                password: sha1
            }, function (result, event) {
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
    onButtonGravar: function (button, e, options) {
        // console.log("onButtonGravar");
        // var params = button.up('form').getForm().getValues();
        // only get changed values
        // getValues( [asString], [dirtyOnly], [includeEmptyText], [useDataValues] )
        // cf. http://localhost/extjs/docs/index.html#!/api/Ext.form.Basic-method-getValues
        var params = button.up('form').getForm().getValues(false, true, false, false);


        if (this.getCheckMasculino().checked)
            params['masculino'] = true;
        if (this.getCheckFeminino().checked)
            params['masculino'] = false;
        if (!this.getCheckMasculino().checked && !this.getCheckFeminino().checked)
            params['masculino'] = null;

        console.log("Mexeu no sexo. params['masculino']=", params['masculino'], typeof(params['masculino']));
        console.log("Valor anterior:", GeoPublic.LoggedInUser.data.masculino, typeof(GeoPublic.LoggedInUser.data.masculino));

        if (params['masculino'] != GeoPublic.LoggedInUser.data.masculino)
            console.log('Vale a pena gravar');
        else {
            console.log('Não vale a pena gravar');
            delete params.masculino;
        }

        if (params.feminino)
            delete params.feminino;

        // Se todos os browsers já suportassem ECMAScript 5, podia-se fazer:
        // Object.keys(obj).length === 0
        // http://kangax.github.io/es5-compat-table/
        var keys = [];
        for (var k in params) {
            keys.push(k);
        }
        // console.log(params, keys.length);
        if (keys.length !== 0) {
            ExtRemote.DXLogin.update(params, function (result, event) {
                if (result.success) {
                    // recrio a cópia dos dados do utilizador no lado do cliente, com as alterações efetuadas
                    // não preciso de fazer isto quando mudo a password
                    // não sei se preciso de fazer isto quando mudo a fotografia!
                    GeoPublic.LoggedInUser = Ext.create('GeoPublic.model.Utilizador', result.data[0]);
                    Ext.Msg.alert('Successo', 'As alterações foram gravadas com sucesso.');
                } else {
                    Ext.Msg.alert('Erro', 'Ocorreu um erro ao gravar as alterações.');
                }
            });
        }
    },
    onButtonGravarHome: function (button, e, options) {
        //<debug>
        console.log("onButtonGravarHome", button.itemId);
        //</debug>
        switch (button.itemId) {
            case 'gravar':
                if (button.up('form').getForm().isValid()) {
                    var params = button.up('form').getForm().getValues();
                    ExtRemote.DXLogin.updateLocation(params, function (result, event) {
                        //<debug>
                        console.debug(result);
                        //</debug>
                        if (result.success) {
                            GeoPublic.LoggedInUser.data.longitude = params.longitude;
                            GeoPublic.LoggedInUser.data.latitude = params.latitude;
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
                    latitude: null,
                    longitude: null
                }, function (result, event) {
                    //<debug>
                    console.debug(result);
                    //</debug>
                    if (result.success) {
                        // limpar o form!
                        button.up('form').getForm().reset();
                        // limpar as marcas do mapa!
                        map.getLayersByName("Markers")[0].clearMarkers();
                        // limpar a informação do objecto global
                        GeoPublic.LoggedInUser.data.longitude = null;
                        GeoPublic.LoggedInUser.data.latitude = null;
                        Ext.Msg.alert('Localização alterada', 'A sua localização foi alterada.');
                    } else {
                        Ext.Msg.alert('Problemas a alterar a localização', result.message);
                    }
                });
                break;
        }
    },
    onButtonChangeEmail: function (button, e, options) {
        Ext.Msg.alert('Alterar o email', 'Lamentamos, mas esta funcionalidade ainda não está disponível.');
    }
});
