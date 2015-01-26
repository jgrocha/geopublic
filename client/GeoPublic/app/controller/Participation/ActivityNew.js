Ext.define('GeoPublic.controller.Participation.ActivityNew', {
    extend: 'Ext.app.Controller',
    requires: ['GeoPublic.store.Ocorrencia', 'GeoPublic.view.Participation.Discussion'],
    // stores : ['Ocorrencia'], // getOcorrenciaStore() hummm...
    // Ext.ComponentQuery.query('profile checkbox')
    refs: [{
        ref: 'todasDiscussoes', // getTodasDiscussoes
        selector: 'activity #flow'
    }],
    init: function () {
        console.log('O controlador GeoPublic.controller.Participation.ActivityNew init...');
        this.control({
            'activitynew': {
                'afterrender': this.onActivityNewPanelAfterRender
            }
        }, this);
    },
    onLaunch: function () {
        console.log('...O controlador GeoPublic.controller.Participation.ActivityNew onLaunch.');
    },
    onActivityNewPanelAfterRender: function (panel, options) {
        console.log('controlador GeoPublic.controller.Participation.ActivityNew onActivityNewPanelAfterRender');
    }
});