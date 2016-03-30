Ext.define('GeoPublic.controller.BackOffice.Promotor', {
	extend : 'Ext.app.Controller',
	stores : ['Promotor', 'Plano'], // getPromotorStore(), getPlanoStore()
	// models : ['Plano'],
	// Ext.ComponentQuery.query('grid-promotor gridpanel#promotor button#remove')
	refs : [{
		selector : 'grid-promotor gridpanel#promotor',
		ref : 'grid' // gera um getGrid
	}, {
		selector : 'grid-promotor gridpanel#plano',
		ref : 'gridPlano' // gera um getGridPlano
	}, {
		selector : 'grid-promotor gridpanel#promotor button#remove',
		ref : 'buttonRemove' // gera um getButtonRemove
	}, {
		selector : 'grid-promotor gridpanel#promotor filefield#photo',
		ref : 'buttonUploadLogo' // gera um getButtonUploadLogo
	}, {
		selector : 'grid-promotor gridpanel#promotor button#viewLogo',
		ref : 'buttonViewLogo' // gera um getButtonViewLogo
	}],
	init : function() {
		this.control({
			"grid-promotor gridpanel#promotor button#add" : {
				click : this.onButtonClickAdiciona
			},
			"grid-promotor gridpanel#promotor button#remove" : {
				click : this.onButtonClickRemove
			},
			"grid-promotor gridpanel#promotor filefield#photo": {
				change: this.onButtonUpload
			},
			"grid-promotor gridpanel#promotor button#viewLogo" : {
				click : this.onButtonClickViewLogo
			},
			// observar a grid
			'grid-promotor gridpanel#promotor' : {
				selectionchange : this.onGridSelect
			},
			"grid-promotor gridpanel#plano" : {
				itemclick : this.onPlanoGridItemClick
			}
		});
		this.application.on({
		});
		// write( store, operation, eOpts )
		this.getPromotorStore().addListener("write", function(store, operation, eOpts) {
			// console.log(operation);
			// se foi um insert, preciso de por o ID no registo...
			switch (operation.action) {
				case "create":
					console.log('Gravou um novo promotor que ficou com o id: ' + operation.resultSet.records[0].data.id);
					var record = this.getPromotorStore().getAt(0);
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
		this.getPromotorStore().proxy.addListener("exception", function(proxy, response, operation, eOpts) {
			console.log(response.result.message);
			Ext.Msg.show({
				title : 'Erro',
				msg : response.result.message,
				icon : Ext.Msg.ERROR,
				buttons : Ext.Msg.OK
			});
			this.getPromotorStore().rejectChanges();
		}, this);
		this.getPromotorStore().proxy.addListener("load", this.onPromotorStoreLoad, this);
	},
	onButtonUpload: function (button, e, options) {
		var me = this;
		console.log("onButtonUpload");
		var sm = this.getGrid().getSelectionModel();
		var store = this.getPromotorStore();
		var selection = sm.getSelection();
		if (selection.length == 1) {
			button.up('form').getForm().submit({
				waitMsg: 'Uploading your photo...',
				callback: function (fp, o) {
				},
				success: function (fp, o) {
					//console.log(me.getImageUm());
					// uploaded_images/profiles/32x32/31_5f66cde0f0ae3fdf99c9169f657a1834.png

					console.log(o.result);
					selection[0].set('logotipo', o.result.name160);

					console.log(o.result.name32);
					console.log(o.result.name160);
					Ext.Msg.alert('Success', 'Your photo has been uploaded.<br> File size:' + o.result.size + ' bytes.');
				},
				failure: function (form, action) {
					//<debug>
					console.log(arguments);
					//</debug>
					Ext.MessageBox.show({
						title: 'EXCEPTION',
						msg: 'Error uploading file',
						icon: Ext.MessageBox.ERROR,
						buttons: Ext.Msg.OK
					});
				}
			});
		}
	},
	onButtonClickViewLogo : function(button, e, options) {
		console.log('onButtonClickViewLogo');
		var sm = this.getGrid().getSelectionModel();
		var store = this.getPromotorStore();
		var selection = sm.getSelection();
		if (selection.length == 1) {
			if (selection[0].data.logotipo) {
				console.log(selection[0].data.logotipo);
				var logowin = Ext.create('Ext.window.Window', {
					title: 'Logo',
					width:200,
					height:200,
					modal: true,
					border: true,
					items:
					{
						xtype: 'image',
						src: selection[0].data.logotipo
					}
				});
				logowin.show();
			} else {
				Ext.example.msg('View logo', 'Please upload the image.');
			}
		}
	},
	onPlanoGridItemClick : function(dataview, record, item, index, e, eOpts) {
		console.log('onPlanoGridItemClick');
		// which row was clicked?
		console.log(record);
		console.log(record.get('alternativeproposta'));

		var tabs = dataview.up('grid-promotor').down('tabpanel');
		var planoForm = tabs.child('#planoForm');
		var proposalForm = tabs.child('#proposalForm');

		var nongeo = record.get('alternativeproposta');
		if (nongeo) {

			var form = dataview.up('grid-promotor').down('form#proposalForm');
			form.getForm().loadRecord(record);
			form.enable();
			tabs.setActiveTab(proposalForm);

			var form = dataview.up('grid-promotor').down('form#planoForm');
			form.disable();


		} else {
			var form = dataview.up('grid-promotor').down('form#planoForm');
			form.getForm().loadRecord(record);
			form.enable();
			tabs.setActiveTab(planoForm);

			var form = dataview.up('grid-promotor').down('form#proposalForm');
			form.disable();
		}
	},
	onGridSelect : function(selModel, selection) {
		this.getButtonRemove().setDisabled(!selection.length);
		this.getButtonUploadLogo().setDisabled(!selection.length);
		this.getButtonViewLogo().setDisabled(!selection.length);
		if (selection.length == 1) {
			console.log('Ler os planos do promotor ', selection[0].data.id);
			// var store = Ext.StoreManager.lookup('Plano');
			var store = this.getPlanoStore();
			// var model = this.getPlanoModel();
			// model.load(selection[0].data.id);
			store.load({
				params:{
					id : selection[0].data.id,
					mode: 2	// read all plans
				}
			});
		}
	},
	onButtonClickAdiciona : function(button, e, options) {
		console.log('onButtonClickAdiciona');
		var rowEditing = this.getGrid().plugins[0];
		// console.log(rowEditing);
		rowEditing.cancelEdit();
		// Create a model instance
		var r = Ext.create('GeoPublic.model.Promotor', {
			designacao : 'Nova entidade',
			email : 'info@entidade.pt',
			site : 'http://www.entidade.pt',
			// É preenchida, mas só par ao utilizador ver. Não será editável.
			dataregisto : new Date()
		});
		this.getPromotorStore().insert(0, r);
		// passei o startEdit para depois do evento 'write', depois de termos o id deste registo
		// rowEditing.startEdit(0, 0);
	},
	onButtonClickRemove : function(button, e, options) {
		console.log('onButtonClickRemove');
		var rowEditing = this.getGrid().plugins[0];
		var sm = this.getGrid().getSelectionModel();
		var store = this.getPromotorStore();
		rowEditing.cancelEdit();
		var selection = sm.getSelection();
		console.log(GeoPublic.LoggedInUser.data.id + ' === ' + selection[0].data.idutilizador);
		if (GeoPublic.LoggedInUser.data.id === selection[0].data.idutilizador) {
			store.remove(sm.getSelection());
			if (store.getCount() > 0) {
				sm.select(0);
			}
		} else {
			Ext.example.msg('Remover promotor', 'Não pode remover um promotor criado por outro utilizador.');
		}
	},
	onPromotorStoreLoad : function(proxy, records, successful, eOpts) {
		if (!successful) {
			Ext.MessageBox.show({
				title : 'Data Load Error',
				msg : 'The data encountered a load error, please try again in a few minutes.'
			});
		} else {
			console.log(records.length + ' registos foram devolvidos');
		}
	}/*,
	onLaunch : function() {
		var me = this;
		console.log('...O controlador GeoPublic.controller.Promotor arrancou.');
	}*/
});
