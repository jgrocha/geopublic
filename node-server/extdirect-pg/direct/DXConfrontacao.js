var table = 'infprevia.confrontacao';
var db = global.App.database;
var DXConfrontacao = {
	//callback as last argument is mandatory
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