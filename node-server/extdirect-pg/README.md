####Sample node.js server implementation for Ext.Direct using MySQL database server

First you hve to adjust configuration values inside db-config.json and server.json config files.

Then launch server from commandline : node server.js

This server relies on existence of MySQL server. Adjust your credentials to match user/password on the server as well as provide correct hostname

File schema-mysql.db contains structure and dummy data for reference implementation.
Database name used: extdirectnode

You have to run matching ExtJs/Touch application to see it in action.

<b>Note:</b> this repository does not include any npm modules. After cloning the repository you have to run 'npm install' to retrieve matching modules.

#### Structure

    * Folder 'direct' contains all Direct classes
    * Folder 'uploads' is required if you have intentions of uploading any files via the server.
    * server-config.json - config variables for the server
    * db-config.json - config variables for the database
    * db-config.json - config variables for MySQL server
    * schema-mysql.sql - initial sample data with schema.
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


