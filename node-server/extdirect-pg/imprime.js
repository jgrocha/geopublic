var http = require('http');
var fs = require('fs');

var mapa_layers = {
	"layers" : [{
		"baseURL" : "http://localhost/mapproxy/tms/",
		"opacity" : 1,
		"singleTile" : false,
		"type" : "TMS",
		"layer" : "mapquest/pt_tm_06",
		"maxExtent" : [-119191.407499, -300404.803999, 162129.0811, 276083.7674],
		"tileSize" : [256, 256],
		"resolutions" : [2251.90848203, 1125.95424101, 562.977120507, 281.488560253, 140.744280127, 70.3721400634, 35.1860700317, 17.5930350158, 8.79651750792, 4.39825875396, 2.19912937698, 1.09956468849, 0.549782344245, 0.274891172122, 0.137445586061, 0.0687227930306],
		"format" : "png"
	}],
	"srs" : "EPSG:3763"
};

var mapa_layout = {
	"center" : [-19557, 107814],
	"rotation" : 0,
	"dpi" : 75,
	"scale" : 25000
};

var data = {
	units : "m",
	srs : "EPSG:3763",
	layout : "A4-5",
	dpi : 150,
	mapTitle : "Confrontação da pretensão",
	comment : "Este mapa indicativo.",
	maps : {
		"mapa0" : {
			"layers" : [{
				"baseURL" : "http://localhost/mapproxy/tms/",
				"opacity" : 1,
				"singleTile" : false,
				"type" : "TMS",
				"layer" : "mapquest/pt_tm_06",
				"maxExtent" : [-119191.407499, -300404.803999, 162129.0811, 276083.7674],
				"tileSize" : [256, 256],
				"resolutions" : [2251.90848203, 1125.95424101, 562.977120507, 281.488560253, 140.744280127, 70.3721400634, 35.1860700317, 17.5930350158, 8.79651750792, 4.39825875396, 2.19912937698, 1.09956468849, 0.549782344245, 0.274891172122, 0.137445586061, 0.0687227930306],
				"format" : "png"
			}],
			"srs" : "EPSG:3763"
		},
		"mapa1" : {
			"layers" : [{
				"baseURL" : "http://localhost/mapproxy/tms/",
				"opacity" : 1,
				"singleTile" : false,
				"type" : "TMS",
				"layer" : "mapquest/pt_tm_06",
				"maxExtent" : [-119191.407499, -300404.803999, 162129.0811, 276083.7674],
				"tileSize" : [256, 256],
				"resolutions" : [2251.90848203, 1125.95424101, 562.977120507, 281.488560253, 140.744280127, 70.3721400634, 35.1860700317, 17.5930350158, 8.79651750792, 4.39825875396, 2.19912937698, 1.09956468849, 0.549782344245, 0.274891172122, 0.137445586061, 0.0687227930306],
				"format" : "png"
			}],
			"srs" : "EPSG:3763"
		},
		"mapa2" : {
			"layers" : [{
				"baseURL" : "http://localhost/mapproxy/tms/",
				"opacity" : 1,
				"singleTile" : false,
				"type" : "TMS",
				"layer" : "mapquest/pt_tm_06",
				"maxExtent" : [-119191.407499, -300404.803999, 162129.0811, 276083.7674],
				"tileSize" : [256, 256],
				"resolutions" : [2251.90848203, 1125.95424101, 562.977120507, 281.488560253, 140.744280127, 70.3721400634, 35.1860700317, 17.5930350158, 8.79651750792, 4.39825875396, 2.19912937698, 1.09956468849, 0.549782344245, 0.274891172122, 0.137445586061, 0.0687227930306],
				"format" : "png"
			}],
			"srs" : "EPSG:3763"
		},
		"mapa4" : {
			"layers" : [{
				"baseURL" : "http://localhost/mapproxy/tms/",
				"opacity" : 1,
				"singleTile" : false,
				"type" : "TMS",
				"layer" : "mapquest/pt_tm_06",
				"maxExtent" : [-119191.407499, -300404.803999, 162129.0811, 276083.7674],
				"tileSize" : [256, 256],
				"resolutions" : [2251.90848203, 1125.95424101, 562.977120507, 281.488560253, 140.744280127, 70.3721400634, 35.1860700317, 17.5930350158, 8.79651750792, 4.39825875396, 2.19912937698, 1.09956468849, 0.549782344245, 0.274891172122, 0.137445586061, 0.0687227930306],
				"format" : "png"
			}],
			"srs" : "EPSG:3763"
		},
		"mapa5" : {
			"layers" : [{
				"baseURL" : "http://localhost/mapproxy/tms/",
				"opacity" : 1,
				"singleTile" : false,
				"type" : "TMS",
				"layer" : "mapquest/pt_tm_06",
				"maxExtent" : [-119191.407499, -300404.803999, 162129.0811, 276083.7674],
				"tileSize" : [256, 256],
				"resolutions" : [2251.90848203, 1125.95424101, 562.977120507, 281.488560253, 140.744280127, 70.3721400634, 35.1860700317, 17.5930350158, 8.79651750792, 4.39825875396, 2.19912937698, 1.09956468849, 0.549782344245, 0.274891172122, 0.137445586061, 0.0687227930306],
				"format" : "png"
			}],
			"srs" : "EPSG:3763"
		},
		"mapa6" : {
			"layers" : [{
				"baseURL" : "http://localhost/mapproxy/tms/",
				"opacity" : 1,
				"singleTile" : false,
				"type" : "TMS",
				"layer" : "mapquest/pt_tm_06",
				"maxExtent" : [-119191.407499, -300404.803999, 162129.0811, 276083.7674],
				"tileSize" : [256, 256],
				"resolutions" : [2251.90848203, 1125.95424101, 562.977120507, 281.488560253, 140.744280127, 70.3721400634, 35.1860700317, 17.5930350158, 8.79651750792, 4.39825875396, 2.19912937698, 1.09956468849, 0.549782344245, 0.274891172122, 0.137445586061, 0.0687227930306],
				"format" : "png"
			}],
			"srs" : "EPSG:3763"
		}
	},
	pages : [{
		maps : {
			"mapa0" : {
				"center" : [-26557, 100814],
				"rotation" : 0,
				"dpi" : 75,
				"scale" : 10000
			},
			"mapa1" : {
				"center" : [-23557, 103814],
				"rotation" : 0,
				"dpi" : 75,
				"scale" : 25000
			},
			"mapa2" : {
				"center" : [-21557, 105814],
				"rotation" : 0,
				"dpi" : 75,
				"scale" : 25000
			},
			"mapa4" : {
				"center" : [-17557, 109814],
				"rotation" : 0,
				"dpi" : 75,
				"scale" : 25000
			},
			"mapa5" : {
				"center" : [-15557, 111814],
				"rotation" : 0,
				"dpi" : 75,
				"scale" : 25000
			},
			"mapa6" : {
				"center" : [-13557, 113814],
				"rotation" : 0,
				"dpi" : 75,
				"scale" : 25000
			}
		},
		"tabelamapa1" : {
			"data" : [{
				"id" : 1,
				"area" : 27.5,
				"sumario" : "Este terreno  para quase nada",
				"texto" : "Texto muito comprimdo, maior do que a  de Braga",
			}],
			"columns" : ["id", "area", "sumario", "texto"]
		},
		"tabelamapa2" : {
			"data" : [{
				"id" : 2,
				"area" : 27.5,
				"sumario" : "Este terreno  para quase nada",
				"texto" : "Texto muito comprimdo, maior do que a  de Braga",
			}],
			"columns" : ["id", "area", "sumario", "texto"]
		},
		"tabelamapa3" : {
			"data" : [{
				"id" : 3,
				"area" : 27.5,
				"sumario" : "Este terreno  quase nada",
				"texto" : "Texto muito comprimdo, maior do que a SÉ de Braga",
			}],
			"columns" : ["id", "area", "sumario", "texto"]
		}
	}]
};

