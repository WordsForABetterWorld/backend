var expect = require('chai').expect;
var request = require('supertest');
var app = require('../../app');

var validItem = require('../../schema/samples/word.json');

describe("POST /validate/", function () {

  it('responds with unsuported media type if no item is given', function (done) {
    request(app)
      .post('/validate/')
      .set('Accept', 'application/json')
      .expect(415, 'Couln\'t identify type of Object', done);
  });

  it('responds with OK if valid items is given', function (done) {
    request(app)
      .post('/validate/')
      .set('Accept', 'application/json')
      .send(validItem)
      .expect(200, 'Valid', done);
  });

  it('responds with array of errors if invalid item is given', function (done) {
    request(app)
      .post('/validate/')
      .set('Accept', 'application/json')
      .send({ type: "word" })
      .expect('Content-Type', /json/)
      .expect(200, done);
  });
});