Ext.define('GeoPublic.view.DiscussaoRegulamento', {
    extend: 'Ext.container.Container',
    requires : ['GeoPublic.view.Participation.ActivityNew'],
    alias: 'widget.discussao-regulamento',
    layout: 'border',
    closable: true,
    // title: 'Regime Jurídico da Urbanização e Edificação',
    // style : 'padding:5px',
    initComponent: function () {
        //<debug>
        console.log(this.initialConfig);
        //</debug>

        this.mergelycriado = false;

        this.iddivcompare = 'compare-' + this.initialConfig.idplano;
        this.items = [{
            region: 'center',
            collapsible: false,
            // html: 'Janela com o texto do regulamento',
            layout: 'border',
            items: [{
                xtype: 'component',
                itemId: 'secretaria',
                layout: 'fit',
                region: 'center',
                // style: {background: 'red'},
                id: this.iddivcompare,
                config : {
                    idplano : this.initialConfig.idplano,
                    idpromotor : this.initialConfig.idpromotor,
                    title: this.initialConfig.designacao,
                    proposta: this.initialConfig.proposta,
                    designacao: this.initialConfig.designacao,
                    descricao: this.initialConfig.descricao
                }
            }]
        }, {
            xtype: 'activitynew',
            region: 'east',
            // collapsible : false,
            split: true,
            width: 400,
            config : {
                idplano : this.initialConfig.idplano,
                idpromotor : this.initialConfig.idpromotor
            }
        }];
        this.callParent(arguments);
    }
});
