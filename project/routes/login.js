var express = require('express');
var flash    = require('connect-flash');
var passport = require('passport');
var mysql = require('mysql');
var dbconfig = require('../config/database');


module.exports = (function() {
	    	var router = express.Router();
			var connection = mysql.createConnection(dbconfig.connection);
				connection.query('USE ' + dbconfig.database);
				    	router.get('/', function(req, res) {
								res.render('login', { message: req.flash('signupMessage'), message2: req.flash('loginMessage')} );
									});
// logout
router.get('/logout', function(req, res) {
	req.logout();
	connection.query("DELETE FROM chat",function(err, rows){
		if(err)
		        {console.log("DELETE CHAT ERROR");}
	        else
		        {console.log("DELETE CHAT SUCCESS");}
	        });
	        res.redirect('/');
});

