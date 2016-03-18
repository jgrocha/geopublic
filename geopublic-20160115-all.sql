--
-- PostgreSQL database dump
--

-- Dumped from database version 9.3.10
-- Dumped by pg_dump version 9.3.10
-- Started on 2016-01-15 18:55:49 WET

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

--
-- TOC entry 6 (class 2615 OID 45736)
-- Name: ppgis; Type: SCHEMA; Schema: -; Owner: geobox
--

CREATE SCHEMA ppgis;


ALTER SCHEMA ppgis OWNER TO geobox;

SET search_path = ppgis, pg_catalog;

--
-- TOC entry 1421 (class 1255 OID 235121)
-- Name: createdefaultlayer(); Type: FUNCTION; Schema: ppgis; Owner: geobox
--

CREATE FUNCTION createdefaultlayer() RETURNS trigger
    LANGUAGE plpgsql
    AS $_$
DECLARE
estado integer;
  BEGIN
    INSERT INTO public.tema (ord, titulo, url, tipo, srid, activo, visivel, idutilizador, idplano) 
VALUES (10, 'OSM', 'http://a.tile.openstreetmap.org/${z}/${x}/${y}.png,http://b.tile.openstreetmap.org/${z}/${x}/${y}.png,http://c.tile.openstreetmap.org/${z}/${x}/${y}.png',
'OSM', 3857, TRUE, TRUE, NEW.idutilizador, NEW.id);

INSERT INTO ppgis.estado (id, idplano, estado, significado, color, icon) 
VALUES (1, NEW.id, 'Submitted', 'Participation submitted', 'red', 'resources/images/traffic-cone-icon-red-32.png');

     RETURN NEW;
  END;
$_$;


ALTER FUNCTION ppgis.createdefaultlayer() OWNER TO geobox;

--
-- TOC entry 1417 (class 1255 OID 45737)
-- Name: updateparticipationstate(); Type: FUNCTION; Schema: ppgis; Owner: geobox
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


ALTER FUNCTION ppgis.updateparticipationstate() OWNER TO geobox;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- TOC entry 186 (class 1259 OID 45738)
-- Name: comentario; Type: TABLE; Schema: ppgis; Owner: geobox; Tablespace: 
--

CREATE TABLE comentario (
    id integer NOT NULL,
    comentario text,
    datacriacao timestamp with time zone DEFAULT now(),
    datamodificacao timestamp with time zone DEFAULT now(),
    idocorrencia integer,
    idutilizador integer NOT NULL,
    idestado integer NOT NULL,
    apagado boolean DEFAULT false NOT NULL
);


ALTER TABLE ppgis.comentario OWNER TO geobox;

--
-- TOC entry 187 (class 1259 OID 45743)
-- Name: comentario_id_seq; Type: SEQUENCE; Schema: ppgis; Owner: geobox
--

CREATE SEQUENCE comentario_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE ppgis.comentario_id_seq OWNER TO geobox;

--
-- TOC entry 3814 (class 0 OID 0)
-- Dependencies: 187
-- Name: comentario_id_seq; Type: SEQUENCE OWNED BY; Schema: ppgis; Owner: geobox
--

ALTER SEQUENCE comentario_id_seq OWNED BY comentario.id;


--
-- TOC entry 188 (class 1259 OID 45745)
-- Name: estado; Type: TABLE; Schema: ppgis; Owner: geobox; Tablespace: 
--

CREATE TABLE estado (
    id integer NOT NULL,
    idplano integer NOT NULL,
    estado character varying(30),
    significado character varying(200),
    color character varying(24),
    icon character varying(250)
);


ALTER TABLE ppgis.estado OWNER TO geobox;

--
-- TOC entry 189 (class 1259 OID 45751)
-- Name: fotografia; Type: TABLE; Schema: ppgis; Owner: geobox; Tablespace: 
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
    datamodificacao timestamp with time zone DEFAULT now(),
    apagado boolean DEFAULT false NOT NULL,
    name character varying(255)
);


ALTER TABLE ppgis.fotografia OWNER TO geobox;

--
-- TOC entry 190 (class 1259 OID 45760)
-- Name: fotografia_id_seq; Type: SEQUENCE; Schema: ppgis; Owner: geobox
--

CREATE SEQUENCE fotografia_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE ppgis.fotografia_id_seq OWNER TO geobox;

