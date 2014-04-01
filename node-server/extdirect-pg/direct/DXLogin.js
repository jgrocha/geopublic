var table = 'utilizador';
var db = global.App.database;
var dns = require('dns');
var useragent = require('useragent');

var crypto = require('crypto');
var smtpTransport = global.App.transport;
var emailTemplates = require('email-templates');

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
		console.log('Session ID = ' + sessionID);
		console.log(request.session);
		if (request.session.userid) {
			var conn = db.connect();
			var sql = 'SELECT * FROM ' + table, where = '';
			where = " WHERE id = '" + request.session.userid + "' and ativo and emailconfirmacao";
			sql += where;
			conn.query(sql, function(err, resultUtilizador) {
				if (err) {
					db.debugError(callback, err);
				} else {
					var sql = "UPDATE sessao SET dataultimaatividade = now(), reaproveitada = reaproveitada+1 where userid = " + request.session.userid + " and sessionid = '" + sessionID + "'";
					conn.query(sql, function(err, updateResult) {
						db.disconnect(conn);
						if (err) {
							console.log('UPDATE =' + sql + ' Error: ' + err);
							db.debugError(callback, err);
						} else {
							// posso prolongar mais o cookie (mais uma semana...)
							request.session.cookie.maxAge = 7 * 24 * 60 * 60 * 1000;
							callback({
								success : true,
								message : 'Sessão recuperada.',
								data : resultUtilizador.rows
							});
						}
					});

				}
			});
		} else {
			callback({
				success : false,
				message : 'Session not registered or too old'
			});
		}
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
		var email = params.email.toLowerCase(), password = params.password, remember = params.remember;
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
			where = " WHERE email = '" + email + "'  AND password = '" + password + "' and ativo and emailconfirmacao";
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
							success : false,
							message : 'Invalid user or password'
						});
					} else {
						// vamos gravar na base de dados a hora de login
						var campos = ['userid', 'sessionid', 'ip', 'hostname', 'browser'];
						var valores = [resultSelect.rows[0].id, sessionID, ip, host, browser];
						var buracos = [];
						for ( i = 1; i <= campos.length; i++) {
							buracos.push('$' + i);
						}
						// Por um UPDATE trigger na BD a fechar todas as outras sessões existentes deste utilizador?
						// Por um UPDATE trigger na BD para atualizar utilizador (ultimologin, sessionid)?
						//
						// A menos que seja permitido ter várias sessões em aberto (também podemos usar o IP para saber se são sessões em dispositivos diferentes)
						// Podem ser sessões a partir do mesmo IP, mas com browsers diferentes.
						// insert into sessao (userid, sessionid, ip, hostname) values ();
						conn.query('INSERT INTO sessao (' + campos.join() + ') VALUES (' + buracos.join() + ')', valores, function(err, resultInsert) {
							// conn.query('INSERT INTO sessao (' + campos.join() + ') VALUES (' + buracos.join() + ') RETURNING id', valores, function(err, resultInsert) {
							if (err) {
								db.debugError(callback, err);
							} else {
								console.log('request.session.cookie.maxAge = ' + request.session.cookie.maxAge);
								if (remember) {
									request.session.cookie.maxAge = 7 * 24 * 60 * 60 * 1000;
								}
								request.session.userid = resultSelect.rows[0].id;
								callback({
									success : true,
									message : 'Login valid and logged',
									data : resultSelect.rows
								});
							}
						});
					}
				}
			});
		});
	},
	deauthenticate : function(params, callback, sessionID, request, response) {
		console.log('Vai terminar Session ID = ' + sessionID);
		var conn = db.connect();
		var sql = "UPDATE sessao SET datalogout = now(), ativo = false where userid = " + request.session.userid + " and sessionid = '" + sessionID + "'";
		conn.query(sql, function(err, updateResult) {
			db.disconnect(conn);
			// release connection
			if (err) {
				console.log('UPDATE =' + sql + ' Error: ' + err);
				db.debugError(callback, err);
			} else {
				// este session destroy é assíncrono, claro
				// os dados da sessão estão num store e é preciso algum tempo para atualizar o store
				request.session.destroy(function(err) {
					if (err) {
						console.log('Error destroying session: ' + err);
					} else {
						callback({
							success : true,
							message : 'Logout successful'
						});
					}
				});
			}
		});
	},
	// para enviar emails:
	// nodemailer (envio)
	// node-email-templates, para a formatação
	registration : function(params, callback, sessionID, request, response) {
		var name = params.name, password = params.password, email = params.email.toLowerCase();
		var token = '';
		var conn = db.connect();

		var enviarEmail = function(parametros, callback) {
			// envio o email!
			var locals = {
				email : email,
				subject : 'Registo',
				saudacao : 'Caro(a)',
				name : name,
				token : token,
				callback : function(err, responseStatus) {
					if (err) {
						callback({
							success : false,
							message : 'Falhou o envio para o endereço ' + email + '.'
						});
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
					template('registo', locals, function(err, html, text) {
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

		var inserirNovoUtilizador = function(mensagem, inserirCallback) {
			var campos = ['nome', 'idgrupo', 'password', 'email', 'ativo', 'emailconfirmacao', 'token'];
			var valores = [name, 5, password, email, 'false', 'false', token];
			var buracos = [];
			for ( i = 1; i <= campos.length; i++) {
				buracos.push('$' + i);
			}
			conn.query('INSERT INTO utilizador (' + campos.join() + ') VALUES (' + buracos.join() + ') RETURNING id', valores, function(err, resultInsert) {
				db.disconnect(conn);
				// release connection
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

		crypto.randomBytes(32, function(ex, buf) {
			token = buf.toString('hex');
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

		var conn = db.connect();
		// se existe.
		var sql = "SELECT nome, masculino FROM utilizador WHERE email = '" + email + "'";
		console.log('SQL=' + sql);
		conn.query(sql, function(err, result) {
			if (err) {
				db.debugError(callback, err);
			} else {
				if (result.rows.length == 0) {
					callback({
						success : false,
						message : 'O email ' + email + ' não corresponde a nenhum utilizador registado.'
					});
				} else {
					// gero um token
					crypto.randomBytes(32, function(ex, buf) {
						var token = buf.toString('hex');
						// associar token ao utilizador
						var sql = "UPDATE utilizador SET token = '" + token + "', datamodificacao = now() where email = '" + email + "'";
						conn.query(sql, function(err, updateResult) {
							db.disconnect(conn);
							// release connection
							if (err) {
								console.log('UPDATE =' + sql + ' Error: ' + err);
								db.debugError(callback, err);
							} else {
								// envio o email!
								var locals = {
									email : email,
									subject : 'Pedido de nova senha',
									saudacao : result.rows[0].masculino ? 'Caro' : 'Cara',
									name : result.rows[0].nome,
									token : token,
									callback : function(err, responseStatus) {
										if (err) {
											callback({
												success : false,
												message : 'Falhou o envio para o endereço ' + email + '.'
											});
										} else {
											console.log(responseStatus.message);
										}
										callback({
											success : true,
											message : 'O email foi enviado com sucesso.'
										});
										smtpTransport.close();
									}
								};
								emailTemplates(global.App.templates, function(err, template) {
									if (err) {
										console.log(err);
									} else {
										template('reset', locals, function(err, html, text) {
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
							}
						});

					});
				}
			}
		});
	},
	update : function(params, callback, sessionID, request, response) {
		console.log('Session ID = ' + sessionID);
		var fields = [], values = [], i = 1;
		for (var key in params) {
			fields.push(key + '= $' + i);
			values.push(params[key]);
			i = i + 1;
		}
		if (request.session.userid) {
			var conn = db.connect();
			conn.query('UPDATE ' + table + ' SET ' + fields.join() + ' WHERE id = ' + request.session.userid, values, function(err, result) {
				db.disconnect(conn);
				if (err) {
					console.log('UPDATE =' + sql + ' Error: ' + err);
					db.debugError(callback, err);
				} else {
					callback({
						success : true,
						message : 'User updated'
					});
				}
			});
		} else {
			callback({
				success : false,
				message : 'User was not updated'
			});
		}
	},
	/*
	 * Se existir alguém com o email retornado, é simples:
	 * 	i) Escolhe esse utilizador da BD e retorna esse utilizador
	 * 	ii) Eventualmente "vê" se há alguma informação do FB que possa ser acrescentado no perfil do utilizador...
	 * 	ii) Será que o utilizador já lá teve essa informação e removeu-a?
	 * 	iii) Preciso de flag para saber se faz/fez login pelo facebook:
	 * 		só na primeira vez é que copio os dados
	 * 		ou tenho um botão específico, caso tenha sido feito o login via FB
	 *
	 * Se esse email ainda não existir:
	 * 	a) Cria um utilizador, com o email, SEM PASSWORD, e com toda a informação possível do FB
	 * 	b) Retorna esse utilizador
	 */
	
	/*
	 * Muito fixe!
	 * Falta só acrescentar a sessão que acabou de iniciar.
	 */
	facebook : function(params, callback, sessionID, request, response) {
		console.log(params);
		var name = params.name, email = params.email.toLowerCase();
		var sexo = (params.gender == "male") ? 1 : 0;
		var conn = db.connect();

		var inserirNovoUtilizador = function() {
			var campos = ['nome', 'idgrupo', 'password', 'email', 'ativo', 'emailconfirmacao'];
			var valores = [name, 5, 'facebook', email, 'true', 'true'];
			var buracos = [];
			for ( i = 1; i <= campos.length; i++) {
				buracos.push('$' + i);
			}
			conn.query('INSERT INTO utilizador (' + campos.join() + ') VALUES (' + buracos.join() + ') RETURNING id', valores, function(err, resultInsert) {
				if (err) {
					db.debugError(callback, err);
				} else {
					console.log('resultInsert = ' + resultInsert.rows[0].id);
					var sql = "SELECT * FROM utilizador WHERE id = " + resultInsert.rows[0].id;
					conn.query(sql, function(err, result) {
						db.disconnect(conn);
						// release connection
						if (err) {
							db.debugError(callback, err);
						} else {
							request.session.userid = resultInsert.rows[0].id;
							callback({
								success : true,
								message : 'Login valid and logged',
								data : result.rows
							});
						}
					});

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

		var sql = "SELECT * FROM utilizador WHERE email = '" + email + "'";
		conn.query(sql, function(err, result) {
			if (err) {
				db.debugError(callback, err);
			} else {
				if (result.rows.length == 0) {
					// Ainda não existe este utilizador
					inserirNovoUtilizador();
				} else {
					request.session.userid = result.rows;
					callback({
						success : true,
						message : 'Login valid and logged',
						data : result.rows
					});
				}
			}
		});

	}
};

module.exports = DXLogin;
