Ext.define('GeoPublic.controller.TipoOcorrencia', {
	extend : 'Ext.app.Controller',
	stores : ['TipoOcorrencia'], // getTipoOcorrenciaStore()
	// Ext.ComponentQuery.query('topheader button#botaoLogin')
	refs : [{
		selector : 'grid-promotor gridpanel#tipoocorrencia',
		ref : 'grid' // gera um getGrid
	}, {
		selector : 'grid-promotor gridpanel#plano',
		ref : 'gridPlano' // gera um getGridPlano
	}, {
		selector : 'grid-promotor gridpanel#tipoocorrencia button#remove',
		ref : 'buttonRemove' // gera um getButtonRemove
	}],
	init : function() {
		console.log('O controlador está a arrancar...');
		this.control({
			"grid-promotor gridpanel#tipoocorrencia button#add" : {
				click : this.onButtonClickAdiciona
			},
			"grid-promotor gridpanel#tipoocorrencia button#remove" : {
				click : this.onButtonClickRemove
			},
			// observar a grid
			'grid-promotor gridpanel#tipoocorrencia' : {
				selectionchange : this.onGridSelect
			}
		});
		this.application.on({
		});
		// write( store, operation, eOpts )
		this.getTipoOcorrenciaStore().addListener("write", function(store, operation, eOpts) {
			// console.log(operation);
			// se foi um insert, preciso de por o ID no registo...
			switch (operation.action) {
				case "create":
					console.log('Gravou um novo tipoocorrencia que ficou com o id: ' + operation.resultSet.records[0].data.id);
					// var record = this.getTipoOcorrenciaStore().getAt(0);
					// record.set("id", operation.resultSet.records[0].data.id);
					// quero mostrar a coluna alterada, com o novo ID...
					// var rowEditing = this.getGrid().plugins[0];
					// rowEditing.startEdit(0, 0);
					break;
				case "update":
					console.log('Gravou o tipoocorrencia com o id: ' + operation.resultSet.records[0].data.id);
					break;
				case "destroy":
					break;
				default:
					break;
			}
		}, this);
		// http://localhost/extjs/docs/index.html#!/api/Ext.data.proxy.Server-event-exception
		this.getTipoOcorrenciaStore().proxy.addListener("exception", function(proxy, response, operation, eOpts) {
			console.log(response.result.message);
			Ext.Msg.show({
				title : 'Erro',
				msg : response.result.message,
				icon : Ext.Msg.ERROR,
				buttons : Ext.Msg.OK
			});
			this.getTipoOcorrenciaStore().rejectChanges();
		}, this);
		this.getTipoOcorrenciaStore().proxy.addListener("load", this.onTipoOcorrenciaStoreLoad, this);
	},
	onGridSelect : function(selModel, selection) {
		this.getButtonRemove().setDisabled(!selection.length);
	},
	onButtonClickAdiciona : function(button, e, options) {
		console.log('onButtonClickAdiciona TipoOcorrencia');
		var rowEditing = this.getGrid().plugins[0];
		// console.log(rowEditing);
		rowEditing.cancelEdit();

		var sm = this.getGridPlano().getSelectionModel();
		var selection = sm.getSelection();
		console.log(selection.length);
		if (selection.length == 1) {
			console.log('Novo TipoOcorrencia para o plano ' + selection[0].data.id);

			// Create a model instance
			var r = Ext.create('GeoPublic.model.TipoOcorrencia', {
				// The id will be assigned by PostgreSQL
				idplano : selection[0].data.id,
				designacao : 'Tipo de ocorrência',
				ativa : 1
			});

			var store = this.getTipoOcorrenciaStore();
			var proximo = store.count();
			store.insert(proximo, r);
			
			// passei o startEdit para depois do evento 'write', depois de termos o id deste registo
			// rowEditing.startEdit(0, 0);
		}
	},
	onButtonClickRemove : function(button, e, options) {
		console.log('onButtonClickRemove');
		var rowEditing = this.getGrid().plugins[0];
		var sm = this.getGrid().getSelectionModel();
		var store = this.getTipoOcorrenciaStore();
		rowEditing.cancelEdit();
		store.remove(sm.getSelection());
		if (store.getCount() > 0) {
			sm.select(0);
		}
	},
	onTipoOcorrenciaStoreLoad : function(proxy, records, successful, eOpts) {
		if (!successful) {
			Ext.MessageBox.show({
				title : 'Data Load Error',
				msg : 'The data encountered a load error, please try again in a few minutes.'
			});
		} else {
			console.log(records.length + ' registos foram devolvidos');
		}
	},
	onLaunch : function() {
		var me = this;
		console.log('...O controlador GeoPublic.controller.TipoOcorrencia arrancou.');
	}
});
