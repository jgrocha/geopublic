--
-- PostgreSQL database dump
--

-- Dumped from database version 9.3.3
-- Dumped by pg_dump version 9.3.3
-- Started on 2014-03-17 12:02:42 WET

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- TOC entry 189 (class 1259 OID 36255)
-- Name: grupo; Type: TABLE; Schema: public; Owner: geobox; Tablespace: 
--

CREATE TABLE grupo (
    id integer NOT NULL,
    nome character varying(45) NOT NULL,
    datacriacao timestamp with time zone DEFAULT now(),
    datamodificacao timestamp with time zone,
    idutilizador integer
);


ALTER TABLE public.grupo OWNER TO geobox;

--
-- TOC entry 188 (class 1259 OID 36253)
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
-- TOC entry 3377 (class 0 OID 0)
-- Dependencies: 188
-- Name: grupo_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: geobox
--

ALTER SEQUENCE grupo_id_seq OWNED BY grupo.id;


--
-- TOC entry 193 (class 1259 OID 36293)
-- Name: menu; Type: TABLE; Schema: public; Owner: geobox; Tablespace: 
--

CREATE TABLE menu (
    id integer NOT NULL,
    titulo character varying(45) NOT NULL,
    icon character varying(15),
    idsuperior integer,
    class character varying(45),
    anonimo boolean DEFAULT false
);


ALTER TABLE public.menu OWNER TO geobox;

--
-- TOC entry 192 (class 1259 OID 36291)
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
-- TOC entry 3378 (class 0 OID 0)
-- Dependencies: 192
-- Name: menu_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: geobox
--

ALTER SEQUENCE menu_id_seq OWNED BY menu.id;


--
-- TOC entry 194 (class 1259 OID 36300)
-- Name: permissao; Type: TABLE; Schema: public; Owner: geobox; Tablespace: 
--

CREATE TABLE permissao (
    idmenu integer,
    idgrupo integer
);


ALTER TABLE public.permissao OWNER TO geobox;

--
-- TOC entry 191 (class 1259 OID 36264)
-- Name: utilizador; Type: TABLE; Schema: public; Owner: geobox; Tablespace: 
--

CREATE TABLE utilizador (
    id integer NOT NULL,
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
    CONSTRAINT enforce_dims_geometria CHECK ((st_ndims(ponto) = 2)),
    CONSTRAINT enforce_geotype_geometria CHECK (((geometrytype(ponto) = 'POINT'::text) OR (ponto IS NULL))),
    CONSTRAINT enforce_srid_geometria CHECK ((st_srid(ponto) = 3763))
);


ALTER TABLE public.utilizador OWNER TO geobox;

--
-- TOC entry 190 (class 1259 OID 36262)
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
-- TOC entry 3379 (class 0 OID 0)
-- Dependencies: 190
-- Name: utilizador_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: geobox
--

ALTER SEQUENCE utilizador_id_seq OWNED BY utilizador.id;


--
-- TOC entry 3228 (class 2604 OID 36258)
-- Name: id; Type: DEFAULT; Schema: public; Owner: geobox
--

ALTER TABLE ONLY grupo ALTER COLUMN id SET DEFAULT nextval('grupo_id_seq'::regclass);


--
-- TOC entry 3237 (class 2604 OID 36296)
-- Name: id; Type: DEFAULT; Schema: public; Owner: geobox
--

ALTER TABLE ONLY menu ALTER COLUMN id SET DEFAULT nextval('menu_id_seq'::regclass);


--
-- TOC entry 3230 (class 2604 OID 36267)
-- Name: id; Type: DEFAULT; Schema: public; Owner: geobox
--

ALTER TABLE ONLY utilizador ALTER COLUMN id SET DEFAULT nextval('utilizador_id_seq'::regclass);


--
-- TOC entry 3367 (class 0 OID 36255)
-- Dependencies: 189
-- Data for Name: grupo; Type: TABLE DATA; Schema: public; Owner: geobox
--

COPY grupo (id, nome, datacriacao, datamodificacao, idutilizador) FROM stdin;
1	Administradores	2014-01-03 01:01:31.902406+00	\N	\N
2	Técnicos	2014-01-03 01:01:31.906002+00	\N	\N
3	Aplicadores	2014-01-03 01:01:31.908872+00	\N	\N
4	Vendedores	2014-01-03 01:01:31.911732+00	\N	\N
5	Público	2014-01-03 01:01:31.914822+00	\N	\N
\.


--
-- TOC entry 3380 (class 0 OID 0)
-- Dependencies: 188
-- Name: grupo_id_seq; Type: SEQUENCE SET; Schema: public; Owner: geobox
--

SELECT pg_catalog.setval('grupo_id_seq', 5, true);


--
-- TOC entry 3371 (class 0 OID 36293)
-- Dependencies: 193
-- Data for Name: menu; Type: TABLE DATA; Schema: public; Owner: geobox
--

COPY menu (id, titulo, icon, idsuperior, class, anonimo) FROM stdin;
1	Legislação	\N	\N	\N	t
2	Aplicação	\N	1	\N	t
3	Comercialização	\N	1	\N	t
4	Gestão de utilizadores	\N	\N	\N	f
6	Utilizadores	\N	4	\N	f
7	Permissões	\N	4	\N	f
8	Gestão de tabelas	\N	\N	\N	f
10	Códigos postais	\N	8	\N	f
11	Cartões	\N	\N	\N	f
13	Consulta	\N	11	\N	f
14	Pendentes	\N	11	\N	f
15	Relatórios	\N	\N	\N	f
16	Por delegação	\N	15	\N	f
17	Por utilizador	\N	15	\N	f
18	Tempos de emissão	\N	15	\N	f
19	Informações	\N	\N	\N	t
20	Cursos e workshops	\N	19	\N	t
21	Recortes de Imprensa	\N	19	\N	t
5	Grupos	\N	4	grupo	f
9	Tipos de anexos	\N	8	tipoanexo	f
12	Requerimentos	\N	11	requerimento	f
\.


