Ext.define('GeoPublic.view.BackOffice.Janela', {
    extend: 'Ext.window.Window',
    alias: 'widget.window-map-limits',
    height: 490,
    width: 1000,
    title: "Select the plan limits",
    layout: 'fit',
    modal: true,
    closable: true,
    closeAction: 'destroy', // 'hide',
    initComponent: function () {
        console.log('Abrir o mapa com ' + this.the_geom);
        this.items = [{
            xtype: 'map-limits',
            the_geom: this.the_geom
        }];
        this.callParent(arguments);
    }
});