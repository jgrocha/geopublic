Ext.define('GeoPublic.view.StartPanel', {
	extend : 'Ext.panel.Panel',
	alias : 'widget.startpanel',
	title : 'Welcome'.translate(),
	autoScroll : true,
	width : 900,
	initComponent : function() {
		this.callParent(arguments);
	},
    bodyStyle: {
        backgroundImage: 'url(resources/images/storm.png)',
        backgroundSize: '241 174',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'bottom left'
    },
	layout : {
		type : 'vbox',
		// padding : '5',
		align : 'center'
	},
	defaults : {
		margin : '0 0 20 0' // '0 0 50 0'
	},
	items : [{
		title : 'Have Your Say'.translate(),
		itemId : 'participationbar',
		width : 900,
		autoScroll : true,
		bodyPadding : 10,
		loader : {
			url : 'resources/guiarapido/participacaocivica.html'.translate(),
			autoLoad : true
		}
	}, {
        hidden: true,
		width : 900,
		itemId : 'circlebar',
		layout : {
			type : 'hbox',
			padding : '5',
			pack : 'center',
			align : 'middle'
		},
		defaults : {
			margin : '0 5 0 0'
		},
		items : [{
			xtype : 'container',
			itemId : 'promotorescircle',
			cls : 'circle',
			width : 150,
			height : 150,
			html : '0 Promotores'
		}, {
			xtype : 'container',
			itemId : 'planoscircle',
			cls : 'circle-gray',
			width : 150,
			height : 150,
			html : '0 Planos'
		}, {
			xtype : 'container',
			itemId : 'participationscircle',
			cls : 'circle-gray',
			width : 150,
			height : 150,
			html : '0 Participações'
		}, {
			xtype : 'container',
			itemId : 'commentscircle',
			cls : 'circle-gray',
			width : 150,
			height : 150,
			html : '0 Comentários'
		}]
	}, {
		title : 'Institutions'.translate(),
		width : 900,
        itemId : 'promotorbar',
        style: 'opacity: 0;', // para usar o FadeIn
        autoScroll : true,
		// hidden : true,
		layout : {
			type : 'hbox',
			pack : 'left', // 'center',
			align : 'middle' // 'middle'
		},
		defaults : {
			margin : '10 10 10 0'
		},
		items : [/*{
         xtype : 'startpromotor'
         }, {
         xtype : 'startpromotor'
         }, {
         xtype : 'startpromotor'
         } */]
	}, {
        title : 'Plans under discussion'.translate(),
        width : 900,
        itemId : 'planbar',
        style: 'opacity: 0;', // para usar o FadeIn
        autoScroll : true,
        layout : {
            type : 'hbox',
            pack : 'left', // 'center',
            align : 'middle'
        },
        defaults : {
            margin : '10 10 10 0'
        },
        items : [ /*{
            xtype : 'startplano'
        }, {
            xtype : 'startplano'
        }, {
            xtype : 'startplano'
        } */]
    }, {
		// xtype : 'tabpanel',
		itemId : 'planpresentationbar',
		width : 900,
        style: 'opacity: 0;', // para usar o FadeIn
		// bodyPadding : 10,
		// hidden : true,
		plain : true, // remover o fundo da barra dos panels
		idplano : null,
		items : [/*
		 * to be added later
		 */]
	}, {
		width : 900,
		itemId : 'readybar',
		title : 'Participation rules'.translate(),
        ui: 'startplano',
		// hidden : true,
        style: 'opacity: 0;', // para usar o FadeIn
        layout: {
            type: 'vbox',
            align: 'stretch',
            pack: 'start'
        },
		items : [{
            // bodyPadding: '0 48 0 0',
            margin: '0 48 0 0',
            xtype: 'panel',
            // region: 'center',
            flex: 1,
            bodyStyle: 'background-color: #E6E6E6', // cinza claro
            items: [{
                loader : {
                    url : 'resources/guiarapido/participar_geo.html',
                    autoLoad : true
                },
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
                itemId: 'participa',
                text: 'Discuss the plan'.translate(),
                scale: 'medium'
            }]
        }]
	}]
});
