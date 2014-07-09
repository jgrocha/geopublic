Ext.define('DemoExtJs.store.Confrontacao', {
    extend: 'Ext.data.Store',
    requires: [
        'DemoExtJs.model.Confrontacao'
    ],
    autoLoad: false, // só pode ler este store depois de ter um utilizador autenticado
    remoteSort:true, //enable remote filter
    remoteFilter:true, //enable remote sorting
    pageSize: 5,
    //autoSync: true, // if operating on model directly this will make double POSTs!
    model: 'DemoExtJs.model.Confrontacao'
    // storeId: 'Sessao' // If store Id matches it's class name, may be skipped.
});