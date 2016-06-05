var express = require('express');
var router = express.Router();

var mysql = require('mysql');
var dbconfig = require('../config/database');
var connection = mysql.createConnection(dbconfig.connection);

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

module.exports = router;
