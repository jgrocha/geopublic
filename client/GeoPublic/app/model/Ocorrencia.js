Ext.define('GeoPublic.model.Ocorrencia', {
	extend : 'Ext.data.Model',
	fields : [{
		name : 'id',
		type : 'int'
	}, {
		name : 'idplano',
		type : 'int'
	}, {
		name : 'idestado',
		type : 'int'
	}, {
		name : 'idtipoocorrencia',
		type : 'int'
	}, {
		name : 'titulo',
		type : 'string'
	}, {
		name : 'participacao',
		type : 'string'
	}, {
        name : 'geojson',
        type : 'string'
    }, {
        name : 'proposta',
        type : 'string'
    }, {
		name : 'datacriacao',
		type : 'date'
	}, {
		name : 'datamodificacao',
		type : 'date'
	}, {
        name : 'numcomentarios',
        type : 'int'
    }, {
        name : 'numfotografias',
        type : 'int'
    }, {
		name : 'color',
		type : 'string'
	}, {
		name : 'icon',
		type : 'string'
	}, {
		name : 'days',
		mapping : 'haquantotempo.days'
	}, {
		name : 'hours',
		mapping : 'haquantotempo.hours'
	}, {
		name : 'minutes',
		mapping : 'haquantotempo.minutes'
	}, {
		name : 'seconds',
		mapping : 'haquantotempo.seconds'
	}, {
		name : 'fotografia',
		type : 'string'
	}, {
		name : 'nome',
		type : 'string'
	}, {
		name : 'idutilizador',
		type : 'int',
		persist: false
	}, {
		name : 'estado',
		type : 'string',
		persist: false
	}],
	proxy : {
		type : 'direct',
		// paramOrder : 'id',
		api : {
			create : 'ExtRemote.DXParticipacao.createOcorrencia',
			read : 'ExtRemote.DXParticipacao.readOcorrencia',
			update : 'ExtRemote.DXParticipacao.updateOcorrencia',
			destroy : 'ExtRemote.DXParticipacao.destroyOcorrencia'
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