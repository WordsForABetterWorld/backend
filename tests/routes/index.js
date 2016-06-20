var expect = require('chai').expect;
var request = require('supertest');
var app = require('../../app');
var config = require('config').public;

describe("GET /", function () {
  it('respond with public part of config', function (done) {
    request(app)
      .get('/')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, config, done);
  });
});