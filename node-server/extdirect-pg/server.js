//Set up common namespace for the application
//As this is the global namespace, it will be available across all modules
if (!global['App']) {
	global.App = {};
}
var express = require('express'), nconf = require('nconf'), http = require('http'), path = require('path'), extdirect = require('extdirect'), db = require('./server-db');
var crypto = require('crypto');
var templatesDir = path.resolve(__dirname, 'templates'), emailTemplates = require('email-templates'), nodemailer = require('nodemailer');
var generatePassword = require('password-generator');

nconf.env().file({
	file : 'server-config.json'
});

var ServerConfig = nconf.get("ServerConfig"), ExtDirectConfig = nconf.get("ExtDirectConfig");
var app = express();
var RedisStore = require('connect-redis')(express);
var redis = require("redis").createClient();

var transport = nodemailer.createTransport("SMTP", {
	service : "Gmail",
	auth : {
		user : "estibordo@gmail.com",
		pass : "79colemil"
	}
});
global.App.transport = transport;
global.App.templates = templatesDir;

/*
 * $ redis-cli
 * redis 127.0.0.1:6379> keys *
 * redis 127.0.0.1:6379> get sess:lfSTwue7iVHtufYIDoTkqkYi
 "{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"}}"
 */

if (ServerConfig.enableSessions) {
	//memory store for sessions - change to different storage here to match your implementation.
	// var store = new express.session.MemoryStore;
	var store = new RedisStore({
		host : 'localhost',
		port : 6379,
		client : redis
	});
}

app.configure(function() {
	app.set('port', process.env.PORT || ServerConfig.port);
	app.use(express.logger(ServerConfig.logger));
	if (ServerConfig.enableUpload) {
		app.use(express.bodyParser({
			uploadDir : ServerConfig.fileUploadFolder
		}));
		//take care of body parsing/multipart/files
	}
	app.use(express.methodOverride());
	if (ServerConfig.enableCompression) {
		app.use(express.compress());
		//Performance - we tell express to use Gzip compression
	}
	if (ServerConfig.enableSessions) {
		//Required for session
		// cookie session cookie settings, defaulting to { path: '/', httpOnly: true, maxAge: null }
		// o cookie só dura durante a sessão do browser, com maxAge: null
		// o cookie não pode ser lido em Javascript, com httpOnly: true.
		// i.é Ext.util.Cookies.get("connect.sid"); não funciona no cliente
		app.use(express.cookieParser());
		app.use(express.session({
			secret : ServerConfig.sessionSecret,
			store : store
		}));
	}
	app.use(express.static(path.join(__dirname, ServerConfig.webRoot)));
});

//CORS Supports
if (ServerConfig.enableCORS) {

	app.use(function(req, res, next) {
		res.header('Access-Control-Allow-Origin', ServerConfig.AccessControlAllowOrigin);
		// allowed hosts
		res.header('Access-Control-Allow-Methods', ServerConfig.AccessControlAllowMethods);
		// what methods should be allowed
		res.header('Access-Control-Allow-Headers', ServerConfig.AccessControlAllowHeaders);
		//specify headers
		res.header('Access-Control-Allow-Credentials', ServerConfig.AccessControlAllowCredentials);
		//include cookies as part of the request if set to true
		res.header('Access-Control-Max-Age', ServerConfig.AccessControlMaxAge);
		//prevents from requesting OPTIONS with every server-side call (value in seconds)

		if (req.method === 'OPTIONS') {
			res.send(204);
		} else {
			next();
		}
	});
}

//GET method returns API
app.get(ExtDirectConfig.apiPath, function(request, response) {
	try {
		var api = extdirect.getAPI(ExtDirectConfig);
		response.writeHead(200, {
			'Content-Type' : 'application/json'
		});
		response.end(api);
	} catch(e) {
		console.log(e);
	}
});

