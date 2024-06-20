// controllers/taskListController.js

const db = require('../db');

// Récupérer toutes les tâches
const getAllTasks = (req, res) => {
  const query = `
    SELECT * FROM task_list
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.json(results);
  });
};

// Récupérer une tâche par son ID
const getTaskById = (req, res) => {
  const taskId = req.params.taskId;

  const query = `
    SELECT * FROM task_list
    WHERE _id = ?
  `;

  db.query(query, [taskId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(results[0]);
  });
};

// Créer une nouvelle tâche
const createTask = (req, res) => {
  const { task, task_description, priority, due_date, profile_id } = req.body;

  const insertQuery = `
    INSERT INTO task_list (task, task_description, priority, due_date, profile_id)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(insertQuery, [task, task_description, priority, due_date, profile_id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to create task' });
    }
    res.status(201).json({ message: 'Task created successfully' });
  });
};

// Mettre à jour une tâche par son ID
const updateTask = (req, res) => {
  const taskId = req.params.taskId;
  const { task, task_description, priority, due_date, profile_id } = req.body;

  const updateQuery = `
    UPDATE task_list
    SET task = ?,
        task_description = ?,
        priority = ?,
        due_date = ?,
        profile_id = ?
    WHERE _id = ?
  `;

  db.query(updateQuery, [task, task_description, priority, due_date, profile_id, taskId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to update task' });
    }
    res.json({ message: 'Task updated successfully' });
  });
};

// Supprimer une tâche par son ID
const deleteTask = (req, res) => {
  const taskId = req.params.taskId;

  const deleteQuery = `
    DELETE FROM task_list
    WHERE _id = ?
  `;

  db.query(deleteQuery, [taskId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to delete task' });
    }
    res.json({ message: 'Task deleted successfully' });
  });
};

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};
