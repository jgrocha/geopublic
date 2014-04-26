-- DROP TABLE ppgis.promotor CASCADE;
CREATE TABLE ppgis.promotor
(
  id serial NOT NULL,
  designacao character varying(100) NOT NULL,
  email character varying(50) NOT NULL,
  site character varying(120),
  dataregisto timestamp with time zone NOT NULL DEFAULT now(),
  datamodificacao timestamp with time zone NOT NULL DEFAULT now(),
  idutilizador integer NOT NULL,
  CONSTRAINT promotor_pkey PRIMARY KEY (id),
  CONSTRAINT promotor_utilizador_fk FOREIGN KEY (idutilizador)
    REFERENCES utilizador(id) 
);

INSERT INTO ppgis.promotor (designacao, email, idutilizador) VALUES ('Câmara Municipal de Águeda', 'miguel.tavares@cm-agueda.pt', 31);
INSERT INTO ppgis.promotor (designacao, email, idutilizador) VALUES ('Associação U Mosquito', 'tavares.miguel@gmail.com', 31);

-- DROP TABLE ppgis.plano CASCADE;
CREATE TABLE ppgis.plano
(
  id serial NOT NULL,
  idpromotor integer NOT NULL,
  designacao character varying(100) NOT NULL,
  descricao text,
  responsavel character varying(100) NOT NULL,
  email character varying(50) NOT NULL,
  site character varying(120),
  inicio timestamp with time zone NOT NULL DEFAULT now(),
  fim timestamp with time zone NOT NULL DEFAULT now()+interval '30 days',
  datamodificacao timestamp with time zone NOT NULL DEFAULT now(),
  idutilizador integer NOT NULL,
  CONSTRAINT plano_pkey PRIMARY KEY (id),
  CONSTRAINT plano_promotor_fk FOREIGN KEY (idpromotor)
      REFERENCES ppgis.promotor(id),
  CONSTRAINT plano_utilizador_fk FOREIGN KEY (idutilizador)
    REFERENCES utilizador(id)       
);

INSERT INTO ppgis.plano (idpromotor, designacao, descricao, responsavel, email, idutilizador) 
VALUES (1, 'Plano Local de Promoção das Acessibilidades', 'O Plano Local de Promoção das Acessibilidades (PLPA) promove a identificação de problemas de acessibilidade', 'Miguel Tavares', 'tavares.miguel@gmail.com', 31);

INSERT INTO ppgis.plano (idpromotor, designacao, descricao, responsavel, email, idutilizador) 
VALUES (2, 'Jardins abandonados', 'Este projeto visa a identificação de jardins que carecem de intervenção urgente', 'Miguel Tavares', 'tavares.miguel@gmail.com', 31);
