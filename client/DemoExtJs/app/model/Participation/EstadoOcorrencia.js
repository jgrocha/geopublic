Ext.define('DemoExtJs.model.Participation.EstadoOcorrencia', {
	extend : 'Ext.data.Model',
	fields : [{
		name : 'id',
		type : 'int'
	}, {
		name : 'idplano',
		type : 'int'
	}, {
		name : 'estado',
		type : 'string'
	}, {
		name : 'significado',
		type : 'string'
	}, {
		name : 'color', // http://www.w3schools.com/html/html_colornames.asp
		type : 'string'
	}, {
		name : 'icon',
		type : 'string'
	}],
	// belongsTo : 'DemoExtJs.model.Promotor',
	// http://localhost/extjs/docs/index.html#!/api/Ext.data.proxy.Direct
	proxy : {
		type : 'direct',
		// paramOrder : 'id,idplano', // Tells the proxy to pass the id as the first parameter to the remoting method.
		api : {
			create : 'ExtRemote.DXParticipacao.createEstadoOcorrencia',
			read : 'ExtRemote.DXParticipacao.readEstadoOcorrencia',
			update : 'ExtRemote.DXParticipacao.updateEstadoOcorrencia',
			destroy : 'ExtRemote.DXParticipacao.destroyEstadoOcorrencia'
		},
		reader : {
			type : 'json',
			root : 'data',
			messageProperty : 'message' // mandatory if you want the framework to set it's content
		},
		writer : {
			writeAllFields : true // para ir também o idplano
		}
	}
});

/*
 *   id integer NOT NULL,
 idplano integer NOT NULL,
 estado character varying(30),
 significado character varying(200),
 color character varying(12),
 icon character varying(250),
 */