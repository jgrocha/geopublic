Ext.define('GeoPublic.model.Plano', {
	extend : 'Ext.data.Model',
	fields : [{
		name : 'id',
		type : 'int'
	}, {
		name : 'idpromotor',
		type : 'int'
	}, {
		name : 'designacao',
		type : 'string'
	}, {
		name : 'descricao',
		type : 'string'
	}, {
		name : 'responsavel',
		type : 'string'
	}, {
		name : 'email',
		type : 'string'
	}, {
		name : 'site',
		type : 'string'
	}, {
		name : 'inicio',
		type : 'date'
	}, {
		name : 'fim',
		type : 'date'
	}, {
        name : 'idutilizador',
        type : 'int',
        persist: false
    }, {
        name : 'the_geom',
        type : 'string'
    }, {
        name : 'proposta',
        type : 'string'
    }, 	{
		name : 'alternativeproposta',
		type : 'boolean'
	}, 	{
		name : 'active',
		type : 'boolean'
	}, {
		name : 'planocls',
		type : 'string'
	}, {
		name : 'background',
		type : 'string'
	}, 	{
        name : 'closed',
        type : 'boolean'
    }],
	// belongsTo : 'GeoPublic.model.Promotor',
	// http://localhost/extjs/docs/index.html#!/api/Ext.data.proxy.Direct
	proxy : {
		// Extra parameters that will be included on every read request.
		// Individual requests with params of the same name will override these params when they are in conflict.
		// extraParams : {
		// 	tabela : 'plano'
		// },
		type : 'direct',
		// paramOrder : 'id', // Tells the proxy to pass the id as the first parameter to the remoting method.
		api : {
			create : 'ExtRemote.DXParticipacao.createPlano',
			read : 'ExtRemote.DXParticipacao.readPlano',
			update : 'ExtRemote.DXParticipacao.updatePlano',
			destroy : 'ExtRemote.DXParticipacao.destroyPlano'
		},
		reader : {
			type : 'json',
			root : 'data',
			messageProperty : 'message' // mandatory if you want the framework to set it's content
		},
		// NÃO TESTADO; acrescentei par ver se dava para ir só as partes modificadas do RowEditor
		// Não garante que o paramatro id vá em primero lugar!
		// Pelo contrário... o id vai sempre em último
		writer : {
			writeAllFields : false
		}
	}
});
