var gm = require('gm');
// var im = require('imagemagick');
var crypto = require('crypto');
var db = global.App.database;

var DXFormTest = {
	/*
	 testMe : function(params, callback) {
	 console.log(params);
	 callback({
	 success : true,
	 msg : 'Hello world',
	 params : params
	 });
	 },
	 */
	testMe : function(params, callback, sessionID, request, response) {
		// testMe : function(params, callback) {
		console.log('Session ID = ' + sessionID);
		console.log('Params = ' + JSON.stringify(params));
		console.log('session.userid = ' + request.session.userid);
		console.log('Cookie = ' + JSON.stringify(request.session.cookie));
		request.session.cookie.maxAge = 7 * 24 * 60 * 60 * 1000;
		console.log('Cookie = ' + JSON.stringify(request.session.cookie));
		callback({
			success : true,
			msg : 'Hello world',
			params : params
		});
	},

	testException : function(params, callback) { failedHere;// explicit typo
		callback({
			success : true
		});
	},

	load : function(params, callback) {
		callback({
			success : true,
			data : {
				firstname : 'John',
				lastname : 'Smith',
				email : 'john.smith@comapny.info'
			}
		});
	},

	submit : function(params, callback/*formHandler*/) {
		callback({
			success : true,
			params : params
		});
	},

	// http://shapeshed.com/working_with_filesystems_in_nodejs/
	// http://ogre.adc4gis.com/

	filesubmitshapefile : function(params, callback, sessionID, request, response/*formHandler*/) {
		var files = request.files;
		//get files from request object
		console.log(files);
		var userid = request.session.userid;
		console.log('DXFormTest.filesubmitshapefile Session ID = ' + sessionID + ' com o utilizador ' + userid);

		// Do something with uploaded file, e.g. move to another location
		var fs = require('fs'), file = files.shapefile, tmp_path = file.path;
		console.log(file);
		var path = require('path');

		var target_path = './public/uploaded_shapefiles';
		var target_file = target_path + '/' + file.name;

		console.log('Tempory path = ' + tmp_path);
		console.log('Target path = ' + target_file);

		var successfulUpload = function(cb) {

		};

		var failedUpload = function(cd, error) {

		};

		if (file.size > 0) {
			if (file.size < 100000) {
				try {
					fs.rename(tmp_path, target_file, function(err) {
						if (err) {
							console.log('fs.rename');
							console.log(err);
							callback({
								success : false,
								msg : "Erro ao copiar da pasta temporária para a pasta dos uploads.",
								errors : err.message
							});
						}
						// delete the temporary file, so that the explicitly set temporary upload dir does not get filled with unwanted files
						fs.unlink(tmp_path, function() {
							callback({
								success : true,
								msg : 'Carregamento com sucesso.',
								size : file.size,
								name : target_file
							});
						});
					});
				} catch(e) {
					console.log('Exception on fs.rename');
					callback({
						success : false,
						msg : "Erro ao copiar da pasta temporária para a pasta dos uploads.",
						errors : e.message
					});
				}
			} else {
				console.log('Shapefile demasiado grande');
				callback({
					success : false,
					msg : "A shapefile é demasiado grande.",
					errors : e.message
				});
			}
		} else {
			console.log('file.size === 0');
			callback({
				success : false,
				msg : "Ficheiro vazio.",
				params : params,
				errors : {
					clientCode : "File not found",
					portOfLoading : "This field must not be null"
				}
			});
		}

	},

	/*
	 * Tenho que estar em sessão...
	 */
	filesubmitinstantaneo : function(params, callback, sessionID, request, response/*formHandler*/) {
		console.log('filesubmitinstantaneo');
		var files = request.files;
		// get files from request object
		console.log(params);
		// console.log(request);
		// console.log(files);

		// participation_data/promotor/plano/nome.png (original)
		// participation_data/promotor/plano/80x80/nome.png (80 por 80)
		// participation_data/promotor/plano/_x600/nome.png (limitado a 600 de altura)
		// participation_data/1/2/teste.png
		// participation_data/1/2/80x80/teste.png
		// participation_data/1/2/_x600/teste.png

		var fs = require('fs'), file = files.instantaneo, tmp_path = file.path;
		var path = require('path');
		console.log('Temporary path = ' + tmp_path);

		var aleatorio = tmp_path.split('/')[1];

		// { idplano: '1', idpromotor: '1' }
		// Tempory path = uploads/03738e700d5d1538df59d4c9931724b4

		// we can use the extension of the original file
		// or the file type returned by gm().identify
		var extension = path.extname(file.name).toLowerCase();
		// client side path
		// image url: pasta + '/' + caminho
		var pasta = 'participation_data/' + params.idpromotor + '/' + params.idplano;
		var caminho = aleatorio + extension;
		// server side
		var path_normal = './public/' + pasta + '/' + caminho;
		var path_thumb = './public/' + pasta + '/80x80/' + caminho;
		var path_medium = './public/' + pasta + '/_x600/' + caminho;

		if ((params.idpromotor) && (params.idplano) && (sessionID) && (request.session.userid)) {
			gm(tmp_path).identify(function(err, data) {
				if (err) {
					// Penso que não se trata de uma imagem
					callback({
						success : false,
						msg : "Upload failed - can't identify file format",
						errors : err.message
					});
				} else {
					// console.log(data);
					// { format: 'JPEG', width: 3904, height: 2622, depth: 8 }
					// { format: 'PNG',
					// if (data.format == 'JPEG')
					if (file.size > 0) {
						var resize80 = null, resize600 = null;
						gm(tmp_path).resize(null, 600).noProfile().write(path_medium, function(err) {
							if (err) {
								console.log('Erro: ', err);
							} else {
								resize600 = path_medium;
								complete();
							}
						});
						gm(tmp_path).resize(80, 80).noProfile().write(path_thumb, function(err) {
							if (err) {
								console.log('Erro: ', err);
							} else {
								resize80 = path_thumb;
								complete();
							}
						});
						function complete() {
							if (resize600 !== null && resize80 !== null) {
								try {
									fs.rename(tmp_path, path_normal, function(err) {
										if (err)
											throw err;
										var fields = ['sessionid', 'pasta', 'caminho', 'idutilizador', 'tamanho', 'largura', 'altura'];
										var buracos = ['$1', '$2', '$3', '$4', '$5', '$6', '$7'];
										var values = [sessionID, pasta, caminho, request.session.userid, file.size, data.size.width, data.size.height];
										console.log(values);
										var conn = db.connect();
										conn.query('INSERT INTO ppgis.fotografiatmp (' + fields.join() + ') VALUES (' + buracos.join() + ') RETURNING id', values, function(err, resultInsert) {
											db.disconnect(conn);
											if (err) {
												db.debugError(callback, err);
											} else {
												callback({
													success : true,
													msg : 'Uploaded successfully',
													size : file.size,
													path : path_normal,
													data : resultInsert.rows // id para fazer o load do store :-)
												});
											}
										});
									});
								} catch(e) {
									console.log('Exception');
									callback({
										success : false,
										msg : "Upload failed - can't rename the uploaded file",
										errors : e.message
									});
								}
							}
						}

					} else {
						console.log('file.size === 0');
						callback({
							success : false,
							msg : "Upload failed - empty file",
							params : params,
							errors : {
								clientCode : "File not found",
								portOfLoading : "This field must not be null"
							}
						});
					}
				}
			});
		} else {
			callback({
				success : false,
				msg : "Upload failed - some parameters are missing",
				params : params
			});
		}
	},
	filesubmitphotoprofile : function(params, callback, sessionID, request, response/*formHandler*/) {
		var files = request.files;
		//get files from request object
		// console.log(params, files)
		var userid = request.session.userid;
		console.log('DXFormTest.filesubmitphotoprofile Session ID = ' + sessionID + ' com o utilizador ' + userid);

		// Do something with uploaded file, e.g. move to another location
		var fs = require('fs'), file = files.photo, tmp_path = file.path;
		var path = require('path');

		console.log('Tempory path = ' + tmp_path);

		var successfulUpload = function(cb) {

		};

		var failedUpload = function(cd, error) {

		};

		crypto.randomBytes(16, function(ex, buf) {
			token = buf.toString('hex');
			// set path in utilizador table (path_xxx)
			// set where the file should be saved (target_path_xxx)
			var path_160 = 'uploaded_images/profiles/160x160/' + userid + '_' + token + path.extname(file.name);
			var path_32 = 'uploaded_images/profiles/32x32/' + userid + '_' + token + path.extname(file.name);

			var target_path_160 = './public/' + path_160;
			var target_path_32 = './public/' + path_32;

			gm(tmp_path).identify(function(err, data) {
				if (err) {
					// Penso que não se trata de uma imagem
					callback({
						success : false,
						msg : "Upload failed - can't identify file format",
						errors : err.message
					});
				} else {
					console.log(data);
					// { format: 'JPEG', width: 3904, height: 2622, depth: 8 }
					// { format: 'PNG',
					// if (features.format == 'JPEG')

					// move the file from the temporary location to the intended location
					// do it only if there is a file with size
					if (file.size > 0) {
						var resize32 = null, resize160 = null;

						gm(tmp_path).resize(160, 160).noProfile().write(target_path_160, function(err) {
							if (err) {
								console.log('Erro: ', err);
							} else {
								resize160 = target_path_160;
								complete();
							}
						});

						gm(tmp_path).resize(32, 32).noProfile().write(target_path_32, function(err) {
							if (err) {
								console.log('Erro: ', err);
							} else {
								resize32 = target_path_32;
								complete();
							}
						});

						function complete() {
							if (resize160 !== null && resize32 !== null) {
								try {
									fs.unlink(tmp_path, function() {
										// atualiza a base de dados!
										var conn = db.connect();
										var sql = "UPDATE utilizador SET fotografia = '" + path_32 + "', datamodificacao = now() where id = " + userid;
										conn.query(sql, function(err, updateResult) {
											db.disconnect(conn);
											// release connection
											if (err) {
												console.log('UPDATE =' + sql + ' Error: ' + err);
												db.debugError(callback, err);
											} else {
												callback({
													success : true,
													msg : 'Uploaded successfully',
													size : file.size,
													name32 : path_32,
													name160 : path_160
												});
											}
										});
									});
								} catch(e) {
									console.log('Exception on fs.unlink');
									callback({
										success : false,
										msg : "Upload failed - can't rename the uploaded file",
										errors : e.message
									});
								}
							}
						}

					} else {
						console.log('file.size === 0');
						callback({
							success : false,
							msg : "Upload failed - empty file",
							params : params,
							errors : {
								clientCode : "File not found",
								portOfLoading : "This field must not be null"
							}
						});
					}
				}

			});
		});

	}
};

module.exports = DXFormTest;
