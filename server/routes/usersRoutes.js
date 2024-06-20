const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const profilesController = require('../controllers/profilesController');

// Routes pour les utilisateurs
router.get('/', usersController.getAllUsers);
router.get('/:userId', usersController.getUserById);
router.post('/', usersController.createUser);
router.put('/:userId', usersController.updateUser);
router.delete('/:userId', usersController.deleteUser);

// Routes pour les profils
router.get('/:userId/profile', profilesController.getProfileByUserId);
router.post('/:userId/profile', profilesController.createProfile);
router.put('/:userId/profile', profilesController.updateProfile);
router.delete('/:userId/profile', profilesController.deleteProfile);

module.exports = router;
