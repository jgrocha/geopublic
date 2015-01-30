Ext.define('GeoPublic.controller.StartPlanoDescricao', {
    extend: 'Ext.app.Controller',
    init: function () {
        this.control({
            'startplanodescricao button#regras': {
                'mouseover': this.onMouseOverRegrasParticipacao,
                'mouseout': this.onMouseOutRegrasParticipacao
            }
        }, this);
    },
    onMouseOverRegrasParticipacao: function (b) {
        b.setText('Participation rules'.translate());
    },
    onMouseOutRegrasParticipacao: function (b) {
        b.setText('');
    }
});
