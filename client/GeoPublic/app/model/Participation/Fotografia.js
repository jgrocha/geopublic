Ext.define('GeoPublic.model.Participation.Fotografia', {
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
	}, {
        name : 'documento',
        type: 'string'
    }, {
		name : 'name',
		type : 'string'
	}],
	proxy : {
		type : 'direct',
		// paramOrder : ['id', 'idocorrencia'],
		// com paramOrder:
		// Não passa o idocorrencia
		// sem paramOrder:
		// // { idocorrencia: 1, page: 1, start: 0, limit: 25 }
		api : {
			create : 'ExtRemote.DXParticipacao.createFotografia',
			read : 'ExtRemote.DXParticipacao.readFotografia',
			update : 'ExtRemote.DXParticipacao.updateFotografia',
			destroy : 'ExtRemote.DXParticipacao.destroyFotografia'
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