Ext.define('GeoPublic.view.DiscussaoRegulamento', {
    extend: 'Ext.container.Container',
    alias: 'widget.discussao-regulamento',
    // requires : ['Ext.grid.Panel', 'Ext.grid.column.Number', 'Ext.form.field.Number', 'Ext.toolbar.Paging', 'Ext.form.field.Checkbox', 'Ext.grid.column.Action', 'Ext.grid.plugin.RowEditing'],
    layout: 'border',
    title: 'Regime Jurídico da Urbanização e Edificação',
    // style : 'padding:5px',
    items: [{
        region: 'center',
        collapsible: false,
        // html: 'Janela com o texto do regulamento',
        items: [{
            html: 'Antes'
        }, {
            xtype: 'component',
            id: 'compare',
            autoEl: {
                html: 'Teste'
            }
        }, {
            html: 'Depois'
        }]
    }, {
        region: 'east',
        split: true,
        width: 400,
        html: 'Janela com as participações'
    }]
});
