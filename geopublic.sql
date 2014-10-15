--
-- PostgreSQL database dump
--

-- Dumped from database version 9.3.5
-- Dumped by pg_dump version 9.3.5
-- Started on 2014-10-14 14:11:28 WEST

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

--
-- TOC entry 9 (class 2615 OID 99226)
-- Name: ppgis; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA ppgis;


SET search_path = ppgis, pg_catalog;

--
-- TOC entry 1531 (class 1255 OID 178262)
-- Name: updateparticipationstate(); Type: FUNCTION; Schema: ppgis; Owner: -
--

CREATE FUNCTION updateparticipationstate() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
estado integer;
  BEGIN
    SELECT idestado INTO STRICT estado FROM ppgis.ocorrencia WHERE ppgis.ocorrencia.id = new.idocorrencia;
    IF NEW.idestado IS NULL THEN
            NEW.idestado = estado;
    ELSE
	IF NEW.idestado != estado THEN
          UPDATE ppgis.ocorrencia
          SET idestado = new.idestado,
            datamodificacao = now()
          WHERE ppgis.ocorrencia.id = new.idocorrencia;
        END IF;
  END IF;
     RETURN NEW;
  END;
$$;


SET default_tablespace = '';

SET default_with_oids = false;

--
-- TOC entry 315 (class 1259 OID 178198)
-- Name: comentario; Type: TABLE; Schema: ppgis; Owner: -; Tablespace: 
--

CREATE TABLE comentario (
    id integer NOT NULL,
    comentario character varying(255),
    datacriacao timestamp with time zone DEFAULT now(),
    datamodificacao timestamp with time zone DEFAULT now(),
    idocorrencia integer,
    idutilizador integer NOT NULL,
    idestado integer NOT NULL
);


--
-- TOC entry 314 (class 1259 OID 178196)
-- Name: comentario_id_seq; Type: SEQUENCE; Schema: ppgis; Owner: -
--

CREATE SEQUENCE comentario_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3914 (class 0 OID 0)
-- Dependencies: 314
-- Name: comentario_id_seq; Type: SEQUENCE OWNED BY; Schema: ppgis; Owner: -
--

ALTER SEQUENCE comentario_id_seq OWNED BY comentario.id;


--
-- TOC entry 309 (class 1259 OID 178047)
-- Name: estado; Type: TABLE; Schema: ppgis; Owner: -; Tablespace: 
--

CREATE TABLE estado (
    id integer NOT NULL,
    idplano integer NOT NULL,
    estado character varying(30),
    significado character varying(200),
    color character varying(24),
    icon character varying(250)
);


--
-- TOC entry 313 (class 1259 OID 178173)
-- Name: fotografia; Type: TABLE; Schema: ppgis; Owner: -; Tablespace: 
--

CREATE TABLE fotografia (
    id integer NOT NULL,
    idocorrencia integer NOT NULL,
    pasta character varying(255),
    caminho character varying(255) NOT NULL,
    observacoes text,
    idutilizador integer NOT NULL,
    tamanho integer,
    largura integer,
    altura integer,
    inapropriada boolean DEFAULT false NOT NULL,
    datacriacao timestamp with time zone DEFAULT now(),
    datamodificacao timestamp with time zone DEFAULT now()
);


--
-- TOC entry 312 (class 1259 OID 178171)
-- Name: fotografia_id_seq; Type: SEQUENCE; Schema: ppgis; Owner: -
--

CREATE SEQUENCE fotografia_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3915 (class 0 OID 0)
-- Dependencies: 312
-- Name: fotografia_id_seq; Type: SEQUENCE OWNED BY; Schema: ppgis; Owner: -
--

ALTER SEQUENCE fotografia_id_seq OWNED BY fotografia.id;


--
-- TOC entry 317 (class 1259 OID 178237)
-- Name: fotografiatmp; Type: TABLE; Schema: ppgis; Owner: -; Tablespace: 
--

