const express = require('express');
const router = express.Router();
const giftIdeasController = require('../controllers/giftIdeasController');

// Routes pour les gift ideas
router.get('/', giftIdeasController.getAllGiftIdeas);
router.get('/:ideaId', giftIdeasController.getGiftIdeaById);
router.get('/contact/:contactId', (req, res, next) => {
    console.log(`Received request to get gift ideas for contact ID: ${req.params.contactId}`);
    next();
  }, giftIdeasController.getGiftIdeasByContactId);
router.post('/', giftIdeasController.createGiftIdea);
router.put('/:ideaId', giftIdeasController.updateGiftIdea);
router.delete('/:ideaId', giftIdeasController.deleteGiftIdea);

module.exports = router;
