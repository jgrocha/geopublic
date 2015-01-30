### Deploy on the cloud 

The following instructions were used to deploy the application on a dedicated Ubuntu server, with 14.04 installed.

After deploying, the application should be available at (http://10.15.5.233:3003)

#### Create and power up an instance on openStack

Instructions in `STORM_Accessing Storm Clouds Platform %40 HP IIC.docx` document.

The instance name will became the hostname, p.e instance-ppgis.

#### Connect to the instance using its IP

After connecting to the VPN, you can connect to the server.

```bash
chmod 0600 ~/.ssh/my-keypair.pem
ssh -i ~/.ssh/my-keypair.pem ubuntu@10.15.5.226
```

#### Preparation

Use the instance name, p.e. ppgis.

```bash
echo "127.0.0.1 instance-ppgis" | sudo tee -a /etc/hosts
sudo apt-get update
sudo apt-get upgrade

sudo apt-get install redis-server build-essential subversion graphicsmagick
```

One language package should be installed. PostgreSQL will not create the initial database cluster without any language installed.
Install this package or others for different languages.

```bash
sudo apt-get install language-pack-pt
```

#### Installing PostgreSQL database server and create new database

```bash
sudo apt-get -y install postgresql-9.3 postgresql-9.3-postgis-2.1 postgresql-contrib
sudo apt-get -y install postgresql-server-dev-9.3 postgresql-client-common postgresql-client-9.3
sudo apt-get -y install pgbouncer

sudo sed -i s/=0/=1/ /etc/default/pgbouncer

sudo sed -i '/\[databases\]/!b;n;cgeopublic = host=127.0.0.1 port=5432 dbname=geopublic' /etc/pgbouncer/pgbouncer.ini

echo '"geobox" "geobox"' | sudo tee -a /etc/pgbouncer/userlist.txt

sudo sed -i "s/^max_client_conn = 100/max_client_conn = 500/" /etc/pgbouncer/pgbouncer.ini

sudo service pgbouncer restart

sudo sed -i "s/^max_connections = 100/max_connections = 250/" /etc/postgresql/9.3/main/postgresql.conf
sudo service postgresql restart
```

Note: To confirm the configuration filename, use:

```bash
sudo su postgres
psql -c "SHOW config_file;"

               config_file
------------------------------------------
 /etc/postgresql/9.3/main/postgresql.conf
(1 row)
exit
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

#### Testing database connection with pgbouncer

```bash
psql -h localhost -p 6432 -U geobox geopublic
\q
```

#### Load initial database contents

```bash
wget https://raw.githubusercontent.com/jgrocha/geopublic/master/geopublic-demo-0.9.backup
export PGPASSWORD=geobox; pg_restore -h localhost -d geopublic -C -U geobox geopublic-demo-0.9.backup
```

#### Configuring SMTP

The server should provide the SMTP service.

Install postfix and select *Internet Site* from the available options.

Use *euparticipo.cm-agueda.pt* for the system mail name.

```bash
sudo apt-get install postfix
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
svn checkout https://github.com/jgrocha/geopublic/trunk/server .
npm update
svn checkout https://github.com/jgrocha/geopublic/trunk/client/GeoPublic/build/production/GeoPublic public
mkdir -p uploads
mkdir -p public/participation_data
mkdir -p public/uploaded_images

mkdir -p public/participation_data/1/1/80x80
mkdir -p public/participation_data/1/1/_x600
```

##### Sample images (from a local machine)

```bash
scp -i ~/.ssh/my-keypair.pem participation_data/1/1/5f891a61039074a8d5287bcd2a50da15.jpg ubuntu@10.15.5.226:public_html/public/participation_data/1/1
scp -i ~/.ssh/my-keypair.pem participation_data/1/1/80x80/5f891a61039074a8d5287bcd2a50da15.jpg ubuntu@10.15.5.226:public_html/public/participation_data/1/1/80x80
scp -i ~/.ssh/my-keypair.pem participation_data/1/1/_x600/5f891a61039074a8d5287bcd2a50da15.jpg ubuntu@10.15.5.226:public_html/public/participation_data/1/1/_x600

scp -i ~/.ssh/my-keypair.pem participation_data/1/1/a1d11249ddf1b4bc30c1e7d793697080.jpg ubuntu@10.15.5.226:public_html/public/participation_data/1/1
scp -i ~/.ssh/my-keypair.pem participation_data/1/1/80x80/a1d11249ddf1b4bc30c1e7d793697080.jpg ubuntu@10.15.5.226:public_html/public/participation_data/1/1/80x80
scp -i ~/.ssh/my-keypair.pem participation_data/1/1/_x600/a1d11249ddf1b4bc30c1e7d793697080.jpg ubuntu@10.15.5.226:public_html/public/participation_data/1/1/_x600
```

##### Server folders

On the server side, under `public_html`:
 uploads

On the server side, under `public_html/public`:
 public/resources
 public/participation_data
 public/uploaded_images

![Server folder structure](serverfolderstructure.png "Server folder structure")

1. `uploads`

    This is a temporary folder to receive uploaded images. Images are scaled and moved from this temporary folder to other folders.

2. `public/participation_data`

    Images uploaded by users to illustrate their participation are stored in this folder. This folder is organized by entity and plan. All images regarding one plan are stored on the same folder.

3. `public/uploaded_images`

    Other images uploaded by users are stored under this folder. Profile images are uploaded here.

4. `public/resources`

    Contains static resources used by the application, like icons, etc.

#### Start the application

```bash
cd ~/public_html/
sudo NODE_ENV=production forever start server.js
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

#### Configuration behind Apache (Apache 2.4.5 and later)

```bash
sudo a2enmod proxy_wstunnel
```
# TODO

uploaded_images/profiles/32x32/31_990cf6c664b7c6de6043e1084034b414.jpg