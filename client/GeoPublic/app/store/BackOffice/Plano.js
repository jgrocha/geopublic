Ext.define('GeoPublic.store.BackOffice.Plano', {
    extend: 'Ext.data.Store',
    requires: ['GeoPublic.model.Plano'],
    autoLoad: {params: {mode: 1, reqfrom: 'BackOffice.Plano'}}, // reqform only for debug
    remoteSort: true, //enable remote filter
    remoteFilter: false, //enable remote sorting
    // pageSize: 5,
    autoSync: false, // if operating on model directly this will make double POSTs!
    model: 'GeoPublic.model.Plano'
}); 