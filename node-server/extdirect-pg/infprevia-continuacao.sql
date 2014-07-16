select st_astext(ST_Intersection(infprevia.pretensao.the_geom, ip_ordenamento.espaco_central.geom))
from infprevia.pretensao, ip_ordenamento.espaco_central
where infprevia.pretensao.id = 7 and ST_Intersects(infprevia.pretensao.the_geom, ip_ordenamento.espaco_central.geom);

-- camadas com quem precisamos de calcular distância com ...

-- camadas com quem precisamos de interceptar com ST_Intersection
CREATE TABLE infprevia.camada
(
  id serial NOT NULL,
  tabela character varying(80),
  coluna character varying(80),

  --vv-- não estão a ser utilizados --
  dominio character varying(50),
  subdominio character varying(50),
  familia character varying(50),
  objecto character varying(100),
  ident_gene character varying(100),
  ident_part character varying(100),
  diploma_es character varying(100),
  texto text,
  --^^-- não estão a ser utilizados --

  parecer character varying(80),
  buffer integer,
  entidade character varying(100),
  
  dataregisto timestamp with time zone NOT NULL DEFAULT now(),
  datamodificacao timestamp with time zone NOT NULL DEFAULT now(),
  idutilizador integer NOT NULL DEFAULT 28,
  
  CONSTRAINT camada_pkey PRIMARY KEY (id),
  CONSTRAINT camada_utilizador_fk FOREIGN KEY (idutilizador)
      REFERENCES utilizador (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
);

insert into infprevia.camada (tabela, coluna, dominio, subdominio, familia) 
values ( 'ip_ordenamento.espaco_central', 'geom', 'PLANTA_ORDENAMENTO', 'CLASSIFICACAO_QUALIFICACAO_SOLOS', 'SOLO_URBANO_URBANIZADO');
insert into infprevia.camada (tabela, coluna, dominio, subdominio, familia) 
values ( 'ip_ordenamento.espaco_residencial_tipo1', 'geom', 'PLANTA_ORDENAMENTO', 'CLASSIFICACAO_QUALIFICACAO_SOLOS', 'SOLO_URBANO_URBANIZADO');

insert into infprevia.camada (tabela, coluna) values ( 'ip_ordenamento.espaco_atividades_economicas', 'geom');
-- insert into infprevia.camada (tabela, coluna) values ( 'ip_ordenamento.espaco_central', 'geom');
insert into infprevia.camada (tabela, coluna) values ( 'ip_ordenamento.espaco_florestal_conservacao_estrita', 'geom');
insert into infprevia.camada (tabela, coluna) values ( 'ip_ordenamento.espaco_florestal_protecao', 'geom');
insert into infprevia.camada (tabela, coluna) values ( 'ip_ordenamento.espaco_florestal_recreio', 'geom');
insert into infprevia.camada (tabela, coluna) values ( 'ip_ordenamento.espaco_historico_cultural', 'geom');
-- insert into infprevia.camada (tabela, coluna) values ( 'ip_ordenamento.espaco_residencial_tipo1', 'geom');
insert into infprevia.camada (tabela, coluna) values ( 'ip_ordenamento.espaco_residencial_tipo2', 'geom');
insert into infprevia.camada (tabela, coluna) values ( 'ip_ordenamento.espaco_residencial_tipo3', 'geom');
insert into infprevia.camada (tabela, coluna) values ( 'ip_ordenamento.espacos_agricolas', 'geom');
insert into infprevia.camada (tabela, coluna) values ( 'ip_ordenamento.espacos_florestais_producao_tipo1', 'geom');
insert into infprevia.camada (tabela, coluna) values ( 'ip_ordenamento.espacos_florestais_producao_tipo2', 'geom');
insert into infprevia.camada (tabela, coluna) values ( 'ip_ordenamento.espacos_florestais_producao_tipo3', 'geom');
insert into infprevia.camada (tabela, coluna) values ( 'ip_ordenamento.espacos_naturais', 'geom');
insert into infprevia.camada (tabela, coluna) values ( 'ip_ordenamento."espaços_verdes"', 'geom');

insert into infprevia.camada (tabela, coluna) values ( 'ip_ordenamento.uopg', 'geom');
delete from infprevia.camada where tabela = 'ip_ordenamento.uopg';

ALTER TABLE ip_condicionantes.ran_ip ADD COLUMN ident_gene character varying(100);
ALTER TABLE ip_condicionantes.ran_ip ADD COLUMN ident_part character varying(100);
ALTER TABLE ip_condicionantes.ran_ip ADD COLUMN diploma_es character varying(100);
  
insert into infprevia.camada (tabela, coluna) values ( 'ip_condicionantes.ran_ip', 'geom');

-- resultado da intercepção com as camadas
CREATE TABLE infprevia.confrontacao
(
  id serial NOT NULL,
  idpretensao integer NOT NULL,
  idcamada integer NOT NULL,

  area numeric,
  -- distancia numeric,
    
  the_geom geometry NOT NULL,

  dominio character varying(50),
  subdominio character varying(50),
  familia character varying(50),
  objecto character varying(100),
  ident_gene character varying(100),
  ident_part character varying(100),
  diploma_es character varying(100),
  texto text,
  parecer character varying(80),
  buffer integer,
  entidade character varying(100),
    
  dataregisto timestamp with time zone NOT NULL DEFAULT now(),
  idutilizador integer NOT NULL DEFAULT 28,
  
  CONSTRAINT confrontacao_pkey PRIMARY KEY (id),

  CONSTRAINT confrontacao_camada_fk FOREIGN KEY (idcamada)
      REFERENCES infprevia.camada (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,

  CONSTRAINT confrontacao_pretensao_fk FOREIGN KEY (idpretensao)
      REFERENCES infprevia.pretensao (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,

  CONSTRAINT confrontacao_utilizador_fk FOREIGN KEY (idutilizador)
      REFERENCES utilizador (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
      
  CONSTRAINT enforce_dims_the_geom CHECK (st_ndims(the_geom) = 2),
  CONSTRAINT enforce_geotype_the_geom CHECK (geometrytype(the_geom) = 'POLYGON'::text OR geometrytype(the_geom) = 'POINT'::text OR the_geom IS NULL),
  CONSTRAINT enforce_srid_the_geom CHECK (st_srid(the_geom) = 3763)
);

ALTER TABLE infprevia.confrontacao ADD COLUMN sumario text;
ALTER TABLE infprevia.camada ADD COLUMN sumario text;

CREATE OR REPLACE FUNCTION confronta(p integer, utilizador integer) RETURNS VOID AS $$
DECLARE
    rec RECORD;
BEGIN
    FOR rec IN SELECT * FROM infprevia.camada LOOP
        RAISE NOTICE 'Vai confrontar: % com %.%', p, rec.tabela, rec.coluna; 
        PERFORM intercepta(p, rec.id, rec.tabela, rec.coluna, utilizador);
    END LOOP;
    RETURN;
END;
$$ LANGUAGE plpgsql
  
CREATE OR REPLACE FUNCTION completa_pretensao() RETURNS trigger AS $completa_pretensao$
    BEGIN
        -- IF NEW.dataregisto IS NULL THEN
        NEW.dataregisto := current_timestamp;
        -- END IF;    
        NEW.datamodificacao := current_timestamp;
        NEW.area := st_area(NEW.the_geom);
        -- NEW.last_user := current_user;
        RETURN NEW;
    END;
$completa_pretensao$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION confronta_pretensao() RETURNS trigger AS $confrontacao_automatica$
    BEGIN
	EXECUTE confronta(NEW.id, NEW.idutilizador);
	RETURN NEW;
    END;
$confrontacao_automatica$ LANGUAGE plpgsql;

DROP TRIGGER confrontacao_automatica ON infprevia.pretensao;

CREATE TRIGGER completa BEFORE INSERT OR UPDATE ON infprevia.pretensao
  FOR EACH ROW EXECUTE PROCEDURE completa_pretensao();
  
CREATE TRIGGER confrontacao_automatica AFTER INSERT OR UPDATE ON infprevia.pretensao
  FOR EACH ROW EXECUTE PROCEDURE confronta_pretensao();

select confronta(7, 28);

select * from infprevia.pretensao;
select * from infprevia.confrontacao;

delete from infprevia.confrontacao;

CREATE OR REPLACE FUNCTION intercepta(p integer, camada integer, t character varying(80), c character varying(80), u integer)
    RETURNS void AS $$
     DECLARE geo character varying(80);
     DECLARE sumario text; 
    BEGIN
      sumario = '''Para o local assinalado o instrumento de gestão territorial é o Plano Diretor Municipal, publicado no Diário da República, 2.ª série – N.º44 de 1 de março, através do Aviso n.º3341/2012. O terreno insere-se em solo urbano, na categoria de solo urbanizado – Espaços de Atividades Económicas. ''';
      -- sumario = '''Teste''';
      geo = t || '.' || c;
      RAISE NOTICE 'Vai interceptar infprevia.pretensao.the_geom com %', geo;
      EXECUTE 'INSERT INTO infprevia.confrontacao (idpretensao, idcamada, the_geom, area, idutilizador, dominio, subdominio, familia, objecto, ident_gene, ident_part, diploma_es, parecer, entidade, sumario, texto) ' ||
      'select ' || p || ', ' || camada || ', ST_Intersection(infprevia.pretensao.the_geom,' || geo || '), st_area(ST_Intersection(infprevia.pretensao.the_geom, ' || geo || ')), ' || u || ', ' ||
      t || '.dominio, ' || t || '.subdominio, ' || t || '.familia, ' || t || '.objecto, ' || t || '.ident_gene, ' || t || '.ident_part, ' || t || '.diploma_es, ' || t || '.parecer, ' || t || '.entidade, ' || sumario || ' , '|| t || '.texto ' ||
      'from infprevia.pretensao, ' || t || ' '
      'where infprevia.pretensao.id = ' || p || ' and ST_Intersects(infprevia.pretensao.the_geom, ' || geo || ')';
    END;
    $$ LANGUAGE plpgsql;

-- delete from infprevia.pretensao where id = 34;
  
  dominio, subdominio, familia, objecto, ident_gene, ident_part, diploma_es, texto

  

CREATE TABLE ip_condicionantes.caminho_ferro
(
  id serial NOT NULL,
  geom geometry,
  gid integer,
  cod_cart integer,
  sub_domini character varying(254),
  familia character varying(254),
  cod_sub integer,
  cod_fam integer,
  distancia numeric,
  texto text,
  parecer character varying(80),
  entidade character varying(80),
  CONSTRAINT caminho_ferro_pkey PRIMARY KEY (id),
  CONSTRAINT enforce_dims_geom CHECK (st_ndims(geom) = 2),
  CONSTRAINT enforce_geotype_geom CHECK (geometrytype(geom) = 'MULTIPOLYGON'::text OR geom IS NULL),
  CONSTRAINT enforce_srid_geom CHECK (st_srid(geom) = 3763)
)
WITH (
  OIDS=FALSE
);

select * from infprevia.camada


INSERT INTO "infprevia"."pretensao" ( "designacao","relatorio","the_geom","dataregisto","datamodificacao","idutilizador","area" ) VALUES ( 'Acabadinho de pescar',null,ST_GeomFromText('POLYGON ((-25694.553244778 100147.11401639, -25714.895191515 100126.77206965, -25742.384308728 100148.21358108, -25712.146279794 100164.15726906, -25694.553244778 100147.11401639))', 3763),'1970-01-01T00:00:00Z','1970-01-01T00:00:00Z',31,null)