--
-- TOC entry 3815 (class 0 OID 0)
-- Dependencies: 190
-- Name: fotografia_id_seq; Type: SEQUENCE OWNED BY; Schema: ppgis; Owner: geobox
--

ALTER SEQUENCE fotografia_id_seq OWNED BY fotografia.id;


--
-- TOC entry 191 (class 1259 OID 45762)
-- Name: fotografiatmp; Type: TABLE; Schema: ppgis; Owner: geobox; Tablespace: 
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
    datamodificacao timestamp with time zone DEFAULT now(),
    name character varying(255)
);


ALTER TABLE ppgis.fotografiatmp OWNER TO geobox;

--
-- TOC entry 192 (class 1259 OID 45771)
-- Name: fotografiatmp_id_seq; Type: SEQUENCE; Schema: ppgis; Owner: geobox
--

CREATE SEQUENCE fotografiatmp_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE ppgis.fotografiatmp_id_seq OWNER TO geobox;

--
-- TOC entry 3816 (class 0 OID 0)
-- Dependencies: 192
-- Name: fotografiatmp_id_seq; Type: SEQUENCE OWNED BY; Schema: ppgis; Owner: geobox
--

ALTER SEQUENCE fotografiatmp_id_seq OWNED BY fotografiatmp.id;


--
-- TOC entry 193 (class 1259 OID 45773)
-- Name: ocorrencia; Type: TABLE; Schema: ppgis; Owner: geobox; Tablespace: 
--

CREATE TABLE ocorrencia (
    id integer NOT NULL,
    idplano integer NOT NULL,
    idestado integer NOT NULL,
    idtipoocorrencia integer,
    titulo character varying(100),
    participacao text,
    the_geom public.geometry(Point,900913),
    idutilizador integer NOT NULL,
    apagado boolean DEFAULT false NOT NULL,
    datacriacao timestamp with time zone DEFAULT now(),
    datamodificacao timestamp with time zone DEFAULT now(),
    proposta text,
    CONSTRAINT enforce_dims_the_geom CHECK ((public.st_ndims(the_geom) = 2)),
    CONSTRAINT enforce_geotype_the_geom CHECK (((public.geometrytype(the_geom) = 'POINT'::text) OR (the_geom IS NULL))),
    CONSTRAINT enforce_srid_the_geom CHECK ((public.st_srid(the_geom) = 900913))
);


ALTER TABLE ppgis.ocorrencia OWNER TO geobox;

--
-- TOC entry 194 (class 1259 OID 45785)
-- Name: ocorrencia_id_seq; Type: SEQUENCE; Schema: ppgis; Owner: geobox
--

CREATE SEQUENCE ocorrencia_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE ppgis.ocorrencia_id_seq OWNER TO geobox;

--
-- TOC entry 3817 (class 0 OID 0)
-- Dependencies: 194
-- Name: ocorrencia_id_seq; Type: SEQUENCE OWNED BY; Schema: ppgis; Owner: geobox
--

ALTER SEQUENCE ocorrencia_id_seq OWNED BY ocorrencia.id;


--
-- TOC entry 195 (class 1259 OID 45787)
-- Name: plano; Type: TABLE; Schema: ppgis; Owner: geobox; Tablespace: 
--

CREATE TABLE plano (
    id integer NOT NULL,
    idpromotor integer NOT NULL,
    designacao character varying(100) NOT NULL,
    descricao text,
    responsavel character varying(100) NOT NULL,
    email character varying(120) NOT NULL,
    site character varying(120),
    inicio timestamp with time zone DEFAULT now() NOT NULL,
    fim timestamp with time zone DEFAULT (now() + '30 days'::interval) NOT NULL,
    datamodificacao timestamp with time zone DEFAULT now() NOT NULL,
    idutilizador integer NOT NULL,
    the_geom public.geometry(Polygon,900913),
    proposta text,
    alternativeproposta boolean,
    active boolean,
    planocls character varying(24)
);


ALTER TABLE ppgis.plano OWNER TO geobox;

--
-- TOC entry 3818 (class 0 OID 0)
-- Dependencies: 195
-- Name: TABLE plano; Type: COMMENT; Schema: ppgis; Owner: geobox
--

COMMENT ON TABLE plano IS 'If plano.the_geom exists, then the disuccsion is map based, with one geographic feature for each participation
If plano.proposta exists, then the discussion is about something without geographic features
If plano.proposta exists, the promotor can decide if alternative text forms can be provided by citizens, using the plano.alternativetext (yes or no)';


