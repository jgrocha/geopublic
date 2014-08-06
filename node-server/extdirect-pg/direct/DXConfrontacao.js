var table = 'infprevia.confrontacao';
var tabela_processo = 'infprevia.pretensoes15julho2010';

var db = global.App.database;
var DXConfrontacao = {
	//callback as last argument is mandatory
	processo : function(params, callback, sessionID, request) {
		console.log('DXConfrontacao.processo Session ID = ' + sessionID);
		// Estou a passar o userid, embora seja desnecessário
		console.log(params);
		// { userid: 31, page: 1, start: 0, limit: 5 }
		var userid = request.session.userid;
		if (request.session.userid) {
			console.log('Utilizador = ' + request.session.userid + ' == ' + userid);
		} else {
			console.log('Sem utilizador');
		}
		var toGeoJson = function(rows) {
			var obj, i;
			obj = {
				type : "FeatureCollection",
				features : []
			};
			for ( i = 0; i < rows.length; i++) {
				var item, feature, geometry;
				item = rows[i];
				geometry = JSON.parse(item.geojson);
				delete item.geojson;
				feature = {
					type : "Feature",
					properties : item,
					geometry : geometry
				};
				obj.features.push(feature);
			}
			return obj;
		};
		var conn = db.connect();
		var sql = 'SELECT nome, ST_AsGeoJSON(geom) as geojson, ' + "'Processo resultante de " + params.processo + "' as designacao" + ' FROM ' + tabela_processo;
		var where = " where nome ilike '%" + params.processo + "%'";
		sql += where;
		//filtering. this example assumes filtering on 1 field, as multiple field where clause requires additional info e.g. chain operator
		if (params.filter) {
			where = " AND " + params.filter[0].property + " LIKE '%" + params.filter[0].value + "%'";
			// set your business logic here to perform advanced where clause
			sql += where;
		}
		// this sample implementation supports 1 sorter, to have more than one, you have to loop and alter query
		sql += ' ORDER BY st_area(geom) desc';
		// Paging
		sql += ' LIMIT ' + params.limit + ' OFFSET ' + params.start;
		console.log(sql);
		conn.query(sql, function(err, result) {
			if (err) {
				console.log('SQL=' + sql + ' Error: ', err);
				db.debugError(callback, err);
			} else {
				//get totals for paging
				var totalQuery = 'SELECT count(*) as totals from ' + tabela_processo + where;
				conn.query(totalQuery, function(err, resultTotalQuery) {
					if (err) {
						console.log('SQL=' + totalQuery + ' Error: ', err);
						db.debugError(callback, err);
					} else {
						db.disconnect(conn);
						//release connection
						callback({
							success : true,
							data : toGeoJson(result.rows),
							total : resultTotalQuery.rows[0].totals // cuidado! Não está a bater certo por causa do LIMIT
						});
					}
				});
			}
		});
	},
	openlayers : [{
		"type" : "rpc",
		"tid" : 7,
		"action" : "DXConfrontacao",
		"method" : "processo",
		"result" : {
			"success" : true,
			"data" : {
				"type" : "FeatureCollection",
				"features" : [{
					"type" : "Feature",
					"properties" : {
						"nome" : "N Processo: 451/09\r\nTipo: LIC",
						"designacao" : "Processo resultante de 451/09"
					},
					"geometry" : {
						"type" : "Polygon",
						"coordinates" : [[[-26964, 97113.8515625], [-26962.3046875, 97110.859375], [-26960.607421875, 97107.8671875], [-26955.369140625, 97098.6328125], [-26945.2421875, 97080.828125], [-26943.4609375, 97077.6640625], [-26939.82421875, 97071.2109375], [-26948.177734375, 97071.6015625], [-26948.15234375, 97073.546875], [-27009.28125, 97074.3671875], [-27070.41015625, 97075.1953125], [-27052.205078125, 96997.7109375], [-27070.607421875, 96992.390625], [-27092.318359375, 96986.34375], [-27107.80859375, 96982.0234375], [-27109.078125, 96985.1875], [-27110.962890625, 96989.4140625], [-27112.41796875, 96992.6171875], [-27115.095703125, 96998.4921875], [-27118.4296875, 97003.0703125], [-27121, 97032.984375], [-27146.640625, 97036.171875], [-27183.517578125, 97040.7578125], [-27184.330078125, 97037.1640625], [-27185.6484375, 97031.3125], [-27194.685546875, 97034.296875], [-27204.275390625, 97037.46875], [-27206.556640625, 97038.625], [-27207.763671875, 97039.828125], [-27208.494140625, 97041.46875], [-27208.525390625, 97043.8984375], [-27206.140625, 97056.4609375], [-27203.7578125, 97069.0234375], [-27203.15625, 97069.875], [-27202.880859375, 97069.96875], [-27201.30078125, 97078.734375], [-27201.142578125, 97078.90625], [-27200.34765625, 97078.59375], [-27199.41015625, 97078.453125], [-27188.58984375, 97076.7578125], [-27176.91015625, 97074.96875], [-27166.716796875, 97073.4375], [-27160.814453125, 97072.5546875], [-27153.51171875, 97071.4375], [-27153.2109375, 97071.4375], [-27152.91015625, 97071.8046875], [-27151.46484375, 97090.2421875], [-27141.978515625, 97091.4609375], [-27086.81640625, 97098.515625], [-27021.357421875, 97106.78125], [-26964, 97113.8515625]]]
					}
				}]
			},
			"total" : "3"
		}
	}],
	read : function(params, callback, sessionID, request) {
		console.log('DXConfrontacao.read Session ID = ' + sessionID);
		// Estou a passar o userid, embora seja desnecessário
		console.log(params);
		// { userid: 31, page: 1, start: 0, limit: 5 }
		var userid = request.session.userid;
		if (request.session.userid) {
			console.log('Utilizador = ' + request.session.userid + ' == ' + userid);
		} else {
			console.log('Sem utilizador');
		}
		var conn = db.connect();
		var sql = 'SELECT * FROM ' + table;
		var where = " WHERE idutilizador = '" + userid + "'";
		if (params.idpretensao) {
			where += " AND idpretensao = " + params.idpretensao;
		}
		sql += where;
		//filtering. this example assumes filtering on 1 field, as multiple field where clause requires additional info e.g. chain operator
		if (params.filter) {
			where = " AND " + params.filter[0].property + " LIKE '%" + params.filter[0].value + "%'";
			// set your business logic here to perform advanced where clause
			sql += where;
		}
		// this sample implementation supports 1 sorter, to have more than one, you have to loop and alter query
		if (params.sort) {
			var s = params.sort[0];
			sql += ' ORDER BY ' + s.property + ' ' + s.direction;
		}
		// Paging
		sql += ' LIMIT ' + params.limit + ' OFFSET ' + params.start;
		console.log(sql);
		conn.query(sql, function(err, result) {
			if (err) {
				console.log('SQL=' + sql + ' Error: ', err);
				db.debugError(callback, err);
			} else {
				//get totals for paging
				var totalQuery = 'SELECT count(*) as totals from ' + table + where;
				conn.query(totalQuery, function(err, resultTotalQuery) {
					if (err) {
						console.log('SQL=' + totalQuery + ' Error: ', err);
						db.debugError(callback, err);
					} else {
						db.disconnect(conn);
						//release connection
						callback({
							success : true,
							data : result.rows,
							total : resultTotalQuery.rows[0].totals // rowsTotal[0].totals
						});
					}
				});
			}
		});
	}
};
module.exports = DXConfrontacao;
