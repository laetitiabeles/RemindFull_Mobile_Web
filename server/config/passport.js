// MODULES
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const db = require('../db');

passport.use(new LocalStrategy(
  {
      usernameField: 'username', // Renommé pour refléter qu'il peut être email ou username
      passwordField: 'password'
  },
  function(username, password, done) {
      console.log(`Attempting to authenticate user with username: ${username}`);
      db.query('SELECT * FROM user WHERE username = ?', [username], function(err, results) {
          if (err) {
              console.error("Database error during authentication:", err);
              return done(err);
          }
          if (!results.length) {
              console.log(`No user found with username: ${username}`);
              return done(null, false, { message: 'Incorrect username or email.' });
          }
          if (!bcrypt.compareSync(password, results[0].password)) {
              console.log("Incorrect password provided for user:", username);
              return done(null, false, { message: 'Incorrect password.' });
          }
          console.log(`User ${username} authenticated successfully`);
          return done(null, results[0]);
      });
  }
));

// Sérialisation de l'utilisateur pour la session
passport.serializeUser((user, done) => {
  console.log(`Serializing user: ${user._id}`);
  done(null, user._id);
});

// Désérialisation de l'utilisateur à partir de l'ID de session
passport.deserializeUser((_id, done) => {
  console.log(`Deserializing user with ID: ${_id}`);
  db.query('SELECT * FROM user WHERE _id = ?', [_id], function(err, results) {
      if (err) {
          console.error("Error deserializing user:", err);
          return done(err);
      }
      done(null, results[0]);
  });
});

module.exports = passport;
