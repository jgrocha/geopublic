Ext.define('GeoPublic.controller.StartPlano', {
    extend: 'Ext.app.Controller',
    init: function () {
        this.control({
            'startplano': {
                'afterrender': this.onStartPlanoAfterRender
            },
            'startplano button#apresentacao': {
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
