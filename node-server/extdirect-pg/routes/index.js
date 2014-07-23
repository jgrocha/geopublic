var crypto = require('crypto');
var generatePassword = require('password-generator');

var crypto = require('crypto');
var emailTemplates = require('email-templates');

exports.searchProcesso = function(pg) {
	return function(req, res) {
		console.log('/search' + req.headers.host);
		console.log(req.query);
		/*
		 {
		 format: 'json',
		 bounded: '1',
		 viewboxlbrt: '-8.559,40.495,-8.245,40.695',
		 q: '2001'
		 }
		 */
		var json = JSON.stringify([{
			place_id : "2480029307",
			licence : "Data © OpenStreetMap contributors, ODbL 1.0. http://www.openstreetmap.org/copyright",
			osm_type : "way",
			osm_id : "238558001",
			boundingbox : ["40.5726232", "40.5726954", "-8.445669", "-8.4455675"],
			lat : "40.5726526",
			lon : "-8.4455893",
			display_name : "Praça Conde de Águeda, Mourisca do Vouga, Águeda, 3750-147, Portugal, European Union",
			class : "highway",
			type : "residential",
			importance : 0.2
		}, {
			place_id : "60321452",
			licence : "Data © OpenStreetMap contributors, ODbL 1.0. http://www.openstreetmap.org/copyright",
			osm_type : "way",
			osm_id : "82964789",
			boundingbox : ["40.5725094", "40.5726579", "-8.445945", "-8.445772"],
			lat : "40.5725798",
			lon : "-8.4458583",
			display_name : "Praça Conde de Águeda, Mourisca do Vouga, Águeda, 3750-147, Portugal, European Union",
			class : "highway",
			type : "pedestrian",
			importance : 0.2
		}, {
			place_id : "71495153",
			licence : "Data © OpenStreetMap contributors, ODbL 1.0. http://www.openstreetmap.org/copyright",
			osm_type : "way",
			osm_id : "114352337",
			boundingbox : ["40.5676313", "40.5679289", "-8.3576997", "-8.3575234"],
			lat : "40.5679289",
			lon : "-8.3575234",
			display_name : "Conde Jose de Sucena, Talhada, Portugal",
			class : "highway",
			type : "tertiary",
			importance : 0.2
		}]);
		res.writeHead(200, {
			'Content-Type' : 'application/json; charset=utf-8'
		});
		res.end(req.query.json_callback + '(' + json + ')');
	};
};

/*
 * HTTP/1.1 200 OK
Date: Wed, 23 Jul 2014 23:10:09 GMT
Server: Apache
X-Powered-By: PHP/5.3.3
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: OPTIONS,GET
Vary: Accept-Encoding,User-Agent
Content-Encoding: gzip
Content-Length: 421
Keep-Alive: timeout=5, max=83
Connection: Keep-Alive
Content-Type: application/javascript; charset=UTF-8
 */

/* meu...
 * 
 * HTTP/1.1 200 OK
Date: Wed, 23 Jul 2014 23:08:09 GMT
X-Powered-By: Express
Vary: Accept-Encoding
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET,PUT,POST,DELETE,OPTIONS
Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept
Access-Control-Allow-Credentials: true
Access-Control-Max-Age: 3600
Content-Type: application/json; charset=utf-8
Keep-Alive: timeout=5, max=99
Connection: Keep-Alive
Transfer-Encoding: chunked
 */

