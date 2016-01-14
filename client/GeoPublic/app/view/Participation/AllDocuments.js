Ext.define('GeoPublic.view.Participation.AllDcoments', {
    extend: 'Ext.container.Container',
    xtype: 'all-documents',
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    style: 'padding:20px',

    initComponent: function () {
        console.log(this);
        this.items = [{
            xtype : 'dataview',
            store : this.config.store,
            tpl : ['<tpl for=".">', //
                '<div class="thumb-wrap-ad" id="document-{id}" data-qtip="{name}">', //
                '<div class="thumb-ad"><img src="{url}"></div>', //
                '<span class="x-editable">{name:htmlEncode}</span>',
                '</div>', '</tpl>', //
                '<div class="x-clear"></div>' //
            ],
            multiSelect : true,
            trackOver : true,
            overItemCls : 'x-item-over',
            itemSelector : 'div.thumb-wrap-ad',
            emptyText : 'No documents were uploaded yet'.translate(),
            listeners : {
                selectionchange : function(dv, nodes) {
                    var l = nodes.length, s = l !== 1 ? 's' : '';
                    //<debug>
                    console.log('Simple DataView (' + l + ' item' + s + ' selected)');
                    console.log(nodes);
                    console.log(nodes[0]);
                    //</debug>
                    var imagem = nodes[0].get('url').replace("/80x80/", "/doc/");
                    var win = window.open(imagem.replace(/png$/, "pdf"), '_blank');
                    win.focus();
                }
            }
        }, {
            xtype: 'panel',
            //html: 'Estes romanos são loucos!',
            autoScroll : true,
            bodyPadding : 10,
            loader : {
                url : 'resources/guiarapido/alldocuments.html'.translate(),
                autoLoad : true
            }
        }];
        this.callParent(arguments);
    }
});