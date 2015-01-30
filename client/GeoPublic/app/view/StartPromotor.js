Ext.define('GeoPublic.view.StartPromotor', {
	extend : 'Ext.panel.Panel',
	alias : 'widget.startpromotor',
	width : 280,
    height: 300,
	// frame : true,
	// ui : 'light',
    ui: 'startplano',
    frame: false, // true,
    layout: 'border',
    bodyPadding: 0,
	initComponent : function() {
		var me = this;
        //<debug>
		console.debug(this.initialConfig);
		console.log('Abrir com o promotor ' + this.initialConfig.idpromotor + ' denominado ' + this.initialConfig.designacao);
        //</debug>
		this.idpromotor = this.initialConfig.idpromotor;

        this.title = this.initialConfig.designacao;
        this.items = [{
            bodyPadding: '10 0 0 10',
            margin: '0 48 0 0',
            xtype: 'panel',
            region: 'center',
            layout: {
                type: 'vbox',
                padding: '0 0 10 0', // Por baixo de cada item
                align: 'stretch'
            },
            bodyStyle: 'background-color: #E6E6E6', // cinza claro
            items: [{
                html: 'Site: <a href="' + this.initialConfig.site + '" target="_blank">' + this.initialConfig.designacao + '</a>',
                padding: '0 0 10 0',
                bodyStyle: 'background:none'
            }, {
                html: 'Contacto: <a href="mailto:' + this.initialConfig.email + '?Subject=Participação Pública">' + this.initialConfig.email + '</a>',
                padding: '0 0 20 0',
                bodyStyle: 'background:none'
            }, {
                xtype: 'container',
                height: 100,
                items: [{
                    xtype : 'image',
                    src : this.initialConfig.logotipo, // 'resources/images/MSQUITO1-02.png',
                    style : {
                        'display' : 'block',
                        'margin' : 'auto'
                    }
                }]
            }]
        }, {
            xtype: 'panel',
            bodyStyle: 'background-color: #FFDB4D', // amarelo claro
            // bodyStyle: 'background:none',
            region: 'south',
            height: 48,
            layout: {
                type: 'hbox',pack: 'end',
                align: 'stretch'
            },
            items: [{
                minWidth: 48,
                textAlign: 'right',
                xtype: 'button',
                itemId: 'planosdisponiveis',
                text: '',
                scale: 'medium'
            }]
        }];
        this.callParent(arguments);
    }
});

/*

		this.items = [{
			html : '<a href="' + this.initialConfig.site + '" target="_blank">' + this.initialConfig.designacao + '</a>'
		}, {
			width : 260,
			height : 160,
			style : {
				'display' : 'table-cell',
				'vertical-align' : 'middle'
			},
			items : [{
				xtype : 'image',
				src : this.initialConfig.logotipo, // 'resources/images/MSQUITO1-02.png',
				style : {
					'display' : 'block',
					'margin' : 'auto'
				}
			}]
		}, {
			xtype : 'container',
			// itemId : 'promotorescircle',
			cls : 'circle',
			width : 150,
			height : 150,
			html : 'Planos',
			listeners : {
				render : function(c) {
					c.el.on('click', function() {
						c.up('startpromotor').fireEvent('clickPlano', c.up('startpromotor'));
					});
				}
			}
		}];
		this.callParent(arguments);
	}
});
*/