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

	/*
	 * Tenho que estar em sessão, com um utilizador bem identificado, para por a fotografia na pasta dele
	 * (quando se tratar de uma foto de perfil)
	 */
	filesubmit : function(params, callback, sessionID, request, response/*formHandler*/) {
		var files = request.files;
		//get files from request object
		// console.log(params, files)
		var userid = request.session.userid;
		console.log('DXFormTest.filesubmit Session ID = ' + sessionID + ' com o utilizador ' + userid);

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

						/*
						 try {
						 fs.rename(tmp_path, target_path, function(err) {
						 if (err) {
						 callback({
						 success : false,
						 msg : "Upload failed - can't rename the file",
						 errors : err.message
						 });
						 }
						 // delete the temporary file, so that the explicitly set temporary upload dir does not get filled with unwanted files
						 fs.unlink(tmp_path, function() {
						 // atualiza a base de dados!
						 var conn = db.connect();
						 var sql = "UPDATE utilizador SET fotografia = '" + url_path + "', datamodificacao = now() where id = " + userid;
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
						 name : url_path
						 });
						 }
						 });
						 });
						 });
						 } catch(e) {
						 console.log('Exception on fs.rename');
						 callback({
						 success : false,
						 msg : "Upload failed - can't rename the file",
						 errors : e.message
						 });
						 }
						 */
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
