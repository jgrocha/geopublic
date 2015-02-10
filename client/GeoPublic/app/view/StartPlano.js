Ext.define('GeoPublic.view.StartPlano', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.startplano',
    width: 280,
    height: 280,
    ui: 'startplano', // 'light', 'default', 'startplano-framed'
    frame: false, // true,
    layout: 'border',
    bodyPadding: 0,
    // bodyStyle : 'background-color:#e7d885',
    initComponent: function () {
        //<debug>
        console.log('Abrir com o plano ' + this.initialConfig.idplano + ' denominado ' + this.initialConfig.designacao + ' com a proposta '); //  + this.initialConfig.proposta.substr(0, 12));
        //</debug>
        this.idplano = this.initialConfig.idplano;
        this.idpromotor = this.initialConfig.idpromotor;
        this.descricao = this.initialConfig.descricao;
        this.proposta = this.initialConfig.proposta;

        this.title = this.initialConfig.designacao;
        this.items = [{
            bodyPadding: '10 0 0 10',
            margin: '0 48 0 0',
            xtype: 'panel',
            region: 'center',
            layout: {
                type: 'vbox',
                padding: '0 0 10 0', // Por baixo de cada item
                align: 'stretch'
            },
            bodyStyle: 'background-color: #b7b7b7', // cinza claro
            items: [ /*{
                html: this.initialConfig.descricao,
                padding: '0 0 10 0',
                bodyStyle: 'background:none'
            }, */ {
                html: 'From'.translate() + ':&nbsp;' + Ext.util.Format.date(this.initialConfig.inicio, "d M Y"),
                padding: '0 0 10 0',
                bodyStyle: 'background:none'
            }, {
                html: 'Until'.translate() + ':&nbsp;' + Ext.util.Format.date(this.initialConfig.fim, "d M Y"),
                padding: '0 0 10 0',
                bodyStyle: 'background:none'
            }, {
                html: 'Responsible'.translate() + ':&nbsp;' + this.initialConfig.responsavel,
                padding: '0 0 10 0',
                bodyStyle: 'background:none'
            }, {
                html: 'Contact'.translate() + ':&nbsp;' + '<a href="mailto:' + this.initialConfig.email + '?Subject=' + this.initialConfig.designacao + '">' + this.initialConfig.email + '</a>',
                padding: '0 0 20 0',
                bodyStyle: 'background:none'
            }]
        }, {
            xtype: 'panel',
            bodyStyle: 'background-color: #FFDB4D', // amarelo claro
            // bodyStyle: 'background:none',
            region: 'south',
            height: 48,
            layout: {
                type: 'hbox',
                pack: 'end',
                align: 'stretch'
            },
            items: [{
                minWidth: 48,
                // overCls: 'customOverStyle',
                textAlign: 'right',
                xtype: 'button',
                itemId: 'apresentacao',
                text: 'Introduction'.translate(),
                scale: 'medium'
            }]
        }];
        this.callParent(arguments);
    }
});
