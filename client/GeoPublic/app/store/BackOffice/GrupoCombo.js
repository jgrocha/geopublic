Ext.define('GeoPublic.store.BackOffice.GrupoCombo', {
    extend: 'Ext.data.Store',
    requires: [
        'GeoPublic.model.BackOffice.Grupo'
    ],
    autoLoad: true,
    remoteSort: true, //enable remote filter
    remoteFilter: true, //enable remote sorting
    pageSize: 20,
    model: 'GeoPublic.model.BackOffice.Grupo'
});