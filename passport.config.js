var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy
var APP_KEY = require('./server.js').APP_KEY

passport.use(new LocalStrategy(
  function(username, password, done) {
    global.dbo.collection('users').findOne({ name: username }, function (err, user) {
      if (err) { return done(err); }
      // Return if user not found in database
      if (!user) {
        return done(null, false, {
          message: 'User not found'
        });
      }

      // If credentials are correct, return the user object
      return done(null, user);
    });
  }
));