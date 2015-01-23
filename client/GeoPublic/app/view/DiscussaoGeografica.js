Ext.define('GeoPublic.view.DiscussaoGeografica', {
    extend: 'Ext.container.Container',
    requires : ['GeoPublic.view.Participation.ActivityNew', 'GeoPublic.view.Mapa'],
    alias: 'widget.discussao-geografica',
    layout: 'border',
    closable: true,
    // title: 'Regime Jurídico da Urbanização e Edificação',
    // style : 'padding:5px',
    initComponent: function () {
        //<debug>
        console.log(this.initialConfig);
        //</debug>
        this.items = [{
            region: 'center',
            xtype: 'mapa',
            collapsible: false,
            // html: 'Janela com o mapa de suporte à discussão do aplno ' + this.initialConfig.designacao,
            config : {
                idplano : this.initialConfig.idplano,
                idpromotor : this.initialConfig.idpromotor,
                title: this.initialConfig.designacao,
                proposta: this.initialConfig.proposta,
                designacao: this.initialConfig.designacao,
                descricao: this.initialConfig.descricao
            }
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
