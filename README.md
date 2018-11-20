# KnexReconnector

Very basic version of a wrapper for knex enabling switching databases on the
fly. Currently supports:

```
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
```

Tests passing with 100% coverage, fill in `template.env` into `.env` file to
run tests, need mysql db with db `test`.
