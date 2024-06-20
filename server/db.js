const mysql = require('mysql2');

// Configure la connexion à la db
const dbConfig = {
  host: '127.0.0.1',
  user: 'root',
  password: 'holberton',
  database: 'RemindFull'
};

const db = mysql.createConnection(dbConfig);

// Connecte la db
db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the MySQL database.');
});

module.exports = db;
