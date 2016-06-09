var express = require('express');
var flash    = require('connect-flash');
var passport = require('passport');
var mysql = require('mysql');
var dbconfig = require('../config/database');
var fs = require('fs');

module.exports = (function() {
    var router = express.Router();
    var connection  = mysql.createConnection(dbconfig.connection);
    connection.query('USE ' + dbconfig.database);


    router.get('/chatroom', isLoggedIn, function(req, res){
      connection.query("SELECT count(*) as `count`, channel, video FROM chat WHERE receiver = ? order by chatid desc",[ req.user['email'] ], function(err, rows) {
        var channel = "";
        var video= "";

        if (rows[0].count)
        {
          channel = rows[0].channel;
          video = rows[0].video;
        }
        if (!video)
          video = req.query.video;
        console.log(rows[0].count, rows[0].channel, rows[0].video);
        res.render('chatroom', {user: req.user, channel: channel, video: video});
      });
    });

})();

function isLoggedIn(req, res, next) {

        // if user is authenticated in the session, carry on
        if (req.isAuthenticated())
                return next();

        // if they aren't redirect them to the home page
        res.redirect('/');
}