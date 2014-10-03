Ext.define('DemoExtJs.view.Participation.Activity', {
	extend : 'Ext.container.Container',
	alias : 'widget.activity',
	layout : {
		type : 'vbox',
		align : 'stretch',
		pack : 'start'
	},
	bodyCls : 'activity-panel',
	items : [{
		xtype : 'contribution',
		collapsible : true,
		collapsed : true,
		titleCollapse : true
	}, {
		flex : 1,
		defaultType : 'container',
		itemId : 'flow',
		autoScroll : true,
		items : [{
			layout : 'fit',
			// minWidth : 200,
			// minHeight : 200,
			defaultType : 'container',
			items : [/*{
			 xtype : 'discussion'
			 }, {
			 xtype : 'discussion'
			 }, {
			 xtype : 'discussion'
			 }, {
			 xtype : 'discussion'
			 }, {
			 xtype : 'discussion'
			 }, {
			 xtype : 'discussion'
			 }, {
			 xtype : 'discussion'
			 } */ ]
		}]

	}]
});
