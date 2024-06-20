// routes/contactsRoutes.js

const express = require('express');
const router = express.Router();
const contactsController = require('../controllers/contactsController');

// Routes pour les contacts
router.get('/', contactsController.getAllContacts);
router.get('/:contactId', contactsController.getContactById);
router.post('/', contactsController.createContact);
router.put('/:contactId', contactsController.updateContact);
router.delete('/:contactId', contactsController.deleteContact);

module.exports = router;
