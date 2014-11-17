select st_asgeojson(the_geom), * from ppgis.plano

-- "{"type":"Polygon","coordinates":[[[-1025020.9381525,4681000.9988157],[-1010574.3398087,4681000.9988157],[-1010574.3398087,4684622.2030303],[-1025020.9381525,4684622.2030303],[-1025020.9381525,4681000.9988157]]]}"

update ppgis.plano
set the_geom = ST_GeometryFromText('POLYGON((-942201.41801707 4948511.4885196,-937443.21300699 4948511.4885196,-937443.21300699 4952314.2306762,-942201.41801707 4952314.2306762,-942201.41801707 4948511.4885196))', 900913)
where id = 1

insert into ppgis.ocorrencia (idplano, idestado, idtipoocorrencia, titulo, participacao, the_geom, idutilizador) 
values (1, 1, 1, 'Um tiro no escuro', 'Aqui, neste preciso local, que um general desconhecido deu um tiro no escuro, num dia ainda por determinar.', 
ST_GeometryFromText('POINT(-939822.31551203 4950412.8595979)', 900913), 31);

select st_asewkt( ST_SetSRID(ST_GeomFromGeoJSON('{"type":"Point","coordinates":[-938752.1971161801,4951105.5701667]}'), 900913) )