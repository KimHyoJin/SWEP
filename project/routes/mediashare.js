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

})();

function isLoggedIn(req, res, next) {

        // if user is authenticated in the session, carry on
        if (req.isAuthenticated())
                return next();

        // if they aren't redirect them to the home page
        res.redirect('/');
}