CREATE TABLE fotografiatmp (
    id integer NOT NULL,
    sessionid character varying(24),
    pasta character varying(255),
    caminho character varying(255) NOT NULL,
    observacoes text,
    idutilizador integer NOT NULL,
    tamanho integer,
    largura integer,
    altura integer,
    inapropriada boolean DEFAULT false NOT NULL,
    datacriacao timestamp with time zone DEFAULT now(),
    datamodificacao timestamp with time zone DEFAULT now()
);


--
-- TOC entry 316 (class 1259 OID 178235)
-- Name: fotografiatmp_id_seq; Type: SEQUENCE; Schema: ppgis; Owner: -
--

CREATE SEQUENCE fotografiatmp_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3916 (class 0 OID 0)
-- Dependencies: 316
-- Name: fotografiatmp_id_seq; Type: SEQUENCE OWNED BY; Schema: ppgis; Owner: -
--

ALTER SEQUENCE fotografiatmp_id_seq OWNED BY fotografiatmp.id;


--
-- TOC entry 311 (class 1259 OID 178136)
-- Name: ocorrencia; Type: TABLE; Schema: ppgis; Owner: -; Tablespace: 
--

CREATE TABLE ocorrencia (
    id integer NOT NULL,
    idplano integer NOT NULL,
    idestado integer NOT NULL,
    idtipoocorrencia integer,
    titulo character varying(100),
    participacao character varying(255),
    the_geom public.geometry(Point,900913),
    idutilizador integer NOT NULL,
    apagado boolean DEFAULT false NOT NULL,
    datacriacao timestamp with time zone DEFAULT now(),
    datamodificacao timestamp with time zone DEFAULT now(),
    CONSTRAINT enforce_dims_the_geom CHECK ((public.st_ndims(the_geom) = 2)),
    CONSTRAINT enforce_geotype_the_geom CHECK (((public.geometrytype(the_geom) = 'POINT'::text) OR (the_geom IS NULL))),
    CONSTRAINT enforce_srid_the_geom CHECK ((public.st_srid(the_geom) = 900913))
);


--
-- TOC entry 310 (class 1259 OID 178134)
-- Name: ocorrencia_id_seq; Type: SEQUENCE; Schema: ppgis; Owner: -
--

CREATE SEQUENCE ocorrencia_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3917 (class 0 OID 0)
-- Dependencies: 310
-- Name: ocorrencia_id_seq; Type: SEQUENCE OWNED BY; Schema: ppgis; Owner: -
--

ALTER SEQUENCE ocorrencia_id_seq OWNED BY ocorrencia.id;


--
-- TOC entry 232 (class 1259 OID 99306)
-- Name: plano; Type: TABLE; Schema: ppgis; Owner: -; Tablespace: 
--

CREATE TABLE plano (
    id integer NOT NULL,
    idpromotor integer NOT NULL,
    designacao character varying(100) NOT NULL,
    descricao text,
    responsavel character varying(100) NOT NULL,
    email character varying(50) NOT NULL,
    site character varying(120),
    inicio timestamp with time zone DEFAULT now() NOT NULL,
    fim timestamp with time zone DEFAULT (now() + '30 days'::interval) NOT NULL,
    datamodificacao timestamp with time zone DEFAULT now() NOT NULL,
    idutilizador integer NOT NULL,
    the_geom public.geometry(Polygon,900913)
);


--
-- TOC entry 231 (class 1259 OID 99304)
-- Name: plano_id_seq; Type: SEQUENCE; Schema: ppgis; Owner: -
--

CREATE SEQUENCE plano_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3918 (class 0 OID 0)
-- Dependencies: 231
-- Name: plano_id_seq; Type: SEQUENCE OWNED BY; Schema: ppgis; Owner: -
--

ALTER SEQUENCE plano_id_seq OWNED BY plano.id;


