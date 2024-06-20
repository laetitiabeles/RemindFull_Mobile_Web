const db = require('../db');

// Récupérer tous les cadeaux
const getAllGifts = (req, res) => {
  const query = `
    SELECT g.gift_id, g.contact_id, g.gift_description, g.gift_date, g.profile_id, p.user_id
    FROM gifts g
    LEFT JOIN profile p ON g.profile_id = p.profile_id
  `;
  
  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.json(results);
  });
};

// Récupérer un cadeau par ID
const getGiftById = (req, res) => {
  const giftId = req.params.giftId;

  const query = `
    SELECT g.gift_id, g.contact_id, g.gift_description, g.gift_date, g.profile_id, p.user_id
    FROM gifts g
    LEFT JOIN profile p ON g.profile_id = p.profile_id
    WHERE g.gift_id = ?
  `;

  db.query(query, [giftId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Gift not found' });
    }
    res.json(results[0]);
  });
};

// Créer un nouveau cadeau
const createGift = (req, res) => {
  const { contact_id, gift_description, gift_date, profile_id } = req.body;

  const query = `
    INSERT INTO gifts (contact_id, gift_description, gift_date, profile_id)
    VALUES (?, ?, ?, ?)
  `;

  db.query(query, [contact_id, gift_description, gift_date, profile_id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to create gift' });
    }
    res.status(201).json({ message: 'Gift created successfully' });
  });
};

// Mettre à jour un cadeau par ID
const updateGift = (req, res) => {
  const giftId = req.params.giftId;
  const { contact_id, gift_description, gift_date, profile_id } = req.body;

  const query = `
    UPDATE gifts
    SET contact_id = ?, gift_description = ?, gift_date = ?, profile_id = ?
    WHERE gift_id = ?
  `;

  db.query(query, [contact_id, gift_description, gift_date, profile_id, giftId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to update gift' });
    }
    res.json({ message: 'Gift updated successfully' });
  });
};

// Supprimer un cadeau par ID
const deleteGift = (req, res) => {
  const giftId = req.params.giftId;

  const query = `
    DELETE FROM gifts
    WHERE gift_id = ?
  `;

  db.query(query, [giftId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to delete gift' });
    }
    res.json({ message: 'Gift deleted successfully' });
  });
};

module.exports = {
  getAllGifts,
  getGiftById,
  createGift,
  updateGift,
  deleteGift,
};
