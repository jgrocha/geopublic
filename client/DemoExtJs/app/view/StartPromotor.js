Ext.define('DemoExtJs.view.StartPromotor', {
	extend : 'Ext.panel.Panel',
	alias : 'widget.startpromotor',

	width : 280,
	frame : true,
	ui : 'light',
	layout : {
		type : 'vbox',
		padding : '10',
		align : 'center'
	},

	initComponent : function() {
		var me = this;
		console.debug(this.initialConfig);
		console.log('Abrir com o promotor ' + this.initialConfig.idpromotor + ' denominado ' + this.initialConfig.designacao);
		this.title = this.initialConfig.designacao;
		this.idpromotor = this.initialConfig.idpromotor;

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
		}, /*{
		 xtype : 'button',
		 // itemId : 'planosorfeu',
		 text : 'Planos para discussão'
		 },*/
		{
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
