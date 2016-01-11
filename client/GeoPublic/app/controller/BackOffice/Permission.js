Ext.define('GeoPublic.controller.BackOffice.Permission', {
	extend : 'Ext.app.Controller',
	stores : ['BackOffice.Grupo', 'BackOffice.Menu', 'BackOffice.Permissao'],
	refs : [{
		selector : 'permissoes gridpanel#grid-group',
		ref : 'gridGroup' // gera um getGridGroup
	}, {
		selector : 'permissoes gridpanel#grid-permission',
		ref : 'gridPermission' // gera um getGridPermission
	}, {
		selector : 'permissoes gridpanel#grid-menu',
		ref : 'gridMenu' // gera um getGridMenu
	}],
	init : function() {
		this.control({
			'permissoes gridpanel#grid-group' : {
				selectionchange : this.onGridSelect
			}
		});
	},
	onGridSelect : function(selModel, selection) {
		console.log('onGridSelect');
		var store = this.getBackOfficePermissaoStore();
		if (selection.length == 1) {
			console.log('Ler as permissões do grupo ', selection[0].data.id);
			store.load({
				params:{
					idgrupo : selection[0].data.id
				}
			});
		} else {
			store.load();
		}
	}
});
