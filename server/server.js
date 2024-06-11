const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();

// Utilise le middleware json d'Express pour parser le JSON
app.use(express.json());

app.use(cors({
  origin: 'http://localhost:3001'
}));

// Configure la connexion à la base de données
const db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'holberton',
  database: 'RemindFull'
});

// Connexion à la base de données
db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the MySQL database.');
});

// Route pour récupérer les neurodivergences
app.get('/api/neurodivergences', (req, res) => {
  db.query('SELECT id, type FROM neurodivergence', (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// Route pour créer un nouveau contact
app.post('/api/contacts', (req, res) => {
  const { contact, neurodivergence_id } = req.body;
  const { first_name, last_name, email, phone_number, birthday } = contact;

  // Vérifie que les champs obligatoires sont présents
  if (!first_name || !last_name) {
    return res.status(400).json({ error: 'First name and last name are required.' });
  }

  // Insérer le contact
  db.query(
    'INSERT INTO contact (first_name, last_name, email, phone_number, birthday) VALUES (?, ?, ?, ?, ?)',
    [first_name, last_name, email, phone_number, birthday],
    (err, result) => {
      if (err) {
        console.error('Error inserting contact:', err);
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(400).json({ error: 'Email already exists' });
        }
        return res.status(500).json({ error: 'Error inserting contact: ' + err.message });
      }

      const contact_id = result.insertId;

      // Associer le contact à la neurodivergence
      db.query(
        'INSERT INTO contact_neurodivergence (contact_id, neurodivergence_id) VALUES (?, ?)',
        [contact_id, neurodivergence_id],
        (err) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }

          res.status(201).json({ message: 'Contact created successfully', contact_id });
        }
      );
    }
  );
});

// Route pour récupérer les contacts avec leurs neurodivergences
app.get('/api/contacts', (req, res) => {
  const query = `
    SELECT c._id, c.first_name, c.last_name, c.email, c.phone_number, c.birthday, c.last_contact, n.type AS neurodivergence 
    FROM contact c
    LEFT JOIN contact_neurodivergence cn ON c._id = cn.contact_id
    LEFT JOIN neurodivergence n ON cn.neurodivergence_id = n.id
  `;
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// Démarrer le serveur
app.listen(3000, () => {
  console.log('Server running on port 3000');
});
