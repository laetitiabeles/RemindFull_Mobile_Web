const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();

// Middleware to parse JSON and handle CORS
app.use(express.json());
app.use(cors());

// Configure the database connection
const dbConfig = {
  host: '127.0.0.1',
  user: 'root',
  password: 'holberton',
  database: 'RemindFull'
};

const db = mysql.createConnection(dbConfig);

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the MySQL database.');
});

// Helper function to send a server error response
const handleServerError = (res, err) => {
  console.error(err);
  res.status(500).json({ error: err.message });
};

// Route to get all neurodivergences
app.get('/api/neurodivergences', (req, res) => {
  const query = 'SELECT id, type FROM neurodivergence';
  db.query(query, (err, results) => {
    if (err) {
      return handleServerError(res, err);
    }
    res.json(results);
  });
});

// USERS

// Route pour créer un nouvel utilisateur
app.post('/api/users', (req, res) => {
  const { username, email, password, birthday, neurodivergences } = req.body;

  // Insérer l'utilisateur dans la table `user`
  const insertUserQuery = `
    INSERT INTO user (username, email, password, birthday)
    VALUES (?, ?, ?, ?)
  `;
  db.query(insertUserQuery, [username, email, password, birthday], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to create user' });
    }

    const userId = result.insertId;

    // Insérer les neurodivergences dans la table `user_neurodivergence`
    if (neurodivergences && neurodivergences.length > 0) {
      const insertUserNeurodivergencesQuery = `
        INSERT INTO user_neurodivergence (user_id, neurodivergence_id)
        VALUES ?
      `;

      const values = neurodivergences.map(neurodivergenceId => [userId, neurodivergenceId]);

      db.query(insertUserNeurodivergencesQuery, [values], (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Failed to associate neurodivergences' });
        }
        res.status(201).json({ message: 'User created successfully' });
      });
    } else {
      res.status(201).json({ message: 'User created successfully' });
    }
  });
});

