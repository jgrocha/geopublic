Ext.define('GeoPublic.store.BackOffice.Permissao', {
    extend: 'Ext.data.Store',
    requires: [
        'GeoPublic.model.BackOffice.Permissao'
    ],
    autoLoad: false, // só pode ler este store depois de ter um utilizador autenticado
    remoteSort: true, //enable remote filter
    remoteFilter: true, //enable remote sorting
    pageSize: 20,
    //autoSync: true, // if operating on model directly this will make double POSTs!
    model: 'GeoPublic.model.BackOffice.Permissao'
});