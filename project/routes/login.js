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

//process the login form
router.post('/signin', passport.authenticate('local-login', {
	successRedirect : '/mypage', // redirect to the secure profile section
	            failureRedirect : '/', // redirect back to the signup page if there is an error
	            failureFlash : true // allow flash messages
			}),

	function(req, res) {
		            if (req.body.remember) {
				                  req.session.cookie.maxAge = 1000 * 60 * 3;
						              } else {
								                    req.session.cookie.expires = false;
										                }
			            	res.redirect('/');
					    	});

//process the signup form
router.post('/signup', passport.authenticate('local-signup', {
			successRedirect : '/mypage', // redirect to the secure profile section
			failureRedirect : '/error', // redirect back to the signup page if there is an error
			failureFlash : true // allow flash messages
		}));

    return router;    
    })();
