Ext.define('GeoPublic.model.Users.Sessao', {
	extend : 'Ext.data.Model',

	fields : [{
		name : 'id',
		type : 'int'
	}, {
		name : 'datalogin',
		type : 'date'
	}, /*{
	 name : 'datalogout',
	 type : 'date'
	 }, */
	{
		name : 'ip',
		type : 'string'
	}, {
		name : 'hostname',
		type : 'string'
	}, {
		name : 'browser',
		type : 'string'
	} /*, {
	 name : 'sisoperativo',
	 type : 'string'
	 }
	 {
	 name : 'ativo',
	 type : 'boolean'
	 }*/],
	proxy : {
		type : 'direct',
		api : {
			// create : 'ExtRemote.DXTodoItem.create',
			read : 'ExtRemote.DXSessao.readSessao'
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
