Ext.define('GeoPublic.model.Menu', {
	extend : 'Ext.data.Model',
    /*
     id serial NOT NULL,
     titulo character varying(45) NOT NULL,
     icon character varying(15),
     idsuperior integer,
     class character varying(45),
     anonimo boolean DEFAULT false,
     */
	fields : [{
		name : 'id',
		type : 'int'
	}, {
		name : 'titulo',
		type : 'string'
	}, {
		name : 'icon',
		type : 'int'
	}, {
		name : 'idsuperior',
		type : 'int'
	}, {
		name : 'extjsview',
		type : 'string'
	}, {
		name : 'ativo',
		type : 'boolean'
	}],
    proxy : {
        type : 'direct',
        api : {
            // create : 'ExtRemote.DXSessao.createMenu',
            read : 'ExtRemote.DXSessao.readMenu'
            // update : 'ExtRemote.DXSessao.updateMenu',
            // destroy : 'ExtRemote.DXSessao.destroyMenu'
        },
        reader : {
            type : 'json',
            root : 'data',
            messageProperty : 'message' // mandatory if you want the framework to set it's content
        }
    }
});
