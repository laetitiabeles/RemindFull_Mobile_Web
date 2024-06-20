const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('./config/passport');
const app = express();

// Middleware pour parser le JSON et gérer les CORS
app.use(express.json());
app.use(cors());

// Middleware pour gérer les erreurs de parsing JSON
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
      console.error('Invalid JSON or bad request', err);
      return res.status(400).json({ error: 'Invalid JSON or bad request' });
  }
  next();
});

// Session middleware
app.use(session({
  secret: 'your_secret_session_key',
  resave: false,
  saveUninitialized: false
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
const contactsRoutes = require('./routes/contactsRoutes');
const usersRoutes = require('./routes/usersRoutes');
const neurodivergencesRoutes = require('./routes/neurodivergencesRoutes');
const authRoutes = require('./routes/authRoutes');
const giftsRoutes = require('./routes/giftsRoutes');
const giftIdeasRoutes = require('./routes/giftIdeasRoutes');
const taskListRoutes = require('./routes/taskListRoutes');

// USE Routes
app.use('/auth', authRoutes);
app.use('/api/contacts', contactsRoutes);
app.use('/api/users', passport.authenticate('local', { session: false }), usersRoutes);
app.use('/api/neurodivergences', neurodivergencesRoutes);
app.use('/api/gifts', passport.authenticate('local', { session: false }), giftsRoutes);
app.use('/api/gift_ideas', passport.authenticate('local', { session: false }), giftIdeasRoutes);
app.use('/api/task-list', passport.authenticate('local', { session: false }), taskListRoutes);

// Démarre le serveur
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
