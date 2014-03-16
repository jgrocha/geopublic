####Sample node.js server implementation for Ext.Direct using PostgreSQL database server

First you hve to adjust configuration values inside `server-db.js` and `server-config.json` config files.

Then launch server from commandline : `nodemon server.js`

This server relies on existence of PostgreSQL server. Adjust your credentials to match user/password on the server as well as provide correct hostname

File `schema-pg.sql` contains structure and dummy data for the `todoitem` table.
Database name used: `extdirectnode`.

To run matching ExtJs/Touch application to see it in action, you could do something like:

```bash
cd node-server/extdirect-pg
rm -rf public
ln -s ../../client/DemoExtJs public
mkdir public/uploaded_images
npm install
nodemon server.js
```

<b>Note:</b> this repository does not include any npm modules. You have to run 'npm install' to retrieve matching modules.

#### Structure

    * Folder 'direct' contains all Direct classes
    * Folder 'uploads' is required if you have intentions of uploading any files via the server.
    * server-config.json - config variables for the server
    * schema-pg.sql - initial sample data with schema.
    * server.js - Main server file
    * server-db.js - Database part implementation. If you want to implement different type of database, make any changes to this file

#### Configuring Apache

Is you use Apache proxy to serve the application, you should also configure ExtDirect `server-config.json` to use the same URL and PORT to get the uploads running.

```json
    "ExtDirectConfig": {
        "namespace": "ExtRemote",
        "apiName": "REMOTING_API",
        "apiPath": "/directapi",
        "classPath": "/direct",
        "classPrefix": "DX",
        "_server": "localhost",
        "server": "development.localhost.lan",
        "_port": "3000",
        "port": "80",
        "protocol": "http",
        "relativeUrl": false,
        "appendRequestResponseObjects": true
    }
```

##### Apache virtual host configuration

```
<VirtualHost *:80>
	ServerName development.localhost.lan
	ProxyRequests Off
	# ProxyPreserveHost On
	<Proxy *>
		Order deny,allow
		Allow from all
	</Proxy>
	<Location />
		ProxyPass http://localhost:3000/
		ProxyPassReverse http://localhost:3000/
	</Location>
</VirtualHost>
```


