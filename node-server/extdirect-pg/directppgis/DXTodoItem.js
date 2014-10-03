var table = 'todoitem';
var db = global.App.database;

var DXTodoItem = {
	create : function(params, callback, sessionID) {

		console.log('DXTodoItem.create Session ID = ' + sessionID);

		var conn = db.connect();
		delete params['id'];
		delete params['complete'];
		// convert true, false to 1, 0

		var campos = [];
		var buracos = [];
		var valores = [];
		var i = 1;
		for (var key in params) {
			campos.push(key);
			buracos.push('$' + i);
			valores.push(params[key]);
			i = i + 1;
		}

		conn.query('INSERT INTO ' + table + ' (' + campos.join() + ') VALUES (' + buracos.join() + ') RETURNING id', valores, function(err, result) {
			if (err) {
				db.debugError(callback, err);
			} else {
				conn.query('SELECT * FROM ' + table + ' WHERE id = $1', [result.rows[0].id], function(err, resultAfter, fields) {
					db.disconnect(conn);
					//release connection
					callback({
						success : true,
						data : resultAfter.rows[0]
					});
				});
			}
		});
	},

	//callback as last argument is mandatory
	read : function(params, callback, sessionID, request) {
		console.log('DXTodoItem.read Session ID = ' + sessionID);
		if (request.session.userid) {
			console.log('Utilizador = ' + request.session.userid);
		} else {
			console.log('Sem utilizador');
		}
								
		var conn = db.connect();

		var sql = 'SELECT * FROM ' + table, where = '';

		//filtering. this example assumes filtering on 1 field, as multiple field where clause requires additional info e.g. chain operator

		if (params.filter) {
			where = " WHERE " + params.filter[0].property + " LIKE '%" + params.filter[0].value + "%'";
			// set your business logic here to perform advanced where clause
			sql += where;
		}

		// this sample implementation supports 1 sorter, to have more than one, you have to loop and alter query
		if (params.sort) {
			var s = params.sort[0];
			sql = sql + ' ORDER BY ' + s.property + ' ' + s.direction;
		}

		// Paging
		sql = sql + ' LIMIT ' + params.limit + ' OFFSET ' + params.start;

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
	},

	update : function(params, callback, sessionID) {
		console.log('DXTodoItem.update Session ID = ' + sessionID);
		var conn = db.connect();
		conn.query('UPDATE ' + table + ' SET text = $1 where id = ' + params['id'], [params['text']], function(err, result) {
			db.disconnect(conn);
			//release connection
			if (err) {
				db.debugError(callback, err);
			} else {
				callback({
					success : true
				});
			}
		});
	},

	destroy : function(params, callback, sessionID) {
		console.log('DXTodoItem.update Session ID = ' + sessionID);
		var conn = db.connect();

		conn.query('DELETE FROM ' + table + ' WHERE id = $1', [params['id']], function(err, result) {
			db.disconnect(conn);
			//release connection
			if (err) {
				db.debugError(callback, err);
			} else {
				callback({
					success : result.rowCount === 1, //if row successfully removed, affected row will be equal to 1
					id : params['id']
				});
			}
		});
	}
};

module.exports = DXTodoItem;
