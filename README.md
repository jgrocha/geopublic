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

sudo sed -i "s/^max_connections = 100/max_connections = 500/" /etc/postgresql/9.3/main/postgresql.conf
sudo sed -i "s/^shared_buffers = 128MB/shared_buffers = 256MB/" /etc/postgresql/9.3/main/postgresql.conf
sudo sed -i "s/^#fsync = on/fsync = off/" /etc/postgresql/9.3/main/postgresql.conf
sudo sed -i "s/^#effective_io_concurrency = 1/effective_io_concurrency = 2/" /etc/postgresql/9.3/main/postgresql.conf
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
-- this role must match the configuration in server-db.js
psql postgres -c "CREATE ROLE geobox LOGIN PASSWORD 'geobox' SUPERUSER INHERIT CREATEDB CREATEROLE REPLICATION;"
createdb -O geobox geopublic
psql geopublic -c "CREATE EXTENSION adminpack;"
psql geopublic -c "CREATE EXTENSION postgis;"
psql geopublic -c "CREATE EXTENSION hstore;"
psql geopublic -c "CREATE EXTENSION pgcrypto;"
-- populate supporting tables
psql geopublic -f geopublic-20160115-all.sql
psql geopublic -f geopublic-20160115-data.sql
-- initial user; replace the email 'jgr@geomaster.pt' with your own; replace the password 'pa55word' with your own
psql geopublic -c "insert into utilizador (idgrupo, email, password, nome, emailconfirmacao) values(1, 'jgr@geomaster.pt', encode(digest('pa55word', 'sha1'), 'hex'), 'Administrator', true);"
exit
```

#### Testing database connection

```bash
psql -h localhost -p 5432 -U geobox geopublic
\q
```

#### Configuring SMTP (not possible)

The server should provide the SMTP service. Right now, the SMTP service is relayed to another host because the cloud can not be used to configure a proper SMTP server.

The relay is hard coded in `server.js``.

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
cd
mkdir public_html
cd public_html/
svn checkout https://github.com/jgrocha/geopublic/trunk/server .
-- port where the server run. Port 80 maybe taken by Apache
sed -i 's/"port": [0-9]\+/"port": 80/' server-config.json
-- full address
sed -i 's/localhost/euparticipo.cm-agueda.pt/' server-config.json
npm update
svn checkout https://github.com/jgrocha/geopublic/trunk/client/GeoPublic/build/production/GeoPublic public
mkdir -p uploads
mkdir -p public/participation_data
mkdir -p public/uploaded_images
```

##### Create admin user

```bash
sudo su postgres
-- create database structure
psql geopublic -f geopublic-20160115-all.sql
-- populate supporting tables (groups, menus and permissions)
psql geopublic -f geopublic-20160115-data.sql
-- initial user; replace the email 'jgr@geomaster.pt' with your own; replace the password 'pa55word' with your own
psql geopublic -c "insert into utilizador (idgrupo, email, password, nome, emailconfirmacao) values(1, 'jgr@geomaster.pt', encode(digest('pa55word', 'sha1'), 'hex'), 'Administrator', true);"
exit
```

##### About server folders

On the server side, under `public_html`:
 uploads

On the server side, under `public_html/public`:
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

### Prepare the first plan for discussion

Login with the user created, p.e: 'jgr@geomaster.pt' and 'pa55word'

* Under the login name 'Administrator', select "Plans and promoters" on the drop down menu
* Add new promoter
  * Fill the promoters data
  * Add a logo (promoter's logo)
* Add a new plan for discussion
  * You can add more than one email separated by , to support more than one moderator
* Write some description about the plan under discussion
* Use the show map button to select the plan area. The last rectangle drawn is used.
* Use the `Update plan` button to save the plan description and the geographic scope.

Reload the site to start with the new plan.

#### Change the name of the institution hosting the platform

Below the name of the application Have Your Say, there is the name of the institution running the platform.

To change the name, edit the file `resources/languages/en.js` and replace "Câmara Municipal de Águeda" with your own institution.

#### Translate the application

#### Titles and buttons

Each browser sends the user's list of preferred languages. Usually this can be changed in the browser's preferences.'

This application checks the list of preferred languages and uses the first one supported.

For each supported languages, there should be a file in `resources/languages` with the name of the language.

To translate the application to Italian, for example, simple copy `pt.js` to `it.js` and edited the file.
Edit the translation file, but change only the "translation" string and never the "id" string.

To translate to Spanish, copy `pt.js` to `es.js`; to Greek, copy `pt.js` to `el.js`, etc.

#### Panels contents (longer text)

Larger text are stored in small html files. For example, the first panel on the Welcome tab, that says:

"Have Your Say" is a web based platform to empower every citizen committed to the public good.

This text is stores in `resources/guiarapido/participacaocivica.html`.

To translate it, you must create another text file, for example,  `resources/guiarapido/participacaocivica_pt.html`.
To display your file instead of the original one, use the translation file `pt.js` to map these two files:

```
{
    "id": 'resources/guiarapido/participacaocivica.html',
    "translation": "resources/guiarapido/participacaocivica_pt.html"
}
```

#### Email messages

All emails messages are created from templates stored in the `templates` folder. To send email messages in your languages, edit all templates in theat folder. There is a template for HTML based messages and another for plain text messages.

#### Update the application

```bash
cd public_html
sudo stop ppgis
rm -rf .svn public/.svn
svn checkout --force https://github.com/jgrocha/geopublic/trunk/server .
svn revert -R .
sed -i 's/"port": [0-9]\+/"port": 80/' server-config.json
sed -i 's/localhost/euparticipo.cm-agueda.pt/' server-config.json
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
mv public_html/bin/backup.sh ~/bin
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

### Running on Apache

If you already have Apache running on port 80, you can use Apache `mod_proxy`.

```
<VirtualHost *:80>
        ServerName euparticipo.geomaster.pt
        ProxyPreserveHost On
        ProxyPass / http://localhost:3003/
        ProxyPassReverse / http://localhost:3003/
</VirtualHost>
```