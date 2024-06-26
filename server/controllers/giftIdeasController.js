const db = require('../db');

// Fonction de gestion des erreurs serveur uniforme
const handleServerError = (res, err) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
};

// Récupérer toutes les idées cadeaux
const getAllGiftIdeas = (req, res) => {
  const query = `
    SELECT gi.idea_id, gi.contact_id, gi.gift_title, gi.idea_description, gi.idea_date, gi.profile_id, p.user_id
    FROM gift_ideas gi
    LEFT JOIN profile p ON gi.profile_id = p.profile_id
  `;

  db.query(query, (err, results) => {
    if (err) return handleServerError(res, err); // Utilisation de la fonction de gestion des erreurs
    res.json(results);
  });
};

// Récupérer une idée par ID
const getGiftIdeaById = (req, res) => {
  const ideaId = req.params.ideaId;

  const query = `
    SELECT gi.idea_id, gi.contact_id, gi.gift_title, gi.idea_description, gi.idea_date, gi.profile_id, p.user_id
    FROM gift_ideas gi
    LEFT JOIN profile p ON gi.profile_id = p.profile_id
    WHERE gi.idea_id = ?
  `;

  db.query(query, [ideaId], (err, results) => {
    if (err) return handleServerError(res, err); // Utilisation de la fonction de gestion des erreurs
    if (results.length === 0) {
      return res.status(404).json({ error: 'Gift idea not found' });
    }
    res.json(results[0]);
  });
};

// Récupérer les idées cadeaux par contact ID
const getGiftIdeasByContactId = (req, res) => {
  const contactId = req.params.contactId;
  console.log(`Executing getGiftIdeasByContactId query for contact ID: ${contactId}`);

  const query = `
    SELECT gi.idea_id, gi.contact_id, gi.gift_title, gi.idea_description, gi.idea_date
    FROM gift_ideas gi
    WHERE gi.contact_id = ?
  `;

  db.query(query, [contactId], (err, results) => {
    if (err) return handleServerError(res, err);
    if (results.length === 0) {
      console.log(`No gift ideas found for contact ID: ${contactId}`);
      return res.status(404).json({ error: 'No gift ideas found' });
    }
    console.log("getGiftIdeasByContactId query executed successfully, results:", results);
    res.json(results);
  });
};

// Créer une nouvelle idée cadeau
const createGiftIdea = (req, res) => {
  const { contact_id, gift_title, idea_description, idea_date, profile_id } = req.body;

  db.beginTransaction(err => {
    if (err) return handleServerError(res, err); // Utilisation de transactions

    const query = `
      INSERT INTO gift_ideas (contact_id, gift_title, idea_description, idea_date, profile_id)
      VALUES (?, ?, ?, ?, ?)
    `;

    db.query(query, [contact_id, gift_title, idea_description, idea_date, profile_id], (err, result) => {
      if (err) {
        return db.rollback(() => handleServerError(res, err)); // Rollback en cas d'erreur
      }
      db.commit(err => {
        if (err) return db.rollback(() => handleServerError(res, err)); // Rollback en cas d'erreur lors de la finalisation
        res.status(201).json({ message: 'Gift idea created successfully' });
      });
    });
  });
};

// Mettre à jour une idée cadeau par ID
const updateGiftIdea = (req, res) => {
  const ideaId = req.params.ideaId;
  const { contact_id, gift_title, idea_description, idea_date, profile_id } = req.body;

  db.beginTransaction(err => {
    if (err) return handleServerError(res, err); // Utilisation de transactions

    const query = `
      UPDATE gift_ideas
      SET contact_id = ?, gift_title = ?, idea_description = ?, idea_date = ?, profile_id = ?
      WHERE idea_id = ?
    `;

    db.query(query, [contact_id, gift_title, idea_description, idea_date, profile_id, ideaId], (err, result) => {
      if (err) {
        return db.rollback(() => handleServerError(res, err)); // Rollback en cas d'erreur
      }
      db.commit(err => {
        if (err) return db.rollback(() => handleServerError(res, err)); // Rollback en cas d'erreur lors de la finalisation
        res.json({ message: 'Gift idea updated successfully' });
      });
    });
  });
};

// Supprimer une idée cadeau par ID
const deleteGiftIdea = (req, res) => {
  const ideaId = req.params.ideaId;

  db.beginTransaction(err => {
    if (err) return handleServerError(res, err); // Utilisation de transactions

    const query = `
      DELETE FROM gift_ideas
      WHERE idea_id = ?
    `;

    db.query(query, [ideaId], (err, result) => {
      if (err) {
        return db.rollback(() => handleServerError(res, err)); // Rollback en cas d'erreur
      }
      db.commit(err => {
        if (err) return db.rollback(() => handleServerError(res, err)); // Rollback en cas d'erreur lors de la finalisation
        res.json({ message: 'Gift idea deleted successfully' });
      });
    });
  });
};

module.exports = {
  getAllGiftIdeas,
  getGiftIdeaById,
  getGiftIdeasByContactId,
  createGiftIdea,
  updateGiftIdea,
  deleteGiftIdea,
};
