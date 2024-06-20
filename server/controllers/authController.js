// MODULES
const express = require('express');
const passport = require('../config/passport');
const bcrypt = require('bcrypt');
const db = require('../db');
const router = express.Router();

// Route Handlers
const registerUser = async (req, res) => {
    const { username, email, password, birthday } = req.body;

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
};

const loginUser = async (req, res, next) => {
    const { identifier, password } = req.body;  // `identifier` peut être soit le username, soit l'email

    try {
        // Recherche de l'utilisateur par email ou username
        const userQuery = 'SELECT * FROM user WHERE email = ? OR username = ?';
        const userResult = await new Promise((resolve, reject) => {
            db.query(userQuery, [identifier, identifier], (err, results) => {
                if (err) return reject(err);
                resolve(results[0]);
            });
        });

        if (!userResult) {
            return res.status(401).json({ error: 'No user found with these credentials' });
        }

        // Vérification du mot de passe
        const isMatch = await bcrypt.compare(password, userResult.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Incorrect password' });
        }

        // Authentification réussie
        req.login(userResult, err => {
            if (err) return next(err);
            res.json({ message: 'Login successful', user: userResult });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error during login' });
    }
};

const checkAuthStatus = (req, res) => {
    res.json({ isAuthenticated: req.isAuthenticated() });
};

const logoutUser = (req, res) => {
    req.logout((err) => {
        if (err) {
            // En cas d'erreur lors de la déconnexion
            return res.status(500).json({ error: 'Failed to logout' });
        }
        // Déconnexion réussie, retourne un message de confirmation
        res.status(200).json({ message: 'Logout successful' });
    });
};

// Export as individual modules
module.exports = {
    registerUser,
    loginUser,
    checkAuthStatus,
    logoutUser
};
