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

Ext.define('GeoPublic.view.Estatisticas.ChartByType', {
	extend : 'Ext.chart.Chart',
	alias : 'widget.startpanelchartbytype',
	animate : true,
	shadow : true,
	axes : [{
		type : 'Numeric',
		position : 'top', // 'bottom',
		fields : ['count'],
		label : {
			renderer : Ext.util.Format.numberRenderer('0,0')
		},
		title : 'Número de participações',
		grid : true,
		minimum : 0
	}, {
		type : 'Category',
		position : 'left',
		fields : ['type']
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
	store: 'Participation.ChartByType',
	initComponent : function() {
		/*
		// global!
		this.store = Ext.create('Ext.data.JsonStore', {
			fields : ['type', 'count']
		});
		var data = [{
			type : 'Rampeamento',
			count : 20
		}, {
			type : 'Passeios',
			count : 10
		}, {
			type : 'Cocó',
			count : 12
		}, {
			type : 'Begetação',
			count : 8
		}];
		this.store.loadData(data);
		//generateData(4, 20));
		// this.store.loadData(generateData(5, 20));
		console.log('this.store');
		console.log(this.store);
		*/
		this.series = [{
			type : 'bar',
			axis : 'bottom',
			highlight : true,
			tips : {
				trackMouse : true,
				width : 140,
				height : 28,
				renderer : function(storeItem, item) {
					this.setTitle(storeItem.get('type') + ': ' + storeItem.get('count') + ' participações');
				}
			},
			label : {
				display : 'insideEnd',
				field : 'count',
				renderer : Ext.util.Format.numberRenderer('0'),
				orientation : 'horizontal',
				color : '#333',
				'text-anchor' : 'middle'
			},
			xField : 'type',
			yField : ['count']
		}];
		this.callParent(arguments);
	}
});
