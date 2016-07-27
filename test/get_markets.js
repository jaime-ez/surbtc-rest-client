'use strict';

var Client = require('../');
var assert = require('chai').assert;
var success = require('./fixtures/get_markets').success;
var errorFixture = require('./fixtures/get_markets').error;

describe('Surbtc REST Client Get markets', function() {

  it('should get markets', function(done) {

    var client = new Client({});

    client.getMarkets(function(error, response) {
      assert(!error);
      assert(response);
      assert.deepEqual(success(response), response);
      done();
    });
  });

  it('should fail to get markets', function(done) {

    var client = new Client({
      api: 'https://surbtc.com/api/v1/marketmarket'
    });

    client.getMarkets(function(error, response) {
      assert(error);
      assert(!response);
      assert.deepEqual(errorFixture(), error);
      done();
    });
  });
});
