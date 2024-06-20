// MODULES
const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const moment = require('moment');
const db = require('../db');
const router = express.Router();

// Route pour l'inscription d'un nouvel utilisateur
router.post('/register', async (req, res) => {
    const { username, email, password, birthday, neurodivergences } = req.body;

    try {
        // Check si l'user existe
        const existingUser = await new Promise((resolve, reject) => {
            db.query('SELECT * FROM user WHERE username = ?', [username], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });

        if (existingUser.length > 0) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        // Inscription de l'utilisateur si l'username est unique
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert l'user dans la table user
        const userResult = await new Promise((resolve, reject) => {
            db.query('INSERT INTO user (username, email, password) VALUES (?, ?, ?)',
                [username, email, hashedPassword],
                (err, results) => {
                    if (err) return reject(err);
                    resolve(results);
                });
        });

        const userId = userResult.insertId;

        // Insert le profil de l'utilisateur dans la table profile
        const profileResult = await new Promise((resolve, reject) => {
            db.query('INSERT INTO profile (user_id, birthday) VALUES (?, ?)',
                [userId, birthday],
                (err, results) => {
                    if (err) return reject(err);
                    resolve(results);
                });
        });

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// Login
router.post('/login', passport.authenticate('local'), (req, res) => {
    res.json(req.user); // Retourne l'utilisateur connecté
});

// Check authentication status
router.get('/status', (req, res) => {
    res.json({ isAuthenticated: req.isAuthenticated() });
});

// Logout
router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to logout' });
        }
        res.redirect('/'); // Redirige l'utilisateur vers la page de connexion après la déconnexion
    });
});

module.exports = router;