/*
 * To give some feedback to the user, we can redirect him to a feedback page (light), with will redirect him to the application
 * Using this strategy, the user does not see/uses the parameters in the application URL
 */

// app.get('/registo/:id', loadUser, function(req, res, next) {
app.get('/registo/:id', function(req, res, next) {
	console.log('/registo/' + req.params.id);
	// o parametro é só para informar a interface
	// para de poder dar um feedback ao utilizador
	var pg = global.App.database;
	var conn = pg.connect();
	// var sql = "UPDATE utilizador SET datamodificacao = now(), emailconfirmacao = true, token=null where token = '" + req.params.id + "'";
	var sql = "UPDATE utilizador SET datamodificacao = now(), ativo = true, emailconfirmacao = true where token = '" + req.params.id + "'";
	conn.query(sql, function(err, updateResult) {
		console.log(updateResult);
		pg.disconnect(conn);
		// release connection
		if (err || updateResult.rowCount == 0) {
			console.log('UPDATE =' + sql + ' Error: ' + err);
			res.redirect('?action=registo&error=A query pelo token falhou');
		} else {
			res.redirect('?action=registo');
		}
	});
});

app.get('/reset/:id', function(req, res, next) {
	console.log('/reset/' + req.params.id);
	/*
	 * http://development.localhost.lan/reset/e4a247b6dbd054cadfe00857ae0717c625c031184d58db9e7078aa46f1788956
	 * Se apareceu este URL, é porque o utilizador clicou num link que recebeu com o reset da password
	 * Fazemos o seguinte:
	 * i) verificar que existe o token e qual o utilizador/email associado
	 * ii) gerar uma nova password
	 * ii) enviar novo email com uma nova password (que ele depois pode mudar no perfil)
	 */
	var pg = global.App.database;
	var conn = pg.connect();
	var sql = "select * from utilizador where token = '" + req.params.id + "'";
	conn.query(sql, function(err, result) {
		if (err) {
			console.log('SQL =' + sql + ' Error: ' + err);
			// encodeURIComponent()
			res.redirect('?action=reset&error=' + encodeURIComponent('A query pelo token falhou'));
		} else {
			if (result.rowCount == 0) {
				res.redirect('?action=reset&error=' + encodeURIComponent('O token não existe'));
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
						res.redirect('?action=reset&error=Erro ao atualizar o utilizador com a nova senha');
					} else {
						var locals = {
							email : 'info@jorge-gustavo-rocha.pt',
							subject : 'Nova senha de acesso',
							saudacao : 'Caro',
							name : 'Gustavo Rocha',
							password : newpassword,
							callback : function(err, responseStatus) {
								if (err) {
									console.log(err);
								} else {
									console.log(responseStatus.message);
								}
								res.redirect('?action=reset');
								transport.close();
							}
						};
						emailTemplates(templatesDir, function(err, template) {
							if (err) {
								console.log(err);
							} else {
								template('password', locals, function(err, html, text) {
									if (err) {
										console.log(err);
									} else {
										transport.sendMail({
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
		}
	});
});

// Ignoring any GET requests on class path
app.get(ExtDirectConfig.classPath, function(request, response) {
	response.writeHead(200, {
		'Content-Type' : 'application/json'
	});
	response.end(JSON.stringify({
		success : false,
		msg : 'Unsupported method. Use POST instead.'
	}));
});

// POST request process route and calls class
app.post(ExtDirectConfig.classPath, function(request, response) {
	extdirect.processRoute(request, response, ExtDirectConfig);
});

app.configure('development', function() {
	app.use(express.errorHandler({
		dumpExceptions : true,
		showStack : true
	}));
	global.App.mode = 'development';
});

app.configure('production', function() {
	app.use(express.errorHandler());
	global.App.mode = 'production';
});

http.createServer(app).listen(app.get('port'), function() {
	console.log("Express server listening on port %d in %s mode", app.get('port'), app.settings.env);
});