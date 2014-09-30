Ext.define('Ext.chart.theme.CustomBlue', {
	extend : 'Ext.chart.theme.Base',

	constructor : function(config) {
		var titleLabel = {
			font : 'bold 18px Arial'
		}, axisLabel = {
			fill : 'rgb(8,69,148)',
			font : '12px Arial',
			spacing : 2,
			padding : 5
		};

		this.callParent([Ext.apply({
			axis : {
				stroke : '#084594'
			},
			axisLabelLeft : axisLabel,
			axisLabelBottom : axisLabel,
			axisTitleLeft : titleLabel,
			axisTitleBottom : titleLabel
		}, config)]);
	}
});

Ext.define('DemoExtJs.view.StartPanelChartByType', {
	extend : 'Ext.chart.Chart',
	alias : 'widget.startpanelchartbytype',
	animate : true,
	shadow : true,
	axes : [{
		type : 'Numeric',
		position : 'top', // 'bottom',
		fields : ['data1'],
		label : {
			renderer : Ext.util.Format.numberRenderer('0,0')
		},
		title : 'Número de participações',
		grid : true,
		minimum : 0
	}, {
		type : 'Category',
		position : 'left',
		fields : ['name']
		// title : 'Tipo de Ocorrência'
	}],
	// theme : 'CustomBlue',
	theme : 'Base:gradients',
	background : {
		gradient : {
			id : 'backgroundGradient',
			angle : 45,
			stops : {
				0 : {
					color : '#ffffff'
				},
				100 : {
					color : '#eaf1f8'
				}
			}
		}
	},
	initComponent : function() {
		var generateData = function(n, floor) {
			var tipos = ["Rampeamento e rebaixamento", "Passeios", "Mobiliário Urbano", "Elementos da vegetação", "Outras situações"];
			var data = [], p = (Math.random() * 11) + 1, i;
			floor = (!floor && floor !== 0) ? 20 : floor;
			for ( i = 0; i < (n || 12); i++) {
				data.push({
					name : tipos[i],
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
		this.store.loadData(generateData(5, 20));
		console.log('this.store');
		console.log(this.store);
		this.series = [{
			type : 'bar',
			axis : 'bottom',
			highlight : true,
			tips : {
				trackMouse : true,
				width : 140,
				height : 28,
				renderer : function(storeItem, item) {
					this.setTitle(storeItem.get('name') + ': ' + storeItem.get('data1') + ' participações');
				}
			},
			label : {
				display : 'insideEnd',
				field : 'data1',
				renderer : Ext.util.Format.numberRenderer('0'),
				orientation : 'horizontal',
				color : '#333',
				'text-anchor' : 'middle'
			},
			xField : 'name',
			yField : ['data1']
		}];
		this.callParent(arguments);
	}
});
