Ext.define('DemoExtJs.model.InfPrevia.ConfrontacaoPretensao', {
	extend : 'Ext.data.Model',
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
		name : 'parecer', /* 0 ou 1 */
		type : 'string'
	}, {
		name : 'entidade',
		type : 'string'
	}, {
		name : 'sumario',
		type : 'string'
	}]
}); 