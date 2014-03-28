var table = 'utilizador';
var db = global.App.database;

var dns = require('dns');
var useragent = require('useragent');

var nodemailer = require("nodemailer");

var DXLogin = {
	// method signature has 5 parameters
	/**
	 *
	 * @param params object with received parameters
	 * @param callback callback function to call at the end of current method
	 * @param sessionID - current session ID if "enableSessions" set to true, otherwise null
	 * 	cf. server-config.json and server.js
	 * @param request only if "appendRequestResponseObjects" enabled
	 * @param response only if "appendRequestResponseObjects" enabled
	 */
	alive : function(params, callback, sessionID, request, response) {
		var username = params.username;

		// Boa! Estou a receber um cookie
		// cookies: { 'connect.sid': 's:of4w5hIxGBoZ79sR+UVG4zng.0GbWYAtcoNuEVvbpel4vtd4Vu1wfe8w1vDms7FVlPqM' }
		// cookies: { 'connect.sid': 's:gVR+8yQ9ML7eOFV38smboFq6.sF5SHW/gPnbqBcLqyi3jwrx/2dYvvsBmIwaV28tfryU' },

		// Boa! Estou a receber um sessionID, algo como:
		// sessionID: '7sm4BAJ67Clhwdr73Pg2yk5d'
		// sessionID: 'gVR+8yQ9ML7eOFV38smboFq6',

		console.log('Session ID = ' + sessionID);

		// console.log(params);
		console.log(request.session);
		// console.log(response);

		var conn = db.connect();
		// SELECT * FROM sessao where sessionid = 'ZYUvtrBch65VtzJmU20Y5alu'
		// order by datalogin desc LIMIT 1

		var sql = 'SELECT * FROM sessao ', where = '', order = '';
		where = " WHERE sessionid = '" + sessionID + "'";
		order = " order by datalogin desc LIMIT 1";
		sql += where;
		sql += order;

		console.log('SQL=' + sql);
		conn.query(sql, function(err, result) {
			if (err) {
				console.log('SQL=' + sql + ' Error: ', err);
				db.debugError(callback, err);
			} else {
				// console.log(result.rows);
				// console.log(result.rows.length);
				if (result.rows.length == 0) {
					db.disconnect(conn);
					//release connection
					callback({
						success : true,
						message : 'Session not registered or too old',
						data : []
					});
				} else {
					var sql = 'SELECT * FROM ' + table, where = '';
					where = " WHERE login = '" + result.rows[0].login + "' and ativo and emailconfirmacao";
					sql += where;
					conn.query(sql, function(err, resultUtilizador) {
						if (err) {
							db.debugError(callback, err);
						} else {
							var sql = "UPDATE sessao SET dataultimaatividade = now(), reaproveitada = reaproveitada +1 where sessionid = '" + sessionID + "'";
							conn.query(sql, function(err, updateResult) {
								db.disconnect(conn);
								// release connection
								if (err) {
									console.log('UPDATE =' + sql + ' Error: ' + err);
									db.debugError(callback, err);
								} else {
									callback({
										success : true,
										message : 'Sessão de ' + result.rows[0].datalogin + ' a partir do IP ' + result.rows[0].ip + ' recuperada.',
										data : resultUtilizador.rows
									});
								}
							});

						}
					});
				}
			}
		});
	},

	/*
	 * req.session.cookie.expires = false;
	 * req.session.cookie.maxAge = 5 * 60 * 1000;
	 *
	 * Por defeito, os cookies têm expire a false.
	 * Desaparecem assim que o utilizador fecha o browser.
	 * Se vem um cookie novo, o node.js dá um sessionid novo
	 *
	 * Se o utilizador diz 'estou no meu computador', então altero a validade do cookie.
	 *
	 * Desta forma, em vez de ser eu a guardar algo no storage local do cliente,
	 * a coisa é feita através do mecanismo de cookies existente.
	 *
	 */
	authenticate : function(params, callback, sessionID, request, response) {
		var username = params.username, password = params.password, remember = params.remember;

		// Boa! Estou a receber um cookie
		// cookies: { 'connect.sid': 's:of4w5hIxGBoZ79sR+UVG4zng.0GbWYAtcoNuEVvbpel4vtd4Vu1wfe8w1vDms7FVlPqM' }
		// cookies: { 'connect.sid': 's:gVR+8yQ9ML7eOFV38smboFq6.sF5SHW/gPnbqBcLqyi3jwrx/2dYvvsBmIwaV28tfryU' },
		// Boa! Estou a receber um sessionID, algo como:
		// sessionID: '7sm4BAJ67Clhwdr73Pg2yk5d'
		// sessionID: 'gVR+8yQ9ML7eOFV38smboFq6',

		console.log('Session ID = ' + sessionID);
		var agent = useragent.parse(request.headers['user-agent']);
		var browser = agent.toAgent();
		var os = agent.os.toString();
		var device = agent.device.toString();
		console.log('Useragent detected: ' + browser, os, device);
		var ip = request.ip;
		var host = '';
		// eventualmente por aqui um timeout curto
		// http://stackoverflow.com/questions/10777657/node-js-dns-lookup-how-to-set-timeout
		dns.reverse(ip, function(err, domains) {
			if (err) {
				console.log(err.toString());
				host = err.code;
			} else {
				if (domains.length > 0) {
					host = domains[0];
					console.log(ip, host, browser, os, device);
					agent.toString();
				}
			}
			var conn = db.connect();
			var sql = 'SELECT * FROM ' + table, where = '';
			where = " WHERE login = '" + username + "'  AND password = '" + password + "' and ativo and emailconfirmacao";
			sql += where;

			console.log('SQL=' + sql);
			conn.query(sql, function(err, resultSelect) {
				if (err) {
					console.log('SQL=' + sql + ' Error: ', err);
					db.debugError(callback, err);
				} else {
					// console.log(resultSelect.rows);
					console.log('Linhas retornadas: ', resultSelect.rows.length);
					if (resultSelect.rows.length == 0) {
						db.disconnect(conn);
						//release connection
						callback({
							success : true,
							message : 'Invalid user or password',
							data : []
						});
					} else {
						// vamos gravar na base de dados a hora de login
						var campos = ['login', 'sessionid', 'ip', 'hostname', 'browser'];
						var valores = [username, sessionID, ip, host, browser];
						var buracos = [];
						for ( i = 1; i <= campos.length; i++) {
							buracos.push('$' + i);
						}
						// Por um UPDATE trigger na BD a fechar todas as outras sessões existentes deste utilizador?
						// Por um UPDATE trigger na BD para atualizar utilizador (ultimologin, sessionid)?
						//
						// A menos que seja permitido ter várias sessões em aberto (também podemos usar o IP para saber se são sessões em dispositivos diferentes)
						// Podem ser sessões a partir do mesmo IP, mas com browsers diferentes.
						// insert into sessao (login, sessionid, ip, hostname) values ();
						conn.query('INSERT INTO sessao (' + campos.join() + ') VALUES (' + buracos.join() + ') RETURNING id', valores, function(err, resultInsert) {
							if (err) {
								db.debugError(callback, err);
							} else {
								console.log('request.session.cookie.maxAge = ' + request.session.cookie.maxAge);
								if (remember) {
									request.session.cookie.maxAge = 7 * 24 * 60 * 60 * 1000;
								}
								request.session.user = username;
								conn.query('SELECT * FROM sessao WHERE id = $1', [resultInsert.rows[0].id], function(err, resultIdSessao, fields) {
									db.disconnect(conn);
									//release connection
									// devolve os dados do utilizador (e não a linha da sessao)
									callback({
										success : true,
										message : 'Login logged',
										data : resultSelect.rows
									});
								});
							}
						});
					}
				}
			});
		});

	},
	// req.session.destroy()

	deauthenticate : function(params, callback, sessionID, request, response) {
		console.log('Vai terminar Session ID = ' + sessionID);
		request.session.destroy(function(err) {
			if (err) {
				console.log('Error destroying session: ' + err);
			}
		});
		var conn = db.connect();
		var sql = "UPDATE sessao SET datalogout = now(), ativo = false where sessionid = '" + sessionID + "'";
		conn.query(sql, function(err, updateResult) {
			db.disconnect(conn);
			// release connection
			if (err) {
				console.log('UPDATE =' + sql + ' Error: ' + err);
				db.debugError(callback, err);
			} else {
				callback({
					success : true,
					message : 'Logout successful'
				});
			}
		});
	},
	// para enviar emails:
	// nodemailer (envio)
	// node-email-templates, para a formatação

	registration : function(params, callback, sessionID, request, response) {
		var name = params.name, password = params.password, email = params.email.toLowerCase();

		var enviarEmail = function(parametros, callback) {
			console.log('Vou enviar um email e no fim respondo a quem chamou');
			callback(parametros);
		};

		var inserirNovoUtilizador = function(mensagem, inserirCallback) {
			var campos = ['nome', 'password', 'email', 'ativo', 'emailconfirmacao'];
			var valores = [name, password, email, 'false', 'false'];
			var buracos = [];
			for ( i = 1; i <= campos.length; i++) {
				buracos.push('$' + i);
			}
			conn.query('INSERT INTO utilizador (' + campos.join() + ') VALUES (' + buracos.join() + ') RETURNING id', valores, function(err, resultInsert) {
				if (err) {
					db.debugError(callback, err);
				} else {
					console.log('resultInsert = ' + resultInsert.rows[0].id);
					inserirCallback({
						success : true,
						message : mensagem + ' com o id ' + resultInsert.rows[0].id
					}, callback);
				}
			});
		};

		console.log('Session ID = ' + sessionID);
		var agent = useragent.parse(request.headers['user-agent']);
		var browser = agent.toAgent();
		var os = agent.os.toString();
		var device = agent.device.toString();
		console.log('Useragent detected: ' + browser, os, device);
		var ip = request.ip;
		var host = '';

		/*
		 // mandar um email...
		 // create reusable transport method (opens pool of SMTP connections)
		 var smtpTransport = nodemailer.createTransport("SMTP", {
		 service : "Gmail",
		 auth : {
		 user : "estibordo@gmail.com",
		 pass : "79colemil"
		 }
		 });

		 var mailOptions = {
		 // from: "Gustavo Rocha <estibordo@gmail.com>", // sender address
		 to : "jgr@di.uminho.pt, " + email, // list of receivers
		 subject : "Registo", // Subject line
		 text : "Obrigado por se registar", // plaintext body
		 html : "<b>Obrigado</b> por se registar" // html body
		 };

		 smtpTransport.sendMail(mailOptions, function(error, response) {
		 if (error) {
		 console.log(error);
		 callback({
		 success : false,
		 message : 'Email not sent'
		 });
		 } else {
		 console.log("Message sent: " + response.message);
		 callback({
		 success : true,
		 message : 'Registration successful'
		 });
		 }
		 smtpTransport.close();
		 });
		 */

		var conn = db.connect();
		// se ele já se registou, mas não confirmou o email, escrevemos em cima do que já existe.
		var sql = "SELECT nome, datacriacao, emailconfirmacao FROM utilizador WHERE email = '" + email + "'";
		console.log('SQL=' + sql);
		conn.query(sql, function(err, result) {
			if (err) {
				db.debugError(callback, err);
			} else {
				if (result.rows.length == 0) {
					inserirNovoUtilizador('Utilizador criado na base de dados', enviarEmail);
				} else {
					if (result.rows[0].emailconfirmacao) {
						callback({
							success : false,
							message : 'O email ' + email + ' já está registado pelo ' + result.rows[0].nome + ' desde ' + result.rows[0].datacriacao
						});
					} else {
						// vamos apagar à confiança (???) o registo existente.
						conn.query("DELETE FROM utilizador WHERE email = $1", [email], function(err, result) {
							if (err) {
								db.debugError(callback, err);
							} else {
								inserirNovoUtilizador('Utilizador (re)criado na base de dados', enviarEmail);
							}
						});
					}
				}
			}
		});

	},

	reset : function(params, callback, sessionID, request, response) {
		var email = params.email.toLowerCase();
		console.log('Session ID = ' + sessionID);
		var agent = useragent.parse(request.headers['user-agent']);
		var browser = agent.toAgent();
		var os = agent.os.toString();
		var device = agent.device.toString();
		console.log('Useragent detected: ' + browser, os, device);
		var ip = request.ip;
		var host = '';

		// mandar um email...
		// create reusable transport method (opens pool of SMTP connections)
		var smtpTransport = nodemailer.createTransport("SMTP", {
			service : "Gmail",
			auth : {
				user : "estibordo@gmail.com",
				pass : "79colemil"
			}
		});

		var mailOptions = {
			// from: "Gustavo Rocha <estibordo@gmail.com>", // sender address
			to : "jgr@di.uminho.pt, " + email, // list of receivers
			subject : "Lost password", // Subject line
			text : "Obrigado por se esquecer da password. Ignore caso não tenha perdido a password.", // plaintext body
			html : "<b>Obrigado</b> por se esquecer da password. Ignore caso não tenha perdido a password." // html body
		};

		smtpTransport.sendMail(mailOptions, function(error, response) {
			if (error) {
				console.log(error);
				callback({
					success : false,
					message : 'Email not sent'
				});
			} else {
				console.log("Message sent: " + response.message);
				callback({
					success : true,
					message : 'Password recovered successful'
				});
			}
			smtpTransport.close();
		});

	}
};

module.exports = DXLogin;
