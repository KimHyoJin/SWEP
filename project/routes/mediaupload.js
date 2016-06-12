var express = require('express');
var flash    = require('connect-flash');
var passport = require('passport');
var mysql = require('mysql');
var dbconfig = require('../config/database');
var busboy = require('connect-busboy');

module.exports = (function() {
        var router = express.Router();
	var connection = mysql.createConnection(dbconfig.connection);
	var fs = require('fs');
	//var busboy = require('connect-busboy');
	connection.query('USE ' + dbconfig.database);
	//router.use(busboy());	

	router.get('/uploadvideo',isLoggedIn, function(req, res) {
		res.render('mediaupload', {
			user : req.user // get the user out of session and pass to template
		});
	});



	router.post('/upload', function(req, res) {
	    var fstream;
	    console.log("post upload start");
		req.pipe(req.busboy);
	    console.log("post busboy?");

	    req.busboy.on('file', function (fieldname, file, filename) {
	        console.log("Uploading: " + filename); 
	        fstream = fs.createWriteStream(__dirname+'/../public/files/' + filename);
	       	console.log("Uploading finish: " + filename); 

	        file.pipe(fstream);

	        //db 추가
	        // isStore: 비디오 올린 사람 아이디
	       	var url = "http://52.34.154.77" +'/files/' + filename;

	        var insertQuery = "INSERT INTO video (videoname, url, isStore) values (?,?,?)";
	        connection.query(insertQuery,[filename,url,req.user['email']],function(err, rows) {
	
		console.log("[video upload] 비디오업로드 성공!");
		            });
	        // 갇힘

	        fstream.on('close', function () {
	            res.redirect('back');
	        });

	    });
	});

    return router;
})();


function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
}

