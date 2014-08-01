var pg = require('pg');
var conString = "";

if ('production' == process.env.NODE_ENV) {
	// global.App.mode pode ainda estar a undefined
	conString = "postgres://geobox:geomaster2k14@localhost/extdirectnode";
} else {
	conString = "postgres://geobox:geobox@localhost/extdirectnode";
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

