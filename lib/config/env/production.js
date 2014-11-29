'use strict';

module.exports = {
  env: 'production',
  ip:   process.env.IP ||
        '0.0.0.0',
  port: process.env.PORT ||
        8080,
  mongo: {
    uri: process.env.MONGOHQ_URL ||
         'mongodb://localhost:27017/lorecat-dev'
  },
  // memcached env variables automatically recognized by memjs
  /*memcached: {
    uri: process.env.MEMCACHIER_USERNAME + ':' + process.env.MEMCACHIER_PASSWORD + '@' + process.env.MEMCACHIER_SERVERS
  },*/
  facebook: {
    clientID: "1416415191971106",
    clientSecret: "7c1ff58b101ba8cb6de884b68670a13c",
    callbackURL: "http://www.lorecat.com/auth/facebook/callback"
  },
  twitter: {
    clientID: "tEoefcedNUredDQ9d7bwZJidf",
    clientSecret: "oMPq1AelFJg99T5tKVXZYiemhvY615iH7XtDmTai1uF4IVzhjH",
    callbackURL: "http://www.lorecat.com/auth/twitter/callback"
  },
  google: {
    clientID: "183329064779-nk4269rthumdcks33fpv0ohp3i4o4gm4.apps.googleusercontent.com",
    clientSecret: "LEEebK_R3KokSqSCni0BHFuO",
    callbackURL: "http://www.lorecat.com/auth/google/callback"
  }
};