var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/mypage', function(req, res, next) {
  //res.send('respond with a resource');
  res.render('mypage', { title: 'mypage' });

});

module.exports = router;
