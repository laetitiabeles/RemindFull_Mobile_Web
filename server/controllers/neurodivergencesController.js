const db = require('../db');

// Fonction de gestion des erreurs serveur uniforme
const handleServerError = (res, err) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
};

// Récupérer toutes les neurodivergences
const getAllNeurodivergences = (req, res) => {
  const query = 'SELECT * FROM neurodivergences';
  
  db.query(query, (err, results) => {
    if (err) return handleServerError(res, err); // Utilisation de la fonction de gestion des erreurs
    res.json(results);
  });
};

// Créer une nouvelle neurodivergence
const createNeurodivergence = (req, res) => {
  const { type } = req.body;
  const query = 'INSERT INTO neurodivergences (type) VALUES (?)';
  
  db.query(query, [type], (err, results) => {
    if (err) return handleServerError(res, err); // Utilisation de la fonction de gestion des erreurs
    res.status(201).json({ message: 'Neurodivergence created successfully' });
  });
};

// Mettre à jour une neurodivergence
const updateNeurodivergence = (req, res) => {
  const id = req.params.id;
  const { type } = req.body;
  const query = 'UPDATE neurodivergences SET type = ? WHERE id = ?';
  
  db.query(query, [type, id], (err, results) => {
    if (err) return handleServerError(res, err); // Utilisation de la fonction de gestion des erreurs
    res.json({ message: 'Neurodivergence updated successfully' });
  });
};

// Supprimer une neurodivergence
const deleteNeurodivergence = (req, res) => {
  const id = req.params.id;
  const query = 'DELETE FROM neurodivergences WHERE id = ?';
  
  db.query(query, [id], (err, results) => {
    if (err) return handleServerError(res, err); // Utilisation de la fonction de gestion des erreurs
    res.json({ message: 'Neurodivergence deleted successfully' });
  });
};

module.exports = {
  getAllNeurodivergences,
  createNeurodivergence,
  updateNeurodivergence,
  deleteNeurodivergence
};