Ext.define('GeoPublic.view.StartPlanoDescricao', {
	extend : 'Ext.panel.Panel',
	alias : 'widget.startplanodescricao',
    width : 'auto',
    ui: 'startplano', // 'light', 'default', 'startplano-framed'
    frame: false, // true,
    layout: {
        type: 'vbox',
        align: 'stretch',
        pack: 'start'
    },
    bodyPadding: 0,
	initComponent : function() {
		var me = this;
		// console.debug(this.initialConfig);
		console.log('Abrir com o plano ' + this.initialConfig.idplano + ' denominado ' + this.initialConfig.designacao);
		this.title = this.initialConfig.designacao;
		// this.itemId = 'StartPlanoDescricao-' + this.initialConfig.id;
        this.items = [{
            bodyPadding: '10 0 0 10',
            margin: '0 48 0 0',
            xtype: 'panel',
            // region: 'center',
            flex: 1,
            bodyStyle: 'background-color: #E6E6E6', // cinza claro
            items: [{
                html: this.initialConfig.descricao,
                // padding: '0 0 10 0',
                bodyStyle: 'background:none'
            }]
        }, {
            xtype: 'panel',
            // bodyStyle: 'background-color: #333', // cinza escuro
            bodyStyle: 'background:none',
            // region: 'south',
            height: 48,
            layout: {
                type: 'hbox',
                pack: 'end',
                align: 'stretch'
            },
            items: [{
                minWidth: 48,
                // overCls: 'customOverStyle',
                textAlign: 'right',
                xtype: 'button',
                itemId: 'regras',
                text: '',
                scale: 'medium'
            }]
        }];
        this.callParent(arguments);
    }
});

        /*
		this.items = [{
			html : this.initialConfig.descricao
		}];
		this.callParent(arguments);
	}
});
*/