/*
 x = Ext.data.JsonP.callback2([{
 "place_id" : "2480029307",
 "licence" : "Data \u00a9 OpenStreetMap contributors, ODbL 1.0. http:\/\/www.openstreetmap.org\/copyright",
 "osm_type" : "way",
 "osm_id" : "238558001",
 "boundingbox" : ["40.5726232", "40.5726954", "-8.445669", "-8.4455675"],
 "lat" : "40.5726526",
 "lon" : "-8.4455893",
 "display_name" : "Pra\u00e7a Conde de \u00c1gueda, Mourisca do Vouga, \u00c1gueda, 3750-147, Portugal, European Union",
 "class" : "highway",
 "type" : "residential",
 "importance" : 0.2
 }, {
 "place_id" : "60321452",
 "licence" : "Data \u00a9 OpenStreetMap contributors, ODbL 1.0. http:\/\/www.openstreetmap.org\/copyright",
 "osm_type" : "way",
 "osm_id" : "82964789",
 "boundingbox" : ["40.5725094", "40.5726579", "-8.445945", "-8.445772"],
 "lat" : "40.5725798",
 "lon" : "-8.4458583",
 "display_name" : "Pra\u00e7a Conde de \u00c1gueda, Mourisca do Vouga, \u00c1gueda, 3750-147, Portugal, European Union",
 "class" : "highway",
 "type" : "pedestrian",
 "importance" : 0.2
 }, {
 "place_id" : "71495153",
 "licence" : "Data \u00a9 OpenStreetMap contributors, ODbL 1.0. http:\/\/www.openstreetmap.org\/copyright",
 "osm_type" : "way",
 "osm_id" : "114352337",
 "boundingbox" : ["40.5676313", "40.5679289", "-8.3576997", "-8.3575234"],
 "lat" : "40.5679289",
 "lon" : "-8.3575234",
 "display_name" : "Conde Jose de Sucena, Talhada, Portugal",
 "class" : "highway",
 "type" : "tertiary",
 "importance" : 0.2
 }, {
 "place_id" : "2481903210",
 "licence" : "Data \u00a9 OpenStreetMap contributors, ODbL 1.0. http:\/\/www.openstreetmap.org\/copyright",
 "osm_type" : "way",
 "osm_id" : "116884204",
 "boundingbox" : ["40.5131137", "40.5132446", "-8.4982913", "-8.4970647"],
 "lat" : "40.5131177",
 "lon" : "-8.4979678",
 "display_name" : "Rua Conde Ferreira, Oliveira do Bairro, Portugal, European Union",
 "class" : "highway",
 "type" : "residential",
 "importance" : 0.2
 }, {
 "place_id" : "64718957",
 "licence" : "Data \u00a9 OpenStreetMap contributors, ODbL 1.0. http:\/\/www.openstreetmap.org\/copyright",
 "osm_type" : "way",
 "osm_id" : "98045235",
 "boundingbox" : ["40.5551795", "40.5567493", "-8.4357572", "-8.433464"],
 "lat" : "40.555765",
 "lon" : "-8.4346041",
 "display_name" : "Rua Conde Sucena, Borralha, 3750-000, Portugal",
 "class" : "highway",
 "type" : "residential",
 "importance" : 0.2
 }, {
 "place_id" : "65324430",
 "licence" : "Data \u00a9 OpenStreetMap contributors, ODbL 1.0. http:\/\/www.openstreetmap.org\/copyright",
 "osm_type" : "way",
 "osm_id" : "97752353",
 "boundingbox" : ["40.5567493", "40.5581126", "-8.4376235", "-8.4357572"],
 "lat" : "40.557257",
 "lon" : "-8.4364979",
 "display_name" : "Rua Conde Sucena, Borralha, 3750-863, Portugal",
 "class" : "highway",
 "type" : "residential",
 "importance" : 0.2
 }, {
 "place_id" : "78510554",
 "licence" : "Data \u00a9 OpenStreetMap contributors, ODbL 1.0. http:\/\/www.openstreetmap.org\/copyright",
 "osm_type" : "way",
 "osm_id" : "131306560",
 "boundingbox" : ["40.5429305", "40.5458347", "-8.5386197", "-8.53804"],
 "lat" : "40.5444203",
 "lon" : "-8.5383622",
 "display_name" : "Rua Conde de \u00c1gueda, Oi\u00e3, Portugal, European Union",
 "class" : "highway",
 "type" : "residential",
 "importance" : 0.2
 }, {
 "place_id" : "62689594",
 "licence" : "Data \u00a9 OpenStreetMap contributors, ODbL 1.0. http:\/\/www.openstreetmap.org\/copyright",
 "osm_type" : "way",
 "osm_id" : "93392852",
 "boundingbox" : ["40.5605916", "40.5607658", "-8.4405658", "-8.4381763"],
 "lat" : "40.5607409",
 "lon" : "-8.4394117",
 "display_name" : "Rua Conde Caldeira, Borralha, 3750-859, Portugal",
 "class" : "highway",
 "type" : "residential",
 "importance" : 0.2
 }, {
 "place_id" : "2482713822",
 "licence" : "Data \u00a9 OpenStreetMap contributors, ODbL 1.0. http:\/\/www.openstreetmap.org\/copyright",
 "osm_type" : "way",
 "osm_id" : "240253364",
 "boundingbox" : ["40.5118286", "40.5132205", "-8.4970467", "-8.4963624"],
 "lat" : "40.5122332",
 "lon" : "-8.4970085",
 "display_name" : "Travessa Conde Ferreira, Oliveira do Bairro, Portugal, European Union",
 "class" : "highway",
 "type" : "service",
 "importance" : 0.175
 }, {
 "place_id" : "59900263",
 "licence" : "Data \u00a9 OpenStreetMap contributors, ODbL 1.0. http:\/\/www.openstreetmap.org\/copyright",
 "osm_type" : "way",
 "osm_id" : "82804598",
 "boundingbox" : ["40.5752583", "40.5762939", "-8.4488941", "-8.4481709"],
 "lat" : "40.5758798448712",
 "lon" : "-8.44845773334242",
 "display_name" : "Jardim Conde de Sucena, Rua da Misericordia, P\u00f3voa da Igreja, Mourisca do Vouga, \u00c1gueda, 3750-103, Portugal, European Union",
 "class" : "leisure",
 "type" : "park",
 "importance" : 0.101
 }, {
 "place_id" : "9797568",
 "licence" : "Data \u00a9 OpenStreetMap contributors, ODbL 1.0. http:\/\/www.openstreetmap.org\/copyright",
 "osm_type" : "node",
 "osm_id" : "960916898",
 "boundingbox" : [40.5729139, 40.5730139, -8.4449927, -8.4448927],
 "lat" : "40.5729639",
 "lon" : "-8.4449427",
 "display_name" : "Hotel Conde de \u00c1gueda, Rua Ant\u00f3nio Ferreira Sucena, Mourisca do Vouga, \u00c1gueda, 3750-165, Portugal, European Union",
 "class" : "tourism",
 "type" : "hotel",
 "importance" : 0.101,
 "icon" : "http:\/\/open.mapquestapi.com\/nominatim\/v1\/images\/mapicons\/accommodation_hotel2.p.20.png"
 }, {
 "place_id" : "18042309",
 "licence" : "Data \u00a9 OpenStreetMap contributors, ODbL 1.0. http:\/\/www.openstreetmap.org\/copyright",
 "osm_type" : "node",
 "osm_id" : "1694943365",
 "boundingbox" : [40.5757801, 40.5758801, -8.4484805, -8.4483805],
 "lat" : "40.5758301",
 "lon" : "-8.4484305",
 "display_name" : "Conde Sucena, Rua da Misericordia, P\u00f3voa da Igreja, Mourisca do Vouga, \u00c1gueda, 3750-103, Portugal, European Union",
 "class" : "historic",
 "type" : "memorial",
 "importance" : 0.101,
 "icon" : "http:\/\/open.mapquestapi.com\/nominatim\/v1\/images\/mapicons\/tourist_monument.p.20.png"
 }, {
 "place_id" : "64035871",
 "licence" : "Data \u00a9 OpenStreetMap contributors, ODbL 1.0. http:\/\/www.openstreetmap.org\/copyright",
 "osm_type" : "way",
 "osm_id" : "95032433",
 "boundingbox" : ["40.5755387", "40.5760846", "-8.4499742", "-8.4490594"],
 "lat" : "40.5758122411818",
 "lon" : "-8.4494639896185",
 "display_name" : "Hospital Distrital de \u00c1gueda, 261, Rua da Misericordia, P\u00f3voa da Igreja, Mourisca do Vouga, \u00c1gueda, 3750-130 Agueda, Portugal, European Union",
 "class" : "amenity",
 "type" : "hospital",
 "importance" : 0.001,
 "icon" : "http:\/\/open.mapquestapi.com\/nominatim\/v1\/images\/mapicons\/health_hospital.p.20.png"
 }]);
 */

