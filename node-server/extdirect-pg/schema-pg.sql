--
-- PostgreSQL database dump
--

-- Dumped from database version 9.3.3
-- Dumped by pg_dump version 9.3.3
-- Started on 2014-03-16 19:16:38 WET

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
-- TOC entry 187 (class 1259 OID 37719)
-- Name: todoitem; Type: TABLE; Schema: public; Owner: geobox; Tablespace: 
--

CREATE TABLE todoitem (
    id integer NOT NULL,
    text character varying(128),
    complete integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.todoitem OWNER TO geobox;

--
-- TOC entry 186 (class 1259 OID 37717)
-- Name: todoitem_id_seq; Type: SEQUENCE; Schema: public; Owner: geobox
--

CREATE SEQUENCE todoitem_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.todoitem_id_seq OWNER TO geobox;

--
-- TOC entry 3274 (class 0 OID 0)
-- Dependencies: 186
-- Name: todoitem_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: geobox
--

ALTER SEQUENCE todoitem_id_seq OWNED BY todoitem.id;


--
-- TOC entry 3149 (class 2604 OID 37722)
-- Name: id; Type: DEFAULT; Schema: public; Owner: geobox
--

ALTER TABLE ONLY todoitem ALTER COLUMN id SET DEFAULT nextval('todoitem_id_seq'::regclass);


--
-- TOC entry 3268 (class 0 OID 37719)
-- Dependencies: 187
-- Data for Name: todoitem; Type: TABLE DATA; Schema: public; Owner: geobox
--

COPY todoitem (id, text, complete) FROM stdin;
2	Get some rest and sleep well	1
3	Wake up refreshed	1
6	Read morning newspapers	0
7	Watch Good Morning America	0
4	Take hot shower	1
8	Dress up for the gym	0
9	Check twitter	0
5	Lovely breakfast with eggs	0
11	End hunger in Africa	0
\.


--
-- TOC entry 3275 (class 0 OID 0)
-- Dependencies: 186
-- Name: todoitem_id_seq; Type: SEQUENCE SET; Schema: public; Owner: geobox
--

SELECT pg_catalog.setval('todoitem_id_seq', 11, true);


--
-- TOC entry 3152 (class 2606 OID 37725)
-- Name: todoitem_pkey; Type: CONSTRAINT; Schema: public; Owner: geobox; Tablespace: 
--

ALTER TABLE ONLY todoitem
    ADD CONSTRAINT todoitem_pkey PRIMARY KEY (id);


--
-- TOC entry 3273 (class 0 OID 0)
-- Dependencies: 187
-- Name: todoitem; Type: ACL; Schema: public; Owner: geobox
--

REVOKE ALL ON TABLE todoitem FROM PUBLIC;
REVOKE ALL ON TABLE todoitem FROM geobox;
GRANT ALL ON TABLE todoitem TO geobox;
GRANT SELECT ON TABLE todoitem TO readonly;


-- Completed on 2014-03-16 19:16:38 WET

--
-- PostgreSQL database dump complete
--

