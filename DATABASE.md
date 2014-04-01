###Decisions

####Table utilizador

```sql
CREATE TABLE utilizador
(
  id serial NOT NULL,
  login character varying(20),
  password character varying(100),
  idgrupo integer,
  email character varying(100),
  fotografia character varying(100),
  nome character varying(120) NOT NULL,
  morada character varying(80),
  localidade character varying(80),
  codpostal character varying(8),
  despostal character varying(80),
  nif character varying(9),
  nic character varying(9),
  masculino boolean,
  pessoacoletiva boolean,
  telemovel character varying(15),
  telefone character varying(15),
  observacoes text,
  dicofre character varying(6),
  ponto geometry(Point,3763),
  datacriacao timestamp with time zone DEFAULT now(),
  datamodificacao timestamp with time zone DEFAULT now(),
  ultimologin timestamp with time zone,
  preferencias hstore,
  ativo boolean DEFAULT true,
  emailconfirmacao boolean DEFAULT false,
  token character varying(64),
  CONSTRAINT utilizador_pkey PRIMARY KEY (id),
  CONSTRAINT utilizador_idgrupo_fkey FOREIGN KEY (idgrupo)
      REFERENCES grupo (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT utilizador_login_key UNIQUE (login),
  CONSTRAINT enforce_dims_geometria CHECK (st_ndims(ponto) = 2),
  CONSTRAINT enforce_geotype_geometria CHECK (geometrytype(ponto) = 'POINT'::text OR ponto IS NULL),
  CONSTRAINT enforce_srid_geometria CHECK (st_srid(ponto) = 3763)
);
```

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
