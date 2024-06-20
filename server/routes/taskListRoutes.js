// routes/taskListRoutes.js

const express = require('express');
const router = express.Router();
const taskListController = require('../controllers/taskListController');

// Routes pour les tâches
router.get('/', taskListController.getAllTasks);
router.get('/:taskId', taskListController.getTaskById);
router.post('/', taskListController.createTask);
router.put('/:taskId', taskListController.updateTask);
router.delete('/:taskId', taskListController.deleteTask);

module.exports = router;
