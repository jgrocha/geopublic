var table = 'sessao';
var db = global.App.database;
var DXSessao = {
    readMenu: function (params, callback, sessionID, request) {
        console.log('DXSessao.readMenu Session ID = ' + sessionID);
        // Estou a passar o userid, embora seja desnecessário
        console.log(params);
        // { userid: 31, page: 1, start: 0, limit: 5 }
        var userid = params.userid;
        if (request.session.userid) {
            console.log('Utilizador = ' + request.session.userid + ' == ' + userid);
        } else {
            console.log('ERRO: request.session.userid != params.userid');
        }
        var conn = db.connect();
        /*
         select *
         from menu where id IN (
         select idmenu
         from permissao p, utilizador u
         where p.idgrupo = u.idgrupo and id = 31
         )
         order by id;
         */
        var sql = '';
        sql += 'select * ';
        sql += 'from menu where id IN (';
        sql += 'select idmenu ';
        sql += 'from permissao p, utilizador u ';
        sql += 'where p.idgrupo = u.idgrupo and id = ' + userid;
        sql += ') ';
        sql += 'order by id';
        console.log(sql);
        conn.query(sql, function (err, result) {
            if (err) {
                console.log('SQL=' + sql + ' Error: ', err);
                db.debugError(callback, err);
            } else {
                //release connection
                db.disconnect(conn);
                callback({
                    success: true,
                    data: result.rows
                });
            }
        });
    },
    createLayer: function (params, callback, sessionID, request) {
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
            console.log('createLayer: ', params);
            var i = 1, id, fields = [], buracos = [], values = [];
            // se existir um ID, retira-se da lista
            id = params.id;
            delete params.id;
            for (var key in params) {
                fields.push(key);
                buracos.push('$' + i);
                values.push(params[key]);
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
            conn.query('INSERT INTO tema (' + fields.join() + ') VALUES (' + buracos.join() + ') RETURNING id', values, function (err, resultInsert) {
                db.disconnect(conn);
                if (err) {
                    db.debugError(callback, err);
                } else {
                    callback({
                        success: true,
                        message: 'Dados inseridos',
                        data: resultInsert.rows
                    });
                }
            });
        }
    },
    updateLayer: function (params, callback, sessionID, request) {
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
        console.log('updateLayer: ', params);
        var i = 1, id, fields = [], values = [];
        id = params.id;
        delete params.id;
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

        var conn = db.connect();
        conn.query('UPDATE tema SET ' + fields.join() + ' WHERE id = ' + id, values, function (err, result) {
            if (err) {
                console.log('UPDATE =' + sql + ' Error: ' + err);
                db.debugError(callback, err);
            } else {
                var sql = 'SELECT * FROM tema where id = ' + id;
                conn.query(sql, function (err, resultSelect) {
                    db.disconnect(conn);
                    if (err) {
                        console.log('SQL=' + sql + ' Error: ', err);
                        db.debugError(callback, err);
                    } else {
                        callback({
                            success: true,
                            message: 'Dados atualizados',
                            data: resultSelect.rows
                        });
                    }
                });
            }
        });
    },
    destroyLayer: function (params, callback, sessionID, request) {
        // falta proteger só para grupo admin
        // falta remover a pasta que foi criada no método createPlano
        console.log('destroyLayer: ', params.id);
        var conn = db.connect();
        var sql = 'delete FROM tema where id = ' + params.id;
        conn.query(sql, function (err, result) {
            db.disconnect(conn);
            if (err) {
                console.log('SQL=' + sql + ' Error: ', err);
                db.debugError(callback, err);
            } else {
                callback({
                    success: true
                });
            }
        });
    },
    readLayer: function (params, callback, sessionID, request) {
        console.log('DXSessao.readLayer Session ID = ' + sessionID);
        console.log(params);
        var conn = db.connect();
        var sql = 'SELECT * FROM tema';
        var where = '';

        if (params.filter) {
            var compareMap = {
                lt: '<=',
                gt: '>=',
                eq: '='
            };
            var filtros = JSON.parse(params.filter);
            var condicoes = [];
            console.log(filtros);
            for (var k = 0; k < filtros.length; k++) {
                console.log('Filtrar por ' + filtros[k].field);
                switch (filtros[k].type) {
                    case 'string':
                        console.log('filtro sobre o tipo: ' + filtros[k].type + ' com o valor ' + filtros[k].value);
                        condicoes.push(filtros[k].field + " ilike '%" + filtros[k].value + "%'");
                        break;
                    case 'date':
                        console.log('filtro sobre o tipo: ' + filtros[k].type + ' com o valor ' + filtros[k].value);
                        condicoes.push("date_trunc('day', " + filtros[k].field + ') ' + compareMap[filtros[k].comparison] + " '" + filtros[k].value + "'");
                        break;
                    case 'numeric':
                        console.log('filtro sobre o tipo: ' + filtros[k].type + ' com o valor ' + filtros[k].value);
                        condicoes.push(filtros[k].field + ' ' + compareMap[filtros[k].comparison] + ' ' + filtros[k].value);
                        break;
                    case 'boolean':
                        console.log('filtro sobre o tipo: ' + filtros[k].type + ' com o valor ' + filtros[k].value);
                        condicoes.push((filtros[k].value ? ' ' : ' NOT ') + filtros[k].field);
                        break;
                    default:
                        console.log('filtro inesperado sobre o tipo: ' + filtros[k].type);
                        break;
                }
            }
            console.log(condicoes.join(" AND "));
            if (where == '') {
                where = ' WHERE ' + condicoes.join(" AND ");
            } else {
                where = where + ' AND ' + condicoes.join(" AND ");
            }
        }
        var order = '';
        if (params.sort) {
            var s = params.sort[0];
            order = ' ORDER BY ' + s.property + ' ' + s.direction;
        }
        sql += where;
        sql += order;
        // Paging
        sql += ' LIMIT ' + params.limit + ' OFFSET ' + params.start;
        console.log(sql);
        conn.query(sql, function (err, result) {
            if (err) {
                console.log('SQL=' + sql + ' Error: ', err);
                db.debugError(callback, err);
            } else {
                //get totals for paging
                var totalQuery = sql.replace(/SELECT \*/i, 'SELECT count(*) as totals');
                totalQuery = totalQuery.replace(/ order by .+$/i, '');
                totalQuery = totalQuery.replace(/ limit .+$/i, '');
                console.log(totalQuery);
                conn.query(totalQuery, function (err, resultTotalQuery) {
                    if (err) {
                        console.log('SQL=' + totalQuery + ' Error: ', err);
                        db.debugError(callback, err);
                    } else {
                        db.disconnect(conn);
                        //release connection
                        callback({
                            success: true,
                            data: result.rows,
                            total: resultTotalQuery.rows[0].totals // rowsTotal[0].totals
                        });
                    }
                });
            }
        });
    },
    readSessao: function (params, callback, sessionID, request) {
        console.log('DXSessao.readSessao Session ID = ' + sessionID);

        console.log(params);
        // { userid: 31, page: 1, start: 0, limit: 5 }
        // ou
        // { page: 1, start: 0, limit: 5, filter: [ { property: 'hostname', value: 'epl' } ] }
        // { page: 1, start: 0, limit: 20, sort: [ { property: 'hostname', direction: 'DESC' } ] }

        /* sem encoding
         { 'filter[0][field]': 'hostname',
         'filter[0][data][type]': 'string',
         'filter[0][data][value]': 'telepac',
         page: 1,
         start: 0,
         limit: 20 }

         * com encoding
         { filter: '[{"type":"date","comparison":"lt","value":"02/28/2015","field":"datalogin"}]',
         page: 1,
         start: 0,
         limit: 20 }
         */

        console.log('1...');
        var conn = db.connect();
        console.log('2...');
        var sql = 'SELECT * FROM sessao';
        var where = '';

        if (params.hasOwnProperty('userid') && (parseInt(params.userid) > 0)) {
            where = " WHERE userid = '" + params.userid + "'";
        }

        console.log('3...');
        if (params.filter) {
            /*
             [ { type: 'date',
             comparison: 'lt',
             value: '02/28/2015',
             field: 'datalogin' },
             { type: 'date',
             comparison: 'gt',
             value: '02/12/2013',
             field: 'datalogin' },
             { type: 'string', value: '80', field: 'ip' },
             { type: 'string', value: 'telepac', field: 'hostname' } ]
             */
            var compareMap = {
                lt: '<=',
                gt: '>=',
                eq: '='
            };

            var filtros = JSON.parse(params.filter);
            var condicoes = [];
            console.log(filtros);
            for (var k = 0; k < filtros.length; k++) {
                console.log('Filtrar por ' + filtros[k].field);
                switch (filtros[k].type) {
                    case 'string':
                        console.log('filtro sobre o tipo: ' + filtros[k].type + ' com o valor ' + filtros[k].value);
                        condicoes.push(filtros[k].field + " ilike '%" + filtros[k].value + "%'");
                        break;
                    case 'date':
                        console.log('filtro sobre o tipo: ' + filtros[k].type + ' com o valor ' + filtros[k].value);
                        condicoes.push("date_trunc('day', " + filtros[k].field + ') ' + compareMap[filtros[k].comparison] + " '" + filtros[k].value + "'");
                        break;
                    case 'numeric':
                        console.log('filtro sobre o tipo: ' + filtros[k].type + ' com o valor ' + filtros[k].value);
                        condicoes.push(filtros[k].field + ' ' + compareMap[filtros[k].comparison] + ' ' + filtros[k].value);
                        break;
                    default:
                        console.log('filtro inesperado sobre o tipo: ' + filtros[k].type);
                        break;
                }
            }
            console.log(condicoes);
            console.log(condicoes.join(" AND "));

            if (where == '') {
                where = ' WHERE ' + condicoes.join(" AND ");
            } else {
                where = where + ' AND ' + condicoes.join(" AND ");
            }
            // where = " AND " + params.filter[0].property + " LIKE '%" + params.filter[0].value + "%'";
            // set your business logic here to perform advanced where clause
            // sql += where;
        }
        var order = '';
        if (params.sort) {
            var s = params.sort[0];
            order = ' ORDER BY ' + s.property + ' ' + s.direction;
        }
        sql += where;
        sql += order;
        // Paging
        sql += ' LIMIT ' + params.limit + ' OFFSET ' + params.start;
        console.log(sql);
        conn.query(sql, function (err, result) {
            if (err) {
                console.log('SQL=' + sql + ' Error: ', err);
                db.debugError(callback, err);
            } else {
                //get totals for paging
                var totalQuery = sql.replace(/SELECT \*/i, 'SELECT count(*) as totals');
                totalQuery = totalQuery.replace(/ order by .+$/i, '');
                totalQuery = totalQuery.replace(/ limit .+$/i, '');
                console.log(totalQuery);
                conn.query(totalQuery, function (err, resultTotalQuery) {
                    if (err) {
                        console.log('SQL=' + totalQuery + ' Error: ', err);
                        db.debugError(callback, err);
                    } else {
                        db.disconnect(conn);
                        //release connection
                        callback({
                            success: true,
                            data: result.rows,
                            total: resultTotalQuery.rows[0].totals // rowsTotal[0].totals
                        });
                    }
                });
            }
        });
    }
};

module.exports = DXSessao;