--
-- TOC entry 230 (class 1259 OID 99291)
-- Name: promotor; Type: TABLE; Schema: ppgis; Owner: -; Tablespace: 
--

CREATE TABLE promotor (
    id integer NOT NULL,
    designacao character varying(100) NOT NULL,
    email character varying(50) NOT NULL,
    site character varying(120),
    dataregisto timestamp with time zone DEFAULT now() NOT NULL,
    datamodificacao timestamp with time zone DEFAULT now() NOT NULL,
    idutilizador integer NOT NULL,
    logotipo character varying(255)
);


--
-- TOC entry 229 (class 1259 OID 99289)
-- Name: promotor_id_seq; Type: SEQUENCE; Schema: ppgis; Owner: -
--

CREATE SEQUENCE promotor_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3919 (class 0 OID 0)
-- Dependencies: 229
-- Name: promotor_id_seq; Type: SEQUENCE OWNED BY; Schema: ppgis; Owner: -
--

ALTER SEQUENCE promotor_id_seq OWNED BY promotor.id;


--
-- TOC entry 308 (class 1259 OID 178005)
-- Name: tipoocorrencia; Type: TABLE; Schema: ppgis; Owner: -; Tablespace: 
--

CREATE TABLE tipoocorrencia (
    id integer NOT NULL,
    idplano integer NOT NULL,
    designacao character varying(100) NOT NULL,
    ativa boolean DEFAULT true,
    datamodificacao timestamp with time zone DEFAULT now() NOT NULL,
    idutilizador integer NOT NULL,
    classe integer
);


SET search_path = public, pg_catalog;

--
-- TOC entry 212 (class 1259 OID 39876)
-- Name: grupo; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE grupo (
    id integer NOT NULL,
    nome character varying(45) NOT NULL,
    datacriacao timestamp with time zone DEFAULT now(),
    datamodificacao timestamp with time zone,
    idutilizador integer
);


--
-- TOC entry 213 (class 1259 OID 39880)
-- Name: grupo_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE grupo_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3920 (class 0 OID 0)
-- Dependencies: 213
-- Name: grupo_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE grupo_id_seq OWNED BY grupo.id;


--
-- TOC entry 214 (class 1259 OID 39882)
-- Name: menu; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE menu (
    id integer NOT NULL,
    titulo character varying(45) NOT NULL,
    icon character varying(15),
    idsuperior integer,
    class character varying(45),
    anonimo boolean DEFAULT false
);


--
-- TOC entry 215 (class 1259 OID 39886)
-- Name: menu_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE menu_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3921 (class 0 OID 0)
-- Dependencies: 215
-- Name: menu_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE menu_id_seq OWNED BY menu.id;


--
-- TOC entry 216 (class 1259 OID 39888)
-- Name: permissao; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE permissao (
    idmenu integer,
    idgrupo integer
);


--
-- TOC entry 222 (class 1259 OID 86677)
-- Name: social; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE social (
    id integer NOT NULL,
    nome character varying(20),
    appkey character varying(80)
);


--
-- TOC entry 221 (class 1259 OID 86675)
-- Name: redesocial_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE redesocial_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3922 (class 0 OID 0)
-- Dependencies: 221
-- Name: redesocial_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE redesocial_id_seq OWNED BY social.id;


--
-- TOC entry 220 (class 1259 OID 71430)
-- Name: sessao; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE sessao (
    id integer NOT NULL,
    userid integer NOT NULL,
    sessionid character varying(24),
    datalogin timestamp with time zone DEFAULT now(),
    datalogout timestamp with time zone,
    ativo boolean DEFAULT true,
    ip character varying(45),
    hostname character varying(45),
    dataultimaatividade timestamp with time zone DEFAULT now(),
    browser character varying(120),
    reaproveitada integer DEFAULT 0,
    socialid integer
);


--
-- TOC entry 219 (class 1259 OID 71428)
-- Name: sessao_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE sessao_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3923 (class 0 OID 0)
-- Dependencies: 219
-- Name: sessao_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE sessao_id_seq OWNED BY sessao.id;


