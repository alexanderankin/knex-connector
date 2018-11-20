var assert = require('chai').assert;
var dotenv = require('dotenv').config({
  path: require('path').join(__dirname, '..', '.env')
});

var knexRe = require('../');

describe('Basic import', function () {
  it('should not be undefined', function () {
    assert(knexRe !== undefined);
  });

  it('should be instantiable', function () {
    var connector = new knexRe({});

    assert(connector !== undefined);
  });
});

describe('Instantiate', function () {
  it('should fail with no options at instantiation', function () {
    var connector = new knexRe({});
    assert.throws(function () {
      connector.getKnex();
    });
  });

  it('should fail with bad options after instantiation', function () {
    var connector = new knexRe({ client: 'mysql' });
    assert.doesNotThrow(function () {
      connector.getKnex();
    });
  });

  it('should fail with reinstall', function () {
    var connector = new knexRe({ client: 'mysql' });
    assert.throws(function () {
      connector.install({ client: 'pg' });
    });
  });

  it('should work with install', function (done) {
    var connector = new knexRe();
    assert.doesNotThrow(function () {
      connector.install({ client: 'pg' });
    });
    connector.reset({ client: 'mysql' }, function (err, knex_) {
      assert(err === null, 'Error not null: ' + err);
      knex_.destroy(done);
    });
  });
});

describe('Running queries', function () {
  it('should connect and run a query', function (done) {
    var connector = new knexRe({ client: 'mysql', connection: {
      host: '127.0.0.1',
      user: process.env['mysqlu'],
      password: process.env['mysqlp'],
      db: 'test'
    }});

    var k = connector.getKnex();
    k.schema.raw('select 2 + 2 as a').asCallback(function (e, r) {
      assert(e === null, 'Error not null: ' + e);

      var [ rows, packets ] = r;
      assert.equal(rows[0] && rows[0].a, 4);
      k.destroy(done);
    });
  });

  it('should run a query on two db\'s', function (done) {
    var connector = new knexRe({ client: 'mysql', connection: {
      host: '127.0.0.1',
      user: process.env['mysqlu'],
      password: process.env['mysqlp'],
      db: 'test'
    }});

    connector.getKnex().schema.raw('select 2 + 2 as a')
      .asCallback(function (e, r) {
        assert(e === null, 'Error not null: ' + e);

        connector.reset({
          client: 'sqlite3',
          useNullAsDefault: false,
          connection: { filename: ':memory:' }
        }, function (e, k) {
          assert(e === null, 'Error not null: ' + e);
          k.schema.raw('select 3 + 3 as b').asCallback(function (e, r) {
            assert(e === null, 'Error not null: ' + e);
            assert(r[0].b === 6, 'Select 3 + 3 as b is not 6');
            connector.destroy(done);
          });
        });
      });
  });
});
