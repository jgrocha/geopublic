Ext.define('GeoPublic.controller.BackOffice.Utilizador', {
    extend: 'Ext.app.Controller',
    stores: ['BackOffice.Utilizador'],
    refs : [{
        selector : 'grid-utilizador gridpanel#utilizador',
        ref : 'grid' // gera um getGrid
    }, {
        selector : 'grid-utilizador button#remove',
        ref : 'buttonRemove' // gera um getButtonRemove
    }],
    init: function(application) {
        this.control({
            "grid-utilizador button#remove" : {
                click : this.onButtonClickRemove
            },
            'grid-utilizador gridpanel#utilizador' : {
                selectionchange : this.onGridSelect
            }
        });
        // http://localhost/extjs/docs/index.html#!/api/Ext.data.proxy.Server-event-exception
        this.getBackOfficeUtilizadorStore().proxy.addListener("exception", function(proxy, response, operation, eOpts) {
            console.log(response.result.message);
            Ext.Msg.show({
                title : 'Erro',
                msg : response.result.message,
                icon : Ext.Msg.ERROR,
                buttons : Ext.Msg.OK
            });
            this.getBackOfficeUtilizadorStore().rejectChanges();
        }, this);
    },
    onButtonClickRemove : function(button, e, options) {
        var me = this;
        console.log('onButtonClickRemove');
        Ext.Msg.confirm('Attention'.translate(), 'Are you sure you want to delete this user?'.translate(), function (buttonId, text, opt) {
            if (buttonId == 'yes') {
                var sm = me.getGrid().getSelectionModel();
                var store = me.getBackOfficeUtilizadorStore();
                var selection = sm.getSelection();
                store.remove(sm.getSelection());
                if (store.getCount() > 0) {
                    sm.select(0);
                }
            }
        })
    },
    onGridSelect : function(selModel, selection) {
        console.log('onGridSelect');
        this.getButtonRemove().setDisabled(!selection.length);
    }
});