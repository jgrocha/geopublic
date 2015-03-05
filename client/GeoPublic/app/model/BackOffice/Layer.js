Ext.define('GeoPublic.model.BackOffice.Layer', {
	extend : 'Ext.data.Model',
	fields : [{
        name : 'id',
        type : 'int'
    }, {
        name : 'ord',
        type : 'int'
    }, {
		name : 'titulo',
		type : 'string'
	}, {
		name : 'layer',
		type : 'string'
	}, {
		name : 'grupo',
		type : 'string'
	}, {
		name : 'url',
		type : 'string'
	}, {
		name : 'tipo',
		type : 'string'
	}, {
        name : 'srid',
        type : 'int'
    }, {
		name : 'estilo',
		type : 'string'
	}, {
		name : 'qtip',
		type : 'string'
	}, {
        name : 'singletile',
        type : 'boolean'
    }, {
        name : 'activo',
        type : 'boolean'
    }, {
		name : 'observacoes',
		type : 'string'
	}, {
        name : 'visivel',
        type : 'boolean'
    }, {
        name : 'base',
        type : 'boolean'
    }],
    proxy : {
        type : 'direct',
        api : {
            create : 'ExtRemote.DXSessao.createLayer',
            read : 'ExtRemote.DXSessao.readLayer',
            update : 'ExtRemote.DXSessao.updateLayer',
            destroy : 'ExtRemote.DXSessao.destroyLayer'
        },
        reader : {
            type : 'json',
            root : 'data',
            messageProperty : 'message' // mandatory if you want the framework to set it's content
        },
        writer : {
            writeAllFields : false
        }
    }
});
