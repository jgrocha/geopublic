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
		name : 'datacriacao',
		type : 'date'
	}, {
		name : 'datamodificacao',
		type : 'date'
	}, {
		name : 'numcomentarios',
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

var x = [{
	"type" : "rpc",
	"tid" : 7,
	"action" : "DXParticipacao",
	"method" : "readEstadoOcorrencia",
	"result" : {
		"success" : true,
		"data" : [{
			"id" : 1,
			"idplano" : 2,
			"estado" : "Aberta",
			"significado" : "",
			"color" : "red",
			"icon" : ""
		}, {
			"id" : 2,
			"idplano" : 2,
			"estado" : "Comprovada",
			"significado" : "",
			"color" : "green",
			"icon" : ""
		}, {
			"id" : 3,
			"idplano" : 2,
			"estado" : "Novo",
			"significado" : "",
			"color" : "yellow",
			"icon" : ""
		}, {
			"id" : 4,
			"idplano" : 2,
			"estado" : "Velho",
			"significado" : "",
			"color" : "blue",
			"icon" : ""
		}],
		"total" : "4"
	}
}, {
	"type" : "rpc",
	"tid" : 5,
	"action" : "DXParticipacao",
	"method" : "readTipoOcorrencia",
	"result" : {
		"success" : true,
		"data" : [{
			"id" : 1,
			"idplano" : 2,
			"designacao" : "Espaço privado",
			"ativa" : true,
			"datamodificacao" : "2014-09-14T21:47:53.469Z",
			"idutilizador" : 31,
			"classe" : null,
			"isclass" : true
		}, {
			"id" : 2,
			"idplano" : 2,
			"designacao" : "Espaço público",
			"ativa" : true,
			"datamodificacao" : "2014-09-14T21:47:53.469Z",
			"idutilizador" : 31,
			"classe" : null,
			"isclass" : true
		}, {
			"id" : 3,
			"idplano" : 2,
			"designacao" : "Desconhecido",
			"ativa" : true,
			"datamodificacao" : "2014-09-14T21:47:53.469Z",
			"idutilizador" : 31,
			"classe" : null,
			"isclass" : true
		}],
		"total" : "3"
	}
}, {
	"type" : "rpc",
	"tid" : 8,
	"action" : "DXParticipacao",
	"method" : "readFotografiaTmp",
	"result" : {
		"success" : true,
		"data" : [],
		"total" : "0"
	}
}, {
	"type" : "rpc",
	"tid" : 6,
	"action" : "DXParticipacao",
	"method" : "readOcorrencia",
	"result" : {
		"success" : true,
		"data" : [{
			"id" : 16,
			"idplano" : 2,
			"idestado" : 1,
			"idtipoocorrencia" : 1,
			"titulo" : "Jardim da Enferma",
			"participacao" : "Este jardim é uma pequena maravilha e está às moscas.",
			"the_geom" : "010100002031BF0D00A8C87CAF94322FC140378F2A72E15141",
			"idutilizador" : 31,
			"apagado" : false,
			"datacriacao" : "2014-09-23T19:43:07.271Z",
			"datamodificacao" : "2014-09-23T19:43:07.271Z",
			"color" : "red",
			"icon" : "",
			"geojson" : "{\"type\":\"Point\",\"coordinates\":[-1022282.3427489,4687304.6649912]}",
			"numcomentarios" : "4",
			"haquantotempo" : {
				"days" : 11,
				"hours" : 2,
				"minutes" : 26,
				"seconds" : 57
			},
			"fotografia" : "uploaded_images/profiles/32x32/31_ee201c208a968b4ac27ea7f662e34db2.jpg",
			"nome" : "Gustavo Bastos"
		}, {
			"id" : 17,
			"idplano" : 2,
			"idestado" : 1,
			"idtipoocorrencia" : 2,
			"titulo" : "Cavalos",
			"participacao" : "Deviam deixar a malta passear a cavalo no Parque Eduardo VII.",
			"the_geom" : "010100002031BF0D00131C4D7C14192FC1A9A022F1C6DC5141",
			"idutilizador" : 31,
			"apagado" : false,
			"datacriacao" : "2014-09-23T21:33:50.032Z",
			"datamodificacao" : "2014-09-23T21:33:50.032Z",
			"color" : "red",
			"icon" : "",
			"geojson" : "{\"type\":\"Point\",\"coordinates\":[-1019018.2427758,4682523.7677385]}",
			"numcomentarios" : "0",
			"haquantotempo" : {
				"days" : 11,
				"minutes" : 36,
				"seconds" : 14
			},
			"fotografia" : "uploaded_images/profiles/32x32/31_ee201c208a968b4ac27ea7f662e34db2.jpg",
			"nome" : "Gustavo Bastos"
		}, {
			"id" : 21,
			"idplano" : 2,
			"idestado" : 1,
			"idtipoocorrencia" : 2,
			"titulo" : "Jardim botânico",
			"participacao" : "Não conheço... Junto aos Jerónimos existe uma espécie de jardim botânico",
			"the_geom" : "010100002031BF0D001BB80309D8142FC18D8983C4AFDB5141",
			"idutilizador" : 31,
			"apagado" : false,
			"datacriacao" : "2014-09-28T10:10:58.874Z",
			"datamodificacao" : "2014-09-28T10:10:58.874Z",
			"color" : "red",
			"icon" : "",
			"geojson" : "{\"type\":\"Point\",\"coordinates\":[-1018476.0176065,4681407.0705284]}",
			"numcomentarios" : "0",
			"haquantotempo" : {
				"days" : 6,
				"hours" : 11,
				"minutes" : 59,
				"seconds" : 5
			},
			"fotografia" : "uploaded_images/profiles/32x32/31_ee201c208a968b4ac27ea7f662e34db2.jpg",
			"nome" : "Gustavo Bastos"
		}, {
			"id" : 22,
			"idplano" : 2,
			"idestado" : 1,
			"idtipoocorrencia" : 2,
			"titulo" : "Feira da Ladra",
			"participacao" : "Todos os sábados, o jardim fica uma desgraça, depois daqueles vendedores de droga por lá andarem o dia todo!\nTêm que acabar com isto, senão eu faço e aconteço!\nExijo uma reparação imediata do jardim.\nE não estou exaltado!",
			"the_geom" : "010100002031BF0D0047DF496826FF2EC144CF1C825DDB5141",
			"idutilizador" : 31,
			"apagado" : false,
			"datacriacao" : "2014-09-28T15:19:08.186Z",
			"datamodificacao" : "2014-10-04T20:16:15.716Z",
			"color" : "red",
			"icon" : "",
			"geojson" : "{\"type\":\"Point\",\"coordinates\":[-1015699.2036886,4681078.0330084]}",
			"numcomentarios" : "6",
			"haquantotempo" : {
				"days" : 6,
				"hours" : 6,
				"minutes" : 50,
				"seconds" : 56
			},
			"fotografia" : "uploaded_images/profiles/32x32/31_ee201c208a968b4ac27ea7f662e34db2.jpg",
			"nome" : "Gustavo Bastos"
		}, {
			"id" : 18,
			"idplano" : 2,
			"idestado" : 3,
			"idtipoocorrencia" : 3,
			"titulo" : "Demolir o pavilhão Carlos Lopes",
			"participacao" : "Acho que está na hora de demolir o pavilhão Carlos Lopes para se ganhar de novo aquela área, para se andar de bicicleta.\nQuem concorda?",
			"the_geom" : "010100002031BF0D000E65A842F6162FC1A1B45CB224DD5141",
			"idutilizador" : 31,
			"apagado" : false,
			"datacriacao" : "2011-12-31T11:00:00.000Z",
			"datamodificacao" : "2014-10-04T20:17:36.259Z",
			"color" : "yellow",
			"icon" : "",
			"geojson" : "{\"type\":\"Point\",\"coordinates\":[-1018747.130191,4682898.7869083]}",
			"numcomentarios" : "2",
			"haquantotempo" : {
				"days" : 1008,
				"hours" : 11,
				"minutes" : 10,
				"seconds" : 4
			},
			"fotografia" : "uploaded_images/profiles/32x32/31_ee201c208a968b4ac27ea7f662e34db2.jpg",
			"nome" : "Gustavo Bastos"
		}],
		"total" : "5"
	}
}];
