// MODULES

const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('./config/passport');

const app = express();

// Middleware pour parser le JSON et gérer les CORS
app.use(express.json());
app.use(cors());

// Session middleware
app.use(session({
  secret: 'your_secret_session_key',
  resave: false,
  saveUninitialized: false
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Importe la connexion à la db
const db = require('./db');

// Envoie une erreur 500 en cas d'erreur serveur
const handleServerError = (res, err) => {
  console.error(err);
  res.status(500).json({ error: err.message });
};

// Routes
const contactsRoutes = require('./routes/contactsRoutes');
const usersRoutes = require('./routes/usersRoutes');
const neurodivergencesRoutes = require('./routes/neurodivergencesRoutes');
const authRoutes = require('./routes/authRoutes');
const giftsRoutes = require('./routes/giftsRoutes');
const giftIdeasRoutes = require('./routes/giftIdeasRoutes');
const taskListRoutes = require('./routes/taskListRoutes');

// USE Routes
app.use('/api/contacts', passport.authenticate('local'), contactsRoutes);
app.use('/api/users', passport.authenticate('local'), usersRoutes);
app.use('/api/neurodivergences', passport.authenticate('local'), neurodivergencesRoutes);
app.use('/auth', authRoutes);
app.use('/api/gifts', giftsRoutes);
app.use('/api/gift_ideas', giftIdeasRoutes);
app.use('/api/task-list', taskListRoutes);

// Démarre le serveur
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
