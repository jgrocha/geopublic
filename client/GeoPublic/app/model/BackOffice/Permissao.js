Ext.define('GeoPublic.model.BackOffice.Permissao', {
    extend: 'Ext.data.Model',
    fields: [{
        name: 'idmenu',
        type: 'int'
    }, {
        name: 'idgrupo',
        type: 'int'
    }],
    proxy: {
        type: 'direct',
        api: {
            // create : 'ExtRemote.DXSessao.create',
            read: 'ExtRemote.DXSessao.readPermissao'
            // update : 'ExtRemote.DXSessao.update',
            // destroy : 'ExtRemote.DXSessao.destroy'
        },
        reader: {
            type: 'json',
            root: 'data',
            messageProperty: 'message' // mandatory if you want the framework to set it's content
        }
    }
});