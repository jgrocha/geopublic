Ext.define('DemoExtJs.store.InfPrevia.ConfrontacaoPretensao', {
	// extend: 'Ext.data.Store', // GeoExt.data.FeatureStore
	extend : 'GeoExt.data.FeatureStore',
	requires : ['DemoExtJs.model.InfPrevia.ConfrontacaoPretensao'],
	autoLoad : false,
	model : 'DemoExtJs.model.InfPrevia.ConfrontacaoPretensao'
	/*
	 fields : [{
	 name : 'id',
	 type : 'int'
	 }, {
	 name : 'area',
	 type : 'float'
	 }, {
	 name : 'dominio',
	 type : 'string'
	 }, {
	 name : 'subdominio',
	 type : 'string'
	 }, {
	 name : 'familia',
	 type : 'string'
	 }, {
	 name : 'objecto',
	 type : 'string'
	 }, {
	 name : 'ident_gene',
	 type : 'string'
	 }, {
	 name : 'ident_part',
	 type : 'string'
	 }, {
	 name : 'diploma_es',
	 type : 'string'
	 }, {
	 name : 'texto',
	 type : 'string'
	 }, {
	 name : 'parecer',
	 type : 'string'
	 }, {
	 name : 'entidade',
	 type : 'string'
	 }]
	 */
	/*
	 remoteSort:true, //enable remote filter
	 remoteFilter:true, //enable remote sorting
	 pageSize: 5,
	 //autoSync: true, // if operating on model directly this will make double POSTs!
	 model: 'DemoExtJs.model.Confrontacao'
	 // storeId: 'Sessao' // If store Id matches it's class name, may be skipped.
	 */
});

/*
 *
 *
 *         store = Ext.create('GeoExt.data.FeatureStore', {
 layer: vecLayer,
 fields: [
 {
 name: 'symbolizer',
 convert: function(v, r) {
 return r.raw.layer.styleMap.createSymbolizer(r.raw, 'default');
 }
 },
 {name: 'name', type: 'string'},
 {name: 'elevation', type: 'float'}
 ],
 autoLoad: true
 });

 */