exports.registo = function(pg) {
	return function(req, res) {
		console.log('/registo/' + req.params.id + ' ' + req.headers.host);
		var conn = pg.connect();
		var sql = "select * from utilizador where token = '" + req.params.id + "'";
		conn.query(sql, function(err, result) {
			if (err || result.rowCount == 0) {
				console.log('SQL =' + sql + ' Error: ' + err);
				pg.disconnect(conn);
				res.render('registo', {
					title : 'Registo de utilizadores',
					site : 'http://' + req.headers.host
				});
			} else {
				var sql = "UPDATE utilizador SET datamodificacao = now(), emailconfirmacao = true, token=null ";
				sql += " where token = '" + req.params.id + "'";
				conn.query(sql, function(err, updateResult) {
					console.log(updateResult);
					pg.disconnect(conn);
					// release connection
					if (err || updateResult.rowCount == 0) {
						console.log('UPDATE =' + sql + ' Error: ' + err);
						res.render('registo', {
							title : 'Registo de utilizadores',
							site : 'http://' + req.headers.host
						});
					} else {
						res.render('registo', {
							title : 'Registo de utilizadores',
							site : 'http://' + req.headers.host,
							user : {
								name : result.rows[0].nome,
								email : result.rows[0].email
							}
						});
					}
				});
			}
		});
	};
};

