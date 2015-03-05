Ext.define('GeoPublic.controller.BackOffice.Layer', {
    extend: 'Ext.app.Controller',
    stores: ['BackOffice.Layer'], // getBackOfficeLayerStore()
    requires: ['GeoPublic.view.BackOffice.Layer'],
    // Ext.ComponentQuery.query('grid-layer gridpanel#promotor button#remove')
    refs: [{
        selector: 'layer gridpanel#grid-layer',
        ref: 'grid' // gera um getGrid
    }, {
        selector: 'layer gridpanel#grid-layer',
        ref: 'gridLayer' // gera um getGridPlano
    }, {
        selector: 'layer gridpanel#grid-layer button#remove',
        ref: 'buttonRemove' // gera um getButtonRemove
    }],
    init: function () {
        this.control({
            "layer gridpanel#grid-layer button#add": {
                click: this.onButtonClickAdiciona
            },
            "layer gridpanel#grid-layer button#remove": {
                click: this.onButtonClickRemove
            },
            // observar a grid
            'layer gridpanel#grid-layer': {
                selectionchange: this.onGridSelect
            }
        });
        
        this.getBackOfficeLayerStore().addListener("write", function (store, operation, eOpts) {
            // console.log(operation);
            // se foi um insert, preciso de por o ID no registo...
            switch (operation.action) {
                case "create":
                    console.log('Gravou um novo registo que ficou com o id: ' + operation.resultSet.records[0].data.id);
                    var record = this.getBackOfficeLayerStore().getAt(0);
                    record.set("id", operation.resultSet.records[0].data.id);
                    // quero mostrar a coluna alterada, com o novo ID...
                    var rowEditing = this.getGrid().plugins[0];
                    rowEditing.startEdit(0, 0);
                    break;
                case "update":
                    console.log('Gravou o registo com o id: ' + operation.resultSet.records[0].data.id);
                    break;
                case "destroy":
                    break;
                default:
                    break;
            }
        }, this);
        // http://localhost/extjs/docs/index.html#!/api/Ext.data.proxy.Server-event-exception
        this.getBackOfficeLayerStore().proxy.addListener("exception", function (proxy, response, operation, eOpts) {
            console.log(response.result.message);
            Ext.Msg.show({
                title: 'Erro',
                msg: response.result.message,
                icon: Ext.Msg.ERROR,
                buttons: Ext.Msg.OK
            });
            this.getBackOfficeLayerStore().rejectChanges();
        }, this);
    },
    onGridSelect: function (selModel, selection) {
        this.getButtonRemove().setDisabled(!selection.length);
    },
    onButtonClickAdiciona: function (button, e, options) {
        console.log('onButtonClickAdiciona');
        var rowEditing = this.getGrid().plugins[0];
        // console.log(rowEditing);
        rowEditing.cancelEdit();
        // Create a model instance
        var r = Ext.create('GeoPublic.model.BackOffice.Layer', {
            /*
             designacao : 'Nova entidade',
             email : 'info@entidade.pt',
             site : 'http://www.entidade.pt',
             // É preenchida, mas só para o utilizador ver. Não será editável.
             dataregisto : new Date()
             */
        });
        this.getBackOfficeLayerStore().insert(0, r);
        // passei o startEdit para depois do evento 'write', depois de termos o id deste registo
        // rowEditing.startEdit(0, 0);
    },
    onButtonClickRemove: function (button, e, options) {
        console.log('onButtonClickRemove');
        var rowEditing = this.getGrid().plugins[0];
        var sm = this.getGrid().getSelectionModel();
        var store = this.getBackOfficeLayerStore();
        rowEditing.cancelEdit();
        var selection = sm.getSelection();
        store.remove(sm.getSelection());
        if (store.getCount() > 0) {
            sm.select(0);
        }
    },
    onLaunch: function () {
        var me = this;
        console.log('...O controlador GeoPublic.controller.BackOffice.Layer arrancou.');
    }
});
