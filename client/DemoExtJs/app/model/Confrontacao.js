Ext.define('DemoExtJs.model.Confrontacao', {
	extend : 'Ext.data.Model',

	fields : [{
		name : 'id',
		type : 'int'
	}, {
		name : 'area',
		type : 'float'
	}, {
		name : 'dominio',
		type : 'string'
	}, {
		name : 'subdominio',
		type : 'string'
	}, {
		name : 'familia',
		type : 'string'
	}, {
		name : 'objecto',
		type : 'string'
	}, {
		name : 'ident_gene',
		type : 'string'
	}, {
		name : 'ident_part',
		type : 'string'
	}, {
		name : 'diploma_es',
		type : 'string'
	}, {
		name : 'texto',
		type : 'string'
	}, {
		name : 'parecer', /* 0 ou 1 */
		type : 'string'
	}, {
		name : 'entidade',
		type : 'string'
	}],
	proxy : {
		type : 'direct',
		api : {
			// create : 'ExtRemote.DXTodoItem.create',
			read : 'ExtRemote.DXConfrontacao.read'
			// update : 'ExtRemote.DXTodoItem.update',
			// destroy : 'ExtRemote.DXTodoItem.destroy'
		},
		reader : {
			type : 'json',
			root : 'data',
			messageProperty : 'message' // mandatory if you want the framework to set it's content
		}
	}
}); 