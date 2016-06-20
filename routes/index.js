var express = require('express');
var router = express.Router();
var config = require('config');

/* GET config */
router.get('/', function(req, res, next) {
  res.json(config);
});

module.exports = router;
