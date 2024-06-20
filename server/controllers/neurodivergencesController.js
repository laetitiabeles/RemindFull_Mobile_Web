const db = require('../db');

// Récupérer toutes les neurodivergences
const getAllNeurodivergences = (req, res) => {
  db.query('SELECT * FROM neurodivergences', (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.json(results);
  });
};

// Créer une nouvelle neurodivergence
const createNeurodivergence = (req, res) => {
  const { type } = req.body;
  db.query('INSERT INTO neurodivergences (type) VALUES (?)', [type], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to create neurodivergence' });
    }
    res.status(201).json({ message: 'Neurodivergence created successfully' });
  });
};

// Mettre à jour une neurodivergence
const updateNeurodivergence = (req, res) => {
  const id = req.params.id;
  const { type } = req.body;
  db.query('UPDATE neurodivergences SET type = ? WHERE id = ?', [type, id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to update neurodivergence' });
    }
    res.json({ message: 'Neurodivergence updated successfully' });
  });
};

// Supprimer une neurodivergence
const deleteNeurodivergence = (req, res) => {
  const id = req.params.id;
  db.query('DELETE FROM neurodivergences WHERE id = ?', [id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to delete neurodivergence' });
    }
    res.json({ message: 'Neurodivergence deleted successfully' });
  });
};

module.exports = {
  getAllNeurodivergences,
  createNeurodivergence,
  updateNeurodivergence,
  deleteNeurodivergence
};
