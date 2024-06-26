const db = require('../db');
const handleServerError = (res, err) => {
  console.error('Database error: ', err);
  res.status(500).json({ error: 'Internal server error' });
};

// Récupérer tous les contacts avec leurs neurodivergences
const getAllContacts = (req, res) => {
  const query = `
    SELECT c._id, c.first_name, c.last_name, c.email, c.phone_number, c.birthday, c.last_contact, n.type AS neurodivergence 
    FROM contact c
    LEFT JOIN contact_neurodivergence cn ON c._id = cn.contact_id
    LEFT JOIN neurodivergence n ON cn.neurodivergence_id = n.id
    ORDER BY c.first_name ASC, c.last_name ASC
  `;
  db.query(query, (err, results) => {
    if (err) return handleServerError(res, err); //++ simplification de la gestion des erreurs
    res.json(results);
  });
  console.log('GET /api/contacts');
};

// Récupérer un contact par ID
const getContactById = (req, res) => {
  const contactId = req.params.contactId;
  const query = `
    SELECT c._id, c.first_name, c.last_name, c.email, c.phone_number, c.birthday, c.last_contact, n.type AS neurodivergence 
    FROM contact c
    LEFT JOIN contact_neurodivergence cn ON c._id = cn.contact_id
    LEFT JOIN neurodivergence n ON cn.neurodivergence_id = n.id
    WHERE c._id = ?
  `;
  db.query(query, [contactId], (err, results) => {
    if (err) return handleServerError(res, err); //++ Appel de la fonction de gestion des erreurs uniforme
    if (results.length === 0) return res.status(404).json({ error: 'Contact not found' });
    res.json(results[0]);
  });
};

// Créer un nouveau contact avec gifts et gift ideas
const createContact = (req, res) => {
  const { first_name, last_name, email, phone_number, birthday, last_contact, neurodivergences, profile_id } = req.body.contact;
  const { gifts, gift_ideas } = req.body;
  console.log("Received body data:", req.body);
  
  db.beginTransaction(err => {
    if (err) return handleServerError(res, err);

    const insertContactQuery = `
      INSERT INTO contact (first_name, last_name, email, phone_number, birthday, last_contact, profile_id)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(insertContactQuery, [first_name, last_name, email, phone_number, birthday, last_contact, profile_id], (err, result) => {
      if (err) {
        return db.rollback(() => handleServerError(res, err)); // rollback en cas d'erreur
      }

      const contactId = result.insertId;
      console.log("Inserted contact ID:", contactId); // Log inserted contact ID

      // Insérer les neurodivergences
      if (neurodivergences && neurodivergences.length > 0) {
        const values = neurodivergences.map(neurodivergenceId => [contactId, neurodivergenceId]);
        console.log("Neurodivergences values to insert:", values); // Log neurodivergences values

        const insertContactNeurodivergencesQuery = `
          INSERT INTO contact_neurodivergence (contact_id, neurodivergence_id)
          VALUES ?
        `;

        db.query(insertContactNeurodivergencesQuery, [values], (err) => { 
          if (err) {
            return db.rollback(() => handleServerError(res, err)); // rollback en cas d'erreur
          }
        });
      }

      // Insérer les gifts
      if (gifts && gifts.length > 0) {
        const giftValues = gifts.map(gift => [contactId, gift.gift_title, gift.gift_description, gift.gift_date, profile_id]);
        console.log("Gifts values to insert:", giftValues); // Log gifts values

        const insertGiftsQuery = `
          INSERT INTO gifts (contact_id, gift_title, gift_description, gift_date, profile_id)
          VALUES ?
        `;

        db.query(insertGiftsQuery, [giftValues], (err) => { 
          if (err) {
            return db.rollback(() => handleServerError(res, err)); // rollback en cas d'erreur
          }
        });
      }

      // Insérer les gift ideas
      if (gift_ideas && gift_ideas.length > 0) {
        const giftIdeaValues = gift_ideas.map(idea => [contactId, idea.gift_title, idea.idea_description, idea.idea_date, profile_id]);
        console.log("Gift ideas values to insert:", giftIdeaValues); // Log gift ideas values

        const insertGiftIdeasQuery = `
          INSERT INTO gift_ideas (contact_id, gift_title, idea_description, idea_date, profile_id)
          VALUES ?
        `;

        db.query(insertGiftIdeasQuery, [giftIdeaValues], (err) => { 
          if (err) {
            return db.rollback(() => handleServerError(res, err)); // rollback en cas d'erreur
          }
        });
      }

      // Commit transaction
      db.commit(err => {
        if (err) return db.rollback(() => handleServerError(res, err)); // rollback en cas d'erreur lors de la finalisation
        res.status(201).json({ message: 'Contact, gifts, and gift ideas created successfully' });
      });
    });
  });
};


// Mettre à jour un contact par ID
const updateContact = (req, res) => {
  const contactId = req.params.contactId;
  const { first_name, last_name, email, phone_number, birthday, last_contact, neurodivergences, profile_id } = req.body;

  db.beginTransaction(err => {
    if (err) return handleServerError(res, err);

    const updateContactQuery = `
      UPDATE contact
      SET first_name = ?,
          last_name = ?,
          email = ?,
          phone_number = ?,
          birthday = ?,
          last_contact = ?,
          profile_id = ?
      WHERE _id = ?
    `;

    db.query(updateContactQuery, [first_name, last_name, email, phone_number, birthday, last_contact, profile_id, contactId], (err) => {
      if (err) {
        return db.rollback(() => handleServerError(res, err));
      }

      const deletePreviousNeurodivergencesQuery = `
        DELETE FROM contact_neurodivergence
        WHERE contact_id = ?
      `;

      db.query(deletePreviousNeurodivergencesQuery, [contactId], (err) => {
        if (err) {
          return db.rollback(() => handleServerError(res, err));
        }

        if (neurodivergences && neurodivergences.length > 0) {
          const values = neurodivergences.map(neurodivergenceId => [contactId, neurodivergenceId]);
          const insertContactNeurodivergencesQuery = `
            INSERT INTO contact_neurodivergence (contact_id, neurodivergence_id)
            VALUES ?
          `;

          db.query(insertContactNeurodivergencesQuery, [values], (err) => {
            if (err) {
              return db.rollback(() => handleServerError(res, err));
            }
            db.commit(err => {
              if (err) return db.rollback(() => handleServerError(res, err));
              res.json({ message: 'Contact updated successfully' });
            });
          });
        } else {
          db.commit(err => {
            if (err) return db.rollback(() => handleServerError(res, err));
            res.json({ message: 'Contact updated successfully' });
          });
        }
      });
    });
  });
};

// Supprimer un contact par ID
const deleteContact = (req, res) => {
  const contactId = req.params.contactId;

  db.beginTransaction(err => {
    if (err) return handleServerError(res, err);
  
    const deleteContactQuery = `
      DELETE FROM contact
      WHERE _id = ?
    `;

    db.query(deleteContactQuery, [contactId], (err) => {
      if (err) {
        return db.rollback(() => handleServerError(res, err));
      }

      const deleteContactNeurodivergencesQuery = `
        DELETE FROM contact_neurodivergence
        WHERE contact_id = ?
      `;

      db.query(deleteContactNeurodivergencesQuery, [contactId], (err) => {
        if (err) {
          return db.rollback(() => handleServerError(res, err));
        }
        db.commit(err => {
          if (err) return db.rollback(() => handleServerError(res, err));
          res.json({ message: 'Contact deleted successfully' });
        });
      });
    });
  });
};

module.exports = {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact
};
