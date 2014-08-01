//Set up common namespace for the application
//As this is the global namespace, it will be available across all modules
if (!global['App']) {
	global.App = {};
}
var express = require('express'), nconf = require('nconf'), http = require('http'), path = require('path'), extdirect = require('extdirect'), db = require('./server-db');

var templatesDir = path.resolve(__dirname, 'templates'), emailTemplates = require('email-templates'), nodemailer = require('nodemailer');

var routes = require('./routes');

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

	app.set('views', path.join(__dirname, 'views'));
	app.set('view engine', 'jade');
	// ~/bin/favicon.sh traffic-cone-icon-512.png favicon.ico
	// cp favicon.ico ~/git/extdirect.examples/client/DemoExtJs
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

/*
 * To give some feedback to the user, we can redirect him to a feedback page (light), with will redirect him to the application
 * Using this strategy, the user does not see/uses the parameters in the application URL
 */

app.get('/registo/:id', routes.registo(global.App.database));
app.get('/reset/:id', routes.reset(global.App.database));

app.get('/search', routes.searchProcesso(global.App.database));

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

http.createServer(app).listen(app.get('port'), function() {
	console.log("Express server listening on port %d in %s mode", app.get('port'), app.settings.env);
});