exports.reset = function(pg) {
	return function(req, res) {
		console.log('/reset/' + req.params.id);
		/*
		 * http://development.localhost.lan/reset/e4a247b6dbd054cadfe00857ae0717c625c031184d58db9e7078aa46f1788956
		 * Se apareceu este URL, é porque o utilizador clicou num link que recebeu com o reset da password
		 * Fazemos o seguinte:
		 * i) verificar que existe o token e qual o utilizador/email associado
		 * ii) gerar uma nova password
		 * ii) enviar novo email com uma nova password (que ele depois pode mudar no perfil)
		 */
		var conn = pg.connect();
		var sql = "select * from utilizador where token = '" + req.params.id + "'";
		conn.query(sql, function(err, result) {
			if (err || result.rowCount == 0) {
				console.log('SQL =' + sql + ' Error: ' + err);
				pg.disconnect(conn);
				res.render('reset', {
					title : 'Reposição da senha',
					site : 'http://' + req.headers.host
				});
			} else {
				var newpassword = generatePassword();
				var shasum = crypto.createHash('sha1');
				shasum.update(newpassword);
				var encrypted = shasum.digest('hex');
				// token should be removed, to prevent duplicated tokens
				var sqlUpdate = "UPDATE utilizador SET datamodificacao = now(), token = NULL, password = '" + encrypted + "' where token = '" + req.params.id + "'";
				conn.query(sqlUpdate, function(err, updateResult) {
					pg.disconnect(conn);
					// release connection
					if (err || updateResult.rowCount == 0) {
						console.log('UPDATE =' + sqlUpdate + ' Error: ' + err);
						res.render('reset', {
							title : 'Reposição da senha',
							site : 'http://' + req.headers.host
						});
					} else {
						var locals = {
							saudacao : result.rows[0].masculino ? 'Caro' : 'Cara',
							name : result.rows[0].nome,
							email : result.rows[0].email, //  'info@jorge-gustavo-rocha.pt',
							subject : 'Nova senha de acesso',
							site : 'http://' + req.headers.host,
							password : newpassword,
							callback : function(err, responseStatus) {
								if (err) {
									console.log(err);
								} else {
									console.log(responseStatus.message);
								}
								res.render('reset', {
									title : 'Registo de utilizadores',
									site : 'http://' + req.headers.host,
									user : {
										name : result.rows[0].nome,
										email : result.rows[0].email
									}
								});
								global.App.transport.close();
							}
						};
						emailTemplates(global.App.templates, function(err, template) {
							if (err) {
								console.log(err);
							} else {
								template('password', locals, function(err, html, text) {
									if (err) {
										console.log(err);
									} else {
										global.App.transport.sendMail({
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
			}
		});
	};
};
