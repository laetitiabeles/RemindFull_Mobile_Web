// controllers/contactsController.js

const db = require('../db');

// Récupérer tous les contacts avec leurs neurodivergences
const getAllContacts = (req, res) => {
  const query = `
    SELECT c._id, c.first_name, c.last_name, c.email, c.phone_number, c.birthday, c.last_contact, n.type AS neurodivergence 
    FROM contact c
    LEFT JOIN contact_neurodivergence cn ON c._id = cn.contact_id
    LEFT JOIN neurodivergence n ON cn.neurodivergence_id = n.id
  `;
  db.query(query, (err, results) => {
    if (err) {
      return handleServerError(res, err);
    }
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
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    res.json(results[0]);
  });
};

// Créer un nouveau contact
const createContact = (req, res) => {
  const { first_name, last_name, email, phone_number, birthday, last_contact, neurodivergences, profile_id } = req.body;

  const insertContactQuery = `
    INSERT INTO contact (first_name, last_name, email, phone_number, birthday, last_contact, profile_id)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(insertContactQuery, [first_name, last_name, email, phone_number, birthday, last_contact, profile_id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to create contact' });
    }

    const contactId = result.insertId;

    if (neurodivergences && neurodivergences.length > 0) {
      const insertContactNeurodivergencesQuery = `
        INSERT INTO contact_neurodivergence (contact_id, neurodivergence_id)
        VALUES ?
      `;

      const values = neurodivergences.map(neurodivergenceId => [contactId, neurodivergenceId]);

      db.query(insertContactNeurodivergencesQuery, [values], (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Failed to associate neurodivergences' });
        }
        res.status(201).json({ message: 'Contact created successfully' });
      });
    } else {
      res.status(201).json({ message: 'Contact created successfully' });
    }
  });
};

// Mettre à jour un contact par ID
const updateContact = (req, res) => {
  const contactId = req.params.contactId;
  const { first_name, last_name, email, phone_number, birthday, last_contact, neurodivergences, profile_id } = req.body;

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

  db.query(updateContactQuery, [first_name, last_name, email, phone_number, birthday, last_contact, profile_id, contactId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to update contact' });
    }

    // Met à jour la ou les neurodivergence.s associées au contact
    const deletePreviousNeurodivergencesQuery = `
      DELETE FROM contact_neurodivergence
      WHERE contact_id = ?
    `;

    db.query(deletePreviousNeurodivergencesQuery, [contactId], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to update contact neurodivergences' });
      }

      if (neurodivergences && neurodivergences.length > 0) {
        const insertContactNeurodivergencesQuery = `
          INSERT INTO contact_neurodivergence (contact_id, neurodivergence_id)
          VALUES ?
        `;
        const values = neurodivergences.map(neurodivergenceId => [contactId, neurodivergenceId]);

        db.query(insertContactNeurodivergencesQuery, [values], (err, result) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to update contact neurodivergences' });
          }
          res.json({ message: 'Contact updated successfully' });
        });
      } else {
        res.json({ message: 'Contact updated successfully' });
      }
    });
  });
};

// Supprimer un contact par ID
const deleteContact = (req, res) => {
  const contactId = req.params.contactId;

  const deleteContactQuery = `
    DELETE FROM contact
    WHERE _id = ?
  `;

  db.query(deleteContactQuery, [contactId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to delete contact' });
    }

    // Supprime la ou les neurodivergence.s associée.s au contact
    const deleteContactNeurodivergencesQuery = `
      DELETE FROM contact_neurodivergence
      WHERE contact_id = ?
    `;

    db.query(deleteContactNeurodivergencesQuery, [contactId], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to delete contact neurodivergences' });
      }
      res.json({ message: 'Contact deleted successfully' });
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