--
-- TOC entry 196 (class 1259 OID 45796)
-- Name: plano_id_seq; Type: SEQUENCE; Schema: ppgis; Owner: geobox
--

CREATE SEQUENCE plano_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE ppgis.plano_id_seq OWNER TO geobox;

--
-- TOC entry 3819 (class 0 OID 0)
-- Dependencies: 196
-- Name: plano_id_seq; Type: SEQUENCE OWNED BY; Schema: ppgis; Owner: geobox
--

ALTER SEQUENCE plano_id_seq OWNED BY plano.id;


--
-- TOC entry 197 (class 1259 OID 45798)
-- Name: promotor; Type: TABLE; Schema: ppgis; Owner: geobox; Tablespace: 
--

CREATE TABLE promotor (
    id integer NOT NULL,
    designacao character varying(100) NOT NULL,
    email character varying(50) NOT NULL,
    site character varying(120),
    dataregisto timestamp with time zone DEFAULT now() NOT NULL,
    datamodificacao timestamp with time zone DEFAULT now() NOT NULL,
    idutilizador integer NOT NULL,
    logotipo character varying(255),
    active boolean DEFAULT true
);


ALTER TABLE ppgis.promotor OWNER TO geobox;

--
-- TOC entry 198 (class 1259 OID 45806)
-- Name: promotor_id_seq; Type: SEQUENCE; Schema: ppgis; Owner: geobox
--

CREATE SEQUENCE promotor_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE ppgis.promotor_id_seq OWNER TO geobox;

--
-- TOC entry 3820 (class 0 OID 0)
-- Dependencies: 198
-- Name: promotor_id_seq; Type: SEQUENCE OWNED BY; Schema: ppgis; Owner: geobox
--

ALTER SEQUENCE promotor_id_seq OWNED BY promotor.id;


--
-- TOC entry 199 (class 1259 OID 45808)
-- Name: tipoocorrencia; Type: TABLE; Schema: ppgis; Owner: geobox; Tablespace: 
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


ALTER TABLE ppgis.tipoocorrencia OWNER TO geobox;

SET search_path = public, pg_catalog;

--
-- TOC entry 200 (class 1259 OID 45813)
-- Name: grupo; Type: TABLE; Schema: public; Owner: geobox; Tablespace: 
--

CREATE TABLE grupo (
    id integer NOT NULL,
    nome character varying(45) NOT NULL,
    datacriacao timestamp with time zone DEFAULT now(),
    datamodificacao timestamp with time zone,
    idutilizador integer,
    omissao boolean DEFAULT false NOT NULL
);


ALTER TABLE public.grupo OWNER TO geobox;

--
-- TOC entry 201 (class 1259 OID 45817)
-- Name: grupo_id_seq; Type: SEQUENCE; Schema: public; Owner: geobox
--

CREATE SEQUENCE grupo_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.grupo_id_seq OWNER TO geobox;

--
-- TOC entry 3821 (class 0 OID 0)
-- Dependencies: 201
-- Name: grupo_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: geobox
--

ALTER SEQUENCE grupo_id_seq OWNED BY grupo.id;


--
-- TOC entry 210 (class 1259 OID 46188)
-- Name: menu; Type: TABLE; Schema: public; Owner: geobox; Tablespace: 
--

CREATE TABLE menu (
    id integer NOT NULL,
    titulo character varying(45) NOT NULL,
    icon character varying(15),
    idsuperior integer,
    extjsview character varying(45),
    anonimo boolean DEFAULT false
);


ALTER TABLE public.menu OWNER TO geobox;

--
-- TOC entry 211 (class 1259 OID 46192)
-- Name: menu_id_seq; Type: SEQUENCE; Schema: public; Owner: geobox
--

CREATE SEQUENCE menu_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.menu_id_seq OWNER TO geobox;

--
-- TOC entry 3822 (class 0 OID 0)
-- Dependencies: 211
-- Name: menu_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: geobox
--

ALTER SEQUENCE menu_id_seq OWNED BY menu.id;


