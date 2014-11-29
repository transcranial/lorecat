'use strict';

module.exports = {
  env: 'test',
  mongo: {
    uri: 'mongodb://localhost:27017/lorecat-test'
  },
  memcached: {
    uri: 'localhost:11211'
  }
};