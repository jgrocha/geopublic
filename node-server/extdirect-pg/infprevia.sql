
-- DROP TABLE infprevia.pretensao CASCADE;
CREATE TABLE infprevia.pretensao
(
  id serial NOT NULL,
  designacao character varying(100), -- o utilizador pode dar-lhe um nome
  relatorio character varying(250), -- url para o relatório em PDF (depois de gerado)
  the_geom geometry NOT NULL,
  dataregisto timestamp with time zone NOT NULL DEFAULT now(),
  datamodificacao timestamp with time zone NOT NULL DEFAULT now(),
  idutilizador integer NOT NULL DEFAULT 28, -- corrigir!
  CONSTRAINT pretensao_pkey PRIMARY KEY (id),
  CONSTRAINT pretensao_utilizador_fk FOREIGN KEY (idutilizador)
    REFERENCES utilizador(id),
  CONSTRAINT enforce_dims_the_geom CHECK (st_ndims(the_geom) = 2),
  CONSTRAINT enforce_geotype_the_geom CHECK (geometrytype(the_geom) = 'POLYGON'::text OR geometrytype(the_geom) = 'POINT'::text OR the_geom IS NULL),
  CONSTRAINT enforce_srid_the_geom CHECK (st_srid(the_geom) = 3763)    
);

select * from utilizador;

select * from infprevia.pretensao;