--
-- TOC entry 208 (class 1259 OID 46165)
-- Name: tema; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE tema (
    ord bigint,
    titulo character varying(120),
    layer character varying(76),
    grupo character varying(120),
    url character varying(512),
    tipo character varying(48),
    srid bigint,
    estilo character varying(255),
    qtip character varying(255),
    singletile boolean,
    activo boolean,
    observacoes character varying(255),
    visivel boolean,
    dataalteracao timestamp without time zone DEFAULT now() NOT NULL,
    id integer NOT NULL,
    datacriacao timestamp with time zone DEFAULT now(),
    datamodificacao timestamp with time zone,
    idutilizador integer,
    base boolean DEFAULT false,
    idplano integer
);


ALTER TABLE public.tema OWNER TO geobox;

--
-- TOC entry 209 (class 1259 OID 46174)
-- Name: pdm_id_seq1; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE pdm_id_seq1
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.pdm_id_seq1 OWNER TO geobox;

--
-- TOC entry 3823 (class 0 OID 0)
-- Dependencies: 209
-- Name: pdm_id_seq1; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE pdm_id_seq1 OWNED BY tema.id;


--
-- TOC entry 212 (class 1259 OID 46194)
-- Name: permissao; Type: TABLE; Schema: public; Owner: geobox; Tablespace: 
--

CREATE TABLE permissao (
    idmenu integer NOT NULL,
    idgrupo integer NOT NULL
);


ALTER TABLE public.permissao OWNER TO geobox;

--
-- TOC entry 202 (class 1259 OID 45828)
-- Name: social; Type: TABLE; Schema: public; Owner: geobox; Tablespace: 
--

CREATE TABLE social (
    id integer NOT NULL,
    nome character varying(20),
    appkey character varying(80)
);


ALTER TABLE public.social OWNER TO geobox;

--
-- TOC entry 203 (class 1259 OID 45831)
-- Name: redesocial_id_seq; Type: SEQUENCE; Schema: public; Owner: geobox
--

CREATE SEQUENCE redesocial_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.redesocial_id_seq OWNER TO geobox;

--
-- TOC entry 3824 (class 0 OID 0)
-- Dependencies: 203
-- Name: redesocial_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: geobox
--

ALTER SEQUENCE redesocial_id_seq OWNED BY social.id;


--
-- TOC entry 204 (class 1259 OID 45833)
-- Name: sessao; Type: TABLE; Schema: public; Owner: geobox; Tablespace: 
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


ALTER TABLE public.sessao OWNER TO geobox;

--
-- TOC entry 205 (class 1259 OID 45840)
-- Name: sessao_id_seq; Type: SEQUENCE; Schema: public; Owner: geobox
--

CREATE SEQUENCE sessao_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.sessao_id_seq OWNER TO geobox;

--
-- TOC entry 3825 (class 0 OID 0)
-- Dependencies: 205
-- Name: sessao_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: geobox
--

ALTER SEQUENCE sessao_id_seq OWNED BY sessao.id;


--
-- TOC entry 206 (class 1259 OID 45842)
-- Name: utilizador; Type: TABLE; Schema: public; Owner: geobox; Tablespace: 
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


ALTER TABLE public.utilizador OWNER TO geobox;

--
-- TOC entry 207 (class 1259 OID 45855)
-- Name: utilizador_id_seq; Type: SEQUENCE; Schema: public; Owner: geobox
--

CREATE SEQUENCE utilizador_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.utilizador_id_seq OWNER TO geobox;

--
-- TOC entry 3826 (class 0 OID 0)
-- Dependencies: 207
-- Name: utilizador_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: geobox
--

ALTER SEQUENCE utilizador_id_seq OWNED BY utilizador.id;


SET search_path = ppgis, pg_catalog;

--
-- TOC entry 3584 (class 2604 OID 45857)
-- Name: id; Type: DEFAULT; Schema: ppgis; Owner: geobox
--

ALTER TABLE ONLY comentario ALTER COLUMN id SET DEFAULT nextval('comentario_id_seq'::regclass);


--
-- TOC entry 3589 (class 2604 OID 45858)
-- Name: id; Type: DEFAULT; Schema: ppgis; Owner: geobox
--

ALTER TABLE ONLY fotografia ALTER COLUMN id SET DEFAULT nextval('fotografia_id_seq'::regclass);


--
-- TOC entry 3594 (class 2604 OID 45859)
-- Name: id; Type: DEFAULT; Schema: ppgis; Owner: geobox
--

ALTER TABLE ONLY fotografiatmp ALTER COLUMN id SET DEFAULT nextval('fotografiatmp_id_seq'::regclass);


