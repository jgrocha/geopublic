Ext.define('GeoPublic.store.BackOffice.Layer', {
    extend: 'Ext.data.Store',
    requires: [
        'GeoPublic.model.BackOffice.Layer'
    ],
    autoLoad: false, // só pode ler este store depois de ter um utilizador autenticado
    remoteSort: false, //enable remote filter
    remoteFilter: false, //enable remote sorting
    // pageSize: 5,
    autoSync: true, // if operating on model directly this will make double POSTs!
    model: 'GeoPublic.model.BackOffice.Layer'
    // storeId: 'Sessao' // If store Id matches it's class name, may be skipped.
});