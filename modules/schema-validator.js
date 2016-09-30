var fs = require('fs');
var path = './schema/';
var async = require('async');

var Validator = require('jsonschema').Validator;

function getAll(path, callback) {

  fs.readdir(path, function (err, files) {
    if(err) throw err;

    // filter out files we don't want to read
    var fileNamesToReject = ['.', '..', 'samples'];

    files = files.filter(function (fileName) {
      return fileNamesToReject.indexOf(fileName) === -1;
    });

    // read all schema files
    var schemas = [];

    async.each(files, function (file, callback) {
      fs.readFile(path + file, function (err, data) {
        if(err) throw err;
        schemas.push(JSON.parse(data));
        callback();
      });
    }, function (err) {
      callback(err, schemas);
    });
  });
}

function validate(item, schemas) {
  var v = new Validator();

  var schema = schemas.find(function (schema) {
    return schema.id === item.type + '.json';
  });

  if(typeof schema === 'undefined'){
    throw new Error('No Schema for Item of type ' + item.type + ' found');
  }

  schemas.forEach(function (schema) {
    v.addSchema(schema, '/' + schema.id);
  });

  return v.validate(item, schema);
}

module.exports = {
  getAll: getAll,
  validate: validate
};