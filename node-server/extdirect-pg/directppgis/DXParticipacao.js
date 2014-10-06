var db = global.App.database;
var io = global.App.io;
var mkdirp = require('mkdirp');
var smtpTransport = global.App.transport;
var emailTemplates = require('email-templates');

var enviarEmail = function(destino, parametros, callback) {
	var email = destino.email;
	var name = destino.nome;
	var locals = {
		email : email,
		subject : 'Novo plano para discussão',
		saudacao : 'Caro(a)',
		name : name,
		// site : 'http://' + request.headers.host,
		site : global.App.url,
		callback : function(err, responseStatus) {
			if (err) {
				console.log(responseStatus.message);
				/*
				 callback({
				 success : false,
				 message : 'Falhou o envio para o endereço ' + email + '.'
				 });
				 */
			} else {
				console.log(responseStatus.message);
			}
			callback(parametros);
			smtpTransport.close();
		}
	};
	emailTemplates(global.App.templates, function(err, template) {
		if (err) {
			console.log(err);
		} else {
			template('newplan', locals, function(err, html, text) {
				if (err) {
					console.log(err);
				} else {
					smtpTransport.sendMail({
						// from : 'Jorge Gustavo <jorgegustavo@sapo.pt>',
						to : locals.email,
						subject : locals.subject,
						html : html,
						// generateTextFromHTML: true,
						text : text
					}, locals.callback);
				}
			});
		}
	});
	callback(parametros);
};

