//Set up common namespace for the application
//As this is the global namespace, it will be available across all modules
if (!global['App']) {
	global.App = {};
}
var express = require('express'), //
nconf = require('nconf'), //
http = require('http'), //
path = require('path'), //
extdirect = require('extdirect'), //
db = require('./server-db'), //
fs = require('fs');

var templatesDir = path.resolve(__dirname, 'templates'), //
emailTemplates = require('email-templates');

var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

var routes = require('./routes');

nconf.env().file({
	file : 'server-config.json'
});

var ServerConfig = nconf.get("ServerConfig"), ExtDirectConfig = nconf.get("ExtDirectConfig");
var app = express();
var RedisStore = require('connect-redis')(express);
var redis = require("redis").createClient();

var transport = nodemailer.createTransport(smtpTransport({
    // host: 'mail.cm-agueda.pt',
    // host: 'mail.geomaster.pt',
    host: ServerConfig.smtphost,
    port: ServerConfig.smtpport,
    secure: ServerConfig.smtpsecure,
    tls: {
        rejectUnauthorized: false
    },
    debug: true,
    auth: {
        user: ServerConfig.smtpuser,
        pass: ServerConfig.smtppass
    }
}));

// Deployment url
if (ServerConfig.url) {
	global.App.url = ServerConfig.url;
}

if (ServerConfig.maxparticipation) {
    global.App.maxparticipation = ServerConfig.maxparticipation;
} else {
    global.App.maxparticipation = 1000;
}

console.log(global.App.maxparticipation);

// 'http://cm-agueda.geomaster.pt/ppgis/';
// global.App.from = 'ppgis@geomaster.pt';
global.App.from = ServerConfig.smtpfrom;
global.App.transport = transport;
global.App.templates = templatesDir;

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
			// mesmo depois de fechar o browser Chrome, a sessionID continua a ser a mesma!
			// Não, não. No Ubuntu, o chrome continua ligado! É preciso fechá-lo na barra superior.
			// no Firefox está tudo bem
			// cookie: { maxAge: null }
		}));
	}
	app.use(express.static(path.join(__dirname, ServerConfig.webRoot)));

	console.log('views: ' + path.join(__dirname, 'views'));
	app.set('views', path.join(__dirname, 'views'));
	app.set('view engine', 'jade');
	// ~/bin/favicon.sh traffic-cone-icon-512.png favicon.ico
	// cp favicon.ico ~/git/extdirect.examples/client/GeoPublic
	// app.use(express.favicon());
	app.use(express.favicon(path.join(__dirname, 'public/resources/images/favicon.ico')));
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
		//include node.jss as part of the request if set to true
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

app.get('/translation', function (request, response) {
	console.log('/translation: Session ID = ' + request.sessionID);
	console.log(request.session);

	var buf = '';
	if (request.session && request.session.lang) {
		console.log('→→→ Já existe request.session.lang → ' + request.session.lang);
		console.log('→→→ TENHO QUE MANDAR A QUE ME PEDEM! → ' + request.session.lang);
		buf = fs.readFileSync('./public/resources/languages/' + request.session.lang + '.js', 'utf8');
		response.writeHead(200, {
			'Content-Type': 'application/json; charset=utf-8'
		});
		response.end(buf);
	} else {
		console.log('→→→ Não existe request.session.lang :-(');
		var acceptedLanguages = request.acceptedLanguages; // accepts(request).languages();
		// if request.session.lang exists, we don't care about
		console.log(acceptedLanguages);
		// [ 'pt-PT', 'pt', 'en-US', 'en', 'es', 'fr', 'it' ]
		var exist = 0, i = 0, n = 0;
		if (acceptedLanguages) {
			n = acceptedLanguages.length;
		}

		while (!exist && (i < n)) {
			try {
				console.log('./public/resources/languages/' + acceptedLanguages[i] + '.js');
				buf = fs.readFileSync('./public/resources/languages/' + acceptedLanguages[i] + '.js', 'utf8');
				response.writeHead(200, {
					'Content-Type': 'application/json; charset=utf-8'
				});
				request.session.lang = acceptedLanguages[i];
				console.log('Language ' + request.session.lang + ' added to request.session.lang');
				response.end(buf);
				exist = 1;
			} catch (err) {
				console.log('Language ' + acceptedLanguages[i] + ' not supported.');
				//console.log(err);
			}
			i++;
		}
		if (!exist) {
			console.log('None of the accepted languages is supported');
			buf = fs.readFileSync('./public/resources/languages/en.js', 'utf8');
			response.writeHead(200, {
				'Content-Type': 'application/json; charset=utf-8'
			});
			request.session.lang = 'en';
			console.log('Language ' + request.session.lang + ' added to request.session.lang');
			response.end(buf);

		}
	}
});

/*app.get('/translation', function(request, response) {
	console.log(request.acceptedLanguages);
	console.log(request.session);
	// [ 'pt-PT', 'pt', 'en-US', 'en', 'es', 'fr', 'it' ]
	// testar se existem os ficheiros...
	var exist = 0, i = 0, n = request.acceptedLanguages.length;
	var buf = '';
	while (!exist && (i < n)) {
		try {
			buf = fs.readFileSync('./public/resources/languages/' + request.acceptedLanguages[i] + '.js', 'utf8');
			response.writeHead(200, {
				'Content-Type' : 'application/json'
			});
			request.session.lang = request.acceptedLanguages[i];
			console.log('Language ' + request.session.lang + ' added to request.session.lang');
			response.end(buf);
			exist = 1;
		} catch(err) {
			console.log('Language ' + request.acceptedLanguages[i] + ' not supported');
		}
		i++;
	}
	if (!exist) {
		console.log('None of the accepted languages is supported');
		buf = fs.readFileSync('./public/resources/languages/en.js', 'utf8');
		response.writeHead(200, {
			'Content-Type': 'application/json; charset=utf-8'
		});
		request.session.lang = 'en';
		console.log('Language ' + request.session.lang + ' added to request.session.lang');
		response.end(buf);

	}
});*/

/*
 * To give some feedback to the user, we can redirect him to a feedback page (light), with will redirect him to the application
 * Using this strategy, the user does not see/uses the parameters in the application URL
 */

app.get('/registo/:lang/:id', routes.registo(global.App.database));
app.get('/reset/:lang/:id', routes.reset(global.App.database));

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

var servidor = http.createServer(app).listen(app.get('port'), function() {
	console.log("Express server listening on port %d in %s mode", app.get('port'), app.settings.env);
});

// http://stackoverflow.com/questions/12824612/change-socket-io-static-file-serving-path
if ('production' == process.env.NODE_ENV) {
	var io = require('socket.io').listen(servidor);
	// , { path: '/ppgis/socket.io'});
} else {
	var io = require('socket.io').listen(servidor);
	// , { path: '/ppgis/socket.io'});
}

io.sockets.on('connection', function(socket) {
	console.log('A new user connected!');
	// socket.emit('info', { msg: 'The world is round, there is no up or down.' });
});

io.sockets.on("error", function(err) {
    console.log("Erro apanhado: ");
    console.log(err.stack);
});

global.App.io = io;
