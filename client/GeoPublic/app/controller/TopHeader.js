Ext.define('GeoPublic.controller.TopHeader', {
    extend: 'Ext.app.Controller',
    stores: ['Menu'], // getMenuStore()
    // Ext.ComponentQuery.query('topheader button#botaoLogin')
    refs: [{
        // selector : 'topheader splitbutton',
        selector: 'topheader button#botaoLogin',
        ref: 'botaoLogin' // gera um getBotaoLogin
    }, {
        selector: 'topheader button#botaoLogout',
        ref: 'botaoLogout' // gera um getBotaoLogout
    }, {
        selector: 'topheader button#botaoRegisto',
        ref: 'botaoRegisto' // gera um getBotaoRegisto
    }, {
        selector: 'topheader splitbutton menu',
        ref: 'loginMenu' // gera um getLoginMenu
    }, {
        selector: 'login',
        ref: 'loginPanel' // gera um getLoginPanel
    }, {
        selector: 'viewport > tabpanel',
        ref: 'painelPrincipal' // gera um getPainelPrincipal
    }],
    init: function () {
        this.control({
            "topheader button#botaoRegisto": {
                click: this.onButtonClickRegisto
            },
            "topheader button#botaoLogin": {// o mesmo que "topheader splitbutton"
                click: this.onButtonClickLogin
            },
            /*
             "topheader splitbutton #botaoLastAccess" : {
             click : this.onButtonLastAccess
             },
             "topheader splitbutton #botaoPerfil" : {
             click : this.onButtonClickPerfil
             },
             */
            "topheader splitbutton #botaoLogout": {
                click: this.onButtonClickLogout
            },
            "topheader button#botaoLanguage menu": {
                click: this.onButtonClickLanguage
            },
            "login form button#lost": {
                click: this.onButtonClickLostPassword
            },
            "login form button#entrar": {
                click: this.onButtonClickEntrar
            },
            "login form button#google": {
                click: this.onButtonClickFacebook
            },
            "login form button#facebook": {
                click: this.onButtonClickFacebook
            },
            "login form button#windows": {
                click: this.onButtonClickFacebook
            },
            "login form button#cancelar": {
                click: this.onButtonClickCancelar
            },
            "registo form button#entrar": {
                click: this.onButtonClickRegistar
            },
            "registo form button#cancelar": {
                click: this.onButtonClickCancelar
            },
            "lostpassword form button#entrar": {
                click: this.onButtonClickSendLostPassword
            },
            "lostpassword form button#cancelar": {
                click: this.onButtonClickCancelar
            },
            "login form textfield": {
                // é disparado tanto em field.name = "user" como em field.name = "password"
                specialkey: this.onTextfieldSpecialKey
            } /* ,
             "demo-cookies toolbar button" : {
             click : this.onButtonClickAuthentificate
             } */
        });
        this.application.on({
            scope: this,
            loginComSucesso: this.onLogin,
            logoutComSucesso: this.onLogout
        });
    },
    onLaunch: function () {
        this.getBotaoLogin().menu.disable();
    },
    onLogout: function () {
        console.log('Vamos reagir ao evento logoutComSucesso');
        this.getBotaoRegisto().setDisabled(false);
        this.getBotaoLogin().setText('Start session'.translate());
        // Tirar alguma fotografia que haja
        this.getBotaoLogin().setIcon('');
        this.getLoginMenu().setWidth(this.getBotaoLogin().getWidth());
        this.getBotaoLogin().menu.disable();
        // eventualment fechar views que sejam restritas a utilizadores, como a vista do perfil
        if (GeoPublic.LoggedInUser) {
            GeoPublic.LoggedInUser = null;
        }

        var menu = this.getBotaoLogin().menu;
        // console.log(menu);
        for (var i = menu.items.length - 1; i >= 0; i--) {
            if (menu.items.items[i].id.match(/^menu-/)) {
                // console.log('Remover ' + menu.items.items[i].id + ' ' + menu.items.items[i].text);
                // only remove () does not destroy the component from the DOM. The id remains
                // remove(..., true); to destroy the component and the id.
                menu.remove(menu.items.items[i], true);
            }
        }

        // eventualment fechar views que sejam restritas a utilizadores, como a vista do perfil
        var mainPanel = this.getPainelPrincipal();
        var tabsParaRemover = [];
        Ext.Array.forEach(mainPanel.items.items, function (item, index, allItems) {
            if (item.closable) {
                // console.log('Vou fechar o painal ' + item.title);
                tabsParaRemover.push(item);
            } else {
                // console.log('NÃO Vou fechar o painal ' + item.title);
            }
        });
        // console.log('Vou remover ' + tabsParaRemover.length + ' tabs!');
        Ext.Array.forEach(tabsParaRemover, function (item, index, allItems) {
            mainPanel.remove(item);
        });

    },
    onLogin: function () {
        // console.log('Vamos reagir ao evento loginComSucesso');
        this.getBotaoRegisto().setDisabled(true);
        if (GeoPublic.LoggedInUser) {
            this.getBotaoLogin().setText(GeoPublic.LoggedInUser.data.nome);
            this.getBotaoLogin().menu.enable();
            this.getLoginMenu().setWidth(this.getBotaoLogin().getWidth());
        }
        // Mostra o menu, só por curiosidade...
        // this.getBotaoLogin().showMenu();

        // fechar a janela de login, se existir
        var login = this.getLoginPanel();
        if (login) {
            login.close();
        }
        // Se foi login pelo facebook, devíamos mudar o botão/ação de logout

        // por a fotografia
        // http://localhost/extjs/docs/index.html#!/api/Ext.button.Button-method-setIcon
        if (GeoPublic.LoggedInUser.data.fotografia && GeoPublic.LoggedInUser.data.fotografia.trim() !== '') {
            this.getBotaoLogin().setIcon(GeoPublic.LoggedInUser.data.fotografia);
            this.getLoginMenu().setWidth(this.getBotaoLogin().getWidth());
        }

        // mandar ler o store com as opções disponíveis consoante as permissões para depois
        // prencher o menu com as ações possíveis, consoante o grupo do utilizador
        // no callback

        var store = this.getMenuStore();
        store.load({
            params: {
                userid: GeoPublic.LoggedInUser.data.id
            },
            callback: function (records, operation, success) {
                //<debug>
                console.log(records.length + ' entradas de menu foram devolvidas');
                //</debug>
                var total = records.length;
                var menu = this.getBotaoLogin().menu;
                var submenu = null;
                for (var i = 0; i < total; i++) {
                    //<debug>
                    console.log(records[i].data);
                    //</debug>
                    var iditem = '';
                    if (records[i].data.idsuperior && (parseInt(records[i].data.idsuperior) > 0)) {
                        // submenu
                        // id: menu-grid-sessao
                        iditem = 'menu-' + records[i].data.extjsview;
                        submenu = menu.items.get('menu-' + records[i].data.idsuperior);
                        submenu.menu.add({
                            text: records[i].data.titulo.translate(),
                            id: iditem,
                            handler: this.onItemMenuClick,
                            scope: this
                        });
                    } else {
                        if (records[i].data.extjsview.length == 0) {
                            // é um menu que vai ter submenu, pois não tem ação associada
                            // menu-3
                            iditem = 'menu-' + records[i].data.id;
                            // insert before logout entry
                            menu.insert(menu.items.length - 1, {
                                text: records[i].data.titulo.translate(),
                                id: iditem,
                                // handler: this.onItemMenuClick,
                                menu: {
                                    items: []
                                }
                            });
                        } else {
                            iditem = 'menu-' + records[i].data.extjsview;
                            // insert before logout entry
                            menu.insert(menu.items.length - 1, {
                                text: records[i].data.titulo.translate(),
                                id: iditem,
                                handler: this.onItemMenuClick,
                                scope: this
                            });
                        }
                    }
                }
            },
            scope: this
        });
    },
    onItemMenuClick: function (item) {
        // id: menu-grid-sessao
        var classe = item.id.substring(5);
        var mainPanel = this.getPainelPrincipal();
        var check = Ext.ComponentQuery.query(classe);
        var newTab = null;
        if (check.length > 0) {
            // A componente já foi criada
            // Selecionar o tab correspondente
            //console.log('A classe ' + classe + ' já foi instanciada.');
            newTab = mainPanel.items.findBy(function (tab) {
                return tab.xtype === classe;
            });
            if (newTab) {
                mainPanel.setActiveTab(newTab);
            }
        } else {
            //console.log('Vamos criar a classe ' + classe);
            if (Ext.ClassManager.getNameByAlias('widget.' + classe) != "") {
                newTab = mainPanel.add({
                    xtype: classe,
                    closable: true
                });
                mainPanel.setActiveTab(newTab);
                // perfeito! Não serve para nada, pois no servidor uso o userid da sessão
                // este código tem que passar para dentro da componente...
                // this.getSessaoStore().proxy.setExtraParam("userid", GeoPublic.LoggedInUser.data.id);
                // this.getSessaoStore().load();
            } else {
                console.log("Error! The class " + 'widget.' + classe + " does not exist (yet)!");
            }
        }
    },
    onButtonClickLostPassword: function (button, e, options) {
        button.up('login').close();
        Ext.create('GeoPublic.view.Users.LostPassword').show();
    },
    onButtonClickRegisto: function (button, e, options) {
        var win = Ext.create('GeoPublic.view.Users.Registo');
        win.show();
    },
    onButtonClickFacebook: function (button, e, options) {
        console.debug(button.itemId);

        hello(button.itemId).login({
            scope: "email",
            response_type: "token"
        }, function () {
            console.log('hello("' + button.itemId + '").login');
        });
    },
    onButtonClickPerfil: function (button, e, options) {
        console.log('Vamos mostrar e permitir atualizar o perfil do utilizador');
        var mainPanel = this.getPainelPrincipal();
        var newTab = mainPanel.items.findBy(function (tab) {
            return tab.title === 'Profile'.translate();
        });
        if (!newTab) {
            if (Ext.ClassManager.getNameByAlias('widget.profile') != "") {
                newTab = mainPanel.add({
                    xtype: 'profile',
                    closable: true,
                    title: 'Profile'.translate()
                });
            } else {
                console.log("Erro! The class " + 'widget.profile' + " does not exist!");
            }
        }
        mainPanel.setActiveTab(newTab);
    },
    onButtonClickLogin: function (button, e, options) {
        console.log('Vamos autenticar um utilizador, se não estiver já loginado');

        // cheirar se já está loginado nalguma rede social...

        var online = function (session) {
            var current_time = (new Date()).getTime() / 1000;
            return session && session.access_token && session.expires > current_time;
        };

        var fb = hello("facebook").getAuthResponse();
        var gl = hello("google").getAuthResponse();
        var wl = hello("windows").getAuthResponse();

        console.log((online(fb) ? "Signed" : "Not signed") + " into FaceBook");
        console.log(fb);
        console.log((online(gl) ? "Signed" : "Not signed") + " into Google");
        console.log((online(wl) ? "Signed" : "Not signed") + " into Microsoft");


        // passar a verificar o objeto global GeoPublic.LoggedInUser
        // se fechar o browser sem sair (e se tinha o recordar clicado) pode recuperar a sessão antiga
        // ao entrar, verifico no servidor que é uma sessão conhecida e devoldo os dados do utilizador para este objeto
        // var user = Ext.state.Manager.get("utilizador");
        if (GeoPublic.LoggedInUser == null) {
            var win = Ext.create('GeoPublic.view.Users.Login');
            win.show();
        } else {
            //<debug>
            console.log('Utilizador atual ' + GeoPublic.LoggedInUser.data.nome + ' com o email ' + GeoPublic.LoggedInUser.data.email);
            if (GeoPublic.LoggedInUser["login"]) {
                console.log("Fez login por " + GeoPublic.LoggedInUser["login"]);
            }
            //</debug>
        }
    },

    onButtonClickLanguage: function (menu, item, event) {
        var me = this;
        //<debug>
        console.log('language!');
        // console.log(arguments);
        console.log(item.action);
        //</debug>
        if ("app-language".translate() != item.action) {
            // console.log('Vamos mudar de language!');

            ExtRemote.DXLogin.changeLanguage({
                lang: item.action
            }, function (result, event) {
                if (result.success) {
                    window.location.reload();
                } else {
                    Ext.Msg.alert('Error'.translate(), Ext.encode(result));
                }
            });
        }
    },

    onButtonClickLogout: function (button, e, options) {
        var me = this;
        //<debug>
        console.log('logout!');
        //</debug>

        var title = Ext.String.format('Also close session on {0}?'.translate(), GeoPublic.LoggedInUser["login"]);
        var mensagem = Ext.String.format('You logged in using your {0} account. Would you like to close your {0} session?'.translate(), GeoPublic.LoggedInUser["login"]);

        if (GeoPublic.LoggedInUser["login"] && GeoPublic.LoggedInUser["login"] !== "local") {
            console.log("Fez login por " + GeoPublic.LoggedInUser["login"]);

            Ext.Msg.show({
                title: title,
                msg: mensagem,
                buttons: Ext.Msg.YESNOCANCEL,
                // icon class defined in sass/etc/all.scss
                icon: GeoPublic.LoggedInUser["login"] + '-icon', // Ext.Msg.QUESTION
                fn: function (btn) {
                    console.log(btn);
                    switch (btn) {
                        case 'yes':
                            hello(GeoPublic.LoggedInUser["login"]).logout({force: true}, function () {
                                //<debug>
                                console.log("Signed out");
                                //</debug>
                            });
                            break;
                        case 'no':
                            hello(GeoPublic.LoggedInUser["login"]).logout(function () {
                                //<debug>
                                console.log("Signed out");
                                //</debug>
                            });
                            break;
                        case 'cancel':
                            return;
                            break;
                    }
                }
            });
        } else {
            console.log("Fez login normal");
            ExtRemote.DXLogin.deauthenticate({}, function (result, event) {
                if (result.success) {
                    // Ext.Msg.alert(result.message);
                    me.application.fireEvent('logoutComSucesso');
                    // me.fireEvent('logout');	// para ser apanhado pelo mapPanel (MainMapPanel controller)
                } else {
                    Ext.Msg.alert('Erro ao terminar a sessão.', Ext.encode(result));
                }
            });
        }
    },
    onButtonClickSendLostPassword: function (button, e, options) {
        var me = this;
        //<debug>
        console.log('registo submit');
        //</debug>

        var formPanel = button.up('form'), lostPasswordPanel = button.up('lostpassword');
        var email = formPanel.down('textfield[name=email]').getValue();

        if (formPanel.getForm().isValid()) {
            ExtRemote.DXLogin.reset({
                email: email
            }, function (result, event) {
                if (result.success) {
                    Ext.Msg.alert('Success'.translate(), Ext.String.format('An email was sent to {0}'.translate(), email) + '<br/>' + 'Please follow the instructions.'.translate());
                    // Ext.Msg.alert('Successul', 'Foi enviado um email para ' + email + '<br/>' + 'Siga as indicações enviadas.');
                } else {
                    // todo
                    // to fix https://github.com/STORM-CLOUDS/SCP/issues/31
                    var mensagem = {
                        minWidth: 480,
                        minHeight: 200,
                        title: 'Error'.translate(),
                        msg: 'It was not possible to send the email message'.translate()
                    };
                    Ext.MessageBox.alert(mensagem);

                    /* correct code
                    Ext.Msg.alert('Error'.translate(), 'It was not possible to send the email message'.translate());
                    */
                }
                lostPasswordPanel.close();
            });
        } else {
            Ext.Msg.alert('Invalid data'.translate(), 'Please review the form data'.translate());
        }
    },

    onButtonClickRegistar: function (button, e, options) {
        var me = this;
        //<debug>
        console.log('registo submit');
        //</debug>

        var formPanel = button.up('form'), registo = button.up('registo');
        var email = formPanel.down('textfield[name=email]').getValue(), name = formPanel.down('textfield[name=name]').getValue(), password = formPanel.down('textfield[name=password]').getValue(), password2x = formPanel.down('textfield[name=password2x]').getValue();
        var sha1 = CryptoJS.SHA1(password).toString();
        if (formPanel.getForm().isValid()) {
            // Ext.get(login.getEl()).mask("A validar a identificação... Aguarde...", 'loading');
            //<debug>
            console.log('Vai tentar com o registo com ' + email + ' e a password = ' + password + ' codificada = ' + sha1);
            //</debug>
            ExtRemote.DXLogin.registration({
                email: email,
                name: name,
                password: sha1
            }, function (result, event) {
                // result == event.result
                // console.debug(result);
                // console.debug(event);
                if (result.success) {
                    // code to fix https://github.com/STORM-CLOUDS/SCP/issues/30
                    var mensagem = {
                        minWidth: 480,
                        minHeight: 200,
                        title: 'Registration process initiated'.translate(),
                        msg: Ext.String.format('An email was sent to {0}'.translate(), email) + '<br/>' + 'Please follow the instructions.'.translate() + '<br/>' +
                        'You need to confirm the email before your first login.'.translate()
                    };
                    Ext.MessageBox.alert(mensagem);
                    /* correct code
                    Ext.Msg.alert('Registration process initiated'.translate(), Ext.String.format('An email was sent to {0}'.translate(), email ) + '<br/>' + 'Please follow the instructions.'.translate() + '<br/>' +
                     'You need to confirm the email before your first login.'.translate());
                     */
                } else {
                    Ext.Msg.alert('Registration error'.translate(), result.message);
                }
                registo.close();
            });
        } else {
            Ext.Msg.alert('Invalid data'.translate(), 'Please review the form data'.translate());
        }
    },
    onButtonClickEntrar: function (button, e, options) {
        var me = this;
        var formPanel = button.up('form'), login = button.up('login');
        var email = formPanel.down('textfield[name=email]').getValue(), pass = formPanel.down('textfield[name=password]').getValue();
        var remember = formPanel.down('checkbox[name=remember]').checked;
        //<debug>
        if (remember) {
            console.log('Para recordar...');
        } else {
            console.log('NÃO recordar NESTE COMPUTADOR...');
        }
        //</debug>
        var sha1 = CryptoJS.SHA1(pass).toString();
        if (formPanel.getForm().isValid()) {
            // Ext.get(login.getEl()).mask("A validar a identificação... Aguarde...", 'loading');
            //<debug>
            console.log('Vai tentar com o login com ' + email + ' e a password = ' + pass + ' codificada = ' + sha1);
            //</debug>
            ExtRemote.DXLogin.authenticate({
                email: email,
                password: sha1,
                remember: remember
            }, function (result, event) {
                // result == event.result
                console.debug(result);
                // console.debug(event);
                if (result.success) {
                    // We have a valid user data
                    // Ext.Msg.alert('Successul login', Ext.encode(result));
                    GeoPublic.LoggedInUser = Ext.create('GeoPublic.model.Utilizador', result.data[0]);
                    GeoPublic.LoggedInUser["login"] = "local";
                    /*
                     * se remember, altero o cookie para sobreviver mais tempo
                     * se o cookie sobreviver, ele será loginado na próxima vez
                     * não preciso de usar o local storage ou qualquer outro cookie
                     */
                    me.application.fireEvent('loginComSucesso');
                    // login.close(); // passou para o evento
                } else {
                    Ext.Msg.alert('Error starting session'.translate(), 'Invalid user or password'.translate()); // Ext.encode(result)
                }
            });
        }
    },
    onButtonClickCancelar: function (button, e, options) {
        button.up('form').getForm().reset();
        button.up('window').close();
    },
    onTextfieldSpecialKey: function (field, e, options) {
        if (e.getKey() == e.ENTER) {
            console.log('Carregou no ENTER');
            var entrar = field.up('form').down('button#entrar');
            entrar.fireEvent('click', entrar, e, options);
        }
    }
});
