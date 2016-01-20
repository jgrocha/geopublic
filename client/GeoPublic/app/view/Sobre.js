Ext.define('GeoPublic.view.Sobre', {
	extend : 'Ext.panel.Panel',
	alias : 'widget.sobre',
	title : 'About'.translate(),
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
		title : 'About Have your Say platform'.translate(),
		width : 900,
		autoScroll : true,
		bodyPadding : 10,
		loader : {
			url : 'resources/guiarapido/about.html'.translate(),
			autoLoad : true
		}
	}]
});
