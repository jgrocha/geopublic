Ext.define('GeoPublic.controller.StartPromotor', {
    extend: 'Ext.app.Controller',
    init: function () {
        this.control({
            'startpromotor button#planosdisponiveis': {
                'mouseover': this.onMouseOverApresentacaoPromotor,
                'mouseout': this.onMouseOutApresentacaoPromotor
            }
        }, this);
    },
    onMouseOverApresentacaoPromotor: function (b) {
        b.setText('Plans under discussion'.translate());
    },
    onMouseOutApresentacaoPromotor: function (b) {
        b.setText('');
    }
});