--
-- TOC entry 3598 (class 2604 OID 45860)
-- Name: id; Type: DEFAULT; Schema: ppgis; Owner: geobox
--

ALTER TABLE ONLY ocorrencia ALTER COLUMN id SET DEFAULT nextval('ocorrencia_id_seq'::regclass);


--
-- TOC entry 3605 (class 2604 OID 45861)
-- Name: id; Type: DEFAULT; Schema: ppgis; Owner: geobox
--

ALTER TABLE ONLY plano ALTER COLUMN id SET DEFAULT nextval('plano_id_seq'::regclass);


--
-- TOC entry 3608 (class 2604 OID 45862)
-- Name: id; Type: DEFAULT; Schema: ppgis; Owner: geobox
--

ALTER TABLE ONLY promotor ALTER COLUMN id SET DEFAULT nextval('promotor_id_seq'::regclass);


SET search_path = public, pg_catalog;

--
-- TOC entry 3613 (class 2604 OID 46197)
-- Name: id; Type: DEFAULT; Schema: public; Owner: geobox
--

ALTER TABLE ONLY grupo ALTER COLUMN id SET DEFAULT nextval('grupo_id_seq'::regclass);


--
-- TOC entry 3634 (class 2604 OID 46198)
-- Name: id; Type: DEFAULT; Schema: public; Owner: geobox
--

ALTER TABLE ONLY menu ALTER COLUMN id SET DEFAULT nextval('menu_id_seq'::regclass);


--
-- TOC entry 3620 (class 2604 OID 45865)
-- Name: id; Type: DEFAULT; Schema: public; Owner: geobox
--

ALTER TABLE ONLY sessao ALTER COLUMN id SET DEFAULT nextval('sessao_id_seq'::regclass);


--
-- TOC entry 3615 (class 2604 OID 45866)
-- Name: id; Type: DEFAULT; Schema: public; Owner: geobox
--

ALTER TABLE ONLY social ALTER COLUMN id SET DEFAULT nextval('redesocial_id_seq'::regclass);


--
-- TOC entry 3632 (class 2604 OID 46199)
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY tema ALTER COLUMN id SET DEFAULT nextval('pdm_id_seq1'::regclass);


--
-- TOC entry 3625 (class 2604 OID 45867)
-- Name: id; Type: DEFAULT; Schema: public; Owner: geobox
--

ALTER TABLE ONLY utilizador ALTER COLUMN id SET DEFAULT nextval('utilizador_id_seq'::regclass);


SET search_path = ppgis, pg_catalog;

--
-- TOC entry 3636 (class 2606 OID 45869)
-- Name: comentario_pkey; Type: CONSTRAINT; Schema: ppgis; Owner: geobox; Tablespace: 
--

ALTER TABLE ONLY comentario
    ADD CONSTRAINT comentario_pkey PRIMARY KEY (id);


--
-- TOC entry 3638 (class 2606 OID 45871)
-- Name: estado_pkey; Type: CONSTRAINT; Schema: ppgis; Owner: geobox; Tablespace: 
--

ALTER TABLE ONLY estado
    ADD CONSTRAINT estado_pkey PRIMARY KEY (id, idplano);


--
-- TOC entry 3640 (class 2606 OID 45873)
-- Name: fotografia_pk; Type: CONSTRAINT; Schema: ppgis; Owner: geobox; Tablespace: 
--

ALTER TABLE ONLY fotografia
    ADD CONSTRAINT fotografia_pk PRIMARY KEY (id);


--
-- TOC entry 3642 (class 2606 OID 45875)
-- Name: fotografiatmp_pk; Type: CONSTRAINT; Schema: ppgis; Owner: geobox; Tablespace: 
--

ALTER TABLE ONLY fotografiatmp
    ADD CONSTRAINT fotografiatmp_pk PRIMARY KEY (id);


--
-- TOC entry 3644 (class 2606 OID 45877)
-- Name: ocorrencia_pkey; Type: CONSTRAINT; Schema: ppgis; Owner: geobox; Tablespace: 
--

ALTER TABLE ONLY ocorrencia
    ADD CONSTRAINT ocorrencia_pkey PRIMARY KEY (id);


--
-- TOC entry 3646 (class 2606 OID 45879)
-- Name: plano_pkey; Type: CONSTRAINT; Schema: ppgis; Owner: geobox; Tablespace: 
--

