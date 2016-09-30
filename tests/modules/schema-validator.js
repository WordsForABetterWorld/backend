var schemaValidator = require('../../modules/schema-validator');
var assert = require('assert');
var fs = require('fs');
var async = require('async');

var schemaDir = './schema/';
var sampleDir = schemaDir + 'samples/';

describe('schemaValidator', function () {

  it('gets all schemas', function (done) {
    schemaValidator.getAll(schemaDir, function (err, schemas) {
      if(err) throw err;
      assert.strictEqual(schemas.length, 10);
      done();
    });
  });



});

describe('schema', function () {

  it('is valid', function (done) {

    async.auto({
      schemas: function (callback) {
        schemaValidator.getAll(schemaDir, callback);
      },
      data: function (callback) {
        fs.readdir(sampleDir, function (err, files) {

          if(err) callback(err);
          // filter out standard directory-names
          var fileNamesToReject = ['.', '..'];

          files = files.filter(function (fileName) {
            return fileNamesToReject.indexOf(fileName) === -1;
          });

          // get data
          var items = {};

          async.each(files, function (fileName, callback) {
            fs.readFile(sampleDir + fileName, function(err, data){
              if(err) throw err;
              items[fileName] = JSON.parse(data);
              callback();
            })
          }, function (err) {
            callback(err, items);
          });
        })
      },
      validation: ['schemas', 'data', function (results, callback) {
        async.eachSeries(Object.keys(results.data), function (fileName, callback) {

          var item = results.data[fileName];

          var validationErrors = schemaValidator.validate(item, results.schemas).errors;
          assert.deepStrictEqual(validationErrors, [], fileName + ' validation has non-empty validation errors');
          callback();
        }, callback);
      }]
    }, function (err) {
      if(err) throw err;
      done();
    });

  });

});