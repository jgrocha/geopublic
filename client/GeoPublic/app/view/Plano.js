Ext.define('GeoPublic.view.Plano', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.plano',
    width: 280,
    // height: 448, // 428, // 280,
    frame: false, // true,
    // layout: 'border',
    // bodyPadding: 0,
    // bodyStyle : 'background-color:#e7d885',
    initComponent: function () {
        //<debug>
        console.log('Abrir com o plano ' + this.initialConfig.idplano + ' denominado ' + this.initialConfig.designacao + ' com o estilo ' + this.initialConfig.planocls); //  + this.initialConfig.proposta.substr(0, 12));
        //</debug>
        this.idplano = this.initialConfig.idplano;
        this.idpromotor = this.initialConfig.idpromotor;
        this.descricao = this.initialConfig.descricao;
        this.proposta = this.initialConfig.proposta;
        this.planocls = this.initialConfig.planocls;

        var emails = this.initialConfig.email.split(/[\s,]+/);
        this.responsible = emails[0];

        this.title = this.initialConfig.designacao;
        this.titleAlign = 'center';

        var datebackground = {};
        if (this.initialConfig.closed) {
            datebackground = {
                background: '#1598a9',
                backgroundImage: 'url(resources/images/closed-stamp-100x100.png)',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'top left'
            };
        } else {
            datebackground = {
                background: '#1598a9'
            };
        }

        this.items = [{
            // bodyPadding: '10 0 0 10',
            // margin: '0 48 0 0',
            xtype: 'panel',
            region: 'center',
            layout: {
                type: 'vbox',
                padding: '0 0 10 0', // Por baixo de cada item
                align: 'stretch'
            },
            // bodyStyle: 'background-color: #b7b7b7', // cinza claro
            items: [{
                xtype: 'container',
                width: 280,
                height: 148,
                style: {
                    'display': 'inline-block',
                    'overflow': 'hidden',
                    'width': '280px',
                    'height': '148px'
                },
                items: [{
                    xtype: 'image',
                    src: this.initialConfig.background, // 'resources/images/MSQUITO1-02.png',
                    // height: 148,
                    width: 280
                    // maxHeight: 148,
                    // maxWidth: 280
                }]
            }, {
                html: 'From'.translate() + ':&nbsp;' + Ext.util.Format.date(this.initialConfig.inicio, "d M Y") + '&nbsp;' + 'Until'.translate() + ':&nbsp;' + Ext.util.Format.date(this.initialConfig.fim, "d M Y"),
                height: 48,
                // bodyStyle: datebackground,
                bodyPadding: '20 0 0 0',
                bodyStyle: {
                    background: '#65bbc6'
                },
                style: {
                    'text-align': 'center'
                }
            }, /*{
             html: 'Until'.translate() + ':&nbsp;' + Ext.util.Format.date(this.initialConfig.fim, "d M Y"),
             padding: '0 0 10 0',
             bodyStyle: 'background:none'
             }, */{
                // height: 138,
                html: '<span style="color:white">' + 'Responsible'.translate() + ':</span>&nbsp;<br/>' + this.initialConfig.responsavel + '<p/>' + '<span style="color:white">' +'Contact'.translate() + ':</span>&nbsp;<br/>' + '<a href="mailto:' + this.responsible + '?Subject=' + this.initialConfig.designacao + '">' + this.responsible + '</a>',
                bodyPadding: '20 0 0 0',
                bodyStyle: datebackground,
                style: {
                    'text-align': 'center'
                }
            }]
        }, {
            xtype: 'panel',
            // bodyStyle: 'background-color: #FFDB4D', // amarelo claro
            // bodyStyle: 'background:none',
            region: 'south',
            // height: 48,
            layout: {
                type: 'vbox',
                pack: 'center',
                align: 'stretch'
            },
            items: [{
                // minWidth: 48,
                // overCls: 'customOverStyle',
                // textAlign: 'right',
                xtype: 'button',
                itemId: 'apresentacao',
                text: 'Introduction'.translate(),
                scale: 'large'
            }]
        }];
        this.callParent(arguments);
    }
});

/*
 <a class="x-btn x-unselectable x-box-item x-btn-default-large x-noicon x-btn-noicon x-btn-default-large-noicon"
 role="button" hidefocus="on" unselectable="on" tabindex="0" id="button-1270"
 style="margin: 0px; right: auto; left: 0px; width: 280px; top: 0px;"><span id="button-1270-btnWrap" class="x-btn-wrap" unselectable="on"><span id="button-1270-btnEl" class="x-btn-button"><span id="button-1270-btnInnerEl" class="x-btn-inner x-btn-inner-center" unselectable="on">Apresentação</span><span role="img" id="button-1270-btnIconEl" class="x-btn-icon-el  " unselectable="on" style=""></span></span></span></a>
 */