const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

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
