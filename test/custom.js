var assert = require('assert');
var impulsedb = require('../src');

describe('custom database', () => {
  'use strict';

  var db;

  beforeEach(() => {
    db = impulsedb('boo', {
      adapter: function(name, objects) {
        objects['super secret key'] = {name};
        return function noopSave() {};
      }
    });
  });

  it('noop adapter', () => {
    db('foo').set('bar', 'baz');
    assert.deepEqual(db('foo').get('bar'), 'baz');
    assert.deepEqual(db('super secret key').get('name'), 'boo');
  });
});