--
-- TOC entry 217 (class 1259 OID 39891)
-- Name: utilizador; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE utilizador (
    id integer NOT NULL,
    login character varying(20),
    password character varying(100),
    idgrupo integer,
    email character varying(100),
    fotografia character varying(1024),
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
    CONSTRAINT enforce_dims_geometria CHECK ((st_ndims(ponto) = 2)),
    CONSTRAINT enforce_geotype_geometria CHECK (((geometrytype(ponto) = 'POINT'::text) OR (ponto IS NULL))),
    CONSTRAINT enforce_srid_geometria CHECK ((st_srid(ponto) = 3763))
);


--
-- TOC entry 218 (class 1259 OID 39903)
-- Name: utilizador_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE utilizador_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3924 (class 0 OID 0)
-- Dependencies: 218
-- Name: utilizador_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE utilizador_id_seq OWNED BY utilizador.id;


SET search_path = ppgis, pg_catalog;

--
-- TOC entry 3736 (class 2604 OID 178201)
-- Name: id; Type: DEFAULT; Schema: ppgis; Owner: -
--

ALTER TABLE ONLY comentario ALTER COLUMN id SET DEFAULT nextval('comentario_id_seq'::regclass);


--
-- TOC entry 3732 (class 2604 OID 178176)
-- Name: id; Type: DEFAULT; Schema: ppgis; Owner: -
--

ALTER TABLE ONLY fotografia ALTER COLUMN id SET DEFAULT nextval('fotografia_id_seq'::regclass);


--
-- TOC entry 3739 (class 2604 OID 178240)
-- Name: id; Type: DEFAULT; Schema: ppgis; Owner: -
--

ALTER TABLE ONLY fotografiatmp ALTER COLUMN id SET DEFAULT nextval('fotografiatmp_id_seq'::regclass);


--
-- TOC entry 3725 (class 2604 OID 178139)
-- Name: id; Type: DEFAULT; Schema: ppgis; Owner: -
--

ALTER TABLE ONLY ocorrencia ALTER COLUMN id SET DEFAULT nextval('ocorrencia_id_seq'::regclass);


--
-- TOC entry 3719 (class 2604 OID 99309)
-- Name: id; Type: DEFAULT; Schema: ppgis; Owner: -
--

ALTER TABLE ONLY plano ALTER COLUMN id SET DEFAULT nextval('plano_id_seq'::regclass);


--
-- TOC entry 3716 (class 2604 OID 99294)
-- Name: id; Type: DEFAULT; Schema: ppgis; Owner: -
--

ALTER TABLE ONLY promotor ALTER COLUMN id SET DEFAULT nextval('promotor_id_seq'::regclass);


SET search_path = public, pg_catalog;

--
-- TOC entry 3699 (class 2604 OID 39905)
-- Name: id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY grupo ALTER COLUMN id SET DEFAULT nextval('grupo_id_seq'::regclass);


--
-- TOC entry 3701 (class 2604 OID 39906)
-- Name: id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY menu ALTER COLUMN id SET DEFAULT nextval('menu_id_seq'::regclass);


--
-- TOC entry 3710 (class 2604 OID 71433)
-- Name: id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY sessao ALTER COLUMN id SET DEFAULT nextval('sessao_id_seq'::regclass);


--
-- TOC entry 3715 (class 2604 OID 86680)
-- Name: id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY social ALTER COLUMN id SET DEFAULT nextval('redesocial_id_seq'::regclass);


--
-- TOC entry 3705 (class 2604 OID 39907)
-- Name: id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY utilizador ALTER COLUMN id SET DEFAULT nextval('utilizador_id_seq'::regclass);


SET search_path = ppgis, pg_catalog;

--
-- TOC entry 3770 (class 2606 OID 178205)
-- Name: comentario_pkey; Type: CONSTRAINT; Schema: ppgis; Owner: -; Tablespace: 
--

