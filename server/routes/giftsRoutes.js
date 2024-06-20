const express = require('express');
const router = express.Router();
const giftsController = require('../controllers/giftsController');

// Routes pour les gifts
router.get('/', giftsController.getAllGifts);
router.get('/:giftId', giftsController.getGiftById);
router.post('/', giftsController.createGift);
router.put('/:giftId', giftsController.updateGift);
router.delete('/:giftId', giftsController.deleteGift);

module.exports = router;
