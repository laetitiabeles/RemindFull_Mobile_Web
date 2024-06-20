// MODULES
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const db = require('../db');

passport.use(new LocalStrategy(
  {
    usernameField: 'identifier', // email ou username
    passwordField: 'password'
  },
  (identifier, password, done) => {
    // Requête à la base de données pour trouver l'utilisateur par email ou username
    const query = 'SELECT * FROM user WHERE email = ? OR username = ?';
    db.query(query, [identifier, identifier], async (err, results) => {
      if (err) {
        return done(err);
      }
      if (!results || results.length === 0) {
        return done(null, false, { message: 'User not found' });
      }

      const user = results[0];

      // Vérifie le mot de passe haché
      try {
        if (await bcrypt.compare(password, user.password)) {
          // Mot de passe correct
          return done(null, user);
        } else {
          // Mot de passe incorrect
          return done(null, false, { message: 'Incorrect password' });
        }
      } catch (error) {
        return done(error);
      }
    });
  }
));

// Sérialisation de l'utilisateur pour la session
passport.serializeUser((user, done) => {
  done(null, user._id);
});

// Désérialisation de l'utilisateur à partir de l'ID de session
passport.deserializeUser((id, done) => {
  const query = 'SELECT * FROM user WHERE _id = ?';
  db.query(query, [id], (err, results) => {
    if (err) {
      return done(err);
    }
    if (!results || results.length === 0) {
      return done(null, false);
    }
    done(null, results[0]);
  });
});

module.exports = passport;
