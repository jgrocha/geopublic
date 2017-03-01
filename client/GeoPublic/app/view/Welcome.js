Ext.define('GeoPublic.view.Welcome', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.welcome',
    // title: 'Welcome'.translate(),
    autoScroll: true,
    layout: 'card',
    // width: 900,
    // height: 560,
    // ui: 'startplano', // 'light', 'default', 'startplano-framed'
    initComponent: function () {
        var hidden = true;
        if (GeoPublic.LoggedInUser) {
            hidden = false;
        }
        this.items = [{
            title: 'Plans under discussion'.translate(),
            itemId: 'plantoshowbar',
            // width: 900,
            // height: 500,
            autoScroll: true,
            layout: {
                type: 'hbox',
                pack: 'left', // 'center',
                align: 'top'
            },
            defaults: {
                margin: '10 10 10 0'
            }
        }, {
            title: 'Plan presentation'.translate(),
            itemId: 'planpresentationbar',
            autoScroll: true,
            idplano: null,
            // html: 'Welcome to Plan B',
            bbar: [{
                xtype: 'panel',
                items: {
                    xtype: 'button',
                    itemId: 'previous',
                    text: 'Back to available plans'.translate(),
                    scale: 'large'
                }
            }, '->', {
                xtype: 'panel',
                items: {
                    xtype: 'button',
                    itemId: 'rules',
                    text: 'Participation rules'.translate(),
                    scale: 'large'
                }
            }, {
                xtype: 'panel',
                hidden: hidden,
                items: {
                    xtype: 'button',
                    itemId: 'discuss',
                    text: 'Discuss the plan'.translate(),
                    cls: 'x-btn-default-large',
                    scale: 'large'
                }
            }]
        }, {
            title: 'Participation rules'.translate(),
            itemId: 'rulebar',
            height: 388,
            // layout: 'column',
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            autoScroll: true,
            defaults: {
                flex: 1,
                layout: {
                    type: 'vbox',
                    pack: 'center',
                    align: 'stretch'
                },
                margin: '10 10 0 0',
                bodyPadding: '0 10 10 10',
                bodyStyle: {
                    background: '#65bbc6'
                }
            },
            items: [{
                title: '1',
                items: [{
                    loader: {
                        url: 'resources/guiarapido/rules/one.html'.translate(),
                        autoLoad: true
                    },
                    flex: 1,
                    bodyStyle: {
                        background: '#65bbc6'
                    }
                }, {
                    xtype: 'button',
                    text: 'New user'.translate(),
                    icon: 'resources/assets/plus-circle.png',
                    itemId: 'botaoRegisto',
                    scale: 'medium'
                }]
            }, {
                title: '2',
                items: [{
                    loader: {
                        url: 'resources/guiarapido/rules/two.html'.translate(),
                        autoLoad: true
                    },
                    flex: 1,
                    bodyStyle: {
                        background: '#65bbc6'
                    }
                }, {
                    xtype: 'button',
                    text: 'Start session'.translate(),
                    itemId: 'botaoLogin',
                    scale: 'medium'
                }]
            }, {
                title: '3',
                items: [{
                    loader: {
                        url: 'resources/guiarapido/rules/three.html'.translate(),
                        autoLoad: true
                    },
                    bodyStyle: {
                        background: '#65bbc6'
                    }
                }]
            }, {
                title: '4',
                items: [{
                    loader: {
                        url: 'resources/guiarapido/rules/four.html'.translate(),
                        autoLoad: true
                    },
                    bodyStyle: {
                        background: '#65bbc6'
                    }
                }]
            }, {
                title: '5',
                items: [{
                    loader: {
                        url: 'resources/guiarapido/rules/five.html'.translate(),
                        autoLoad: true
                    },
                    bodyStyle: {
                        background: '#65bbc6'
                    }
                }]
            }],
            bbar: [{
                xtype: 'panel',
                items: {
                    xtype: 'button',
                    itemId: 'previous',
                    text: 'Back to plan description'.translate(),
                    scale: 'large'
                }
            }, '->', {
                xtype: 'panel',
                items: {
                    xtype: 'button',
                    itemId: 'discuss',
                    text: 'Discuss the plan'.translate(),
                    scale: 'large'
                }
            }]
        }];
        this.callParent(arguments);
    }
})
;
