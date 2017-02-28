Ext.apply(Ext.form.field.VTypes, {
    password: function (val, field) {
        var formPanel = field.up('form'), pwd = formPanel.down('textfield[name=password]').getValue();
        // console.log(val, field.name, pwd);
        // consoante eu sou a password de cima ou de baixo, tenho que fazera comparação
        // tenho que por este vtype em ambos os campos
        return val == pwd;
    },
    passwordText: 'Passwords do not match'.translate()
});

// http://stackoverflow.com/questions/9704913/confirm-password-validator-extjs-4

Ext.define('GeoPublic.view.Viewport', {
    extend: 'Ext.container.Viewport',
    requires: ['Ext.tab.Panel', 'Ext.layout.container.Border', 'Ext.layout.container.Column'],
    layout: 'border',
    // style: { 'background-color': 'white' },
    items: [{
        region: 'north',
        xtype: 'panel',
        // width: 900,
        height: 388,
        layout: {
            type: 'vbox',
            // padding : '5',
            align: 'center'
        },
        items: [{
            xtype: 'topheader'
        }, {
            xtype: 'container',
            layout: {
                type: 'hbox',
                align: 'middle'
            },
            items: [{
                xtype: 'imagecomponent',
                width: 208,
                height: 386,
                src: 'resources/images/EU.png'
            }, {
                xtype: 'imagecomponent',
                margin: '0 0 0 80',
                width: 392,
                height: 230,
                src: 'resources/images/TEXTO_BANNER.png'
            }]
        }],
        bodyStyle: {
            // background: 'transparent',
            backgroundImage: 'url(resources/images/BANNER_FUNDO.jpg)',
            backgroundSize: '1469 388',
            backgroundRepeat: 'repeat-x', // 'no-repeat',
            backgroundPosition: 'center top'
        }
    }, {
        region: 'center',
        xtype: 'tabpanel',
        /*        layout: {
         type: 'vbox',
         align: 'center'
         },*/
        layoutOnTabChange: true, // ?
        // width: 900,
        margins: '20 250 0 250',
        plain: true, // remover o fundo da barra dos panels
        items: [{
            xtype: 'container',
            title: 'Welcome'.translate(),
            itemId: 'welcome',
            autoScroll: true,
            glyph: 0xf015,
            items: [{
                xtype: 'welcome'
            }]
        }, /*{
         xtype: 'startpanel',
         itemId: 'startpanel',
         glyph: 0xf015
         }, *//* {
         xtype : 'mapa-com-projeto'
         }, {
         xtype: 'discussao-regulamento'
         },*/ {
            itemId: 'separador',
            tabConfig: {
                xtype: 'tbfill'
            }
        }, /*{
            xtype: 'grid-promotor'
        },*/ {
            xtype: 'estatisticas',
            glyph: 0xf080 // fa-bar-chart [&#xf080;]
        }, {
            xtype: 'sobre'
        }]
    }]
});