ALTER TABLE ONLY comentario
    ADD CONSTRAINT comentario_pkey PRIMARY KEY (id);


--
-- TOC entry 3764 (class 2606 OID 178051)
-- Name: estado_pkey; Type: CONSTRAINT; Schema: ppgis; Owner: -; Tablespace: 
--

ALTER TABLE ONLY estado
    ADD CONSTRAINT estado_pkey PRIMARY KEY (id, idplano);


--
-- TOC entry 3768 (class 2606 OID 178184)
-- Name: fotografia_pk; Type: CONSTRAINT; Schema: ppgis; Owner: -; Tablespace: 
--

ALTER TABLE ONLY fotografia
    ADD CONSTRAINT fotografia_pk PRIMARY KEY (id);


--
-- TOC entry 3772 (class 2606 OID 178248)
-- Name: fotografiatmp_pk; Type: CONSTRAINT; Schema: ppgis; Owner: -; Tablespace: 
--

ALTER TABLE ONLY fotografiatmp
    ADD CONSTRAINT fotografiatmp_pk PRIMARY KEY (id);


--
-- TOC entry 3766 (class 2606 OID 178150)
-- Name: ocorrencia_pkey; Type: CONSTRAINT; Schema: ppgis; Owner: -; Tablespace: 
--

ALTER TABLE ONLY ocorrencia
    ADD CONSTRAINT ocorrencia_pkey PRIMARY KEY (id);


--
-- TOC entry 3760 (class 2606 OID 99317)
-- Name: plano_pkey; Type: CONSTRAINT; Schema: ppgis; Owner: -; Tablespace: 
--

ALTER TABLE ONLY plano
    ADD CONSTRAINT plano_pkey PRIMARY KEY (id);


--
-- TOC entry 3758 (class 2606 OID 99298)
-- Name: promotor_pkey; Type: CONSTRAINT; Schema: ppgis; Owner: -; Tablespace: 
--

ALTER TABLE ONLY promotor
    ADD CONSTRAINT promotor_pkey PRIMARY KEY (id);


--
-- TOC entry 3762 (class 2606 OID 178011)
-- Name: tipoocorrencia_pkey; Type: CONSTRAINT; Schema: ppgis; Owner: -; Tablespace: 
--

ALTER TABLE ONLY tipoocorrencia
    ADD CONSTRAINT tipoocorrencia_pkey PRIMARY KEY (id, idplano);


SET search_path = public, pg_catalog;

--
-- TOC entry 3744 (class 2606 OID 39909)
-- Name: grupo_pkey; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY grupo
    ADD CONSTRAINT grupo_pkey PRIMARY KEY (id);


--
-- TOC entry 3746 (class 2606 OID 39911)
-- Name: menu_pkey; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY menu
    ADD CONSTRAINT menu_pkey PRIMARY KEY (id);


--
-- TOC entry 3756 (class 2606 OID 86682)
-- Name: redesocial_pkey; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY social
    ADD CONSTRAINT redesocial_pkey PRIMARY KEY (id);


--
-- TOC entry 3752 (class 2606 OID 71439)
-- Name: sessao_pkey; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY sessao
    ADD CONSTRAINT sessao_pkey PRIMARY KEY (id);


--
-- TOC entry 3748 (class 2606 OID 39913)
-- Name: utilizador_login_key; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY utilizador
    ADD CONSTRAINT utilizador_login_key UNIQUE (login);


--
-- TOC entry 3750 (class 2606 OID 39915)
-- Name: utilizador_pkey; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY utilizador
    ADD CONSTRAINT utilizador_pkey PRIMARY KEY (id);


--
-- TOC entry 3753 (class 1259 OID 71445)
-- Name: sessao_sessionid_idx; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX sessao_sessionid_idx ON sessao USING btree (sessionid);


