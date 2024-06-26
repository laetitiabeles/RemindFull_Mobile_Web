const express = require('express');
const router = express.Router();
const giftsController = require('../controllers/giftsController');

// Routes pour les gifts
router.get('/', (req, res, next) => {
  console.log("Received request to get all gifts");
  next();
}, giftsController.getAllGifts);

router.get('/:giftId', (req, res, next) => {
  console.log(`Received request to get gift with ID: ${req.params.giftId}`);
  next();
}, giftsController.getGiftById);

router.get('/contact/:contactId', (req, res, next) => {
  console.log(`Received request to get gifts for contact ID: ${req.params.contactId}`);
  next();
}, giftsController.getGiftsByContactId); // Ajouter cette route pour récupérer les cadeaux par contact

router.post('/', (req, res, next) => {
  console.log("Received request to create a new gift with data:", req.body);
  next();
}, giftsController.createGift);

router.put('/:giftId', (req, res, next) => {
  console.log(`Received request to update gift with ID: ${req.params.giftId}`);
  console.log("Update data:", req.body);
  next();
}, giftsController.updateGift);

router.delete('/:giftId', (req, res, next) => {
  console.log(`Received request to delete gift with ID: ${req.params.giftId}`);
  next();
}, giftsController.deleteGift);

module.exports = router;
