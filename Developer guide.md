### Contributing to the development 

You can grab the source code and add improvements to it.

#### Dependencies

You need:
* sudo apt-get install graphicsmagick
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
sudo npm install -g nodemon
sudo chown -R $USER:$USER ~/.npm
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

[git](http://git-scm.com/) is used to download and manage the source code. You can download the source code directly from the repository, with:

```bash
git clone https://github.com/jgrocha/geopublic.git
```

If you want to contribute with code to the project, the suggested workflow is:
* clone the repository on GitHub
* download your cloned version
* make improvements on your code
* if you want to share your changes, issue a pull request

```bash
npm update
```

##### 

In Eclipse with eGit installed, to download the source code, copy the following url to the clipboad: https://github.com/jgrocha/geopublic.git

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

### Deploy (to include sample data)

```bash
cd client/GeoPublic
sencha app build

mkdir -p build/production/GeoPublic/participation_data
mkdir -p build/production/GeoPublic/uploaded_images

mkdir -p build/production/GeoPublic/uploaded_images/profiles/32x32
mkdir -p build/production/GeoPublic/uploaded_images/profiles/160x160

mkdir -p build/production/GeoPublic/participation_data/1/1/80x80
mkdir -p build/production/GeoPublic/participation_data/1/1/_x600

cp uploaded_images/profiles/32x32/31_990cf6c664b7c6de6043e1084034b414.jpg build/production/GeoPublic/uploaded_images/profiles/32x32
cp uploaded_images/profiles/160x160/31_990cf6c664b7c6de6043e1084034b414.jpg build/production/GeoPublic/uploaded_images/profiles/160x160

cp participation_data/1/1/5f891a61039074a8d5287bcd2a50da15.jpg build/production/GeoPublic/participation_data/1/1
cp participation_data/1/1/80x80/5f891a61039074a8d5287bcd2a50da15.jpg build/production/GeoPublic/participation_data/1/1/80x80
cp participation_data/1/1/_x600/5f891a61039074a8d5287bcd2a50da15.jpg build/production/GeoPublic/participation_data/1/1/_x600

cp participation_data/1/1/a1d11249ddf1b4bc30c1e7d793697080.jpg build/production/GeoPublic/participation_data/1/1
cp participation_data/1/1/80x80/a1d11249ddf1b4bc30c1e7d793697080.jpg build/production/GeoPublic/participation_data/1/1/80x80
cp participation_data/1/1/_x600/a1d11249ddf1b4bc30c1e7d793697080.jpg build/production/GeoPublic/participation_data/1/1/_x600

cd ../..
git add client/GeoPublic/build/production/GeoPublic/participation_data
git add client/GeoPublic/build/production/GeoPublic/uploaded_images
```

#### Configuration behind Apache (Apache 2.4.5 and later)

```bash
sudo a2enmod proxy_wstunnel
```

### Updates

```
    "email-templates": "^2.0.1",
    npm install ejs --save
```

```
-- cls class to enagle additional css for the plan description panel
ALTER table ppgis.plano ADD COLUMN planocls character varying(24);

-- each plan with its own layers
ALTER TABLE public.tema ADD COLUMN idplano integer NULL;
ALTER TABLE public.tema ADD CONSTRAINT tema_plano_fk FOREIGN KEY (idplano) REFERENCES ppgis.plano (id);
```

#### Compute the plan extent to fill the form (required!)

```
WITH extent AS (
       SELECT ST_Extent(geom) as bbox
       FROM ppgis_pu.c_nivel_pu
     )
SELECT
	ST_AsEWKT(ST_Transform(ST_SetSRID(bbox,3763), 4326)) as EPSG_4326,
	ST_AsGeoJSON(ST_Transform(ST_SetSRID(bbox,3763), 900913), 0) as EPSG_900913,
	ST_AsEWKT(ST_SetSRID(bbox,3763)) as EPSG_3763
FROM extent;

-- {"type":"Polygon","coordinates":[[[-941345,4947554],[-941354,4950062],[-938856,4950070],[-938848,4947563],[-941345,4947554]]]}
CREATE TABLE ppgis_pu.limite AS
WITH extent AS (
       SELECT ST_Extent(geom) as bbox
       FROM ppgis_pu.c_nivel_pu
     )
SELECT 1, ST_SetSRID(bbox,3763) as the_geom
FROM extent;
```


#### Allow several moderators on each plan

```
ALTER TABLE ppgis.plano ALTER COLUMN email TYPE character varying(120);
```

The email column should have at least one email: the email of the responsible.
Other emails can be added for more moderators.
Moderators will be notified for each participation inserted, updated or deleted.

Moderators also can delete and edit existing participations.

Emails should be separated by commas.

```
'jgr@geomaster.pt ,  ani@geomaster.pt'.split(/[\s,]+/);
```

#### Documents

```
ALTER TABLE ppgis.fotografiatmp ADD COLUMN name CHARACTER VARYING(255);
ALTER TABLE ppgis.fotografia ADD COLUMN name CHARACTER VARYING(255);
```


