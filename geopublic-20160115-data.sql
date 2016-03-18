--
-- PostgreSQL database dump
--

-- Dumped from database version 9.3.10
-- Dumped by pg_dump version 9.3.10
-- Started on 2016-01-15 18:40:46 WET

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

SET search_path = "public", pg_catalog;

--
-- TOC entry 3658 (class 0 OID 45813)
-- Dependencies: 200
-- Data for Name: grupo; Type: TABLE DATA; Schema: public; Owner: geobox
--

INSERT INTO "grupo" VALUES (3, 'Citizen', '2014-01-03 01:01:31.908872+00', NULL, NULL, true);
INSERT INTO "grupo" VALUES (1, 'Administrator', '2014-01-03 01:01:31.902406+00', NULL, NULL, false);


--
-- TOC entry 3669 (class 0 OID 0)
-- Dependencies: 201
-- Name: grupo_id_seq; Type: SEQUENCE SET; Schema: public; Owner: geobox
--

SELECT pg_catalog.setval('"grupo_id_seq"', 5, true);


--
-- TOC entry 3660 (class 0 OID 46188)
-- Dependencies: 210
-- Data for Name: menu; Type: TABLE DATA; Schema: public; Owner: geobox
--

INSERT INTO "menu" VALUES (4, 'User management', NULL, NULL, NULL, false);
INSERT INTO "menu" VALUES (1, 'Last access', NULL, NULL, 'grid-sessao', false);
INSERT INTO "menu" VALUES (2, 'Profile', NULL, NULL, 'profile', false);
INSERT INTO "menu" VALUES (22, 'Layers', NULL, NULL, 'layer', false);
INSERT INTO "menu" VALUES (6, 'Groups and permissions', NULL, 4, 'permissoes', false);
INSERT INTO "menu" VALUES (5, 'Users', NULL, 4, 'grid-utilizador', false);
INSERT INTO "menu" VALUES (23, 'Plans and promoters', NULL, NULL, 'grid-promotor', false);


--
-- TOC entry 3670 (class 0 OID 0)
-- Dependencies: 211
-- Name: menu_id_seq; Type: SEQUENCE SET; Schema: public; Owner: geobox
--

SELECT pg_catalog.setval('"menu_id_seq"', 23, true);


--
-- TOC entry 3662 (class 0 OID 46194)
-- Dependencies: 212
-- Data for Name: permissao; Type: TABLE DATA; Schema: public; Owner: geobox
--

INSERT INTO "permissao" VALUES (1, 1);
INSERT INTO "permissao" VALUES (2, 1);
INSERT INTO "permissao" VALUES (4, 1);
INSERT INTO "permissao" VALUES (5, 1);
INSERT INTO "permissao" VALUES (6, 1);
INSERT INTO "permissao" VALUES (1, 3);
INSERT INTO "permissao" VALUES (2, 3);
INSERT INTO "permissao" VALUES (22, 1);
INSERT INTO "permissao" VALUES (23, 1);


-- Completed on 2016-01-15 18:40:46 WET

--
-- PostgreSQL database dump complete
--

