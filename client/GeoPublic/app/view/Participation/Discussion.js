Ext.define('GeoPublic.view.Participation.Discussion', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.discussion',
    ui: 'default', // it will be changed to discussion-framed when that participation is selected
    /*
     layout : {
     type : 'vbox',
     padding : '5',
     align : 'stretch'
     },
     */
    // layout: 'fit',
    frame: true,
    margin: '5 5 5 5',
    // title : 'Discussao Nº X',
    initComponent: function () {
        var me = this;
        // console.debug(this.initialConfig);
        console.log('Abrir com a discussao ', this.initialConfig);
        this.title = this.initialConfig.titulo;
        this.idtipoocorrencia = this.initialConfig.idtipoocorrencia;
        this.idocorrencia = this.initialConfig.id_ocorrencia;
        this.idplano = this.initialConfig.idplano;
        this.idpromotor = this.initialConfig.idpromotor;
        this.idestado = this.initialConfig.idestado;
        this.estado = this.initialConfig.estado;
        this.color = this.initialConfig.color;
        this.numcomments = this.initialConfig.numcomments;
        this.numfotografias = this.initialConfig.numfotografias;
        this.idutilizador = this.initialConfig.idutilizador;
        this.feature = this.initialConfig.feature;
        this.participacao = this.initialConfig.participacao;

        var botoesParticipacao = [];

        botoesParticipacao.push({
            // glyph: 0xf0a1, // fa-bullhorn
            // glyph: 0xf1d7, // fa-wechat (alias) [&#xf1d7;]
            glyph: 0xf086,  // fa-comments [&#xf086;]
            xtype: 'button',
            enableToggle: true,
            action: 'view-comments',
            text: this.numcomments + ' ' + 'comments'.translate()
        });
        botoesParticipacao.push('->');

        var showFormComments = false;
        if (GeoPublic.LoggedInUser) {
            showFormComments = true;

            if (GeoPublic.LoggedInUser.data.id == this.idutilizador) {
                // console.log('Mostra botões para a participação ' + this.initialConfig.id_ocorrencia);
                botoesParticipacao.push({
                    glyph: 0xf044, // fa-edit (alias) [&#xf044
                    xtype: 'button',
                    action: 'edit-participation',
                    tooltip: 'Edit participation'.translate()
                });
                if (this.numcomments == 0) {
                    botoesParticipacao.push({
                        glyph: 0xf014, // fa-trash-o [&#xf014;]
                        xtype: 'button',
                        action: 'delete-participation',
                        tooltip: 'Delete participation'.translate()
                    });
                }
            }
        }

        /*
         // http://localhost/extjs/docs/index.html#!/api/Ext.XTemplate
         var tpl = new Ext.XTemplate(//
         '<tpl for=".">', //
         '<p><img src="{fotografia}" align="left"><b>{nome}</b> {comentario}<br/>Em {datacriacao}</p>', //
         '</tpl>' //
         );
         */

        /*
         Ocultar estas tools em função do número de comentários e do idutilizador
         http://www.sencha.com/forum/showthread.php?174646-Customize-icon-on-Ext.panel.Tool
         */
        if (this.initialConfig.geodiscussao) {
            botoesParticipacao.push({
                glyph: 0xf041, // fa-map-marker [&#xf041;]
                xtype: 'button',
                action: 'center-participation',
                tooltip: 'Center on map'.translate()
            });
            console.log('Painel geodiscussao');
        } else {
            if ((this.initialConfig.proposta) && (this.initialConfig.proposta.length > 0)) {
                botoesParticipacao.push({
                    glyph: 0xf0f6, // fa-file-text-o [&#xf0f6;]
                    xtype: 'button',
                    action: 'view-proposal',
                    tooltip: 'View proposal'.translate()
                });
            }
            console.log('Painel discussao paleio');
        }
        // http://docs.sencha.com/extjs/4.2.2/#!/api/Ext.Date
        var tempo = 'Há ';
        if (this.initialConfig.days > 0) {
            tempo += this.initialConfig.days + ' dias (' + Ext.Date.format(this.initialConfig.datacriacao, 'l') + '), às ' + Ext.Date.format(this.initialConfig.datacriacao, 'H:i');
        } else {
            if (this.initialConfig.hours > 0) {
                tempo += this.initialConfig.hours + ':' + this.initialConfig.minutes;
            } else {
                if (this.initialConfig.minutes > 0) {
                    tempo += this.initialConfig.minutes + ' minutos';
                    // tempo += this.initialConfig.seconds + ' segundos';
                } else {
                    tempo += 'menos de 1 minuto';
                }
            }
        }

        this.items = [];

        /*
         this.items = [{
         xtype: 'image',
         margin: '10 10 0 10',
         src: this.initialConfig.fotografia
         }, {
         flex: 1,
         margin: '10 0 0 0',
         html: '<b>' + this.initialConfig.nome + '</b> - ' + this.initialConfig.tempo + '<br/>' + this.initialConfig.comentario,
         }];
         this.dockedItems = [{
         dock: 'bottom',
         xtype: 'toolbar',
         items: botoesParticipacao
         }];
         */

        if (this.numfotografias == 0) {
            this.items.push({
                xtype: 'panel',
                layout: {
                    type: 'hbox',
                    // padding: '5',
                    align: 'top'
                },
                items: [{
                    xtype: 'image',
                    margin: '10 10 0 10',
                    width: 32,
                    height: 32,
                    src: this.initialConfig.fotografia
                }, {
                    xtype: 'panel',
                    flex: 1,
                    margin: '10 0 0 0',
                    // itemId: 'initialcontribution',
                    html: '<b>' + this.initialConfig.nome + '</b> - <i>' + tempo + '</i><br/>' + this.initialConfig.participacao

                }],
                dockedItems: [{
                    dock: 'bottom',
                    xtype: 'toolbar',
                    itemId: 'botoes-participacao',
                    padding: '6 0 6 42',
                    items: botoesParticipacao
                }]
            });
        } else {
            this.items.push({
                xtype: 'panel',
                layout: {
                    type: 'hbox',
                    // padding: '5',
                    align: 'top'
                },
                items: [{
                    xtype: 'image',
                    margin: '10 10 0 10',
                    width: 32,
                    height: 32,
                    src: this.initialConfig.fotografia
                }, {
                    xtype: 'panel',
                    flex: 1,
                    margin: '10 0 0 0',
                    // itemId: 'initialcontribution',
                    html: '<b>' + this.initialConfig.nome + '</b> - <i>' + tempo + '</i><br/>' + this.initialConfig.participacao

                }]
            });

            this.items.push({
                xtype: 'fotografia',
                padding: '0 0 0 42',
                config: {
                    idocorrencia: this.idocorrencia,
                    idplano: this.idplano,
                    idpromotor: this.idpromotor
                },
                dockedItems: [{
                    dock: 'bottom',
                    xtype: 'toolbar',
                    itemId: 'botoes-participacao',
                    // padding: '0 0 0 42',
                    items: botoesParticipacao
                }]
            });
        }

        this.items.push({
            xtype: 'commentlist',
            config: {
                idocorrencia: this.idocorrencia,
                numcomments: this.numcomments,
                idplano: this.idplano,
                idpromotor: this.idpromotor,

                showFormComments: showFormComments,
                idestado: this.idestado,
                estado: this.estado,
                color: this.color,
                estadoStore: this.initialConfig.estadoStore
            }
        });

        /*
        if (showFormComments) {
            this.items.push({
                xtype: 'commentform',
                hidden: !showFormComments,
                config: {
                    idocorrencia: this.idocorrencia,
                    idestado: this.idestado,
                    estado: this.estado,
                    color: this.color,
                    estadoStore: this.initialConfig.estadoStore
                }
            });
        }
        */

        this.callParent(arguments);
    }
});