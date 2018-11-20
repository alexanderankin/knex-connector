var knex = require('knex');

/**
 * KnexReconnector
 * 
 * Class to hold a knex instance wrapping methods to reconnect.
 * 
 * Methods:
 * #KnexReconnector - construct with opts
 * #install - add opts if not in constructor or if cleared
 * #getKnex - gets knex with current opts
 * #reset - takes opts and callback(null, knex)
 * #destroy - takes callback, used by reset
 */
function KnexReconnector(opts) {
  opts = opts || {};
  this.opts = opts;
  if (!opts.client) {
    return;
  }

  this.knex = knex(opts);
}

KnexReconnector.prototype.reset = function(opts, done) {
  this.opts = opts;
  this.destroy(function () {
    this.knex = knex(opts);

    done(null, this.knex);
  }.bind(this));
};

KnexReconnector.prototype.destroy = function(done) {
  if (!this.knex) { return done(); }
  this.knex.destroy()
    .then(function () {
      this.knex = undefined;

      done();
      return null;
    }.bind(this))
    .catch(done);
};

KnexReconnector.prototype.install = function(opts) {
  if (this.knex) { return done(new Error('Already installed')); }
  this.opts = opts;
};


KnexReconnector.prototype.getKnex = function() {
  if (!this.knex) {
    this.knex = knex(this.opts);
  }

  return this.knex;
};

module.exports = KnexReconnector;
