### Dump database schema

```
/usr/bin/pg_dump --host localhost --port 5432 --username "geobox" --format plain --schema=public --schema=ppgis --create --schema-only --no-privileges --no-owner --blobs --verbose --file "/home/jgr/git/geopublic/geopublic.sql" "extdirectnode"
```

File: geopublic.sql 

### Last motifications

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
