Ext.define('DemoExtJs.model.TipoOcorrencia', {
	extend : 'Ext.data.Model',
	fields : [{
		name : 'id',
		type : 'int'
	}, {
		name : 'idplano',
		type : 'int'
	}, {
		name : 'designacao',
		type : 'string'
	}, {
		name : 'ativa',
		type : 'boolean'
	}],
	// belongsTo : 'DemoExtJs.model.Promotor',
	// http://localhost/extjs/docs/index.html#!/api/Ext.data.proxy.Direct
	proxy : {
		type : 'direct',
		paramOrder : 'id', // Tells the proxy to pass the id as the first parameter to the remoting method.
		api : {
			create : 'ExtRemote.DXParticipacao.createTipoOcorrencia',
			read : 'ExtRemote.DXParticipacao.readTipoOcorrencia',
			update : 'ExtRemote.DXParticipacao.updateTipoOcorrencia',
			destroy : 'ExtRemote.DXParticipacao.destroyTipoOcorrencia'
		},
		reader : {
			type : 'json',
			root : 'data',
			messageProperty : 'message' // mandatory if you want the framework to set it's content
		}
		// NÃO TESTADO; acrescentei par ver se dava para ir só as partes modificadas do RowEditor
		/*
		 writer : {
		 writeAllFields : false
		 }
		 */
	}
});
