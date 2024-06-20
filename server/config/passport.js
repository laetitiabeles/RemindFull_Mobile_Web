// MODULES
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const db = require('../db');

passport.use(new LocalStrategy(
  {
      usernameField: 'identifier', // Renommé pour refléter qu'il peut être email ou username
      passwordField: 'password'
  },
  function(identifier, password, done) {
      console.log(`Attempting to authenticate user with identifier: ${identifier}`);
      db.query('SELECT * FROM user WHERE username = ? OR email = ?', [identifier, identifier], function(err, results) {
          if (err) {
              console.error("Database error during authentication:", err);
              return done(err);
          }
          if (!results.length) {
              console.log(`No user found with identifier: ${identifier}`);
              return done(null, false, { message: 'Incorrect username or email.' });
          }
          if (!bcrypt.compareSync(password, results[0].password)) {
              console.log("Incorrect password provided for user:", identifier);
              return done(null, false, { message: 'Incorrect password.' });
          }
          console.log(`User ${identifier} authenticated successfully`);
          return done(null, results[0]);
      });
  }
));

// Sérialisation de l'utilisateur pour la session
passport.serializeUser((user, done) => {
  console.log(`Serializing user: ${user._id}`);
  done(null, user.id);
});

// Désérialisation de l'utilisateur à partir de l'ID de session
passport.deserializeUser((id, done) => {
  console.log(`Deserializing user with ID: ${id}`);
  db.query('SELECT * FROM user WHERE _id = ?', [id], function(err, results) {
      if (err) {
          console.error("Error deserializing user:", err);
          return done(err);
      }
      done(null, results[0]);
  });
});

module.exports = passport;
