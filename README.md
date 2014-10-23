### Deploy on the cloud 

The following instructions were used to deploy the application on a dedicated Ubuntu server, with 14.04 installed.

#### Update Ubuntu

```bash
ssh -i ~/.ssh/agueda-openssh.ppk -X ubuntu@10.15.5.233
```

```bash
echo "127.0.0.1 ppgis" | sudo tee -a /etc/hosts
sudo apt-get install language-pack-pt
sudo apt-get update
sudo apt-get upgrade
sudo apt-get install redis-server
sudo apt-get install build-essential
```

#### Installing PostgreSQL database server

```bash
sudo apt-get install postgresql-9.3 postgresql-9.3-postgis-2.1 postgresql-contrib
sudo apt-get install postgresql-server-dev-9.3 postgresql-client-common postgresql-client-9.3
```

```bash
sudo su postgres
psql postgres -c "CREATE ROLE geobox LOGIN PASSWORD 'geobox' SUPERUSER INHERIT CREATEDB CREATEROLE REPLICATION;"
createdb -O geobox geopublic
psql geopublic -c "CREATE EXTENSION adminpack;"
psql geopublic -c "CREATE EXTENSION postgis;"
exit
```

#### Installing node.js

```bash
sudo apt-add-repository ppa:chris-lea/node.js
sudo apt-get update
sudo apt-get install nodejs
sudo npm install -g forever
```

#### Installing the PPGIS application

```bash
mkdir public_html
cd public_html/
wget https://raw.githubusercontent.com/jgrocha/geopublic/master/geopublic-beta.tgz
tar xvzf geopublic-beta.tgz
wget https://raw.githubusercontent.com/jgrocha/geopublic/master/geopublic-ppgis-all-20141014.backup
pg_restore -h localhost -d geopublic -C -U geobox geopublic-ppgis-all-20141014.backup
npm update
mkdir public/uploads
mkdir public/participation_data
mkdir public/uploaded_images
mkdir public/uploaded_images/profiles
mkdir public/uploaded_images/profiles/32x32
mkdir public/uploaded_images/profiles/160x160
mkdir public/uploaded_shapefiles
sudo NODE_ENV=production forever start server.js
```

#### Monitoring the application

```bash
cd public_html
sudo forever logs
tail -f <log file>
```

#### Stop the application

```bash
cd public_html
sudo forever stop server.js
```
