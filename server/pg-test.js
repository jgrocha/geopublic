var pg = require('pg');
var connectionString = "pg://geobox:geobox@localhost/geotuga";

function doit(err, client, done) {
    client.query('SELECT nome FROM mcdonalds WHERE nome ilike $1', ['%gui%'], function (err, result) {
        //assert.equal('brianc', result.rows[0].name);
        console.log(result.rows)
        console.log(err);
    });
    client.query('SELECT nome FROM mcdonalds WHERE nome ilike $1', ['braga%'], function (err, result) {
        //assert.equal('brianc', result.rows[0].name);
        console.log(result.rows)
        console.log(err);
    });
    done();  // client idles for 30 seconds before closing
}

pg.connect(connectionString, doit);
pg.end();

