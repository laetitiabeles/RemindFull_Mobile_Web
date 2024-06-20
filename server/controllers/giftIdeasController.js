const db = require('../db');

// Récupérer toutes les idées cadeaux
const getAllGiftIdeas = (req, res) => {
  const query = `
    SELECT gi.idea_id, gi.contact_id, gi.idea_description, gi.idea_date, gi.profile_id, p.user_id
    FROM gift_ideas gi
    LEFT JOIN profile p ON gi.profile_id = p.profile_id
  `;
  
  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.json(results);
  });
};

// Récupérer une idée par ID
const getGiftIdeaById = (req, res) => {
  const ideaId = req.params.ideaId;

  const query = `
    SELECT gi.idea_id, gi.contact_id, gi.idea_description, gi.idea_date, gi.profile_id, p.user_id
    FROM gift_ideas gi
    LEFT JOIN profile p ON gi.profile_id = p.profile_id
    WHERE gi.idea_id = ?
  `;

  db.query(query, [ideaId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Gift idea not found' });
    }
    res.json(results[0]);
  });
};

// Créer une nouvelle idée cadeau
const createGiftIdea = (req, res) => {
  const { contact_id, idea_description, idea_date, profile_id } = req.body;

  const query = `
    INSERT INTO gift_ideas (contact_id, idea_description, idea_date, profile_id)
    VALUES (?, ?, ?, ?)
  `;

  db.query(query, [contact_id, idea_description, idea_date, profile_id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to create gift idea' });
    }
    res.status(201).json({ message: 'Gift idea created successfully' });
  });
};

// Mettre à jour une idée cadeau par ID
const updateGiftIdea = (req, res) => {
  const ideaId = req.params.ideaId;
  const { contact_id, idea_description, idea_date, profile_id } = req.body;

  const query = `
    UPDATE gift_ideas
    SET contact_id = ?, idea_description = ?, idea_date = ?, profile_id = ?
    WHERE idea_id = ?
  `;

  db.query(query, [contact_id, idea_description, idea_date, profile_id, ideaId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to update gift idea' });
    }
    res.json({ message: 'Gift idea updated successfully' });
  });
};

// Supprimer une idée cadeau par ID
const deleteGiftIdea = (req, res) => {
  const ideaId = req.params.ideaId;

  const query = `
    DELETE FROM gift_ideas
    WHERE idea_id = ?
  `;

  db.query(query, [ideaId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to delete gift idea' });
    }
    res.json({ message: 'Gift idea deleted successfully' });
  });
};

module.exports = {
  getAllGiftIdeas,
  getGiftIdeaById,
  createGiftIdea,
  updateGiftIdea,
  deleteGiftIdea,
};
