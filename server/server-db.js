var pg = require('pg');
var conString = "";

if ('production' == process.env.NODE_ENV) {
	// global.App.mode pode ainda estar a undefined
	// conString = "postgres://geobox:geomaster2k14@localhost/extdirectnode";
	conString = "postgres://geobox:geobox@localhost:6432/geopublic";
	// em produção deve-se usar o pgbouncer
} else {
    conString = "postgres://geobox:geobox@localhost/geopublic";
    // conString = "postgres://geobox:geobox@euparticipo.cm-agueda.pt/geopublic";
}

// user with read only privileges to test operations with database errors
// var conString = "postgres://readonly:readonly@localhost/extdirectnode";

var myPG = {
	// cf. https://github.com/brianc/node-postgres
	// change to client pooling...

	connect : function() {
		var client = new pg.Client(conString);
		client.connect(function(err) {
			if (err) {
				console.log(err);
				process.exit(1);
			}
		});
		return client;
	},

	disconnect : function(conn) {
		conn.end();
	},

	debugError : function(fn, error) {
		// Generate SOFT error, instead of throwing hard error.
		// We send messages with debug ingo only if in development mode
		console.log(error);
		if (global.App.mode === 'development') {
			fn({
				success : false,
				message : 'Database error'
				/*
				 message : {
				 text : 'Database error',
				 debug : error
				 }
				 */
			});
		} else {
			fn({
				success : false,
				message : 'Unknown error'
				/*
				 message : {
				 text : 'Unknown error',
				 debug : null
				 }
				 */
			});
		}
	}
};

//test db connection and terminate if connection fails
myPG.connect();

global.App.database = myPG;

