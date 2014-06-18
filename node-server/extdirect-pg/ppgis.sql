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


-- DROP TABLE ppgis.plano CASCADE;
CREATE TABLE ppgis.tipoocorrencia
(
  id serial NOT NULL,
  idplano integer NOT NULL,
  designacao character varying(100) NOT NULL,
  ativa boolean DEFAULT TRUE,
  datamodificacao timestamp with time zone NOT NULL DEFAULT now(),
  idutilizador integer NOT NULL,
  CONSTRAINT tipoocorrencia_pkey PRIMARY KEY (id),
  CONSTRAINT tipoocorrencia_plano_fk FOREIGN KEY (idplano)
      REFERENCES ppgis.plano(id),
  CONSTRAINT tipoocorrencia_utilizador_fk FOREIGN KEY (idutilizador)
    REFERENCES utilizador(id)       
);

insert into ppgis.tipoocorrencia (idplano, designacao, idutilizador) values (1, 'Acessos para Cidadãos com Mobilidade Reduzida', 31);
insert into ppgis.tipoocorrencia (idplano, designacao, idutilizador) values (1, 'Animais Abandonados', 31);
insert into ppgis.tipoocorrencia (idplano, designacao, idutilizador) values (1, 'Conservação da Iluminação Pública', 31);
insert into ppgis.tipoocorrencia (idplano, designacao, idutilizador) values (1, 'Conservação das Ruas e Pavimento', 31);
insert into ppgis.tipoocorrencia (idplano, designacao, idutilizador) values (1, 'Conservação de Parque Escolar', 31);
insert into ppgis.tipoocorrencia (idplano, designacao, idutilizador) values (1, 'Estacionamento de Veículos', 31);
insert into ppgis.tipoocorrencia (idplano, designacao, idutilizador) values (1, 'Limpeza de Valetas, Bermas e Caminhos', 31);
insert into ppgis.tipoocorrencia (idplano, designacao, idutilizador) values (1, 'Limpeza e Conservação de Espaços Públicos', 31);
insert into ppgis.tipoocorrencia (idplano, designacao, idutilizador) values (1, 'Manutenção de Ciclovias', 31);
insert into ppgis.tipoocorrencia (idplano, designacao, idutilizador) values (1, 'Manutenção e Limpeza de Contentores e Ecopontos', 31);
insert into ppgis.tipoocorrencia (idplano, designacao, idutilizador) values (1, 'Manutenção Rega e Limpeza de Jardins', 31);
insert into ppgis.tipoocorrencia (idplano, designacao, idutilizador) values (1, 'Poluição Sonora', 31);
insert into ppgis.tipoocorrencia (idplano, designacao, idutilizador) values (1, 'Publicidade, Outdoors e Cartazes', 31);
insert into ppgis.tipoocorrencia (idplano, designacao, idutilizador) values (1, 'Recolha de Lixo', 31);
insert into ppgis.tipoocorrencia (idplano, designacao, idutilizador) values (1, 'Rupturas de Águas ou Desvio de Tampas', 31);
insert into ppgis.tipoocorrencia (idplano, designacao, idutilizador) values (1, 'Sinalização de Trânsito', 31);
insert into ppgis.tipoocorrencia (idplano, designacao, idutilizador) values (1, 'Acessos para Cidadãos com Mobilidade Reduzida', 31);

insert into ppgis.tipoocorrencia (idplano, designacao, idutilizador) values (2, 'Acessos para Cidadãos com Mobilidade Reduzida', 31);
insert into ppgis.tipoocorrencia (idplano, designacao, idutilizador) values (2, 'Animais Abandonados', 31);
insert into ppgis.tipoocorrencia (idplano, designacao, idutilizador) values (2, 'Conservação da Iluminação Pública', 31);
insert into ppgis.tipoocorrencia (idplano, designacao, idutilizador) values (2, 'Conservação das Ruas e Pavimento', 31);
insert into ppgis.tipoocorrencia (idplano, designacao, idutilizador) values (2, 'Conservação de Parque Escolar', 31);
insert into ppgis.tipoocorrencia (idplano, designacao, idutilizador) values (2, 'Estacionamento de Veículos', 31);
insert into ppgis.tipoocorrencia (idplano, designacao, idutilizador) values (2, 'Limpeza de Valetas, Bermas e Caminhos', 31);
insert into ppgis.tipoocorrencia (idplano, designacao, idutilizador) values (2, 'Limpeza e Conservação de Espaços Públicos', 31);
insert into ppgis.tipoocorrencia (idplano, designacao, idutilizador) values (2, 'Manutenção de Ciclovias', 31);
insert into ppgis.tipoocorrencia (idplano, designacao, idutilizador) values (2, 'Manutenção e Limpeza de Contentores e Ecopontos', 31);
insert into ppgis.tipoocorrencia (idplano, designacao, idutilizador) values (2, 'Manutenção Rega e Limpeza de Jardins', 31);
insert into ppgis.tipoocorrencia (idplano, designacao, idutilizador) values (2, 'Poluição Sonora', 31);
insert into ppgis.tipoocorrencia (idplano, designacao, idutilizador) values (2, 'Publicidade, Outdoors e Cartazes', 31);
insert into ppgis.tipoocorrencia (idplano, designacao, idutilizador) values (2, 'Recolha de Lixo', 31);
insert into ppgis.tipoocorrencia (idplano, designacao, idutilizador) values (2, 'Rupturas de Águas ou Desvio de Tampas', 31);
insert into ppgis.tipoocorrencia (idplano, designacao, idutilizador) values (2, 'Sinalização de Trânsito', 31);
insert into ppgis.tipoocorrencia (idplano, designacao, idutilizador) values (2, 'Acessos para Cidadãos com Mobilidade Reduzida', 31);
