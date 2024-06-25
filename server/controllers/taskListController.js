const db = require('../db');

// Fonction de gestion des erreurs serveur uniforme
const handleServerError = (res, err) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
};

// Récupérer toutes les tâches
const getAllTasks = (req, res) => {
  const query = `
    SELECT * FROM task_list
  `;

  db.query(query, (err, results) => {
    if (err) return handleServerError(res, err); //++ simplification de la gestion des erreurs
    res.json(results);
  });
  console.log('GET /api/task-list');
};

// Récupérer une tâche par son ID
const getTaskById = (req, res) => {
  const taskId = req.params.taskId;

  const query = `
    SELECT * FROM task_list
    WHERE _id = ?
  `;

  db.query(query, [taskId], (err, results) => {
    if (err) return handleServerError(res, err); // Utilisation de la fonction de gestion des erreurs
    if (results.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(results[0]);
  });
};

// Créer une nouvelle tâche
const createTask = (req, res) => {
  const { task, task_description, priority, due_date, profile_id } = req.body;

  // Utilisation des transactions pour garantir l'intégrité des données
  db.beginTransaction(err => {
    if (err) return handleServerError(res, err);

    const insertQuery = `
      INSERT INTO task_list (task, task_description, priority, due_date, profile_id)
      VALUES (?, ?, ?, ?, ?)
    `;

    db.query(insertQuery, [task, task_description, priority, due_date, profile_id], (err, result) => {
      if (err) {
        return db.rollback(() => handleServerError(res, err)); // Rollback en cas d'erreur
      }
      db.commit(err => {
        if (err) return db.rollback(() => handleServerError(res, err)); // Rollback en cas d'erreur lors de la finalisation
        res.status(201).json({ message: 'Task created successfully' });
      });
    });
  });
};

// Mettre à jour une tâche par son ID
const updateTask = (req, res) => {
  const taskId = req.params.taskId;
  const { task, task_description, priority, due_date, profile_id } = req.body;

  // Utilisation des transactions pour garantir l'intégrité des données
  db.beginTransaction(err => {
    if (err) return handleServerError(res, err);

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
        return db.rollback(() => handleServerError(res, err)); // Rollback en cas d'erreur
      }
      db.commit(err => {
        if (err) return db.rollback(() => handleServerError(res, err)); // Rollback en cas d'erreur lors de la finalisation
        res.json({ message: 'Task updated successfully' });
      });
    });
  });
};

// Supprimer une tâche par son ID
const deleteTask = (req, res) => {
  const taskId = req.params.taskId;

  console.log(`Attempting to delete task with id: ${taskId}`);

  if (!taskId) {
    console.error('Task ID is undefined');
    return res.status(400).json({ error: 'Task ID is required' });
  }

  // Utilisation des transactions pour garantir l'intégrité des données
  db.beginTransaction(err => {
    if (err) return handleServerError(res, err);

    const deleteQuery = `
      DELETE FROM task_list
      WHERE _id = ?
    `;

    db.query(deleteQuery, [taskId], (err, result) => {
      if (err) {
        console.error('Database query error during task deletion:', err);
        return handleServerError(res, err);
      }
      db.commit(err => {
        if (err) {
          console.error('Error during commit:', err);
          return handleServerError(res, err);
        }
        res.json({ message: 'Task deleted successfully' });
      });
    });
  });
};

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};