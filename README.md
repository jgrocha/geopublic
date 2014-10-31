### Deploy on the cloud 

The following instructions were used to deploy the application on a dedicated Ubuntu server, with 14.04 installed.

After deploying, the application should be available at (http://10.15.5.233:3003)

#### Create and power up an instance on openStack

Instructions in `STORM_Accessing Storm Clouds Platform %40 HP IIC.docx` document.

#### Connect to the instance using its IP

After connecting to the VPN, you can connect to the server.

```bash
ssh -i ~/.ssh/agueda-openssh.ppk -X ubuntu@10.15.5.233
```

#### Preparation

```bash
echo "127.0.0.1 ppgis" | sudo tee -a /etc/hosts
sudo apt-get update
sudo apt-get upgrade

sudo apt-get install redis-server
sudo apt-get install build-essential subversion
```

One language package should be installed. PostgreSQL will not create the initial database cluster without any language installed.
Install this package or others for different languages.

```bash
sudo apt-get install language-pack-pt
```

#### Installing PostgreSQL database server and create new database

```bash
sudo apt-get install postgresql-9.3 postgresql-9.3-postgis-2.1 postgresql-contrib
sudo apt-get install postgresql-server-dev-9.3 postgresql-client-common postgresql-client-9.3
```

#### Create new database

```bash
sudo su postgres
psql postgres -c "CREATE ROLE geobox LOGIN PASSWORD 'geobox' SUPERUSER INHERIT CREATEDB CREATEROLE REPLICATION;"
createdb -O geobox geopublic
psql geopublic -c "CREATE EXTENSION adminpack;"
psql geopublic -c "CREATE EXTENSION postgis;"
psql geopublic -c "CREATE EXTENSION hstore;"
exit
```

#### Load initial database contents

```bash
wget https://raw.githubusercontent.com/jgrocha/geopublic/master/geopublic-demo.backup
export PGPASSWORD=geobox; pg_restore -h localhost -d geopublic -C -U geobox geopublic-demo.backup
```

#### Installing node.js

```bash
sudo apt-add-repository ppa:chris-lea/node.js
sudo apt-get update
sudo apt-get install nodejs
sudo npm install -g forever
sudo chown -R $USER:$USER ~/.npm
```

#### Installing the PPGIS application

```bash
mkdir public_html
cd public_html/
svn checkout https://github.com/jgrocha/geopublic/trunk/node-server/extdirect-pg .
npm update
svn checkout https://github.com/jgrocha/geopublic/trunk/client/GeoPublic/build/production/GeoPublic public
mkdir -p public/uploads
```

#### Start the application

```bash
cd ~/public_html/
NODE_ENV=production forever start server.js
```

sudo is necessary to run the application on port 80.

#### Monitoring the application

```bash
cd ~/public_html
forever logs
tail -f <log file>
```

#### Stop the application

```bash
cd public_html
forever stop server.js
```

#### Configuring SMTP

The server should provide the SMTP service.

Install postfix and select Internet Site from the available options.

```bash
sudo apt-get install postfix
```

