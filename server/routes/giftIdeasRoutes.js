const express = require('express');
const router = express.Router();
const giftIdeasController = require('../controllers/giftIdeasController');

// Routes pour les gift ideas
router.get('/', giftIdeasController.getAllGiftIdeas);
router.get('/:ideaId', giftIdeasController.getGiftIdeaById);
router.post('/', giftIdeasController.createGiftIdea);
router.put('/:ideaId', giftIdeasController.updateGiftIdea);
router.delete('/:ideaId', giftIdeasController.deleteGiftIdea);

module.exports = router;
