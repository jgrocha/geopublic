Ext.define('GeoPublic.view.TopHeader', {
    extend: 'Ext.toolbar.Toolbar',
    alias: 'widget.topheader',
    style: {
        // 'background-color': 'transparent !important',
        'background': 'transparent !important'
    },
    items: [/*{
     xtype : 'imagecomponent',
     width : 48,
     height : 48,
     src : 'resources/images/community_blue_48x48.png'.translate() // 'resources/images/logo_cmagueda.png' // 'http://www.sencha.com/img/20110215-feat-html5.png'
     }, {
     xtype : 'label',
     html : 'Have Your Say'.translate() + '<br/>' + 'Câmara Municipal de Águeda'.translate(),
     style : {
     'font-size' : '12px', // The javascript constant.
     'font-weight' : 'bold'
     }
     },*/ {
        xtype: 'imagecomponent',
        margin: '0 180 0 0',
        width : 212,
        height : 39,
        src: 'resources/images/LOGO_EU_PARTICIPO.png'
    }, {
        xtype: 'tbfill'
    }, {
        xtype: 'button',
        text: 'New user'.translate(),
        icon: 'resources/assets/plus-circle.png',
        itemId: 'botaoRegisto',
        scale: 'medium'
    }, {
        xtype: 'splitbutton',
        text: 'Start session'.translate(),
        itemId: 'botaoLogin',
        // resizable : true,
        width: 192,
        scale: 'medium',
        menu: {
            width: 192,
            items: [/*{
             text : 'Last access'.translate(),
             itemId : 'botaoLastAccess'
             }, {
             text : 'Profile'.translate(),
             itemId : 'botaoPerfil'
             }, */ {
                text: 'Logout'.translate(),
                icon: 'resources/assets/logout.png',
                itemId: 'botaoLogout'
            }]
        }
    }, {
        xtype: 'button',
        itemId: 'botaoLanguage',
        scale: 'medium',

        // iconCls: 'button-home-small',
        // bind: {
        // 	text: '{languageName}',
        // 	iconCls: '{flagCls}'
        // },
        text: 'app-language-name'.translate(),
        menu: [{
            text: 'English',
            iconCls: 'english',
            action: 'en'/*,
             handler: 'onLanguageMenuClick'*/
        }, {
            text: 'Português',
            iconCls: 'portuguese',
            action: 'pt-PT'/*,
             handler: 'onLanguageMenuClick'*/
        }, {
            text: 'Ελληνική',
            iconCls: 'greek',
            action: 'el'/*,
             handler: 'onLanguageMenuClick'*/
        }]
    }]
});