--
-- TOC entry 3381 (class 0 OID 0)
-- Dependencies: 192
-- Name: menu_id_seq; Type: SEQUENCE SET; Schema: public; Owner: geobox
--

SELECT pg_catalog.setval('menu_id_seq', 21, true);


--
-- TOC entry 3372 (class 0 OID 36300)
-- Dependencies: 194
-- Data for Name: permissao; Type: TABLE DATA; Schema: public; Owner: geobox
--

COPY permissao (idmenu, idgrupo) FROM stdin;
1	1
2	1
3	1
4	1
5	1
6	1
7	1
8	1
9	1
10	1
11	1
12	1
13	1
14	1
15	1
16	1
17	1
18	1
19	1
20	1
21	1
1	3
2	3
3	3
11	3
12	3
13	3
14	3
\.


--
-- TOC entry 3369 (class 0 OID 36264)
-- Dependencies: 191
-- Data for Name: utilizador; Type: TABLE DATA; Schema: public; Owner: geobox
--

COPY utilizador (id, login, password, idgrupo, email, fotografia, nome, morada, localidade, codpostal, despostal, nif, nic, masculino, pessoacoletiva, telemovel, telefone, observacoes, dicofre, ponto, datacriacao, datamodificacao, ultimologin, preferencias, ativo) FROM stdin;
2	quim	7c4a8d09ca3762af61e59520943dc26494f8941b	3	sarafrocha@gmail.com	\N	Joaquim Ferreira da Rocha	Rua Gil Vicente	Nogueira	4715-193	Braga	510906109	12345678	t	\N	910333131	253687290	Titular criado para teste	010101	0101000020B30E00000000000000E0D5C000000000A87F0941	2014-01-03 01:01:32.014525+00	2014-01-03 01:01:32.014525+00	2014-01-06 21:44:58.339553+00	\N	t
1	gustavo	12dea96fec20593566ab75692c9949596833adc9	1	jgr@jorge-gustavo-rocha.pt	\N	Jorge Gustavo Pereira Bastos Rocha	Rua Pascoal Fernandes, 11, 6 ESQ	Lamaçães	4715-281	Braga	196628865	8432271	t	\N	910333888	253253586	Titular criado para teste	010101	0101000020B30E00000000000080FDD5C000000000607B0941	2014-01-03 01:01:32.003626+00	2014-01-03 01:01:32.003626+00	2014-03-09 16:08:32.9862+00	\N	t
\.


--
-- TOC entry 3382 (class 0 OID 0)
-- Dependencies: 190
-- Name: utilizador_id_seq; Type: SEQUENCE SET; Schema: public; Owner: geobox
--

SELECT pg_catalog.setval('utilizador_id_seq', 2, true);


--
-- TOC entry 3240 (class 2606 OID 36261)
-- Name: grupo_pkey; Type: CONSTRAINT; Schema: public; Owner: geobox; Tablespace: 
--

ALTER TABLE ONLY grupo
    ADD CONSTRAINT grupo_pkey PRIMARY KEY (id);


--
-- TOC entry 3246 (class 2606 OID 36299)
-- Name: menu_pkey; Type: CONSTRAINT; Schema: public; Owner: geobox; Tablespace: 
--

ALTER TABLE ONLY menu
    ADD CONSTRAINT menu_pkey PRIMARY KEY (id);


--
-- TOC entry 3242 (class 2606 OID 36277)
-- Name: utilizador_login_key; Type: CONSTRAINT; Schema: public; Owner: geobox; Tablespace: 
--

ALTER TABLE ONLY utilizador
    ADD CONSTRAINT utilizador_login_key UNIQUE (login);


--
-- TOC entry 3244 (class 2606 OID 36275)
-- Name: utilizador_pkey; Type: CONSTRAINT; Schema: public; Owner: geobox; Tablespace: 
--

ALTER TABLE ONLY utilizador
    ADD CONSTRAINT utilizador_pkey PRIMARY KEY (id);


--
-- TOC entry 3247 (class 2606 OID 36286)
-- Name: grupo_idutilizador_fkey; Type: FK CONSTRAINT; Schema: public; Owner: geobox
--

ALTER TABLE ONLY grupo
    ADD CONSTRAINT grupo_idutilizador_fkey FOREIGN KEY (idutilizador) REFERENCES utilizador(id);


--
-- TOC entry 3250 (class 2606 OID 36308)
-- Name: permissao_idgrupo_fkey; Type: FK CONSTRAINT; Schema: public; Owner: geobox
--

ALTER TABLE ONLY permissao
    ADD CONSTRAINT permissao_idgrupo_fkey FOREIGN KEY (idgrupo) REFERENCES grupo(id);


--
-- TOC entry 3249 (class 2606 OID 36303)
-- Name: permissao_idmenu_fkey; Type: FK CONSTRAINT; Schema: public; Owner: geobox
--

ALTER TABLE ONLY permissao
    ADD CONSTRAINT permissao_idmenu_fkey FOREIGN KEY (idmenu) REFERENCES menu(id);


--
-- TOC entry 3248 (class 2606 OID 36278)
-- Name: utilizador_idgrupo_fkey; Type: FK CONSTRAINT; Schema: public; Owner: geobox
--

ALTER TABLE ONLY utilizador
    ADD CONSTRAINT utilizador_idgrupo_fkey FOREIGN KEY (idgrupo) REFERENCES grupo(id);


-- Completed on 2014-03-17 12:02:42 WET

--
-- PostgreSQL database dump complete
--