ALTER TABLE ONLY plano
    ADD CONSTRAINT plano_pkey PRIMARY KEY (id);


--
-- TOC entry 3648 (class 2606 OID 45881)
-- Name: promotor_pkey; Type: CONSTRAINT; Schema: ppgis; Owner: geobox; Tablespace: 
--

ALTER TABLE ONLY promotor
    ADD CONSTRAINT promotor_pkey PRIMARY KEY (id);


--
-- TOC entry 3650 (class 2606 OID 45883)
-- Name: tipoocorrencia_pkey; Type: CONSTRAINT; Schema: ppgis; Owner: geobox; Tablespace: 
--

ALTER TABLE ONLY tipoocorrencia
    ADD CONSTRAINT tipoocorrencia_pkey PRIMARY KEY (id, idplano);


SET search_path = public, pg_catalog;

--
-- TOC entry 3652 (class 2606 OID 45885)
-- Name: grupo_pkey; Type: CONSTRAINT; Schema: public; Owner: geobox; Tablespace: 
--

ALTER TABLE ONLY grupo
    ADD CONSTRAINT grupo_pkey PRIMARY KEY (id);


--
-- TOC entry 3664 (class 2606 OID 46180)
-- Name: layer_pk; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY tema
    ADD CONSTRAINT layer_pk PRIMARY KEY (id);


--
-- TOC entry 3666 (class 2606 OID 46201)
-- Name: menu_pkey; Type: CONSTRAINT; Schema: public; Owner: geobox; Tablespace: 
--

ALTER TABLE ONLY menu
    ADD CONSTRAINT menu_pkey PRIMARY KEY (id);


--
-- TOC entry 3668 (class 2606 OID 46203)
-- Name: permissao_pk; Type: CONSTRAINT; Schema: public; Owner: geobox; Tablespace: 
--

ALTER TABLE ONLY permissao
    ADD CONSTRAINT permissao_pk PRIMARY KEY (idmenu, idgrupo);


--
-- TOC entry 3654 (class 2606 OID 45889)
-- Name: redesocial_pkey; Type: CONSTRAINT; Schema: public; Owner: geobox; Tablespace: 
--

ALTER TABLE ONLY social
    ADD CONSTRAINT redesocial_pkey PRIMARY KEY (id);


--
-- TOC entry 3656 (class 2606 OID 45891)
-- Name: sessao_pkey; Type: CONSTRAINT; Schema: public; Owner: geobox; Tablespace: 
--

ALTER TABLE ONLY sessao
    ADD CONSTRAINT sessao_pkey PRIMARY KEY (id);


--
-- TOC entry 3660 (class 2606 OID 45893)
-- Name: utilizador_login_key; Type: CONSTRAINT; Schema: public; Owner: geobox; Tablespace: 
--

ALTER TABLE ONLY utilizador
    ADD CONSTRAINT utilizador_login_key UNIQUE (login);


--
-- TOC entry 3662 (class 2606 OID 45895)
-- Name: utilizador_pkey; Type: CONSTRAINT; Schema: public; Owner: geobox; Tablespace: 
--

ALTER TABLE ONLY utilizador
    ADD CONSTRAINT utilizador_pkey PRIMARY KEY (id);


--
-- TOC entry 3657 (class 1259 OID 45896)
-- Name: sessao_sessionid_idx; Type: INDEX; Schema: public; Owner: geobox; Tablespace: 
--

CREATE INDEX sessao_sessionid_idx ON sessao USING btree (sessionid);


--
-- TOC entry 3658 (class 1259 OID 45897)
-- Name: sessao_userid_idx; Type: INDEX; Schema: public; Owner: geobox; Tablespace: 
--

CREATE INDEX sessao_userid_idx ON sessao USING btree (userid);


SET search_path = ppgis, pg_catalog;

--
-- TOC entry 3693 (class 2620 OID 235122)
-- Name: addlayer; Type: TRIGGER; Schema: ppgis; Owner: geobox
--

CREATE TRIGGER addlayer AFTER INSERT ON plano FOR EACH ROW EXECUTE PROCEDURE createdefaultlayer();


--
-- TOC entry 3692 (class 2620 OID 45898)
-- Name: triggerUpdateParticipationState; Type: TRIGGER; Schema: ppgis; Owner: geobox
--

