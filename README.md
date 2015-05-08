### Deploy on the cloud 

The following instructions were used to deploy the application on a dedicated Ubuntu server, with 14.04 installed.

After deploying, the application should be available at (http://10.15.5.233:3003)

#### Create and power up an instance on openStack

Instructions in `STORM_Accessing Storm Clouds Platform %40 HP IIC.docx` document.

The instance name will became the hostname, p.e instance-ppgis.

#### Connect to the instance using its IP

After connecting to the VPN, you can connect to the server.

```bash
chmod 0600 ~/Transferências/agueda-keypair.pem
ssh -i ~/Transferências/agueda-keypair.pem ubuntu@10.15.5.233
```

#### Preparation

Use the instance name, p.e. ppgis.

```bash
echo "127.0.0.1 instance-ppgis" | sudo tee -a /etc/hosts
sudo apt-get update
sudo apt-get -y upgrade

sudo apt-get -y install redis-server build-essential subversion graphicsmagick
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

#### Empty database contents (usually not necessary)

If previous data already exist, that can be cleared with:

```sql
delete from ppgis.fotografia; ALTER SEQUENCE ppgis.fotografia_id_seq RESTART WITH 1;
delete from ppgis.fotografiatmp; ALTER SEQUENCE ppgis.fotografiatmp_id_seq RESTART WITH 1;
delete from ppgis.comentario; ALTER SEQUENCE ppgis.comentario_id_seq RESTART WITH 1;
delete from ppgis.ocorrencia; ALTER SEQUENCE ppgis.ocorrencia_id_seq RESTART WITH 1;
```

#### Configuring SMTP (no longer necessary)

The server should provide the SMTP service.

Install postfix and select *Internet Site* from the available options.

Use *euparticipo.cm-agueda.pt* for the system mail name.

```bash
sudo apt-get install postfix
sudo hostname euparticipo.cm-agueda.pt
echo "127.0.0.1 euparticipo.cm-agueda.pt" | sudo tee -a /etc/hosts
sudo postfix reload
```

Note (TODO): `inet_protocols = ipv4` might be necessary in /etc/main.cf.

#### Installing node.js

```bash
sudo apt-add-repository -y ppa:chris-lea/node.js
sudo apt-get -y update
sudo apt-get -y install nodejs
sudo npm install -g forever
sudo npm install -g forever-service
sudo chown -R $USER:$USER ~/.npm
```

#### Installing the PPGIS application

```bash
mkdir public_html
cd public_html/
svn checkout https://github.com/jgrocha/geopublic/trunk/server .
sudo sed -i 's/"port": [0-9]\+/"port": 80/' server-config.json
sudo sed -i 's/localhost/euparticipo.cm-agueda.pt/' server-config.json
npm update
svn checkout https://github.com/jgrocha/geopublic/trunk/client/GeoPublic/build/production/GeoPublic public
mkdir -p uploads
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

#### Create the service for the application

```bash
cd ~/public_html/
sudo forever-service install -e "NODE_ENV=production" ppgis --script server.js
```

Commands to interact with service ppgis:

```
Start   - "sudo start ppgis"
Stop    - "sudo stop ppgis"
Status  - "sudo status ppgis"
Restart - "sudo restart ppgis"
```

#### Start the application

```bash
sudo start ppgis
```

#### Monitoring the application

```bash
cd ~/public_html
sudo forever list
tail -f <log file>
```

#### Stop the application

```bash
sudo stop ppgis
```

#### Update application

```bash
cd public_html
sudo stop ppgis
rm -rf .svn public/.svn
svn checkout --force https://github.com/jgrocha/geopublic/trunk/server .
svn revert -R .
sudo sed -i 's/"port": [0-9]\+/"port": 80/' server-config.json
sudo sed -i 's/localhost/euparticipo.cm-agueda.pt/' server-config.json
sudo sed -i 's/xXxXxXxX/euparticipo/' server.js
npm update
svn checkout --force https://github.com/jgrocha/geopublic/trunk/client/GeoPublic/build/production/GeoPublic public
svn revert -R public
sudo start ppgis
```

### Backup

The application generated data on:
* the geopublic database

and on two folder on the file system:
* ~/public_html/public/participation_data
* ~/public_html/public/uploaded_images

#### Preparation

```
cd
mkdir bin
mkdir backup
mv public_html/backup.sh ~/bin
echo 'localhost:5432:*:geobox:geobox' >> ~/.pgpass
chmod 600 ~/.pgpass
bin/backup.sh
```

#### Backup operation

The backup can be started at any time, or can be scheduled to run at specific times or intervals.

##### Manual

```
bin/backup.sh
```

##### Automated

```
crontab -e
```
Add a line to crontab. The backup (in the example) will run every day, at 5:50.

```
50 5 * * * $HOME/bin/backup.sh
```
