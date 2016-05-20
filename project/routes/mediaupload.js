var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/videoupload', function(req, res, next) {
  res.render('videoupload', { title: 'videoupload' });
});

module.exports = router;
