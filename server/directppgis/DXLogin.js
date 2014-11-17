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
			var sql = 'SELECT *, st_x(ponto) as longitude, st_y(ponto) as latitude FROM ' + table, where = '';
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
							if (updateResult.rowCount == 0) {
								console.log('ERROR: session exists, but not on database');
							}
							// posso prolongar mais o cookie (mais uma semana...)
							// request.session.cookie.maxAge = 7 * 24 * 60 * 60 * 1000;
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
			var sql = 'SELECT *, st_x(ponto) as longitude, st_y(ponto) as latitude FROM ' + table, where = '';
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
								request.session.groupid = resultSelect.rows[0].idgrupo;
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
		// console.log(request);
		console.log(request.session);
		if (request.session.userid && request.session.userid > 0) {
			var conn = db.connect();
			var sql = "UPDATE sessao SET datalogout = now() where userid = " + request.session.userid + " and sessionid = '" + sessionID + "'";
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
						// se o cookie tiver sido alterado anteriormente, volta a pô-lo a null
						// o cookie só dura durante a sessão do browser, com maxAge: null
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
		} else {
			console.log('Não deauthenticate, se request.session.userid indefinido');
			callback({
				success : true,
				message : 'Logout already done'
			});
		}
	},
	// para enviar emails:
	// nodemailer (envio)
	// node-email-templates, para a formatação
	registration : function(params, callback, sessionID, request, response) {
		var name = params.name, password = params.password, email = params.email.toLowerCase();
		var token = '';
		var conn = db.connect();

		// console.log(request);
		console.log('registration: request.session.userid = ' + request.session.userid);
		console.log('registration: request.session.lang = ' + request.session.lang);

		var enviarEmail = function(parametros, callback) {
			// envio o email!
			var siteStr = '';
			if (global.App.url) {
				siteStr = global.App.url;
			} else {
				siteStr = 'http://' + request.headers.host;
			}
			var locals = {
				email : email,
				subject : 'Registo',
				saudacao : 'Caro(a)',
				name : name,
				// site : 'http://' + request.headers.host,
				site : siteStr,
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
								from : global.App.from, // 'Jorge Gustavo <jorgegustavo@sapo.pt>',
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
								var siteStr = '';
								if (global.App.url) {
									siteStr = global.App.url;
								} else {
									siteStr = 'http://' + request.headers.host;
								}
								var locals = {
									email : email,
									subject : 'Pedido de nova senha',
									saudacao : result.rows[0].masculino ? 'Caro' : 'Cara',
									name : result.rows[0].nome,
									token : token,
									// site : 'http://' + request.headers.host,
									site : siteStr,
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
													from : global.App.from, // 'Jorge Gustavo <jorgegustavo@sapo.pt>',
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
		fields.push('datamodificacao = $' + i);
		values.push('now()');

		if (request.session.userid) {
			var conn = db.connect();
			conn.query('UPDATE ' + table + ' SET ' + fields.join() + ' WHERE id = ' + request.session.userid, values, function(err, result) {
				if (err) {
					console.log('UPDATE =' + sql + ' Error: ' + err);
					db.debugError(callback, err);
				} else {
					var sql = 'SELECT *, st_x(ponto) as longitude, st_y(ponto) as latitude FROM utilizador where id = ' + request.session.userid;
					conn.query(sql, function(err, resultSelect) {
						db.disconnect(conn);
						if (err) {
							console.log('SQL=' + sql + ' Error: ', err);
							db.debugError(callback, err);
						} else {
							callback({
								success : true,
								message : 'User updated',
								data : resultSelect.rows
							});
						}
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
	updateLocation : function(params, callback, sessionID, request, response) {
		console.log('Session ID = ' + sessionID);

		function isNumber(n) {
			return !isNaN(parseFloat(n)) && isFinite(n);
		};

		var updatestr = '';
		if (isNumber(params.longitude) && isNumber(params.latitude)) {
			updatestr = ' ponto = ST_SetSRID(ST_Point(' + params.longitude + ', ' + params.latitude + '),3763), ';
		} else {
			updatestr = ' ponto = NULL, ';
		}
		updatestr += 'datamodificacao = now() ';
		console.log(updatestr);

		if (request.session.userid) {
			var conn = db.connect();
			conn.query('UPDATE ' + table + ' SET ' + updatestr + ' WHERE id = ' + request.session.userid, function(err, result) {
				if (err) {
					console.log('UPDATE =' + sql + ' Error: ' + err);
					db.debugError(callback, err);
				} else {
					var sql = 'SELECT *, st_x(ponto) as longitude, st_y(ponto) as latitude FROM utilizador where id = ' + request.session.userid;
					conn.query(sql, function(err, resultSelect) {
						db.disconnect(conn);
						if (err) {
							console.log('SQL=' + sql + ' Error: ', err);
							db.debugError(callback, err);
						} else {
							callback({
								success : true,
								message : 'User updated',
								data : resultSelect.rows
							});
						}
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
	 * Applications registered:
	 * https://developers.facebook.com/apps/1425420377699726/dashboard/
	 * https://console.developers.google.com/project/apps~driven-crane-540/apiui/credential
	 * https://account.live.com/developers/applications
	 */
	social : function(params, callback, sessionID, request, response) {
		console.log('+1--------------------------------- facebook ---------------------------+');
		console.log(params);
		var network = 0;
		// facebook, google, windows
		switch (params.network) {
			case 'facebook':
				network = 1;
				break;
			case 'google':
				network = 2;
				break;
			case 'windows':
				network = 3;
				break;
			default:
				console.log('unexpected social network: ' + params.network);
				break;
		}
		var name = params.name, email = params.email.toLowerCase();
		var sexo = (params.gender == "male") ? 1 : 0;
		console.log('+2--------------------------------- facebook ---------------------------+');

		// facebook
		// var morada = params.hometown.name || ''; // erro silencioso! try exception?
		// console.log(morada);
		// ok
		var fotografia = params.picture || '';
		// console.log(fotografia);
		// a fotografia da microsoft tem o token no url; por isso tem que ser mudada na base de dados
		// URL
		console.log('+3--------------------------------- facebook ---------------------------+');

		var logSessionUpdate = function(rows) {
			if (rows[0].id != request.session.userid) {
				console.log("ERRO: rows[0].id = " + rows[0].id + " != request.session.userid = " + request.session.userid);
				callback({
					success : false,
					message : 'Erro: o id do utilizador não coincide com o useid da sessão.'
				});
			} else {
				var sql = "UPDATE sessao SET dataultimaatividade = now(), reaproveitada = reaproveitada+1 where userid = " + request.session.userid + " and sessionid = '" + sessionID + "'";
				conn.query(sql, function(err, updateResult) {
					if (err) {
						console.log('UPDATE =' + sql + ' Error: ' + err);
						db.debugError(callback, err);
					} else {
						if (updateResult.rowCount == 0) {
							// não havia sessao na BD para atualizar?
							// devia existir! só mesmo se a sessao foi apagada da BD entretanto, numa operação de manutenção/teste
							logSession(rows);
						} else {
							db.disconnect(conn);
							callback({
								success : true,
								message : 'Sessão facebook recuperada.',
								data : rows
							});
						}
					}
				});

			}
		};

		var logSession = function(rows) {
			var userid = rows[0].id;
			var campos = ['userid', 'sessionid', 'ip', 'hostname', 'browser', 'socialid'];
			var valores = [userid, sessionID, ip, host, browser, network];
			var buracos = [];
			for ( i = 1; i <= campos.length; i++) {
				buracos.push('$' + i);
			}
			conn.query('INSERT INTO sessao (' + campos.join() + ') VALUES (' + buracos.join() + ')', valores, function(err, resultInsert) {
				db.disconnect(conn);
				// release connection
				if (err) {
					db.debugError(callback, err);
				} else {
					request.session.userid = userid;
					request.session.groupid = rows[0].idgrupo;
					console.log("request.session.userid <-- ", userid);
					callback({
						success : true,
						message : 'Facebook login valid and logged',
						data : rows
					});
				}
			});
		};

		var inserirNovoUtilizador = function() {
			// falta tratar a fotografia do utilizador...

			var campos = ['nome', 'idgrupo', 'observacoes', 'email', 'ativo', 'emailconfirmacao', 'masculino'];
			// Está harcoded o grupo inicial = 5
			var valores = [name, 5, 'Criado a partir da rede social ' + params.network, email, 'true', 'true', sexo];

			if (params.hometown && params.hometown.name && params.hometown.name.trim() !== "") {
				campos.push('morada');
				valores.push(params.hometown.name);
			}
			if (params.picture && params.picture.trim() !== "") {
				campos.push('fotografia');
				valores.push(params.picture);
			}

			var buracos = [];
			for ( i = 1; i <= campos.length; i++) {
				buracos.push('$' + i);
			}
			conn.query('INSERT INTO utilizador (' + campos.join() + ') VALUES (' + buracos.join() + ') RETURNING id', valores, function(err, resultInsert) {
				if (err) {
					db.debugError(callback, err);
				} else {
					console.log('resultInsert = ' + resultInsert.rows[0].id);
					var sql = "SELECT *, st_x(ponto) as longitude, st_y(ponto) as latitude FROM utilizador WHERE id = " + resultInsert.rows[0].id;
					conn.query(sql, function(err, result) {
						if (err) {
							db.debugError(callback, err);
						} else {
							logSession(result.rows);
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

		var conn = db.connect();
		var sql = "SELECT *, st_x(ponto) as longitude, st_y(ponto) as latitude FROM utilizador WHERE email = '" + email + "'";

		console.log('+4--------------------------------- facebook ---------------------------+');
		console.log('+sql ----------------------+' + sql);

		conn.query(sql, function(err, result) {
			if (err) {
				db.debugError(callback, err);
			} else {

				if (result.rows.length == 0) {
					// Ainda não existe este utilizador
					// Ainda não deve existir a sessão registada... penso eu
					inserirNovoUtilizador();
				} else {
					console.log('O utilizador já existe na rede social');
					// O utilizador existe, e pode-se ter registado de várias formas...
					// autenticou-se ou já está autenticado  pelo facebook
					// a sessão pode existir, se ele não fez logout e está autenticado na rede social (voltar a abrir o site)
					// vou testar o request.session.userid, sem testar se existe a entrada na tabela sessao
					if (request.session.userid && request.session.userid > 0) {
						// só se a sessao for apagada da BD é que isto não bate certo...
						logSessionUpdate(result.rows);
					} else {
						logSession(result.rows);
					}
				}
			}
		});

	}
};

module.exports = DXLogin;

// https://apis.live.net/v5.0/1a701f6273d6dd43/picture?access_token=EwB4Aq1DBAAUGCCXc8wU/zFu9QnLdZXy+YnElFkAAXUO/xd7+r2/Pj/+Ucxm+KYx9anFViAGsoaDARbG3OFfGLWW4kIFZDIVbNMdyBPc9pihY7XGpIKYB/QSTJy/21C46Nxjp6PM984ayzwg+z5E44ja97pRAIUOH0wZZ87u4TSOQQ/H3N6czztOftfnANRYUTChFIuavE5vf7peaskvFggiOysR7uuhzPlu90ngdlHMGx9uMxdwB7zIQ1BTs3uEkYdH8bG2lM//CC2+jWm8dVhPGJ7IoiRfZOBkPNdsS4Fe9vPOyg5/4Emi4Sr8u+VhMZOr2Arcma5+NheSIQaCTLyLXvqi3fzgBYsKqtEiIGP6G4hYTEkkj0fIX/y785sDZgAACLbgSUskcijgSAHG+bK7JgRrEmYxHzr4lVqdXM36WjWveDciicihofhlBRgl/yzFziy7tAzdU2KakjgPeVkNofD7GLwOCUN8i6OsnRGQHZD5yBJeQKFkLRDNk+TZ4D0LF/KU7FR3eoNjDLjngdsh7RD/25PEy8zaZgkguImgqxltusxwEJIh5Qka+XvaVPEQg6qhBnbkBM4hcGzQTWm3npQKVB/H7khmZn63ZmU6L8L9ISFaJTKDLmjGz7xG6BycxgI+8fDDH65fCxcZaIux5pPBk1ABAy+XGlWjvAJuEmt081O+W48csXNYznG7oowT4LBysnSHo1pOv98fTi6O/DIUPepCC48Mh3lFSoRYJ+eHCa/9dWfYV+oe4vMNzvQ1QCBNjgSKqJjy3nRYjL0N2AVLE3MostAhxBvNvzZPI+m+1xDc8IaHCqKMSt+dgT0HQi2fTwE=
// https://apis.live.net/v5.0/1a701f6273d6dd43/picture?access_token=EwB4Aq1DBAAUGCCXc8wU/zFu9QnLdZXy+YnElFkAAQAyhV+UpMhuoPFea22da+qMnxzfYomGxEBVNnyosi+B7ezMPY/mW2RXuZyDNk3lqj2V48qDUChdPGsJg/prtv6QkNnxDIH7SX/080m2JHkVrb315KB8ip684S+ungduORuUZ+8R9cP8JfZ9V/NRcAwxEUDff0PH6n0qGFc6A7DUTrBFBV2mB6S+G7YwNDgIF1b/s6oHzOiZleSqwfAIqkML1fck5ajSUtFUwWVjnop5130XLRgRqY4bLQByE6ydMKwBdikOx0cAsnGoFQmDOOa7Q49nNKhcrQdneHo3caSn+avvZ9HgipXDLP8U7N7mk94EiG/AIJRzTKbbFKTbZpYDZgAACI47Pnu8EFA/SAE1oD293TFkVDbzCaY4ZBkqm2adbtYKrkvjbvVGDhMUuvGF5iEPkWqnMS+ksRVxhDTRzMXjCX7AP2EMN0nN+z1o/6lPd2g0DAMXi+siOL6VCZhFecLJ84p+stj/IEFfqsvuV7MuGoyMG3MMD/u2CHWniP/dsmIb0RYX6H2sSQ/H/76hBUWFuhgvhQrHJqsDJNQUDoKg5mBYG2wCPFCs/qCmgnRPSwxSJcADQbpaPTroCZjP5oAQ1wZG/4yWH3OuysslGoyfAzxOx76f+MGQfUBzSbxRveM7bCyhgA1mUp54lZxLd3mM6RTzM2OoUg+6cZoxR+AdkZmp5VDCPnmzeM6X1v1G8nHgJGBMUD04zzKiSDmCFWVR1wV8tsu1QjTWUqU+sOCgjslLc7GqTCPIZRrmq18RG+qQsOheDhRo45UQ4+dRNO1+FnawTwE=