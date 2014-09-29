Ext.define('DemoExtJs.controller.Participation.EstadoOcorrencia', {
	extend : 'Ext.app.Controller',
	requires : ['DemoExtJs.model.Participation.EstadoOcorrencia'],
	stores : ['Participation.EstadoOcorrencia'], // getParticipationEstadoOcorrenciaStore()
	// Ext.ComponentQuery.query('topheader button#botaoLogin')
	refs : [{
		selector : 'grid-promotor gridpanel#estadoocorrencia',
		ref : 'grid' // gera um getGrid
	}, {
		selector : 'grid-promotor gridpanel#plano',
		ref : 'gridPlano' // gera um getGridPlano
	}, {
		selector : 'grid-promotor gridpanel#estadoocorrencia button#remove',
		ref : 'buttonRemove' // gera um getButtonRemove
	}],
	init : function() {
		console.log('O controlador está a arrancar...');
		this.control({
			"grid-promotor gridpanel#estadoocorrencia button#add" : {
				click : this.onButtonClickAdiciona
			},
			"grid-promotor gridpanel#estadoocorrencia button#remove" : {
				click : this.onButtonClickRemove
			},
			// observar a grid
			'grid-promotor gridpanel#estadoocorrencia' : {
				selectionchange : this.onGridSelect
				// validateedit : this.onEdit
				// edit : this.onEdit
			}
		});
		this.application.on({
		});
		this.getParticipationEstadoOcorrenciaStore().addListener("write", function(store, operation, eOpts) {
			switch (operation.action) {
				case "create":
					console.log('Gravou um novo estadoocorrencia que ficou com o id: ' + operation.resultSet.records[0].data.id);
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
		this.getParticipationEstadoOcorrenciaStore().proxy.addListener("exception", function(proxy, response, operation, eOpts) {
			console.log(response.result);
			Ext.Msg.show({
				title : 'Erro',
				msg : response.result.message,
				icon : Ext.Msg.ERROR,
				buttons : Ext.Msg.OK
			});
			this.getParticipationEstadoOcorrenciaStore().rejectChanges();
		}, this);
		this.getParticipationEstadoOcorrenciaStore().proxy.addListener("load", this.onEstadoOcorrenciaStoreLoad, this);
	},
	onGridSelect : function(selModel, selection) {
		this.getButtonRemove().setDisabled(!selection.length);
	},
	// http://localhost/extjs/docs/index.html#!/api/Ext.grid.plugin.RowEditing
	onEdit : function(editor, e) {
		console.log('onEdit');
		/*
		 var plano = e.record.get('idplano');
		 e.record.set('idplano', plano);
		 console.log(plano);
		 // e.record.commit();
		 */
	},
	onButtonClickAdiciona : function(button, e, options) {
		console.log('onButtonClickAdiciona');
		var rowEditing = this.getGrid().plugins[0];
		// console.log(rowEditing);
		rowEditing.cancelEdit();

		var store = this.getParticipationEstadoOcorrenciaStore();

		var sm = this.getGridPlano().getSelectionModel();
		var selection = sm.getSelection();
		if (selection.length == 1) {
			var proximo = store.count();
			// Create a model instance
			var r = Ext.create('DemoExtJs.model.Participation.EstadoOcorrencia', {
				// id : proximo + 1, // to be filled on the server side
				idplano : selection[0].data.id,
				estado : 'Estado',
				color : 'gray',
				icon : ''
			});
			store.insert(proximo, r);
			// rowEditing.startEdit(r, 0);
		}
	},
	onButtonClickRemove : function(button, e, options) {
		console.log('onButtonClickRemove');
		var rowEditing = this.getGrid().plugins[0];
		var sm = this.getGrid().getSelectionModel();
		var store = this.getParticipationEstadoOcorrenciaStore();
		rowEditing.cancelEdit();
		store.remove(sm.getSelection());
		if (store.getCount() > 0) {
			sm.select(0);
		}
	},
	onEstadoOcorrenciaStoreLoad : function(proxy, records, successful, eOpts) {
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
		console.log('...O controlador DemoExtJs.controller.Participation.EstadoOcorrencia arrancou.');
	}
});
