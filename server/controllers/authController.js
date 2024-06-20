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


//LOGIN
const loginUser = async (req, res, next) => {
    console.log('Login request received:', req.body);
    const { username, password } = req.body;

    console.log("Received username: ", username);
    console.log("Received password: ", password);

    try {
        // Recherche de l'utilisateur par email ou username
        if (typeof username !== 'string' || typeof password !== 'string') {
            return res.status(400).json({ error: 'username and password must be strings' });
        }
        const userQuery = 'SELECT * FROM user WHERE username = ?';
        const userResult = await new Promise((resolve, reject) => {
            db.query(userQuery, [username], (err, results) => {
                if (err) {
                    console.error('Database query error: ', err);
                    return reject(new Error('Database query error'));
                }
                if (results.length === 0) {
                    console.error('No user found with the provided username');
                    return resolve(null);
                }
                resolve(results[0]);
            });
        });

        if (!userResult) {
            return res.status(401).json({ error: 'No user found with this username' });
        }

        // Logs des mots de passe pour vérifier les valeurs
        console.log("Password from DB (hashed):", userResult.password);
        console.log("Password from input (plain):", password);

        // Vérification du mot de passe avec bcrypt
        const isMatch = await bcrypt.compare(password, userResult.password);
        if (!isMatch) {
            console.error('Password mismatch');
            return res.status(401).json({ error: 'Incorrect password' });
        }

        // Authentification réussie
        req.login(userResult, err => {
            if (err) {
                console.error('Error during login process: ', err);
                return next(err);
            }
            console.log(`User ${username} authenticated successfully`);
            return res.json({ message: 'Login successful', user: userResult });
        });
    } catch (err) {
        console.error('Unexpected error during login: ', err);
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