// Route pour récupérer tous les utilisateurs avec leurs neurodivergences
app.get('/api/users', (req, res) => {
  const query = `
    SELECT u._id, u.username, u.email, u.birthday, u.created_at, u.updated_at,
           GROUP_CONCAT(n.name SEPARATOR ', ') AS neurodivergences
    FROM user u
    LEFT JOIN user_neurodivergence un ON u._id = un.user_id
    LEFT JOIN neurodivergence n ON un.neurodivergence_id = n.id
    GROUP BY u._id
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.json(results);
  });
});

// Route pour récupérer un utilisateur par ID avec ses neurodivergences
app.get('/api/users/:userId', (req, res) => {
  const userId = req.params.userId;

  const query = `
    SELECT u._id, u.username, u.email, u.birthday, u.created_at, u.updated_at,
           GROUP_CONCAT(n.name SEPARATOR ', ') AS neurodivergences
    FROM user u
    LEFT JOIN user_neurodivergence un ON u._id = un.user_id
    LEFT JOIN neurodivergence n ON un.neurodivergence_id = n.id
    WHERE u._id = ?
    GROUP BY u._id
  `;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(results[0]);
  });
});

// Route pour modifier un utilisateur par ID
app.put('/api/users/:userId', (req, res) => {
  const userId = req.params.userId;
  const { username, email, birthday, neurodivergences } = req.body;

  // Mettre à jour l'utilisateur dans la table `user`
  const updateUserQuery = `
    UPDATE user
    SET username = ?,
        email = ?,
        birthday = ?
    WHERE _id = ?
  `;
  db.query(updateUserQuery, [username, email, birthday, userId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to update user' });
    }

    // Supprimer toutes les associations actuelles dans la table `user_neurodivergence`
    const deletePreviousNeurodivergencesQuery = `
      DELETE FROM user_neurodivergence
      WHERE user_id = ?
    `;
    db.query(deletePreviousNeurodivergencesQuery, [userId], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to update user neurodivergences' });
      }

      // Insérer les nouvelles associations de neurodivergences
      if (neurodivergences && neurodivergences.length > 0) {
        const insertUserNeurodivergencesQuery = `
          INSERT INTO user_neurodivergence (user_id, neurodivergence_id)
          VALUES ?
        `;
        const values = neurodivergences.map(neurodivergenceId => [userId, neurodivergenceId]);

        db.query(insertUserNeurodivergencesQuery, [values], (err, result) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to update user neurodivergences' });
          }
          res.json({ message: 'User updated successfully' });
        });
      } else {
        res.json({ message: 'User updated successfully' });
      }
    });
  });
});

// Route pour supprimer un utilisateur par ID
app.delete('/api/users/:userId', (req, res) => {
  const userId = req.params.userId;

  // Supprimer l'utilisateur dans la table `user`
  const deleteUserQuery = `
    DELETE FROM user
    WHERE _id = ?
  `;
  db.query(deleteUserQuery, [userId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to delete user' });
    }

    // Supprimer les associations dans la table `user_neurodivergence`
    const deleteUserNeurodivergencesQuery = `
      DELETE FROM user_neurodivergence
      WHERE user_id = ?
    `;
    db.query(deleteUserNeurodivergencesQuery, [userId], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to delete user neurodivergences' });
      }
      res.json({ message: 'User deleted successfully' });
    });
  });
});

// CONTACTS

// Route to create a new contact
app.post('/api/contacts', (req, res) => {
  const { contact, neurodivergence_id } = req.body;
  const { first_name, last_name, email, phone_number, birthday } = contact;

  // Nettoyer l'email
  const cleanedEmail = email.trim();

  // Check for required fields
  if (!first_name || !last_name) {
    return res.status(400).json({ error: 'First name and last name are required.' });
  }

  // Insert the new contact
  const insertContactQuery = `
    INSERT INTO contact (first_name, last_name, email, phone_number, birthday)
    VALUES (?, ?, ?, ?, ?)`;

  db.query(
    insertContactQuery,
    [first_name, last_name, cleanedEmail, phone_number, birthday],
    (err, result) => {
      if (err) {
        console.log(err);
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(400).json({ error: 'Email already exists' });
        }
        return handleServerError(res, err);
      }

      const contact_id = result.insertId;  // Now properly scoped within the callback

      // Associate the contact with a neurodivergence
      const associateNeurodivergenceQuery = `
        INSERT INTO contact_neurodivergence (contact_id, neurodivergence_id)
        VALUES (?, ?)
      `;

      db.query(
        associateNeurodivergenceQuery,
        [contact_id, neurodivergence_id],
        (err) => {
          if (err) {
            return handleServerError(res, err);
          }
        res.status(201).json({ message: 'Contact created successfully', contact_id });
        }
      );
    }
  );
});

// Route to delete a contact
app.delete('/api/contacts/:_id', (req, res) => {
  const { _id } = req.params;  // Get the ID of the contact to delete from the route parameter

  // Check if the contact _id is provided and is a valid number
  if (!_id || isNaN(parseInt(_id))) {
    return res.status(400).json({ error: 'Invalid contact _ID provided.' });
  }

  const deleteContactQuery = 'DELETE FROM contact WHERE _id = ?';

  db.query(deleteContactQuery, [_id], (err, result) => {
    if (err) {
      console.error('Error deleting the contact:', err);
      return handleServerError(res, err);
    }
    if (result.affectedRows === 0) {
      // No rows affected means no contact was found with the provided _ID
      return res.status(404).json({ message: 'No contact found with the provided _ID.' });
    }
    // Confirm deletion
    res.status(200).json({ message: 'Contact successfully deleted.' });
  });
});

// Route to update a contact
app.put('/api/contacts/:_id', (req, res) => {
  const { _id } = req.params;
  const { first_name, last_name, email, phone_number, birthday, neurodivergence_id } = req.body;

  if (!_id || isNaN(parseInt(_id))) {
    return res.status(400).json({ error: 'Invalid contact ID provided.' });
  }

  const updateContactQuery = `
    UPDATE contact
    SET first_name = ?, last_name = ?, email = ?, phone_number = ?, birthday = ?, neurodivergence_id = ?
    WHERE _id = ?`;

  db.query(
    updateContactQuery,
    [first_name, last_name, email, phone_number, birthday, neurodivergence_id, _id],
    (err, result) => {
      if (err) {
        console.error('Error updating the contact:', err);
        return handleServerError(res, err);
      }
      if (result.affectedRows === 0) {
        // No rows affected means no contact was found with the provided ID
        return res.status(404).json({ message: 'No contact found with the provided ID.' });
      }
      // Confirm update
      res.status(200).json({ message: 'Contact successfully updated', _id });
    }
  );
});

// Route to get all contacts with their neurodivergences
app.get('/api/contacts', (req, res) => {
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
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
