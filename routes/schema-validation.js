var express = require('express');
var router = express.Router();
var schemaValidator = require('../modules/schema-validator');

/* POST /validate/ */
router.post('/validate/', function(req, res) {

  var item = req.body;

  if(typeof item === 'object' && typeof item.type === 'string'){
    schemaValidator.getAll('./schema/', function (err, schemas) {
      var validationErrors = [];
      try {
        validationErrors = schemaValidator.validate(req.body, schemas).errors;
      } catch (err){
        res.statusCode = 500;
        res.end('Internal Server Error');
      }

      if(validationErrors.length > 0){
        res.json(validationErrors);
      }else{
        res.end('Valid');
      }
    });
  }else {
    res.statusCode = 415;
    res.end('Couln\'t identify type of Object');
  }
});

module.exports = router;