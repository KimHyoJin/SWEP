var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/mediashare', function(req, res, next) {
//  res.render('mediashare', { title: 'mediashare' });

  	var admin = "admin@root";
  	var friends ="";

  	connection.query("SELECT user2 FROM friends WHERE user1= ?",[req.user['email']], function(err, rows) {
      if (err)
         return done(err);
      if (rows.length) {
      	friends = rows;
      	console.log("[mediashare] 친구 있음");

      	connection.query("SELECT * FROM video WHERE isStore = ?",[admin], function(err, rows) {
  	    if (err)
  	        return done(err);
  	    if (rows.length) {
  	    	console.log("[mediashare] 비디오 있음");


  	    	res.render('mediashare', {
  				user: req.user, result: rows, myfriend: friends});
  	    }
  	    else
  	    {
  	    	console.log("[mediashare] 비디오 없음");
  		    connection.query("SELECT * FROM video WHERE isStore = ?",[admin], function(err, rows) {
  		    if (err)
  		        return done(err);
  		    if (rows.length) {
  		    	console.log("[mediashare] 비디오 있음");

  		    	res.render('mediashare', {
  					user: req.user, result: null, myfriend: friends});
  		    }
  	    });
  		}
  		});
      }
      else
      {
      	console.log("[mediashare] 친구 없음");
      	res.render('mypage', {
  			user: req.user, result: null});
      }
  	});

});




module.exports = router;
