Ext.define('DemoExtJs.model.Participation.ChartByType', {
	extend : 'Ext.data.Model',
	fields : [{
		name : 'id',
		type : 'int'
	}, {
		name : 'type',
		type : 'string'
	}, {
		name : 'count',
		type : 'int'
	}],
	// belongsTo : 'DemoExtJs.model.Promotor',
	// http://localhost/extjs/docs/index.html#!/api/Ext.data.proxy.Direct
	proxy : {
		type : 'direct',
		// paramOrder : 'id,idplano', // Tells the proxy to pass the id as the first parameter to the remoting method.
		api : {
			read : 'ExtRemote.DXParticipacao.statsByType'
		},
		reader : {
			type : 'json',
			root : 'data',
			messageProperty : 'message' // mandatory if you want the framework to set it's content
		}
	}
});