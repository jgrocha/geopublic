Ext.define('DemoExtJs.view.Viewport', {
	extend : 'Ext.container.Viewport',
	requires : ['Ext.tab.Panel', 'Ext.layout.container.Border'],

	layout : {
		type : 'border'
	},

	items : [{
		title : 'Node.js + ExtDirect + ExtJS 4',
		region : 'north',
		xtype : 'topheader'
	}, {
		region : 'center',
		xtype : 'tabpanel',
		items : [{
			xtype : 'app-main-map-panel'
		}, {
			xtype : 'grid-actions'
		}, {
			xtype : 'method-call'
		}, {
			xtype : 'form-actions'
		}, {
			xtype : 'form-upload'
		}, {
			xtype : 'tree-actions'
		}, {
			xtype : 'demo-cookies'
		}]
	}]
});
