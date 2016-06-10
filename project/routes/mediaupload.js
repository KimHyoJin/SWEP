var express = require('express');
var router = express.Router();

var mysql = require('mysql');
var dbconfig = require('../config/database');
var connection = mysql.createConnection(dbconfig.connection);

module.exports = router;

router.get('/uploadvideo',isLoggedIn, function(req, res) {
res.render('mediaupload.ejs', {
	user : req.user // get the user out of session and pass to template
	});
});

var fs = require('fs');

router.post('/upload', function(req, res) {
    var fstream;
    req.pipe(req.busboy);
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

// route middleware to make sure
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
}