--
-- TOC entry 3754 (class 1259 OID 71446)
-- Name: sessao_userid_idx; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX sessao_userid_idx ON sessao USING btree (userid);


SET search_path = ppgis, pg_catalog;

--
-- TOC entry 3794 (class 2620 OID 178263)
-- Name: triggerUpdateParticipationState; Type: TRIGGER; Schema: ppgis; Owner: -
--

CREATE TRIGGER "triggerUpdateParticipationState" BEFORE INSERT OR UPDATE ON comentario FOR EACH ROW EXECUTE PROCEDURE updateparticipationstate();


--
-- TOC entry 3792 (class 2606 OID 178206)
-- Name: comentario_ocorrencia_fk; Type: FK CONSTRAINT; Schema: ppgis; Owner: -
--

ALTER TABLE ONLY comentario
    ADD CONSTRAINT comentario_ocorrencia_fk FOREIGN KEY (idocorrencia) REFERENCES ocorrencia(id);


--
-- TOC entry 3791 (class 2606 OID 178211)
-- Name: comentario_utilizador_fk; Type: FK CONSTRAINT; Schema: ppgis; Owner: -
--

ALTER TABLE ONLY comentario
    ADD CONSTRAINT comentario_utilizador_fk FOREIGN KEY (idutilizador) REFERENCES public.utilizador(id);


--
-- TOC entry 3784 (class 2606 OID 178052)
-- Name: estado_plano_fk; Type: FK CONSTRAINT; Schema: ppgis; Owner: -
--

ALTER TABLE ONLY estado
    ADD CONSTRAINT estado_plano_fk FOREIGN KEY (idplano) REFERENCES plano(id);


--
-- TOC entry 3790 (class 2606 OID 178185)
-- Name: fotografia_ocorrencia_fk; Type: FK CONSTRAINT; Schema: ppgis; Owner: -
--

ALTER TABLE ONLY fotografia
    ADD CONSTRAINT fotografia_ocorrencia_fk FOREIGN KEY (idocorrencia) REFERENCES ocorrencia(id);


--
-- TOC entry 3789 (class 2606 OID 178190)
-- Name: fotografia_utilizador_fk; Type: FK CONSTRAINT; Schema: ppgis; Owner: -
--

ALTER TABLE ONLY fotografia
    ADD CONSTRAINT fotografia_utilizador_fk FOREIGN KEY (idutilizador) REFERENCES public.utilizador(id);


--
-- TOC entry 3793 (class 2606 OID 178249)
-- Name: fotografia_utilizador_fk; Type: FK CONSTRAINT; Schema: ppgis; Owner: -
--

ALTER TABLE ONLY fotografiatmp
    ADD CONSTRAINT fotografia_utilizador_fk FOREIGN KEY (idutilizador) REFERENCES public.utilizador(id);


--
-- TOC entry 3787 (class 2606 OID 178156)
-- Name: ocorrencia_estado_fk; Type: FK CONSTRAINT; Schema: ppgis; Owner: -
--

ALTER TABLE ONLY ocorrencia
    ADD CONSTRAINT ocorrencia_estado_fk FOREIGN KEY (idestado, idplano) REFERENCES estado(id, idplano);


--
-- TOC entry 3788 (class 2606 OID 178151)
-- Name: ocorrencia_plano_fk; Type: FK CONSTRAINT; Schema: ppgis; Owner: -
--

ALTER TABLE ONLY ocorrencia
    ADD CONSTRAINT ocorrencia_plano_fk FOREIGN KEY (idplano) REFERENCES plano(id);


--
-- TOC entry 3786 (class 2606 OID 178161)
-- Name: ocorrencia_tipoocorrencia_fk; Type: FK CONSTRAINT; Schema: ppgis; Owner: -
--

ALTER TABLE ONLY ocorrencia
    ADD CONSTRAINT ocorrencia_tipoocorrencia_fk FOREIGN KEY (idtipoocorrencia, idplano) REFERENCES tipoocorrencia(id, idplano);


