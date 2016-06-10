var express = require('express');
var flash    = require('connect-flash');
var passport = require('passport');
var mysql = require('mysql');
var dbconfig = require('../config/database');
//var connection = mysql.createConnection(dbconfig.connection);
var fs = require('fs');

module.exports = (function() {
    var router = express.Router();
	var connection  = mysql.createConnection(dbconfig.connection);
	connection.query('USE ' + dbconfig.database);

	router.get('/mypage', isLoggedIn, function(req, res) {
		connection.query("SELECT * FROM friends WHERE user1 = ?",[req.user['email']], function(err, rows) {
        if (err)
            return done(err);
        if (rows.length) {
        	console.log("[mypage] 친구있음");
        	res.render('mypage', {
				user: req.user, result: rows});
        }
        else
        {
        	console.log("[mypage] 친구없음");
        	res.render('mypage', {
				user: req.user, result: null});
        }
    	});
	});

	router.post('/addFriend', function(req, res){

		var friendEmail = req.body.friendEmail;
		console.log("email: "+friendEmail);

		connection.query("SELECT * FROM user WHERE email = ?",[friendEmail], function(err, rows) {
        if (err)
            return done(err);
        if (rows.length) {

        	connection.query("select * from friends where user1 = ? and user2 = ?", [req.user['email'], friendEmail], function(err, rows){
        		if(err)
        			return done(err);
        		if(rows.length){
        			console.log("[addfirend] 이미 친구 있음");
        			//res.send(req.flash('addfriendMessage', 'Already Friends!'));
        			//res.render('mypage', {
					//	user : req.user, addfriendMessage: "Already Friends!"});
        		}
        		else{
		            var insertQuery = "INSERT INTO friends (user1, user2) values (?,?)";

		            connection.query(insertQuery,[req.user['email'], friendEmail],function(err, rows) {

		            console.log("addfirend] 친구추가 성공!");
		            });
		            var insertQuery = "INSERT INTO friends (user2, user1) values (?,?)";

		            connection.query(insertQuery,[req.user['email'], friendEmail],function(err, rows) {

		            console.log("addfirend] 친구추가2 성공!");
		            });
        		}
        	});

        } else {
        	//req.flash('addfriendMessage', 'That email is not exists');
        	console.log("addfirend] email is not exists");
        }

        res.redirect('/mypage');
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