CREATE TRIGGER "triggerUpdateParticipationState" BEFORE INSERT OR UPDATE ON comentario FOR EACH ROW EXECUTE PROCEDURE updateparticipationstate();


--
-- TOC entry 3670 (class 2606 OID 45899)
-- Name: comentario_ocorrencia_fk; Type: FK CONSTRAINT; Schema: ppgis; Owner: geobox
--

ALTER TABLE ONLY comentario
    ADD CONSTRAINT comentario_ocorrencia_fk FOREIGN KEY (idocorrencia) REFERENCES ocorrencia(id);


--
-- TOC entry 3669 (class 2606 OID 45904)
-- Name: comentario_utilizador_fk; Type: FK CONSTRAINT; Schema: ppgis; Owner: geobox
--

ALTER TABLE ONLY comentario
    ADD CONSTRAINT comentario_utilizador_fk FOREIGN KEY (idutilizador) REFERENCES public.utilizador(id);


--
-- TOC entry 3671 (class 2606 OID 45909)
-- Name: estado_plano_fk; Type: FK CONSTRAINT; Schema: ppgis; Owner: geobox
--

ALTER TABLE ONLY estado
    ADD CONSTRAINT estado_plano_fk FOREIGN KEY (idplano) REFERENCES plano(id);


--
-- TOC entry 3673 (class 2606 OID 45914)
-- Name: fotografia_ocorrencia_fk; Type: FK CONSTRAINT; Schema: ppgis; Owner: geobox
--

ALTER TABLE ONLY fotografia
    ADD CONSTRAINT fotografia_ocorrencia_fk FOREIGN KEY (idocorrencia) REFERENCES ocorrencia(id);


--
-- TOC entry 3672 (class 2606 OID 45919)
-- Name: fotografia_utilizador_fk; Type: FK CONSTRAINT; Schema: ppgis; Owner: geobox
--

ALTER TABLE ONLY fotografia
    ADD CONSTRAINT fotografia_utilizador_fk FOREIGN KEY (idutilizador) REFERENCES public.utilizador(id);


--
-- TOC entry 3674 (class 2606 OID 45924)
-- Name: fotografia_utilizador_fk; Type: FK CONSTRAINT; Schema: ppgis; Owner: geobox
--

ALTER TABLE ONLY fotografiatmp
    ADD CONSTRAINT fotografia_utilizador_fk FOREIGN KEY (idutilizador) REFERENCES public.utilizador(id);


--
-- TOC entry 3678 (class 2606 OID 45929)
-- Name: ocorrencia_estado_fk; Type: FK CONSTRAINT; Schema: ppgis; Owner: geobox
--

ALTER TABLE ONLY ocorrencia
    ADD CONSTRAINT ocorrencia_estado_fk FOREIGN KEY (idestado, idplano) REFERENCES estado(id, idplano);


--
-- TOC entry 3677 (class 2606 OID 45934)
-- Name: ocorrencia_plano_fk; Type: FK CONSTRAINT; Schema: ppgis; Owner: geobox
--

ALTER TABLE ONLY ocorrencia
    ADD CONSTRAINT ocorrencia_plano_fk FOREIGN KEY (idplano) REFERENCES plano(id);


--
-- TOC entry 3676 (class 2606 OID 45939)
-- Name: ocorrencia_tipoocorrencia_fk; Type: FK CONSTRAINT; Schema: ppgis; Owner: geobox
--

ALTER TABLE ONLY ocorrencia
    ADD CONSTRAINT ocorrencia_tipoocorrencia_fk FOREIGN KEY (idtipoocorrencia, idplano) REFERENCES tipoocorrencia(id, idplano);


--
-- TOC entry 3675 (class 2606 OID 45944)
-- Name: ocorrencia_utilizador_fk; Type: FK CONSTRAINT; Schema: ppgis; Owner: geobox
--

ALTER TABLE ONLY ocorrencia
    ADD CONSTRAINT ocorrencia_utilizador_fk FOREIGN KEY (idutilizador) REFERENCES public.utilizador(id);


--
-- TOC entry 3680 (class 2606 OID 45949)
-- Name: plano_promotor_fk; Type: FK CONSTRAINT; Schema: ppgis; Owner: geobox
--

ALTER TABLE ONLY plano
    ADD CONSTRAINT plano_promotor_fk FOREIGN KEY (idpromotor) REFERENCES promotor(id);


