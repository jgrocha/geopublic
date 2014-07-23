DROP TABLE infprevia.confrontacao;
DROP TABLE infprevia.camada;
DROP TABLE infprevia.pretensao;

-- Table: infprevia.pretensao
CREATE TABLE infprevia.pretensao
(
  id serial NOT NULL,
  designacao character varying(100),
  relatorio character varying(250),
  the_geom geometry NOT NULL,
  dataregisto timestamp with time zone NOT NULL DEFAULT now(),
  datamodificacao timestamp with time zone NOT NULL DEFAULT now(),
  idutilizador integer NOT NULL DEFAULT 28,
  area double precision DEFAULT 0,
  CONSTRAINT pretensao_pkey PRIMARY KEY (id),
  CONSTRAINT pretensao_utilizador_fk FOREIGN KEY (idutilizador)
      REFERENCES utilizador (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT enforce_dims_the_geom CHECK (st_ndims(the_geom) = 2),
  CONSTRAINT enforce_geotype_the_geom CHECK (geometrytype(the_geom) = 'POLYGON'::text OR geometrytype(the_geom) = 'POINT'::text OR the_geom IS NULL),
  CONSTRAINT enforce_srid_the_geom CHECK (st_srid(the_geom) = 3763),
  CONSTRAINT enforce_is_valid CHECK (st_isvalid(the_geom))
)
WITH (
  OIDS=FALSE
);
ALTER TABLE infprevia.pretensao
  OWNER TO geobox;

-- Table: infprevia.camada
CREATE TABLE infprevia.camada
(
  tabela character varying(80) NOT NULL,
  coluna character varying(80),
  dominio character varying(50),
  subdominio character varying(50),
  familia character varying(50),
  objecto character varying(100),
  ident_gene character varying(100),
  ident_part character varying(100),
  diploma_es character varying(100),
  sumario text,
  texto text,
  parecer character varying(80),
  buffer integer,
  entidade character varying(100),
  dataregisto timestamp with time zone NOT NULL DEFAULT now(),
  datamodificacao timestamp with time zone NOT NULL DEFAULT now(),
  idutilizador integer NOT NULL DEFAULT 28,
  CONSTRAINT camada_pkey PRIMARY KEY (tabela),
  CONSTRAINT camada_utilizador_fk FOREIGN KEY (idutilizador)
      REFERENCES utilizador (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
)
WITH (
  OIDS=FALSE
);
ALTER TABLE infprevia.camada
  OWNER TO geobox;

insert into infprevia.camada (tabela, coluna) values ( 'ip_ordenamento.espaco_atividades_economicas', 'geom');
insert into infprevia.camada (tabela, coluna) values ( 'ip_ordenamento.espaco_central', 'geom');
insert into infprevia.camada (tabela, coluna) values ( 'ip_ordenamento.espaco_florestal_conservacao_estrita', 'geom');
insert into infprevia.camada (tabela, coluna) values ( 'ip_ordenamento.espaco_florestal_protecao', 'geom');
insert into infprevia.camada (tabela, coluna) values ( 'ip_ordenamento.espaco_florestal_recreio', 'geom');
insert into infprevia.camada (tabela, coluna) values ( 'ip_ordenamento.espaco_historico_cultural', 'geom');
insert into infprevia.camada (tabela, coluna) values ( 'ip_ordenamento.espaco_residencial_tipo1', 'geom');
insert into infprevia.camada (tabela, coluna) values ( 'ip_ordenamento.espaco_residencial_tipo2', 'geom');
insert into infprevia.camada (tabela, coluna) values ( 'ip_ordenamento.espaco_residencial_tipo3', 'geom');
insert into infprevia.camada (tabela, coluna) values ( 'ip_ordenamento.espacos_agricolas', 'geom');
insert into infprevia.camada (tabela, coluna) values ( 'ip_ordenamento.espacos_florestais_producao_tipo1', 'geom');
insert into infprevia.camada (tabela, coluna) values ( 'ip_ordenamento.espacos_florestais_producao_tipo2', 'geom');
insert into infprevia.camada (tabela, coluna) values ( 'ip_ordenamento.espacos_florestais_producao_tipo3', 'geom');
insert into infprevia.camada (tabela, coluna) values ( 'ip_ordenamento.espacos_naturais', 'geom');
insert into infprevia.camada (tabela, coluna) values ( 'ip_ordenamento.espacos_verdes', 'geom');
insert into infprevia.camada (tabela, coluna) values ( 'ip_ordenamento.uopg', 'geom');

insert into infprevia.camada (tabela, coluna) values ( 'ip_condicionantes.ran_ip', 'geom');

-- falta espaco_central_urbanizado

alter table ip_condicionantes.ran_ip add column sumario text;
update ip_condicionantes.ran_ip set sumario = 'A parcela assinalada está dentro da RAN.';

delete from infprevia.camada where tabela ilike '%verdes%'
select * from infprevia.camada where tabela ilike '%verdes%'

-- Table: infprevia.confrontacao
CREATE TABLE infprevia.confrontacao
(
  id serial NOT NULL,
  idpretensao integer NOT NULL,
  camada character varying(80) NOT NULL,
  area numeric,
  the_geom geometry NOT NULL,
  dominio character varying(50),
  subdominio character varying(50),
  familia character varying(50),
  objecto character varying(100),
  ident_gene character varying(100),
  ident_part character varying(100),
  diploma_es character varying(100),
  sumario text,
  texto text,
  parecer character varying(80),
  buffer integer,
  entidade character varying(100),
  dataregisto timestamp with time zone NOT NULL DEFAULT now(),
  idutilizador integer NOT NULL DEFAULT 28,
  CONSTRAINT confrontacao_pkey PRIMARY KEY (id),
  CONSTRAINT confrontacao_camada_fk FOREIGN KEY (camada)
      REFERENCES infprevia.camada (tabela) MATCH SIMPLE
      ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT confrontacao_pretensao_fk FOREIGN KEY (idpretensao)
      REFERENCES infprevia.pretensao (id) MATCH SIMPLE
      ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT confrontacao_utilizador_fk FOREIGN KEY (idutilizador)
      REFERENCES utilizador (id) MATCH SIMPLE
      ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT enforce_dims_the_geom CHECK (st_ndims(the_geom) = 2),
  CONSTRAINT enforce_geotype_the_geom CHECK (geometrytype(the_geom) = 'POLYGON'::text OR geometrytype(the_geom) = 'POINT'::text OR the_geom IS NULL),
  CONSTRAINT enforce_srid_the_geom CHECK (st_srid(the_geom) = 3763)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE infprevia.confrontacao
  OWNER TO geobox;

-- Function: completa_pretensao()
-- DROP FUNCTION completa_pretensao();

CREATE OR REPLACE FUNCTION infprevia.completa_pretensao()
  RETURNS trigger AS
$BODY$
    BEGIN
        -- IF NEW.dataregisto IS NULL THEN
        NEW.dataregisto := current_timestamp;
        -- END IF;    
        NEW.datamodificacao := current_timestamp;
        NEW.area := st_area(NEW.the_geom);
        -- NEW.last_user := current_user;
        RETURN NEW;
    END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION infprevia.completa_pretensao()
  OWNER TO geobox;

-- Function: confronta_pretensao()
-- DROP FUNCTION confronta_pretensao();

CREATE OR REPLACE FUNCTION infprevia.confronta_pretensao()
  RETURNS trigger AS
$BODY$
    BEGIN
	  EXECUTE infprevia.confronta(NEW.id, NEW.idutilizador);
	  RETURN NEW;

	  
    END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION infprevia.confronta_pretensao()
  OWNER TO geobox;


-- Function: confronta(integer, integer)
-- DROP FUNCTION confronta(integer, integer);

CREATE OR REPLACE FUNCTION infprevia.confronta(p integer, utilizador integer)
  RETURNS void AS
$BODY$
DECLARE
    rec RECORD;
    t character varying(80); 
    c character varying(80);
    geo character varying(80);
BEGIN
    FOR rec IN SELECT * FROM infprevia.camada LOOP
        RAISE NOTICE 'Vai confrontar: % com %.%', p, rec.tabela, rec.coluna; 
        PERFORM infprevia.intercepta(p, rec.tabela, rec.coluna, utilizador);
    END LOOP;
   	-- loteamentos 
    t = 'uso_do_solo.loteamentos';
    c = 'the_geom';
    geo = t || '.' || c;      
    EXECUTE 'INSERT INTO infprevia.confrontacao (idpretensao, camada, the_geom, area, idutilizador, dominio, subdominio, familia, objecto, ident_gene, ident_part, diploma_es, parecer, entidade, sumario, texto) ' ||
    'select ' || p || ', ''' || t || ''', ST_Intersection(infprevia.pretensao.the_geom,' || geo || '), st_area(ST_Intersection(infprevia.pretensao.the_geom, ' || geo || ')), ' || utilizador || ', ' ||
    t || '.n_alvara, ' || t || '.n_proc, ' || t || '.n_matriz, ' || t || '.n_conserva, ' || t || '.imgem_alvara, ' || t || '.planta_sintese, ' || t || '.ano, ' || t || '.tipo, ' || t || '.titular, ' || t || '.tipo, ' || t || '.tipo ' ||
    'from infprevia.pretensao, ' || t || ' '
    'where infprevia.pretensao.id = ' || p || ' and ST_Intersects(infprevia.pretensao.the_geom, ' || geo || ')';          
    RETURN;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION infprevia.confronta(integer, integer)
  OWNER TO geobox;

-- Function: intercepta(integer, integer, character varying, character varying, integer)
-- DROP FUNCTION intercepta(integer, integer, character varying, character varying, integer);

CREATE OR REPLACE FUNCTION infprevia.intercepta(p integer, t character varying, c character varying, u integer)
  RETURNS void AS
$BODY$
     DECLARE 
     	geo character varying(80);
     	sumario text; 
    BEGIN
      -- sumario = '''Para o local assinalado o instrumento de gestão territorial é o Plano Diretor Municipal, publicado no Diário da República, 2.ª série – N.º44 de 1 de março, através do Aviso n.º3341/2012. O terreno insere-se em solo urbano, na categoria de solo urbanizado – Espaços de Atividades Económicas. ''';
      sumario = '''Teste''';
      geo = t || '.' || c;
      RAISE NOTICE 'Vai interceptar infprevia.pretensao.the_geom com %', geo;
      EXECUTE 'INSERT INTO infprevia.confrontacao (idpretensao, camada, the_geom, area, idutilizador, dominio, subdominio, familia, objecto, ident_gene, ident_part, diploma_es, parecer, entidade, sumario, texto) ' ||
      'select ' || p || ', ''' || t || ''', ST_Intersection(infprevia.pretensao.the_geom,' || geo || '), st_area(ST_Intersection(infprevia.pretensao.the_geom, ' || geo || ')), ' || u || ', ' ||
      t || '.dominio, ' || t || '.subdominio, ' || t || '.familia, ' || t || '.objecto, ' || t || '.ident_gene, ' || t || '.ident_part, ' || t || '.diploma_es, ' || t || '.parecer, ' || t || '.entidade, ' || t || '.sumario, ' || t || '.texto ' ||
      'from infprevia.pretensao, ' || t || ' '
      'where infprevia.pretensao.id = ' || p || ' and ST_Intersects(infprevia.pretensao.the_geom, ' || geo || ')';
    END;
    $BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION infprevia.intercepta(integer, character varying, character varying, integer)
  OWNER TO geobox;
  
ALTER TABLE infprevia.confrontacao DROP CONSTRAINT confrontacao_camada_fk;

-- Trigger: completa on infprevia.pretensao
-- DROP TRIGGER completa ON infprevia.pretensao;

CREATE TRIGGER completa
  BEFORE INSERT OR UPDATE
  ON infprevia.pretensao
  FOR EACH ROW
  EXECUTE PROCEDURE infprevia.completa_pretensao();

-- Trigger: confrontacao_automatica on infprevia.pretensao
-- DROP TRIGGER confrontacao_automatica ON infprevia.pretensao;

CREATE TRIGGER confrontacao_automatica
  AFTER INSERT OR UPDATE
  ON infprevia.pretensao
  FOR EACH ROW
  EXECUTE PROCEDURE infprevia.confronta_pretensao();
