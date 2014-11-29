'use strict';

module.exports = {
  env: 'development',
  mongo: {
    uri: 'mongodb://localhost:27017/lorecat-dev'
  },
  memcached: {
    uri: 'localhost:11211'
  },
  facebook: {
    clientID: "1416415191971106",
    clientSecret: "7c1ff58b101ba8cb6de884b68670a13c",
    callbackURL: "http://localhost:8000/auth/facebook/callback"
  },
  twitter: {
    clientID: "tEoefcedNUredDQ9d7bwZJidf",
    clientSecret: "oMPq1AelFJg99T5tKVXZYiemhvY615iH7XtDmTai1uF4IVzhjH",
    callbackURL: "http://127.0.0.1:8000/auth/twitter/callback"
  },
  google: {
    clientID: "183329064779-nk4269rthumdcks33fpv0ohp3i4o4gm4.apps.googleusercontent.com",
    clientSecret: "LEEebK_R3KokSqSCni0BHFuO",
    callbackURL: "http://localhost:8000/auth/google/callback"
  }
};