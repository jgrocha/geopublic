Ext.define('DemoExtJs.controller.Plano', {
	extend : 'Ext.app.Controller',
	stores : ['Plano', 'TipoOcorrencia'], // getPlanoStore()
	// Ext.ComponentQuery.query('topheader button#botaoLogin')
	refs : [{
		selector : 'grid-promotor gridpanel#plano',
		ref : 'grid' // gera um getGrid
	}, {
		selector : 'grid-promotor gridpanel#promotor',
		ref : 'gridPromotor' // gera um getGridPromotor
	}, {
		selector : 'grid-promotor gridpanel#plano button#remove',
		ref : 'buttonRemove' // gera um getButtonRemove
	}, {
		selector : 'grid-promotor gridpanel#tipoocorrencia button#add',
		ref : 'buttonAddTipoOcorrencia' // gera um getButtonAddTipoOcorrencia
	}],
	init : function() {
		console.log('O controlador está a arrancar...');
		this.control({
			"grid-promotor gridpanel#plano button#add" : {
				click : this.onButtonClickAdiciona
			},
			"grid-promotor gridpanel#plano button#remove" : {
				click : this.onButtonClickRemove
			},
			// observar a grid
			'grid-promotor gridpanel#plano' : {
				selectionchange : this.onGridSelect
			}
		});
		this.application.on({
		});
		// write( store, operation, eOpts )
		this.getPlanoStore().addListener("write", function(store, operation, eOpts) {
			// console.log(operation);
			// se foi um insert, preciso de por o ID no registo...
			switch (operation.action) {
				case "create":
					console.log('Gravou um novo plano que ficou com o id: ' + operation.resultSet.records[0].data.id);
					var record = this.getPlanoStore().getAt(0);
					record.set("id", operation.resultSet.records[0].data.id);
					// quero mostrar a coluna alterada, com o novo ID...
					var rowEditing = this.getGrid().plugins[0];
					rowEditing.startEdit(0, 0);
					break;
				case "update":
					console.log('Gravou o promotor com o id: ' + operation.resultSet.records[0].data.id);
					break;
				case "destroy":
					break;
				default:
					break;
			}
		}, this);
		// http://localhost/extjs/docs/index.html#!/api/Ext.data.proxy.Server-event-exception
		this.getPlanoStore().proxy.addListener("exception", function(proxy, response, operation, eOpts) {
			console.log(response.result.message);
			Ext.Msg.show({
				title : 'Erro',
				msg : response.result.message,
				icon : Ext.Msg.ERROR,
				buttons : Ext.Msg.OK
			});
			this.getPlanoStore().rejectChanges();
		}, this);
		this.getPlanoStore().proxy.addListener("load", this.onPlanoStoreLoad, this);
	},
	onGridSelect : function(selModel, selection) {
		this.getButtonRemove().setDisabled(!selection.length);
		var store = this.getTipoOcorrenciaStore();
		if (selection.length == 1) {
			console.log('Ler os tipos de ocorrências do plano ', selection[0].data.id);
			// var store = Ext.StoreManager.lookup('Plano');
			store.load({
				id : selection[0].data.id
			});
			//
			this.getButtonAddTipoOcorrencia().setDisabled(0);
		}
		if (selection.length == 0) {
			console.log('Não tenho plano selecionado. Limpar tipos de ocorrências');
			// var store = Ext.StoreManager.lookup('Plano');
			store.loadData([], false);
			//
			this.getButtonAddTipoOcorrencia().setDisabled(1);			
		}
	},
	onButtonClickAdiciona : function(button, e, options) {
		console.log('onButtonClickAdiciona');
		var rowEditing = this.getGrid().plugins[0];
		// console.log(rowEditing);
		rowEditing.cancelEdit();

		var sm = this.getGridPromotor().getSelectionModel();
		var selection = sm.getSelection();
		console.log(selection.length);
		if (selection.length == 1) {
			console.log(selection[0].data.id);
			var hoje = new Date();
			var futuro = new Date(new Date().setMonth(hoje.getMonth() + 1));
			// Create a model instance
			var r = Ext.create('DemoExtJs.model.Plano', {
				idpromotor : selection[0].data.id,
				designacao : 'Plano',
				descricao : 'Descrição do plano ou projeto',
				responsavel : 'Pessoa a contactar',
				email : 'pessoa@entidade.pt',
				site : 'http://www.entidade.pt/plano',
				inicio : hoje,
				fim : futuro
			});
			this.getPlanoStore().insert(0, r);
			// passei o startEdit para depois do evento 'write', depois de termos o id deste registo
			// rowEditing.startEdit(0, 0);
		}
	},
	onButtonClickRemove : function(button, e, options) {
		console.log('onButtonClickRemove');
		var rowEditing = this.getGrid().plugins[0];
		var sm = this.getGrid().getSelectionModel();
		var store = this.getPlanoStore();
		rowEditing.cancelEdit();
		store.remove(sm.getSelection());
		if (store.getCount() > 0) {
			sm.select(0);
		}
	},
	onPlanoStoreLoad : function(proxy, records, successful, eOpts) {
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
		console.log('...O controlador DemoExtJs.controller.Plano arrancou.');
	}
});
