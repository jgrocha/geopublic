Ext.define('DemoExtJs.model.Promotor', {
	extend : 'Ext.data.Model',

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
	}],
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
	}
});

/*
 id serial NOT NULL,
 designacao character varying(100) NOT NULL,
 email character varying(50) NOT NULL,
 site character varying(120),
 dataregisto timestamp with time zone NOT NULL DEFAULT now(),
 */