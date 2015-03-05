Ext.define('GeoPublic.store.Menu', {
    extend: 'Ext.data.Store',
    requires: [
        'GeoPublic.model.Menu'
    ],
    autoLoad: false, // só pode ler este store depois de ter um utilizador autenticado
    remoteSort: false, //enable remote filter
    remoteFilter: false, //enable remote sorting
    // pageSize: 5,
    //autoSync: true, // if operating on model directly this will make double POSTs!
    model: 'GeoPublic.model.Menu'
    // storeId: 'Sessao' // If store Id matches it's class name, may be skipped.
});