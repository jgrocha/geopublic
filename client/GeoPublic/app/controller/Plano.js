Ext.define('GeoPublic.controller.Plano', {
    extend: 'Ext.app.Controller',
    init: function () {
        this.control({
            'plano': {
                'afterrender': this.onStartPlanoAfterRender
            },
            'plano button#apresentacao': {
                // 'mouseover': this.onMouseOverApresentacaoPlano,
                // 'mouseout': this.onMouseOutApresentacaoPlano
            }
        }, this);
    },
    onStartPlanoAfterRender: function (panel) {
        var header = panel.header;
        header.setHeight(56);
    },
    onMouseOverApresentacaoPlano: function (b) {
        b.setText('Introduction'.translate());
    },
    onMouseOutApresentacaoPlano: function (b) {
        b.setText('');
    }
});
