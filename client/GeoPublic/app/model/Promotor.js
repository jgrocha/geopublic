Ext.define('GeoPublic.model.Promotor', {
	extend : 'Ext.data.Model',
	// requires : ['GeoPublic.model.Plano'],
	fields : [{
		name : 'id',
		type : 'int'
	}, {
		name : 'designacao',
		type : 'string'
	}, {
		name : 'email',
		type : 'string'
	}, {
		name : 'site',
		type : 'string'
	}, {
		name : 'dataregisto',
		type : 'date'
	}, {
		name : 'logotipo',
		type : 'string'
	}, {
		name : 'idutilizador',
		type : 'int',
		persist: false
	}],
	// http://extjs-tutorials.blogspot.co.uk/2012/05/extjs-hasmany-relationships-rules.html
	/*
	hasMany : [{
		foreignKey : 'idpromotor',
		name : 'plano',
		model : 'GeoPublic.model.Plano'
		// associationKey: 'phoneNumbers'
	}],
	*/
	// http://localhost/extjs/docs/index.html#!/api/Ext.data.proxy.Direct
	proxy : {
		// Extra parameters that will be included on every read request.
		// Individual requests with params of the same name will override these params when they are in conflict.
		// extraParams : {
		// 	tabela : 'grupo'
		// },
		type : 'direct',
		paramOrder : 'id', // Tells the proxy to pass the id as the first parameter to the remoting method.
		api : {
			create : 'ExtRemote.DXParticipacao.createPromotor',
			read : 'ExtRemote.DXParticipacao.readPromotor',
			update : 'ExtRemote.DXParticipacao.updatePromotor',
			destroy : 'ExtRemote.DXParticipacao.destroyPromotor'
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

/*
 id serial NOT NULL,
 designacao character varying(100) NOT NULL,
 email character varying(50) NOT NULL,
 site character varying(120),
 dataregisto timestamp with time zone NOT NULL DEFAULT now(),
 */