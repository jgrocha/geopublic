Ext.define('DemoExtJs.controller.Plano', {
	extend : 'Ext.app.Controller',
	stores : ['Plano', 'TipoOcorrencia', 'Participation.EstadoOcorrencia'], // getPlanoStore(), getParticipationEstadoOcorrenciaStore()
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
	}, {
		selector : 'grid-promotor gridpanel#estadoocorrencia button#add',
		ref : 'buttonAddEstadoOcorrencia' // gera um getButtonAddTipoOcorrencia
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
				// edit : this.onRowEdit
			}
		});
		this.application.on({
		});
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
					rowEditing.startEdit(record, 3);
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
			console.log(response.result);
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
	// http://localhost/extjs/docs/index.html#!/api/Ext.grid.plugin.RowEditing
	// not in use
	onRowEdit : function(editor, context, eOpts) {// editor, context, eOpts
		console.log('onRowEdit');
		// console.log(context.record);
		// if the store does not set autoSync we need to save the record
		context.record.store.sync();
	},
	onGridSelect : function(selModel, selection) {
		this.getButtonRemove().setDisabled(!selection.length);
		var storeTipo = this.getTipoOcorrenciaStore();
		var storeEstado = this.getParticipationEstadoOcorrenciaStore();
		if ((selection.length == 1) && (selection[0].data.id > 0)) {
			console.log('Ler os tipos e estados de ocorrências do plano ', selection[0].data.id);
			storeTipo.load({
				params : {
					idplano : selection[0].data.id
				}
			});
			storeEstado.load({
				params : {
					idplano : selection[0].data.id
				}
			});
			//
			this.getButtonAddTipoOcorrencia().setDisabled(0);
			this.getButtonAddEstadoOcorrencia().setDisabled(0);
		} else {
			console.log('Não tenho plano selecionado. Limpar tipos de ocorrências');
			storeTipo.loadData([], false);
			storeEstado.loadData([], false);
			this.getButtonAddTipoOcorrencia().setDisabled(1);
			this.getButtonAddEstadoOcorrencia().setDisabled(1);
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

		var responsavel = '';
		var email = '';
		// The user should be authenticated, but just in case...
		if (DemoExtJs.LoggedInUser) {
			responsavel = DemoExtJs.LoggedInUser.data.nome;
			email = DemoExtJs.LoggedInUser.data.email;
		} else {
			responsavel = 'Pessoa a contactar';
			email = 'info@geomaster.pt';
		}

		if (selection.length == 1) {
			console.log(selection[0].data.id);
			var hoje = new Date();
			var futuro = new Date(new Date().setMonth(hoje.getMonth() + 3));
			// Create a model instance
			var r = Ext.create('DemoExtJs.model.Plano', {
				idpromotor : selection[0].data.id,
				designacao : 'Plano',
				descricao : 'Descrição do plano ou projeto',
				responsavel : responsavel,
				email : email,
				site : 'http://geomaster.pt/plano',
				inicio : hoje,
				fim : futuro
			});
			this.getPlanoStore().insert(0, r);
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
