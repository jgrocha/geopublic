Ext.define('DemoExtJs.view.StartPanelChartByState', {
	extend : 'Ext.chart.Chart',
	alias : 'widget.startpanelchartbystate',
	animate : true,
	// store : store1,
	shadow : true,
	/*
	 legend : {
	 position : 'right'
	 },
	 */
	insetPadding : 60,
	theme : 'Base:gradients',
	initComponent : function() {
		var generateData = function(n, floor) {
			var estados = ["Aberta", "Em resolução", "Encaminhada", "Fechada"];
			var data = [], p = (Math.random() * 11) + 1, i;
			floor = (!floor && floor !== 0) ? 20 : floor;
			for ( i = 0; i < (n || 12); i++) {
				data.push({
					name : estados[i],
					data1 : Math.floor(Math.max((Math.random() * 100), floor)),
					data2 : Math.floor(Math.max((Math.random() * 100), floor)),
					data3 : Math.floor(Math.max((Math.random() * 100), floor)),
					data4 : Math.floor(Math.max((Math.random() * 100), floor)),
					data5 : Math.floor(Math.max((Math.random() * 100), floor)),
					data6 : Math.floor(Math.max((Math.random() * 100), floor)),
					data7 : Math.floor(Math.max((Math.random() * 100), floor)),
					data8 : Math.floor(Math.max((Math.random() * 100), floor)),
					data9 : Math.floor(Math.max((Math.random() * 100), floor))
				});
			}
			return data;
		};
		// global!
		this.store = Ext.create('Ext.data.JsonStore', {
			fields : ['name', 'data1', 'data2', 'data3', 'data4', 'data5', 'data6', 'data7', 'data9', 'data9']
		});
		this.store.loadData(generateData(4, 20));
		console.log('this.store');
		console.log(this.store);
		this.series = [{
			type : 'pie',
			field : 'data1',
			showInLegend : true,
			donut : 35,
			tips : {
				trackMouse : true,
				width : 140,
				height : 28,
				renderer : function(storeItem, item) {
					//calculate percentage.
					var total = 0;
					this.store.each(function(rec) {
						total += rec.get('data1');
					});
					this.setTitle(storeItem.get('name') + ': ' + Math.round(storeItem.get('data1') / total * 100) + '%');
				}
			},
			highlight : {
				segment : {
					margin : 20
				}
			},
			label : {
				field : 'name',
				display : 'rotate',
				contrast : true,
				font : '12px Arial'
			}
		}];
		this.items = [{
			type : 'text',
			text : 'Estado das participações',
			font : '14px Arial',
			width : 280,
			height : 30,
			x : 50, //the sprite x position
			y : 10 //the sprite y position
		}];
		this.callParent(arguments);
	},
});
