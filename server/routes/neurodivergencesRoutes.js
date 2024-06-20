const express = require('express');
const router = express.Router();
const neurodivergencesController = require('../controllers/neurodivergencesController');


// Routes pour les neurodivergences
router.get('/', neurodivergencesController.getAllNeurodivergences);
router.post('/', neurodivergencesController.createNeurodivergence);
router.put('/:id', neurodivergencesController.updateNeurodivergence);
router.delete('/:id', neurodivergencesController.deleteNeurodivergence);

module.exports = router;
