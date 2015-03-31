Ext.define('GeoPublic.model.BackOffice.Grupo', {
    extend: 'Ext.data.Model',

    /*
     id serial NOT NULL,
     nome character varying(45) NOT NULL,
     datacriacao timestamp with time zone DEFAULT now(),
     datamodificacao timestamp with time zone,
     idutilizador integer,
     omissao boolean NOT NULL DEFAULT false,
     */

    fields: [{
        name: 'id',
        type: 'int'
    }, {
        name: 'nome',
        type: 'string'
    }, {
        name: 'datacriacao',
        type: 'date'
    }, {
        name: 'datamodificacao',
        type: 'date'
    }, {
        name: 'idutilizador',
        type: 'int'
    }, {
        name : 'omissao',
        type : 'boolean'
    }],
    proxy: {
        type: 'direct',
        api: {
            // create : 'ExtRemote.DXTodoItem.create',
            read: 'ExtRemote.DXSessao.readGrupo'
            // update : 'ExtRemote.DXTodoItem.update',
            // destroy : 'ExtRemote.DXTodoItem.destroy'
        },
        reader: {
            type: 'json',
            root: 'data',
            messageProperty: 'message' // mandatory if you want the framework to set it's content
        }
    }
});
