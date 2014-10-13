Ext.define('GeoPublic.model.Participation.ChartByState', {
	extend : 'Ext.data.Model',
	fields : [{
		name : 'id',
		type : 'int'
	}, {
		name : 'state',
		type : 'string'
	}, {
		name : 'count',
		type : 'int'
	}],
	// belongsTo : 'GeoPublic.model.Promotor',
	// http://localhost/extjs/docs/index.html#!/api/Ext.data.proxy.Direct
	proxy : {
		type : 'direct',
		// paramOrder : 'id,idplano', // Tells the proxy to pass the id as the first parameter to the remoting method.
		api : {
			read : 'ExtRemote.DXParticipacao.statsByState'
		},
		reader : {
			type : 'json',
			root : 'data',
			messageProperty : 'message' // mandatory if you want the framework to set it's content
		}
	}
});