var post_req = null, post_data = null;
// JSON.stringify(data);

var post_options = {
	hostname : 'localhost',
	port : '8080',
	path : '/geoserver/pdf/create.json',
	method : 'POST',
	headers : {
		'Accept' : 'application/json',
		'Content-Type' : 'application/json;charset=UTF-8',
		'Cache-Control' : 'no-cache'
		// 'Content-Length' : Buffer.byteLength(post_data, 'utf8')
	}
};

// console.log(post_options.headers['Content-Length']);
data["layout"] = 'A4-6';
data.maps["mapa3"] = mapa_layers;
data.pages[0].maps["mapa3"] = mapa_layout;
post_data = JSON.stringify(data);
post_options.headers['Content-Length'] = Buffer.byteLength(post_data, 'utf8');
console.log(post_options.headers['Content-Length']);

// para estudar...
// https://github.com/geoext/geoext2/blob/master/tests/data/MapfishPrintProvider.html

post_req = http.request(post_options, function(res) {
	console.log('STATUS: ' + res.statusCode);
	console.log('HEADERS: ' + JSON.stringify(res.headers));
	res.setEncoding('utf8');
	res.on('data', function(chunk) {
		console.log('Response: ', chunk);
		var resposta = JSON.parse(chunk);
		console.log(resposta.getURL);
		var file = fs.createWriteStream("teste.pdf");
		var request = http.get(resposta.getURL, function(response) {
			response.pipe(file);
		});
	});
});

post_req.on('error', function(e) {
	console.log('problem with request: ' + e.message);
});

post_req.write(post_data);
post_req.end();

// console.log(data.maps);
// console.log(data.maps.mapa2);
// data.maps["mapa3"] = novo_mapa;
// console.log(data.maps);
// console.log(data.maps);

