Ext.define('GeoPublic.model.Participation.FotografiaTmp', {
	extend : 'Ext.data.Model',
	fields : [{
		name : 'id',
		type : 'int'
	}, {
		name : 'url',
		type: 'string'
	}, {
		name : 'largura',
		type : 'int'
	}, {
		name : 'altura',
		type : 'int'
	}, {
		name : 'datacriacao',
		type : 'date'
	}],
	proxy : {
		type : 'direct',
		// paramOrder : ['id', 'idocorrencia'],
		// com paramOrder:
		// Não passa o idocorrencia
		// sem paramOrder:
		// // { idocorrencia: 1, page: 1, start: 0, limit: 25 }
		api : {
			create : 'ExtRemote.DXParticipacao.createFotografiaTmp',
			read : 'ExtRemote.DXParticipacao.readFotografiaTmp',
			update : 'ExtRemote.DXParticipacao.updateFotografiaTmp',
			destroy : 'ExtRemote.DXParticipacao.destroyFotografiaTmp'
		},
		reader : {
			type : 'json',
			root : 'data',
			messageProperty : 'message'
		},
		writer : {
			writeAllFields : false
		}
	}	
});