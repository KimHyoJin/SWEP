var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/mediashare', function(req, res, next) {
  res.render('mediashare', { title: 'mediashare' });
});

module.exports = router;
