### Dump database schema

```
/usr/bin/pg_dump --host localhost --port 5432 --username "geobox" --format plain --schema=public --schema=ppgis --create --schema-only --no-privileges --no-owner --blobs --verbose --file "/home/jgr/git/geopublic/geopublic.sql" "extdirectnode"
```

File: geopublic.sql 

### Participation text now limited to 255 characters #26

```
ALTER TABLE ppgis.ocorrencia ALTER COLUMN participacao TYPE text;
ALTER TABLE ppgis.comentario ALTER COLUMN comentario TYPE text;
```

### Last motifications

```
CREATE OR REPLACE FUNCTION ppgis.createdefaultlayer()
  RETURNS trigger AS
$BODY$
DECLARE
estado integer;
  BEGIN
    INSERT INTO public.tema (ord, titulo, url, tipo, srid, activo, visivel, idutilizador, idplano)
VALUES (10, 'OSM', 'http://a.tile.openstreetmap.org/${z}/${x}/${y}.png,http://b.tile.openstreetmap.org/${z}/${x}/${y}.png,http://c.tile.openstreetmap.org/${z}/${x}/${y}.png',
'OSM', 3857, TRUE, TRUE, NEW.idutilizador, NEW.id);

INSERT INTO ppgis.estado (id, idplano, estado, significado, color, icon)
VALUES (1, NEW.id, 'Recebida', 'Parcicipação registada', 'red', 'resources/images/traffic-cone-icon-red-32.png');

     RETURN NEW;
  END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;

CREATE TRIGGER addlayer
  AFTER INSERT
  ON ppgis.plano
  FOR EACH ROW
  EXECUTE PROCEDURE ppgis.createdefaultlayer();
```

```
SELECT setval('ppgis.plano_id_seq', 49);
ALTER TABLE ppgis.promotor ALTER COLUMN active SET DEFAULT TRUE;
ALTER table public.tema ALTER COLUMN idplano DROP NOT NULL;
```
### Previous motifications

```
ALTER TABLE ppgis.promotor ADD COLUMN active boolean;
UPDATE ppgis.promotor SET active = true;

ALTER TABLE ppgis.plano ADD COLUMN proposta text,
 ADD COLUMN alternativeproposta boolean,
 ADD COLUMN active boolean;
UPDATE ppgis.plano SET active = true;

COMMENT ON TABLE ppgis.plano
  IS 'If plano.the_geom exists, then the disuccsion is map based, with one geographic feature for each participation
If plano.proposta exists, then the discussion is about something without geographic features
If plano.proposta exists, the promotor can decide if alternative text forms can be provided by citizens, using the plano.alternativetext (yes or no)';

ALTER TABLE ppgis.ocorrencia ADD COLUMN proposta text;

INSERT INTO ppgis.estado (id, idplano, estado, significado, color, icon)
VALUES (1, 28, 'Recebida', 'Participação reportada', 'yellow', '');
INSERT INTO ppgis.estado (id, idplano, estado, significado, color, icon)
VALUES (2, 28, 'Subscrita', 'Opinião subscrita por mais alguém', 'red', '');
INSERT INTO ppgis.estado (id, idplano, estado, significado, color, icon)
VALUES (3, 28, 'Sem fundamentação', 'Participação pouco fundamentada', 'gray', '');
INSERT INTO ppgis.estado (id, idplano, estado, significado, color, icon)
VALUES (4, 28, 'Sem aplicabilidade', 'Participação sem aplicabilidade ao plano em discussão', 'gray', '');
INSERT INTO ppgis.estado (id, idplano, estado, significado, color, icon)
VALUES (5, 28, 'Aceite para análise', 'Participação reportada', 'green', '');

INSERT INTO ppgis.estado (id, idplano, estado, significado, color, icon)
VALUES (1, 29, 'Recebida', 'Participação reportada', 'yellow', '');
INSERT INTO ppgis.estado (id, idplano, estado, significado, color, icon)
VALUES (2, 29, 'Subscrita', 'Opinião subscrita por mais alguém', 'red', '');
INSERT INTO ppgis.estado (id, idplano, estado, significado, color, icon)
VALUES (3, 29, 'Sem fundamentação', 'Participação pouco fundamentada', 'gray', '');
INSERT INTO ppgis.estado (id, idplano, estado, significado, color, icon)
VALUES (4, 29, 'Sem aplicabilidade', 'Participação sem aplicabilidade ao plano em discussão', 'gray', '');
INSERT INTO ppgis.estado (id, idplano, estado, significado, color, icon)
VALUES (5, 29, 'Aceite para análise', 'Participação reportada', 'green', '');
```

####Table utilizador

#####email field

    * in the database, the maximum size is 100.
    * in the interface (forms), the maximum allowed size is 48
    * in the interface, the regular expression used to validate the email is the default ExtJs expression
    * the official size should be 254!
    * about email size and validation: http://isemail.info/about

The user should be able to change his email address

#####token field

    * in the database, the maximum sise is 64.
    * the token should be always 64 bytes (formed by hex numbers)
    
####Table sessao

When removing a user, we also must drop all its session data.

A trigger should exist to preserve the user+session data, if important.

### Prepare database for publishing

```
sudo su postgres -c psql

SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE
-- don't kill my own connection!
pid <> pg_backend_pid()
-- don't kill the connections to other databases
AND datname = 'geopublic';

-- REVOKE the CONNECT privileges to avoid new connections:
-- REVOKE CONNECT ON DATABASE geopublic FROM PUBLIC, geobox;
-- GRANT CONNECT ON DATABASE geopublic FROM PUBLIC, geobox;

alter database geopublic rename to geopublicdev;
\q

sudo su postgres
createdb -O geobox  --encoding=UTF8 geopublic
psql geopublic -c "CREATE EXTENSION adminpack;"
psql geopublic -c "CREATE EXTENSION postgis;"
psql geopublic -c "CREATE EXTENSION hstore;"

export PGPASSWORD=geobox; pg_restore -h localhost -d geopublic -C -U geobox geopublic-demo.backup

exit

pg_dump --host localhost --port 5432 --username "geobox" --role "geobox" --no-password  --format custom --blobs --verbose --file geopublic-demo-0-9.backup geopublic


```