--
-- TOC entry 3785 (class 2606 OID 178166)
-- Name: ocorrencia_utilizador_fk; Type: FK CONSTRAINT; Schema: ppgis; Owner: -
--

ALTER TABLE ONLY ocorrencia
    ADD CONSTRAINT ocorrencia_utilizador_fk FOREIGN KEY (idutilizador) REFERENCES public.utilizador(id);


--
-- TOC entry 3781 (class 2606 OID 99318)
-- Name: plano_promotor_fk; Type: FK CONSTRAINT; Schema: ppgis; Owner: -
--

ALTER TABLE ONLY plano
    ADD CONSTRAINT plano_promotor_fk FOREIGN KEY (idpromotor) REFERENCES promotor(id);


--
-- TOC entry 3780 (class 2606 OID 99323)
-- Name: plano_utilizador_fk; Type: FK CONSTRAINT; Schema: ppgis; Owner: -
--

ALTER TABLE ONLY plano
    ADD CONSTRAINT plano_utilizador_fk FOREIGN KEY (idutilizador) REFERENCES public.utilizador(id);


--
-- TOC entry 3779 (class 2606 OID 99299)
-- Name: promotor_utilizador_fk; Type: FK CONSTRAINT; Schema: ppgis; Owner: -
--

ALTER TABLE ONLY promotor
    ADD CONSTRAINT promotor_utilizador_fk FOREIGN KEY (idutilizador) REFERENCES public.utilizador(id);


--
-- TOC entry 3783 (class 2606 OID 178012)
-- Name: tipoocorrencia_plano_fk; Type: FK CONSTRAINT; Schema: ppgis; Owner: -
--

ALTER TABLE ONLY tipoocorrencia
    ADD CONSTRAINT tipoocorrencia_plano_fk FOREIGN KEY (idplano) REFERENCES plano(id);


--
-- TOC entry 3782 (class 2606 OID 178017)
-- Name: tipoocorrencia_utilizador_fk; Type: FK CONSTRAINT; Schema: ppgis; Owner: -
--

ALTER TABLE ONLY tipoocorrencia
    ADD CONSTRAINT tipoocorrencia_utilizador_fk FOREIGN KEY (idutilizador) REFERENCES public.utilizador(id);


SET search_path = public, pg_catalog;

--
-- TOC entry 3773 (class 2606 OID 39916)
-- Name: grupo_idutilizador_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY grupo
    ADD CONSTRAINT grupo_idutilizador_fkey FOREIGN KEY (idutilizador) REFERENCES utilizador(id);


--
-- TOC entry 3775 (class 2606 OID 39921)
-- Name: permissao_idgrupo_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY permissao
    ADD CONSTRAINT permissao_idgrupo_fkey FOREIGN KEY (idgrupo) REFERENCES grupo(id);


--
-- TOC entry 3774 (class 2606 OID 39926)
-- Name: permissao_idmenu_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY permissao
    ADD CONSTRAINT permissao_idmenu_fkey FOREIGN KEY (idmenu) REFERENCES menu(id);


--
-- TOC entry 3777 (class 2606 OID 86683)
-- Name: sessao_socialid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY sessao
    ADD CONSTRAINT sessao_socialid_fkey FOREIGN KEY (socialid) REFERENCES social(id);


--
-- TOC entry 3778 (class 2606 OID 71440)
-- Name: sessao_utilizador_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY sessao
    ADD CONSTRAINT sessao_utilizador_id_fkey FOREIGN KEY (userid) REFERENCES utilizador(id);


--
-- TOC entry 3776 (class 2606 OID 39931)
-- Name: utilizador_idgrupo_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY utilizador
    ADD CONSTRAINT utilizador_idgrupo_fkey FOREIGN KEY (idgrupo) REFERENCES grupo(id);


-- Completed on 2014-10-14 14:11:28 WEST

--
-- PostgreSQL database dump complete
--

