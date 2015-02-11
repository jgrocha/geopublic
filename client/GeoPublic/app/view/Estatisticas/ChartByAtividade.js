Ext.define('GeoPublic.view.Estatisticas.ChartByAtividade', {
	extend : 'Ext.chart.Chart',
	alias : 'widget.startpanelchartbyatividade',
	animate : true,
	shadow : true,
	axes : [{
		type : 'Numeric',
		position : 'top', // 'bottom',
		fields : ['count'],
		label : {
			renderer : Ext.util.Format.numberRenderer('0,0')
		},
		title : 'Envolvimento',
		grid : true,
		minimum : 0
	}, {
		type : 'Category',
		position : 'left',
		fields : ['type']
		// title : 'Tipo de Ocorrência'
	}],
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
	store: 'Estatisticas.ChartByAtividade',
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
