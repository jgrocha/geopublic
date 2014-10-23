### Icon

The application icon was designed by <a href="http://www.thenounproject.com/Borengasser">Stephen Borengasser</a> from the <a href="http://www.thenounproject.com">Noun Project</a>

### Deploy on the cloud 

The following instructions were used to deploy the application on a dedicated Ubuntu server, with 14.04 installed.

#### Update Ubuntu

```bash
ssh ubuntu@10.15.5.233

sudo apt-get update
sudo apt-get upgrade
```

#### Installing PostgreSQL database server

sudo apt-get install postgresql-9.3 postgresql-9.3-postgis-2.1 postgresql-client-9.3 postgresql-client-common postgresql-contrib
sudo apt-get install postgresql-server-dev-9.3
```

```bash
sudo su postgres
psql postgres
```

```sql
CREATE ROLE geobox LOGIN PASSWORD 'geobox' SUPERUSER INHERIT CREATEDB CREATEROLE REPLICATION;
\q
```

```bash
createdb -O geobox geopublic
```
```bash
postgres@ppgis:/home/ubuntu$ psql geopublic
psql (9.3.5)
Type "help" for help.

geopublic=# CREATE EXTENSION adminpack;
CREATE EXTENSION
geopublic=# CREATE EXTENSION postgis;
CREATE EXTENSION
geopublic=# \q

exit
```

#### Installing node.js

$ sudo apt-get install python-software-properties
$ sudo apt-add-repository ppa:chris-lea/node.js
$ sudo apt-get update

$ sudo apt-get install nodejs



#### Notes

```bash
Creating new cluster 9.3/main ...
  config /etc/postgresql/9.3/main
  data   /var/lib/postgresql/9.3/main
  locale en_US.UTF-8
  port   5432
```

### Production build

Folders:

uploads
participation_data

### Serving both client and server

```bash
cd node-server/extdirect-mysql
rm -rf public
ln -s ../../client/DemoExtJs public
mkdir public/uploaded_images
npm install
nodemon server.js
```

http://blog.nodejitsu.com/keep-a-nodejs-server-up-with-forever/

#### Deploy

cd /home/jgr/git/extdirect.examples/node-server/extdirect-pg
rm public
cp -r ../../client/DemoExtJs/build/production/DemoExtJs public
mkdir public/uploaded_images
mkdir public/uploaded_images/profiles
mkdir public/uploaded_images/profiles/32x32
mkdir public/uploaded_images/profiles/160x160
mkdir public/uploaded_shapefiles

