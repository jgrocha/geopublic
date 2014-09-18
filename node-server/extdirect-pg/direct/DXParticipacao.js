var db = global.App.database;
var DXParticipacao = {
	destroyOcorrencia : function(params, callback, sessionID, request) {
		console.log('DXParticipacao.destroyOcorrencia');
		console.log(params);
	},
	updateOcorrencia : function(params, callback, sessionID, request) {
		console.log('DXParticipacao.updateOcorrencia');
		console.log(params);
		callback({
			success : true
		});

	},
	createOcorrencia : function(params, callback, sessionID, request) {
		console.log('DXParticipacao.createOcorrencia');
		console.log(params);
		callback({
			success : true
		});
	},
	createOcorrencia : function(params, callback, sessionID, request) {
		/*
		 {
		 titulo: 'sfkjh',
		 id_tipo_ocorrencia: 8,
		 participacao: 'sdfasdfasdf',
		 idplano: 1,
		 geojson: '{"type":"Point","coordinates":[-938422.0682167901,4951421.1694373]}'
		 }
		 */
		console.log('Session ID = ' + sessionID, request.session.userid, request.session.groupid);
		console.log('createOcorrencia: ', params);
		var fields = [], values = [];
		// o primeiro parâmetro é a chave (garantido por paramOrder : 'id', em app/model/Promotor.js)
		// o id vem a 0, quando se insere um registo
		for (var key in params) {
			switch (key) {
				case "id":
					break;
					/*
				case "geojson":
					fields.push('the_geom');
					values.push("ST_GeomFromGeoJSON('" + params[key] + "')");
					break;
					*/
				default:
					fields.push(key);
					values.push(params[key]);
					break;
			}
		}
		fields.push('datamodificacao');
		values.push('now()');
		fields.push('idutilizador');
		values.push(request.session.userid);
		var i = 0, buracos = [];
		for ( i = 1; i <= fields.length; i++) {
			if (fields[i-1] === 'the_geom') {
				buracos.push('ST_SetSRID(ST_GeomFromGeoJSON($' + i + '), 900913)');
			} else {
				buracos.push('$' + i);
			}
		}
		var conn = db.connect();
		conn.query('INSERT INTO ppgis.ocorrencia (' + fields.join() + ') VALUES (' + buracos.join() + ') RETURNING id', values, function(err, resultInsert) {
			db.disconnect(conn);
			if (err) {
				db.debugError(callback, err);
			} else {
				callback({
					success : true,
					message : 'Ocorrência inserida',
					data : resultInsert.rows
					// id : resultInsert.rows[0].id
				});
			}
		});
	},
	readOcorrencia : function(params, callback, sessionID, request) {
		console.log('DXParticipacao.readOcorrencia');
		console.log(params);

		var conn = db.connect();
		var sql = 'SELECT *, ST_AsText(the_geom) as wkt, ST_AsGeoJSON(the_geom) as geojson FROM ppgis.ocorrencia';
		// OpenLayers.Geometry.fromWKT("POINT(-4.259215 45.344827)")
		console.log(sql);
		conn.query(sql, function(err, result) {
			if (err) {
				console.log('SQL=' + sql + ' Error: ', err);
				db.debugError(callback, err);
			} else {
				//get totals for paging
				var totalQuery = 'SELECT count(*) as totals FROM ppgis.ocorrencia';
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
							total : resultTotalQuery.rows[0].totals
						});
					}
				});
			}
		});
	},
	readSummitsGeoJSON : function(params, callback, sessionID, request) {
		console.log('DXParticipacao.readSummits');
		console.log(params);
		var toGeoJson = function(rows) {
			var obj, i;
			obj = {
				type : "FeatureCollection",
				features : []
			};
			for ( i = 0; i < rows.length; i++) {
				var id, item, feature, geometry;
				item = rows[i];
				id = item.id;
				geometry = JSON.parse(item.geojson);
				delete item.geojson;
				delete item.id;
				feature = {
					type : "Feature",
					properties : item,
					geometry : geometry,
					id : id
				};
				obj.features.push(feature);
			}
			return obj;
		};
		var conn = db.connect();
		var sql = 'SELECT id, elevation, name, ST_AsGeoJSON(the_geom) as geojson FROM amr.summits';
		console.log(sql);
		conn.query(sql, function(err, result) {
			if (err) {
				console.log('SQL=' + sql + ' Error: ', err);
				db.debugError(callback, err);
			} else {
				//get totals for paging
				var totalQuery = 'SELECT count(*) as totals FROM amr.summits';
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
							total : resultTotalQuery.rows[0].totals
						});
					}
				});
			}
		});
	},
	createTipoOcorrencia : function(params, callback, sessionID, request) {
		// falta proteger só para grupo admin
		/*
		 createPromotor:
		 {
		 id: 0,
		 designacao: 'Nova entidade',
		 email: 'info@entidade.pt',
		 site: 'http://www.entidade.pt',
		 dataregisto: null }
		 */
		console.log('Session ID = ' + sessionID, request.session.userid, request.session.groupid);
		console.log('createTipoOcorrencia: ', params);
		var fields = [], values = [];
		// o primeiro parâmetro é a chave (garantido por paramOrder : 'id', em app/model/Promotor.js)
		// o id vem a 0, quando se insere um registo
		for (var key in params) {
			switch (key) {
				case "id":
					break;
				default:
					fields.push(key);
					values.push(params[key]);
					break;
			}
		}
		fields.push('datamodificacao');
		values.push('now()');
		fields.push('idutilizador');
		values.push(request.session.userid);
		var i = 0, buracos = [];
		for ( i = 1; i <= fields.length; i++) {
			buracos.push('$' + i);
		}
		var conn = db.connect();
		conn.query('INSERT INTO ppgis.tipoocorrencia (' + fields.join() + ') VALUES (' + buracos.join() + ') RETURNING id', values, function(err, resultInsert) {
			db.disconnect(conn);
			if (err) {
				db.debugError(callback, err);
			} else {
				callback({
					success : true,
					message : 'Dados atualizados',
					data : resultInsert.rows
					// id : resultInsert.rows[0].id
				});
			}
		});
	},
	updateTipoOcorrencia : function(params, callback, sessionID, request) {
		console.log('Session ID = ' + sessionID, request.session.userid, request.session.groupid);
		var fields = [], values = [], i = 0, id = 0;
		// o primeiro parâmetro é a chave (garantido por paramOrder : 'id', em app/model/Promotor.js)
		// Está a deixar alterar a dataregisto, mas depois a ideia é não deixar
		for (var key in params) {
			// if (i==0 && key == 'id') {
			if (i == 0) {
				id = params[key];
			} else {
				fields.push(key + '= $' + i);
				values.push(params[key]);
			}
			i = i + 1;
		}
		fields.push('datamodificacao = $' + i);
		values.push('now()');
		i = i + 1;
		fields.push('idutilizador = $' + i);
		values.push(request.session.userid);
		if (request.session.userid && request.session.groupid <= 1) {
			var conn = db.connect();
			conn.query('UPDATE ppgis.tipoocorrencia SET ' + fields.join() + ' WHERE id = ' + id, values, function(err, result) {
				if (err) {
					console.log('UPDATE =' + sql + ' Error: ' + err);
					db.debugError(callback, err);
				} else {
					var sql = 'SELECT * FROM ppgis.tipoocorrencia where id = ' + id;
					conn.query(sql, function(err, resultSelect) {
						db.disconnect(conn);
						if (err) {
							console.log('SQL=' + sql + ' Error: ', err);
							db.debugError(callback, err);
						} else {
							callback({
								success : true,
								message : 'Dados atualizados',
								data : resultSelect.rows
							});
						}
					});
				}
			});
		} else {
			callback({
				success : false,
				message : 'Utilizador sem permissão para alterar os dados.'
			});
		}
	},
	destroyTipoOcorrencia : function(params, callback, sessionID, request) {
		// falta proteger só para grupo admin
		console.log('destroyTipoOcorrencia: ', params.id);
		var conn = db.connect();
		var sql = 'delete FROM ppgis.tipoocorrencia where id = ' + params.id;
		conn.query(sql, function(err, result) {
			db.disconnect(conn);
			if (err) {
				console.log('SQL=' + sql + ' Error: ', err);
				db.debugError(callback, err);
			} else {
				callback({
					success : true
				});
			}
		});
	},
	readTipoOcorrencia : function(params, callback, sessionID, request) {
		console.log('readTipoOcorrencia: ');
		console.log(params);
		var plano = params;
		// ???
		var userid = request.session.userid;
		var conn = db.connect();
		// var sql = 'SELECT * FROM ppgis.tipoocorrencia where idplano = ' + plano;

		var sql = 'select *, CASE WHEN classe IS NULL THEN true ELSE false END as isclass';
		sql += ' from ppgis.tipoocorrencia where idplano = ' + plano;
		sql += ' order by CASE WHEN classe IS NULL THEN id ELSE classe END, classe DESC';

		conn.query(sql, function(err, result) {
			if (err) {
				console.log('SQL=' + sql + ' Error: ', err);
				db.debugError(callback, err);
			} else {
				console.log('SQL=' + sql + ' Error: ', err);
				//get totals for paging
				var totalQuery = 'SELECT count(*) as totals from ppgis.tipoocorrencia where idplano = ' + plano;
				conn.query(totalQuery, function(err, resultTotalQuery) {
					if (err) {
						console.log('SQL=' + totalQuery + ' Error: ', err);
						db.debugError(callback, err);
					} else {
						db.disconnect(conn);
						//release connection
						console.log('Totais: ', result.rows.length, resultTotalQuery.rows[0].totals);
						callback({
							success : true,
							data : result.rows,
							total : resultTotalQuery.rows[0].totals // rowsTotal[0].totals
						});
					}
				});
			}
		});
	},

	createPlano : function(params, callback, sessionID, request) {
		// falta proteger só para grupo admin
		/*
		 createPromotor:
		 {
		 id: 0,
		 designacao: 'Nova entidade',
		 email: 'info@entidade.pt',
		 site: 'http://www.entidade.pt',
		 dataregisto: null }
		 */
		console.log('Session ID = ' + sessionID, request.session.userid, request.session.groupid);
		console.log('createPlano: ', params);
		var fields = [], values = [];
		// o primeiro parâmetro é a chave (garantido por paramOrder : 'id', em app/model/Promotor.js)
		// o id vem a 0, quando se insere um registo
		for (var key in params) {
			switch (key) {
				case "id":
					break;
				default:
					fields.push(key);
					values.push(params[key]);
					break;
			}
		}
		fields.push('datamodificacao');
		values.push('now()');
		fields.push('idutilizador');
		values.push(request.session.userid);
		var i = 0, buracos = [];
		for ( i = 1; i <= fields.length; i++) {
			buracos.push('$' + i);
		}
		var conn = db.connect();
		conn.query('INSERT INTO ppgis.plano (' + fields.join() + ') VALUES (' + buracos.join() + ') RETURNING id', values, function(err, resultInsert) {
			db.disconnect(conn);
			if (err) {
				db.debugError(callback, err);
			} else {
				callback({
					success : true,
					message : 'Dados atualizados',
					data : resultInsert.rows
					// id : resultInsert.rows[0].id
				});
			}
		});
	},
	updatePlano : function(params, callback, sessionID, request) {
		console.log('Session ID = ' + sessionID, request.session.userid, request.session.groupid);
		var fields = [], values = [], i = 0, id = 0;
		// o primeiro parâmetro é a chave (garantido por paramOrder : 'id', em app/model/Promotor.js)
		// Está a deixar alterar a dataregisto, mas depois a ideia é não deixar
		for (var key in params) {
			// if (i==0 && key == 'id') {
			if (i == 0) {
				id = params[key];
			} else {
				fields.push(key + '= $' + i);
				values.push(params[key]);
			}
			i = i + 1;
		}
		fields.push('datamodificacao = $' + i);
		values.push('now()');
		i = i + 1;
		fields.push('idutilizador = $' + i);
		values.push(request.session.userid);
		if (request.session.userid && request.session.groupid <= 1) {
			var conn = db.connect();
			conn.query('UPDATE ppgis.plano SET ' + fields.join() + ' WHERE id = ' + id, values, function(err, result) {
				if (err) {
					console.log('UPDATE =' + sql + ' Error: ' + err);
					db.debugError(callback, err);
				} else {
					var sql = 'SELECT * FROM ppgis.plano where id = ' + id;
					conn.query(sql, function(err, resultSelect) {
						db.disconnect(conn);
						if (err) {
							console.log('SQL=' + sql + ' Error: ', err);
							db.debugError(callback, err);
						} else {
							callback({
								success : true,
								message : 'Dados atualizados',
								data : resultSelect.rows
							});
						}
					});
				}
			});
		} else {
			callback({
				success : false,
				message : 'Utilizador sem permissão para alterar os dados.'
			});
		}
	},
	destroyPlano : function(params, callback, sessionID, request) {
		// falta proteger só para grupo admin
		console.log('destroyPlano: ', params.id);
		var conn = db.connect();
		var sql = 'delete FROM ppgis.plano where id = ' + params.id;
		conn.query(sql, function(err, result) {
			db.disconnect(conn);
			if (err) {
				console.log('SQL=' + sql + ' Error: ', err);
				db.debugError(callback, err);
			} else {
				callback({
					success : true
				});
			}
		});
	},
	readPlano : function(params, callback, sessionID, request) {
		console.log('readPlano: ');
		console.log(params);
		// var promotor = params.params.idpromotor;
		var promotor = params;
		// ???
		var userid = request.session.userid;
		var conn = db.connect();
		var sql = 'SELECT *, ST_AsText(the_geom) as wkt, ST_AsGeoJSON(the_geom) as geojson FROM ppgis.plano where idpromotor = ' + promotor;
		conn.query(sql, function(err, result) {
			if (err) {
				console.log('SQL=' + sql + ' Error: ', err);
				db.debugError(callback, err);
			} else {
				//get totals for paging
				var totalQuery = 'SELECT count(*) as totals from ppgis.plano where idpromotor = ' + promotor;
				conn.query(totalQuery, function(err, resultTotalQuery) {
					if (err) {
						console.log('SQL=' + totalQuery + ' Error: ', err);
						db.debugError(callback, err);
					} else {
						db.disconnect(conn);
						//release connection
						console.log('Totais: ', result.rows.length, resultTotalQuery.rows[0].totals);
						callback({
							success : true,
							data : result.rows,
							total : resultTotalQuery.rows[0].totals // rowsTotal[0].totals
						});
					}
				});
			}
		});
	},

	/*
	 * 		api : {
	 create : 'ExtRemote.DXParticipacao.createPromotor',
	 read : 'ExtRemote.DXParticipacao.readPromotor'
	 update : 'ExtRemote.DXParticipacao.updatePromotor',
	 destroy : 'ExtRemote.DXParticipacao.destroyPromotor'
	 },
	 */
	createPromotor : function(params, callback, sessionID, request) {
		// falta proteger só para grupo admin
		/*
		 createPromotor:
		 {
		 id: 0,
		 designacao: 'Nova entidade',
		 email: 'info@entidade.pt',
		 site: 'http://www.entidade.pt',
		 dataregisto: null }
		 */
		console.log('Session ID = ' + sessionID, request.session.userid, request.session.groupid);
		console.log('createPromotor: ', params);
		var fields = [], values = [];
		// o primeiro parâmetro é a chave (garantido por paramOrder : 'id', em app/model/Promotor.js)
		// o id vem a 0, quando se insere um registo
		for (var key in params) {
			switch (key) {
				case "id":
					break;
				case "dataregisto":
					fields.push(key);
					values.push('now()');
					break;
				default:
					fields.push(key);
					values.push(params[key]);
					break;
			}
		}
		fields.push('datamodificacao');
		values.push('now()');
		fields.push('idutilizador');
		values.push(request.session.userid);
		var i = 0, buracos = [];
		for ( i = 1; i <= fields.length; i++) {
			buracos.push('$' + i);
		}
		var conn = db.connect();
		conn.query('INSERT INTO ppgis.promotor (' + fields.join() + ') VALUES (' + buracos.join() + ') RETURNING id', values, function(err, resultInsert) {
			db.disconnect(conn);
			if (err) {
				db.debugError(callback, err);
			} else {
				callback({
					success : true,
					message : 'Dados atualizados',
					data : resultInsert.rows
					// id : resultInsert.rows[0].id
				});
			}
		});
	},
	updatePromotor : function(params, callback, sessionID, request) {
		console.log('Session ID = ' + sessionID, request.session.userid, request.session.groupid);
		var fields = [], values = [], i = 0, id = 0;
		// o primeiro parâmetro é a chave (garantido por paramOrder : 'id', em app/model/Promotor.js)
		// Está a deixar alterar a dataregisto, mas depois a ideia é não deixar
		for (var key in params) {
			// if (i==0 && key == 'id') {
			if (i == 0) {
				id = params[key];
			} else {
				fields.push(key + '= $' + i);
				values.push(params[key]);
			}
			i = i + 1;
		}
		fields.push('datamodificacao = $' + i);
		values.push('now()');
		i = i + 1;
		fields.push('idutilizador = $' + i);
		values.push(request.session.userid);
		if (request.session.userid && request.session.groupid <= 1) {
			var conn = db.connect();
			conn.query('UPDATE ppgis.promotor SET ' + fields.join() + ' WHERE id = ' + id, values, function(err, result) {
				if (err) {
					console.log('UPDATE =' + sql + ' Error: ' + err);
					db.debugError(callback, err);
				} else {
					var sql = 'SELECT * FROM ppgis.promotor where id = ' + id;
					conn.query(sql, function(err, resultSelect) {
						db.disconnect(conn);
						if (err) {
							console.log('SQL=' + sql + ' Error: ', err);
							db.debugError(callback, err);
						} else {
							callback({
								success : true,
								message : 'Dados atualizados',
								data : resultSelect.rows
							});
						}
					});
				}
			});
		} else {
			callback({
				success : false,
				message : 'Utilizador sem permissão para alterar os dados.'
			});
		}
	},
	destroyPromotor : function(params, callback, sessionID, request) {
		// falta proteger só para grupo admin
		console.log('destroyPromotor: ', params.id);
		var conn = db.connect();
		var sql = 'delete FROM ppgis.promotor where id = ' + params.id;
		conn.query(sql, function(err, result) {
			db.disconnect(conn);
			if (err) {
				console.log('SQL=' + sql + ' Error: ', err);
				db.debugError(callback, err);
			} else {
				callback({
					success : true
				});
			}
		});
	},
	readPromotor : function(params, callback, sessionID, request) {
		console.log(params);
		// { userid: 31, page: 1, start: 0, limit: 5 }
		var userid = request.session.userid;
		var conn = db.connect();
		var sql = 'SELECT * FROM ppgis.promotor';
		conn.query(sql, function(err, result) {
			if (err) {
				console.log('SQL=' + sql + ' Error: ', err);
				db.debugError(callback, err);
			} else {
				//get totals for paging
				var totalQuery = 'SELECT count(*) as totals from ppgis.promotor';
				conn.query(totalQuery, function(err, resultTotalQuery) {
					if (err) {
						console.log('SQL=' + totalQuery + ' Error: ', err);
						db.debugError(callback, err);
					} else {
						db.disconnect(conn);
						//release connection
						console.log('Totais: ', result.rows.length, resultTotalQuery.rows[0].totals);
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

module.exports = DXParticipacao;
