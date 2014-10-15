### Dump database schema

```
/usr/bin/pg_dump --host localhost --port 5432 --username "geobox" --format plain --schema=public --schema=ppgis --create --schema-only --no-privileges --no-owner --blobs --verbose --file "/home/jgr/git/geopublic/geopublic.sql" "extdirectnode"
```

File: geopublic.sql 

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
