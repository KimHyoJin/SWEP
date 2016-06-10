var express = require('express');
var flash    = require('connect-flash');
var passport = require('passport');
var mysql = require('mysql');
var dbconfig = require('../config/database');
var fs = require('fs');
//////////////////var path = require('path');

module.exports = (function() {
    var router = express.Router();
    var connection  = mysql.createConnection(dbconfig.connection);
    connection.query('USE ' + dbconfig.database);

// 개인 비디오 저장소
	router.get('/myvideo', isLoggedIn, function(req, res) {
	var user = req.user['email'];

	connection.query("SELECT * FROM video WHERE isStore = ?",[user], function(err, rows) {
    if (err)
        return done(err);
    if (rows.length) {
    	console.log("[videostore] 비디오 있음");
    	res.render('myvideo', {
			user: req.user, result: rows});
    }
    else
    {
    	console.log("[videostore] 비디오 없음");
    	res.render('myvideo', {
			user: req.user, result: null});
    }
	});
	});


// 비디오 스토어
	router.get('/videostore',isLoggedIn, function(req, res) {

	var admin = "admin@root";
	var friends ="";

	connection.query("SELECT user2 FROM friends WHERE user1= ?",[req.user['email']], function(err, rows) {
    if (err)
       return done(err);
    if (rows.length) {
    	friends = rows;
    	console.log("[videostore] 친구 있음");

    	connection.query("SELECT * FROM video WHERE isStore = ?",[admin], function(err, rows) {
	    if (err)
	        return done(err);
	    if (rows.length) {
	    	console.log("[videostore] 비디오 있음");


	    	res.render('mediahub', {
				user: req.user, result: rows, myfriend: friends});
	    }
	    else
	    {
	    	console.log("[videostore] 비디오 없음");
		    connection.query("SELECT * FROM video WHERE isStore = ?",[admin], function(err, rows) {
		    if (err)
		        return done(err);
		    if (rows.length) {
		    	console.log("[videostore] 비디오 있음");

		    	res.render('mediahub', {
					user: req.user, result: null, myfriend: friends});
		    }
	    });
		}
		});
    }
    else
    {
    	console.log("[videostore] 친구 없음");
    	res.render('mypage', {
			user: req.user, result: null});
    }
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
