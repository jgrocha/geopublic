### Contributing to the development 

You can grab the source code and add improvements to it.

#### Dependencies

You need:
* node.js
* ExtJS library (v. 4.2.1 GPL)
* OpenLayers (v 2.13.1)
* GeoExt (v. 2.0.2)
* PostgreSQL + PostGIS server
* Eclipse (another IDE, or simply a text editor)

##### Installing node.js

```bash
sudo apt-add-repository ppa:chris-lea/node.js
sudo apt-get update
sudo apt-get install nodejs
sudo npm install -g forever
```

##### Installing Sencha ExtJS tools

```bash
cd /tmp
wget http://cdn.sencha.com/cmd/4.0.4.84/SenchaCmd-4.0.4.84-linux-x64.run.zip
unzip SenchaCmd-4.0.4.84-linux-x64.run.zip
chmod a+x SenchaCmd-4.0.4.84-linux-x64.run
./SenchaCmd-4.0.4.84-linux-x64.run
```

##### Installing Ruby

Sencha cmd uses Ruby.

```bash
sudo apt-get install build-essential git-core curl sqlite3 libsqlite3-dev libxml2-dev libxslt1-dev libreadline-dev libyaml-dev libcurl4-openssl-dev libncurses5-dev libgdbm-dev libffi-dev
cd /tmp
wget http://ftp.ruby-lang.org/pub/ruby/ruby-2.1.3.tar.gz
tar xvzf ruby-2.1.3.tar.gz
cd ruby-2.1.3
./configure
make
sudo make install
```

##### Download source code

Goto to 

In Eclipse

##### Adding libraries (not included on source)

```bash
cd /tmp
wget http://cdn.sencha.com/ext/gpl/ext-4.2.1-gpl.zip
unzip ext-4.2.1-gpl.zip
cp -a ext-4.2.1.883/* ~/git/geopublic/client/GeoPublic/ext
```

What about ext/src/ux ?

##### Creating the database


### Running the application on localhost

```bash
cd ~/git/geopublic/client/GeoPublic
sencha app refresh
sencha app build
```

```bash
cd ~/git/geopublic/node-server/extdirect-pg
ln -s ../../client/GeoPublic public
nodemon
```

#### Development version

#### Production version
  
### Editing  

#### Overview

#### Server side code

#### Client side code

### Prepare for deploy

### Deploy