var DXParticipacao = {
	createComment : function(params, callback, sessionID, request) {
		/*
		 { idocorrencia: '19',  comentario: 'Se já estás a dormir, bom proveito',  idestado: '' }
		 */
		console.log('Session ID = ' + sessionID, request.session.userid, request.session.groupid);
		console.log('createComment: ', params);

		// special case: the idestado can be empty
		// we remove it from the params
		// an additional trigger will fill it with the previous idestado of the ocorrencia
		if (!(params.idestado && parseInt(params.idestado))) {
			delete params.idestado;
			console.log('params.idestado: ' + params.idestado + ' - deleted');
		}
		var fields = [], values = [];
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
		//
		fields.push('datamodificacao');
		values.push('now()');
		fields.push('idutilizador');
		values.push(request.session.userid);
		var i = 0, buracos = [];
		for ( i = 1; i <= fields.length; i++) {
			buracos.push('$' + i);
		}
		var conn = db.connect();
		conn.query('INSERT INTO ppgis.comentario (' + fields.join() + ') VALUES (' + buracos.join() + ') RETURNING id', values, function(err, resultInsert) {
			// db.disconnect(conn);
			if (err) {
				db.debugError(callback, err);
			} else {
				// var sql = 'SELECT * FROM ppgis.comentario where id = ' + resultInsert.rows[0].id;
				var sql = '';
				sql += 'SELECT c.id, c.comentario, c.datacriacao, now()-c.datacriacao as haquantotempo, u.fotografia, u.nome';
				sql += ' FROM ppgis.comentario c, public.utilizador u ';
				sql += ' where c.id = ' + resultInsert.rows[0].id;
				sql += ' and c.idutilizador = u.id';
				conn.query(sql, function(err, result) {
					if (err) {
						console.log('SQL=' + sql + ' Error: ', err);
						db.debugError(callback, err);
					} else {
						db.disconnect(conn);
						io.emit('comment', {
							msg : 'Novo comentário',
							params : params,
							idutilizador : request.session.userid
						});
						//release connection
						callback({
							success : true,
							data : result.rows, // toJson(result.rows, resultTotalQuery.rows[0].totals),
							total : result.rows.length
						});
					}
				});

				/*
				 callback({
				 success : true,
				 message : 'Comentário registado',
				 data : resultInsert.rows
				 // id : resultInsert.rows[0].id
				 });
				 */
			}
		});
	},
	readComment : function(params, callback, sessionID, request) {
		console.log('readComment: ');
		console.log(params);
		var idocorrencia = params;
		var conn = db.connect();
		var sql = '';
		sql += 'SELECT c.id, c.comentario, c.datacriacao, now()-c.datacriacao as haquantotempo, u.fotografia, u.nome';
		sql += ' FROM ppgis.comentario c, public.utilizador u ';
		sql += ' where idocorrencia = ' + idocorrencia;
		sql += ' and c.idutilizador = u.id';
		conn.query(sql, function(err, result) {
			if (err) {
				console.log('SQL=' + sql + ' Error: ', err);
				db.debugError(callback, err);
			} else {
				//get totals for paging
				var totalQuery = 'SELECT count(*) as totals FROM ppgis.comentario where idocorrencia = ' + idocorrencia;
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
							data : result.rows, // toJson(result.rows, resultTotalQuery.rows[0].totals),
							total : resultTotalQuery.rows[0].totals
						});
					}
				});
			}
		});
	},
	readFotografiaTmp : function(params, callback, sessionID, request) {
		console.log('readFotografiaTmp: ');
		console.log(params);
		var conn = db.connect();

		var sql = "SELECT id, pasta || '/80x80/' || caminho as url, largura, altura, datacriacao FROM ppgis.fotografiatmp where sessionid = '" + sessionID + "'";
		conn.query(sql, function(err, result) {
			if (err) {
				console.log('SQL=' + sql + ' Error: ', err);
				db.debugError(callback, err);
			} else {
				//get totals for paging
				var totalQuery = "SELECT count(*) as totals FROM ppgis.fotografiatmp where sessionid = '" + sessionID + "'";
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
							total : resultTotalQuery.rows[0].totals
						});
					}
				});
			}
		});
	},
	destroyFotografiaTmp : function(params, callback, sessionID, request) {
		console.log('DXParticipacao.destroyFotografiaTmp: ', params);
		//  [ { id: 4 }, { id: 6 }, { id: 5 }, { id: 9 } ]
		// or
		// { id: 3 }
		//
		// isto pode ser evitado (ié pode vir sempre um array)
		// http://localhost/extjs/docs/index.html#!/api/Ext.data.writer.Json
		// The allowSingle configuration can be set to false to force the records to always be encoded in an array, even if there is only a single record being sent.
		var where = [];
		var wherestr = '';
		if (Array.isArray(params)) {
			params.forEach(function(entry) {
				where.push('id = ' + entry.id);
			});
			wherestr = where.join(' OR ');
		} else {
			console.log('Não é um array!');
			wherestr = 'id = ' + params.id;
		}
		console.log(wherestr);
		var conn = db.connect();
		var sql = 'delete FROM ppgis.fotografiatmp where ' + wherestr;
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
	updateFotografiaTmp : function(params, callback, sessionID, request) {
		console.log('DXParticipacao.updateFotografiaTmp');
		console.log(params);
		callback({
			success : true
		});
	},
	createFotografiaTmp : function(params, callback, sessionID, request) {
		console.log('DXParticipacao.createFotografiaTmp');
		console.log(params);
		callback({
			success : true
		});
	},
	readFotografia : function(params, callback, sessionID, request) {
		console.log('readFotografia: ');
		// console.log(arguments);
		console.log(params);
		// { idocorrencia: 1, page: 1, start: 0, limit: 25 }
		var idocorrencia = params.idocorrencia;
		var conn = db.connect();

		var sql = "SELECT id, pasta || '/80x80/' || caminho as url, largura, altura, datacriacao FROM ppgis.fotografia where not inapropriada and idocorrencia = " + idocorrencia;
		conn.query(sql, function(err, result) {
			if (err) {
				console.log('SQL=' + sql + ' Error: ', err);
				db.debugError(callback, err);
			} else {
				//get totals for paging
				var totalQuery = 'SELECT count(*) as totals FROM ppgis.fotografia where not inapropriada and idocorrencia = ' + idocorrencia;
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
							total : resultTotalQuery.rows[0].totals
						});
					}
				});
			}
		});
	},
	destroyFotografia : function(params, callback, sessionID, request) {
		console.log('DXParticipacao.destroyFotografia');
		console.log(params);
	},
	updateFotografia : function(params, callback, sessionID, request) {
		console.log('DXParticipacao.updateFotografia');
		console.log(params);
		callback({
			success : true
		});
	},
	createFotografia : function(params, callback, sessionID, request) {
		console.log('DXParticipacao.createFotografia');
		console.log(params);
		callback({
			success : true
		});
	},
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
		var i, buracos = [];
		for ( i = 1; i <= fields.length; i++) {
			if (fields[i - 1] === 'the_geom') {
				buracos.push('ST_SetSRID(ST_GeomFromGeoJSON($' + i + '), 900913)');
			} else {
				buracos.push('$' + i);
			}
		}
		var rollback = function(client, fn) {
			//terminating a client connection will
			//automatically rollback any uncommitted transactions
			//so while it's not technically mandatory to call
			//ROLLBACK it is cleaner and more correct
			client.query('ROLLBACK', function() {
				client.end();
				fn({
					success : false,
					message : 'Transação interrompida'
				});
			});
		};
		var conn = db.connect();
		// https://github.com/brianc/node-postgres/wiki/Transactions
		conn.query('BEGIN', function(err, result) {
			if (err) {
				console.log('BEGIN', err);
				rollback(conn, callback);
			}
			conn.query('INSERT INTO ppgis.ocorrencia (' + fields.join() + ') VALUES (' + buracos.join() + ') RETURNING id', values, function(err, resultInsert) {
				if (err) {
					console.log('INSERT INTO ppgis.ocorrencia', err);
					rollback(conn, callback);
				}
				var sql = 'insert into ppgis.fotografia (idocorrencia, pasta, caminho, observacoes, idutilizador, tamanho, largura, altura, datacriacao) ';
				sql += 'select ' + resultInsert.rows[0].id + ', pasta, caminho, observacoes, idutilizador, tamanho, largura, altura, datacriacao ';
				sql += 'from ppgis.fotografiatmp ';
				sql += "where sessionid = '" + sessionID + "'";
				conn.query(sql, function(err, result2Insert) {
					if (err) {
						console.log('insert into ppgis.fotografia', err);
						rollback(conn, callback);
					}
					sql = "delete FROM ppgis.fotografiatmp where sessionid = '" + sessionID + "'";
					conn.query(sql, function(err, result) {
						if (err) {
							console.log('delete FROM ppgis.fotografiatmp', err);
							rollback(conn, callback);
						}
						conn.query('COMMIT', function(err, result) {
							db.disconnect(conn);
							io.emit('participation', {
								msg : 'Nova ocorrência',
								params : params,
								idutilizador : request.session.userid
							});
							callback({
								success : true,
								message : 'Ocorrência inserida',
								data : resultInsert.rows,
								dataphoto : result2Insert
							});
						});
					});
				});
			});
		});
	},
	readOcorrencia : function(params, callback, sessionID, request) {
		console.log('DXParticipacao.readOcorrencia');
		console.log(params);
		// podem-se pedir todas as ocorrências ou só uma
		// só uma para acrescentar depois de se inserir ou
		// para se acrecentar quando se recebe uma notificação pelo socket.io
		var where = '';
		if (params.id) {
			where = 'id = ' + params.id;
		}
		if (params.idplano) {
			where = 'idplano = ' + params.idplano;
		}
		var conn = db.connect();
		/*
		 SELECT o.*, e.color, e.icon, ST_AsGeoJSON(the_geom) as geojson, (SELECT COUNT(*) FROM ppgis.comentario c WHERE c.idocorrencia = o.id) AS numcomentarios,
		 now()-o.datacriacao as haquantotempo, u.fotografia, u.nome
		 FROM ppgis.ocorrencia o, ppgis.estado e, public.utilizador u
		 WHERE NOT o.apagado AND o.idplano = 2 and e.id = o.idestado AND e.idplano = o.idplano
		 AND o.idutilizador = u.id
		 */

		var sql = 'SELECT o.*, e.color, e.icon, ST_AsGeoJSON(the_geom) as geojson, (SELECT COUNT(*) FROM ppgis.comentario c WHERE c.idocorrencia = o.id) AS numcomentarios,';
		sql += ' now()-o.datacriacao as haquantotempo, u.fotografia, u.nome';
		sql += ' FROM ppgis.ocorrencia o, ppgis.estado e, public.utilizador u';
		sql += ' WHERE NOT o.apagado AND o.' + where + ' and e.id = o.idestado AND e.idplano = o.idplano';
		sql += ' AND o.idutilizador = u.id';

		// OpenLayers.Geometry.fromWKT("POINT(-4.259215 45.344827)")
		console.log(sql);
		conn.query(sql, function(err, result) {
			if (err) {
				console.log('SQL=' + sql + ' Error: ', err);
				db.debugError(callback, err);
			} else {
				//get totals for paging
				var totalQuery = 'SELECT count(*) as totals FROM ppgis.ocorrencia WHERE NOT apagado AND ';
				totalQuery += where;
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
	/*
	 * EstadoOcorrencia
	 */
	createEstadoOcorrencia : function(params, callback, sessionID, request) {
		// falta proteger só para grupo admin
		/*
		 createPromotor:
		 {
		 { id: 0,
		 idplano: 3,
		 estado: 'Estado',
		 significado: '',
		 color: 'gray',
		 icon: '' }
		 */
		console.log('Session ID = ' + sessionID, request.session.userid, request.session.groupid);
		console.log('createEstadoOcorrencia: ');
		console.log(params);
		var conn = db.connect();
		var sql = 'select max(id) as contador from ppgis.estado where idplano = ' + params.idplano;
		conn.query(sql, function(err, result) {
			if (err) {
				console.log('SQL=' + sql + ' Error: ', err);
				db.debugError(callback, err);
			} else {
				var next = result.rows[0].contador + 1;
				params.id = next;
				var fields = [], values = [];
				for (var key in params) {
					fields.push(key);
					values.push(params[key]);
				}
				var i, buracos = [];
				for ( i = 1; i <= fields.length; i++) {
					buracos.push('$' + i);
				}
				conn.query('INSERT INTO ppgis.estado (' + fields.join() + ') VALUES (' + buracos.join() + ') RETURNING id', values, function(err, resultInsert) {
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
			}
		});
	},
	updateEstadoOcorrencia : function(params, callback, sessionID, request) {
		console.log('updateEstadoOcorrencia');
		console.log(params);
		/*
		 { id: 4,
		 idplano: 1,
		 estado: 'Fechada',
		 significado: 'encerrada',
		 color: '',
		 icon: 'escuro' }
		 */
		console.log('Session ID = ' + sessionID, request.session.userid, request.session.groupid);
		var fields = [], values = [], i = 1;
		var id = params.id;
		delete params.id;
		var idplano = params.idplano;
		delete params.idplano;
		for (var key in params) {
			fields.push(key + '= $' + i);
			values.push(params[key]);
			i = i + 1;
		}
		if (request.session.userid && request.session.groupid <= 1) {
			var conn = db.connect();
			conn.query('UPDATE ppgis.estado SET ' + fields.join() + ' WHERE id = ' + id + ' AND idplano = ' + idplano, values, function(err, result) {
				if (err) {
					console.log('UPDATE =' + sql + ' Error: ' + err);
					db.debugError(callback, err);
				} else {
					var sql = 'SELECT * FROM ppgis.estado where id = ' + id + ' AND idplano = ' + idplano;
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
	destroyEstadoOcorrencia : function(params, callback, sessionID, request) {
		// falta proteger só para grupo admin
		console.log('destroyEstadoOcorrencia: ');
		console.log(params);
		var conn = db.connect();
		var sql = 'delete FROM ppgis.estado where id = ' + params.id + ' AND idplano = ' + params.idplano;
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
	readEstadoOcorrencia : function(params, callback, sessionID, request) {
		console.log('readEstadoOcorrencia: ');
		console.log(params);
		var plano = params.idplano;
		// ???
		var userid = request.session.userid;
		var conn = db.connect();

		var sql = 'select * ';
		sql += ' from ppgis.estado where idplano = ' + plano;
		sql += ' order by id';

		conn.query(sql, function(err, result) {
			if (err) {
				console.log('SQL=' + sql + ' Error: ', err);
				db.debugError(callback, err);
			} else {
				//get totals for paging
				var totalQuery = 'SELECT count(*) as totals from ppgis.estado where idplano = ' + plano;
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
	 * TipoOcorrencia
	 */
	createTipoOcorrencia : function(params, callback, sessionID, request) {
		// falta proteger só para grupo admin
		/*
		 createTipoOcorrencia:
		 {
		 id: 0,
		 designacao: 'Nova entidade',
		 email: 'info@entidade.pt',
		 site: 'http://www.entidade.pt',
		 dataregisto: null }
		 */
		console.log('Session ID = ' + sessionID, request.session.userid, request.session.groupid);
		console.log('createTipoOcorrencia: ', params);
		var conn = db.connect();
		var sql = 'select max(id) as contador from ppgis.tipoocorrencia where idplano = ' + params.idplano;
		conn.query(sql, function(err, result) {
			if (err) {
				console.log('SQL=' + sql + ' Error: ', err);
				db.debugError(callback, err);
			} else {
				var next = result.rows[0].contador + 1;
				params.id = next;
				// isclass exists in Model, but not on DB
				delete params.isclass;
				var fields = [], values = [];
				for (var key in params) {
					fields.push(key);
					values.push(params[key]);
				}
				fields.push('datamodificacao');
				values.push('now()');
				fields.push('idutilizador');
				values.push(request.session.userid);
				var i, buracos = [];
				for ( i = 1; i <= fields.length; i++) {
					buracos.push('$' + i);
				}
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
			}
		});
	},
	updateTipoOcorrencia : function(params, callback, sessionID, request) {
		console.log('Session ID = ' + sessionID, request.session.userid, request.session.groupid);
		console.log('updateTipoOcorrencia: ', params);
		/*
		 { id: 5,
		 idplano: 2,
		 designacao: 'Acidente grave sem feridos',
		 ativa: true,
		 classe: 0,
		 isclass: false }
		 */
		var fields = [], values = [], i = 1;
		var id = params.id;
		delete params.id;
		var idplano = params.idplano;
		delete params.idplano;
		delete params.isclass;
		for (var key in params) {
			fields.push(key + '= $' + i);
			values.push(params[key]);
			i = i + 1;
		}
		fields.push('datamodificacao = $' + i);
		values.push('now()');
		i = i + 1;
		fields.push('idutilizador = $' + i);
		values.push(request.session.userid);
		if (request.session.userid && request.session.groupid <= 1) {
			var conn = db.connect();
			conn.query('UPDATE ppgis.tipoocorrencia SET ' + fields.join() + ' WHERE id = ' + id + ' AND idplano = ' + idplano, values, function(err, result) {
				if (err) {
					console.log('UPDATE Error: ' + err);
					db.debugError(callback, err);
				} else {
					var sql = 'SELECT * FROM ppgis.tipoocorrencia where id = ' + id + ' AND idplano = ' + idplano;
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
		console.log('destroyTipoOcorrencia: ', params);
		var conn = db.connect();
		var sql = 'delete FROM ppgis.tipoocorrencia where id = ' + params.id + ' AND idplano = ' + params.idplano;		
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
		var plano = params.idplano;
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
		// falta proteger user loginado
		// falta proteger só para grupo admin
		/*
		 createPlano:  { id: 0,
		 idpromotor: 1,
		 designacao: 'Plano',
		 descricao: 'Descrição do plano ou projeto',
		 responsavel: 'Pessoa a contactar',
		 email: 'pessoa@entidade.pt',
		 site: 'http://www.entidade.pt/plano',
		 inicio: '2014-09-21T13:30:59',
		 fim: '2014-10-21T13:30:59',
		 wkt: '',
		 geojson: '' }
		 */

		console.log('Session ID = ' + sessionID, request.session.userid, request.session.groupid);
		if (request.session.userid) {
			console.log('createPlano: ', params);
			var i = 1, id, fields = [], buracos = [], values = [];
			// se existir um ID, retira-se da lista
			id = params.id;
			delete params.id;
			for (var key in params) {
				if (key === 'the_geom') {
					fields.push(key);
					buracos.push('ST_SetSRID(ST_GeomFromGeoJSON($' + i + '), 900913)');
					// select ST_SetSRID(ST_GeomFromGeoJSON(''), 900913) // dá erro
					// select ST_SetSRID(ST_GeomFromGeoJSON(null), 900913) // não dá erro
					if (params[key] === '') {
						values.push(null);
					} else {
						values.push(params[key]);
					}
				} else {
					fields.push(key);
					buracos.push('$' + i);
					values.push(params[key]);
				}
				i = i + 1;
			}
			fields.push('datamodificacao');
			buracos.push('$' + i);
			values.push('now()');
			i = i + 1;
			fields.push('idutilizador');
			buracos.push('$' + i);
			values.push(request.session.userid);
			var conn = db.connect();
			conn.query('INSERT INTO ppgis.plano (' + fields.join() + ') VALUES (' + buracos.join() + ') RETURNING id', values, function(err, resultInsert) {
				db.disconnect(conn);
				if (err) {
					db.debugError(callback, err);
				} else {
					// console.log(resultInsert);
					// já tenho um id; já posso criar a pasta
					var pasta = './public/participation_data/' + params.idpromotor + '/' + resultInsert.rows[0].id;
					mkdirp(pasta, function(err) {
						if (err) {
							console.error(err);
							callback({
								success : false,
								message : 'Error creating forders',
								data : resultInsert.rows
							});
						} else {
							// cf. DXFormTest.js, filesubmitinstantaneo
							mkdirp.sync(pasta + '/80x80');
							mkdirp.sync(pasta + '/_x600');
							enviarEmail({
								email : params.email.toLowerCase(),
								nome : params.responsavel
							}, {
								success : true,
								message : 'Dados atualizados',
								data : resultInsert.rows
								// id : resultInsert.rows[0].id
							}, callback);
						}
					});
				}
			});
		}
	},
	updatePlano : function(params, callback, sessionID, request) {
		/*
		 { id: 7,
		 idpromotor: 12,
		 designacao: 'Plano B',
		 descricao: 'Descrição do plano ou projeto',
		 responsavel: 'Pessoa a contactar',
		 email: 'pessoa@entidade.pt',
		 site: 'http://www.entidade.pt/plano',
		 inicio: '2014-09-21T16:17:09',
		 fim: '2014-10-21T16:17:09',
		 geojson: '' }

		 { designacao: 'Plano B', id: 7 }
		 */

		console.log('Session ID = ' + sessionID, request.session.userid, request.session.groupid);
		console.log('updatePlano: ', params);
		var i = 1, id, fields = [], values = [];
		id = params.id;
		delete params.id;
		for (var key in params) {
			if (key === 'the_geom') {
				fields.push(key + ' = ' + 'ST_SetSRID(ST_GeomFromGeoJSON($' + i + '), 900913)');
				// select ST_SetSRID(ST_GeomFromGeoJSON(''), 900913) // dá erro
				// select ST_SetSRID(ST_GeomFromGeoJSON(null), 900913) // não dá erro
				if (params[key] === '') {
					values.push(null);
				} else {
					values.push(params[key]);
				}
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
							if (params.email) {
								// mudou o email; vamos mandar um email a dizer que o plano ficou a apontar para este novo email
								console.log('Está na hora de enviar um email para ' + email);
								enviarEmail({
									email : params.email.toLowerCase(),
									nome : resultSelect.rows[0].responsavel
								}, {
									success : true,
									message : 'Dados atualizados',
									data : resultSelect.rows
								}, callback);
							} else {
								callback({
									success : true,
									message : 'Dados atualizados',
									data : resultSelect.rows
								});
							}
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
		// falta remover a pasta que foi criada no método createPlano
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
		var sql = 'SELECT id, idpromotor, designacao, descricao, responsavel, email, site, inicio, fim, datamodificacao, idutilizador, ST_AsGeoJSON(the_geom) as the_geom FROM ppgis.plano where idpromotor = ' + promotor;
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

		// criar uma pasta para os uploads deste promotor

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