--
-- TOC entry 3679 (class 2606 OID 45954)
-- Name: plano_utilizador_fk; Type: FK CONSTRAINT; Schema: ppgis; Owner: geobox
--

ALTER TABLE ONLY plano
    ADD CONSTRAINT plano_utilizador_fk FOREIGN KEY (idutilizador) REFERENCES public.utilizador(id);


--
-- TOC entry 3681 (class 2606 OID 45959)
-- Name: promotor_utilizador_fk; Type: FK CONSTRAINT; Schema: ppgis; Owner: geobox
--

ALTER TABLE ONLY promotor
    ADD CONSTRAINT promotor_utilizador_fk FOREIGN KEY (idutilizador) REFERENCES public.utilizador(id);


--
-- TOC entry 3683 (class 2606 OID 45964)
-- Name: tipoocorrencia_plano_fk; Type: FK CONSTRAINT; Schema: ppgis; Owner: geobox
--

ALTER TABLE ONLY tipoocorrencia
    ADD CONSTRAINT tipoocorrencia_plano_fk FOREIGN KEY (idplano) REFERENCES plano(id);


--
-- TOC entry 3682 (class 2606 OID 45969)
-- Name: tipoocorrencia_utilizador_fk; Type: FK CONSTRAINT; Schema: ppgis; Owner: geobox
--

ALTER TABLE ONLY tipoocorrencia
    ADD CONSTRAINT tipoocorrencia_utilizador_fk FOREIGN KEY (idutilizador) REFERENCES public.utilizador(id);


SET search_path = public, pg_catalog;

--
-- TOC entry 3684 (class 2606 OID 45974)
-- Name: grupo_idutilizador_fkey; Type: FK CONSTRAINT; Schema: public; Owner: geobox
--

ALTER TABLE ONLY grupo
    ADD CONSTRAINT grupo_idutilizador_fkey FOREIGN KEY (idutilizador) REFERENCES utilizador(id);


--
-- TOC entry 3691 (class 2606 OID 46204)
-- Name: permissao_idgrupo_fkey; Type: FK CONSTRAINT; Schema: public; Owner: geobox
--

ALTER TABLE ONLY permissao
    ADD CONSTRAINT permissao_idgrupo_fkey FOREIGN KEY (idgrupo) REFERENCES grupo(id);


--
-- TOC entry 3690 (class 2606 OID 46209)
-- Name: permissao_idmenu_fkey; Type: FK CONSTRAINT; Schema: public; Owner: geobox
--

ALTER TABLE ONLY permissao
    ADD CONSTRAINT permissao_idmenu_fkey FOREIGN KEY (idmenu) REFERENCES menu(id);


--
-- TOC entry 3686 (class 2606 OID 45989)
-- Name: sessao_socialid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: geobox
--

ALTER TABLE ONLY sessao
    ADD CONSTRAINT sessao_socialid_fkey FOREIGN KEY (socialid) REFERENCES social(id);


--
-- TOC entry 3685 (class 2606 OID 45994)
-- Name: sessao_utilizador_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: geobox
--

ALTER TABLE ONLY sessao
    ADD CONSTRAINT sessao_utilizador_id_fkey FOREIGN KEY (userid) REFERENCES utilizador(id);


--
-- TOC entry 3689 (class 2606 OID 46183)
-- Name: tema_idutilizador_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY tema
    ADD CONSTRAINT tema_idutilizador_fkey FOREIGN KEY (idutilizador) REFERENCES utilizador(id);


--
-- TOC entry 3688 (class 2606 OID 232634)
-- Name: tema_plano_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY tema
    ADD CONSTRAINT tema_plano_fk FOREIGN KEY (idplano) REFERENCES ppgis.plano(id);


--
-- TOC entry 3687 (class 2606 OID 45999)
-- Name: utilizador_idgrupo_fkey; Type: FK CONSTRAINT; Schema: public; Owner: geobox
--

ALTER TABLE ONLY utilizador
    ADD CONSTRAINT utilizador_idgrupo_fkey FOREIGN KEY (idgrupo) REFERENCES grupo(id);


--
-- TOC entry 3813 (class 0 OID 0)
-- Dependencies: 7
-- Name: public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM postgres;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO PUBLIC;


-- Completed on 2016-01-15 18:55:49 WET

--
-- PostgreSQL database dump complete
--

