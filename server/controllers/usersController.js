const db = require('../db');

// Récupérer tous les utilisateurs avec leurs profils et neurodivergences
const getAllUsers = (req, res) => {
  const query = `
    SELECT u._id, u.username, u.email, u.created_at, u.updated_at,
           p.birthday,
           GROUP_CONCAT(n.name SEPARATOR ', ') AS neurodivergence
    FROM user u
    LEFT JOIN profile p ON u._id = p.user_id
    LEFT JOIN profile_neurodivergence pn ON p.user_id = pn.profile_id
    LEFT JOIN neurodivergence n ON pn.neurodivergence_id = n.id
    GROUP BY u._id, p.birthday
  `;
  
  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.json(results);
  });
};

// Récupérer un utilisateur par ID avec son profil et ses neurodivergences
const getUserById = (req, res) => {
  const userId = req.params.userId;

  const query = `
    SELECT u._id, u.username, u.email, u.created_at, u.updated_at,
           p.birthday,
           GROUP_CONCAT(n.name SEPARATOR ', ') AS neurodivergence
    FROM user u
    LEFT JOIN profile p ON u._id = p.user_id
    LEFT JOIN profile_neurodivergence pn ON p.user_id = pn.profile_id
    LEFT JOIN neurodivergence n ON pn.neurodivergence_id = n.id
    WHERE u._id = ?
    GROUP BY u._id, p.birthday
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
};

// Créer un nouvel utilisateur avec son profil et ses neurodivergences
const createUser = (req, res) => {
  const { username, email, password, birthday, neurodivergences } = req.body;

  const insertUserQuery = `
    INSERT INTO user (username, email, password)
    VALUES (?, ?, ?)
  `;

  db.query(insertUserQuery, [username, email, password], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to create user' });
    }

    const userId = result.insertId;

    const insertProfileQuery = `
      INSERT INTO profile (user_id, birthday)
      VALUES (?, ?)
    `;

    db.query(insertProfileQuery, [userId, birthday], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to create profile' });
      }

      if (neurodivergences && neurodivergences.length > 0) {
        const insertProfileNeurodivergencesQuery = `
          INSERT INTO profile_neurodivergence (profile_id, neurodivergence_id)
          VALUES ?
        `;

        const values = neurodivergences.map(neurodivergenceId => [userId, neurodivergenceId]);

        db.query(insertProfileNeurodivergencesQuery, [values], (err, result) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to associate neurodivergences' });
          }
          res.status(201).json({ message: 'User and profile created successfully' });
        });
      } else {
        res.status(201).json({ message: 'User and profile created successfully' });
      }
    });
  });
};

// Mettre à jour un utilisateur par ID avec son profil et ses neurodivergences
const updateUser = (req, res) => {
  const userId = req.params.userId;
  const { username, email, birthday, neurodivergences } = req.body;

  const updateUserQuery = `
    UPDATE user
    SET username = ?,
        email = ?
    WHERE _id = ?
  `;

  db.query(updateUserQuery, [username, email, userId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to update user' });
    }

    // Mettre à jour le profil de l'utilisateur
    const updateProfileQuery = `
      UPDATE profile
      SET birthday = ?
      WHERE user_id = ?
    `;

    db.query(updateProfileQuery, [birthday, userId], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to update profile' });
      }

      // Supprimer les neurodivergences précédentes
      const deletePreviousNeurodivergencesQuery = `
        DELETE FROM profile_neurodivergence
        WHERE profile_id = ?
      `;

      db.query(deletePreviousNeurodivergencesQuery, [userId], (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Failed to update profile neurodivergences' });
        }

        if (neurodivergences && neurodivergences.length > 0) {
          const insertProfileNeurodivergencesQuery = `
            INSERT INTO profile_neurodivergence (profile_id, neurodivergence_id)
            VALUES ?
          `;
          const values = neurodivergences.map(neurodivergenceId => [userId, neurodivergenceId]);

          db.query(insertProfileNeurodivergencesQuery, [values], (err, result) => {
            if (err) {
              console.error(err);
              return res.status(500).json({ error: 'Failed to update profile neurodivergences' });
            }
            res.json({ message: 'User and profile updated successfully' });
          });
        } else {
          res.json({ message: 'User and profile updated successfully' });
        }
      });
    });
  });
};

// Supprimer un utilisateur par ID avec son profil et ses neurodivergences
const deleteUser = (req, res) => {
  const userId = req.params.userId;

  const deleteUserQuery = `
    DELETE FROM user
    WHERE _id = ?
  `;

  db.query(deleteUserQuery, [userId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to delete user' });
    }

    // Supprimer le profil de l'utilisateur
    const deleteProfileQuery = `
      DELETE FROM profile
      WHERE user_id = ?
    `;

    db.query(deleteProfileQuery, [userId], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to delete profile' });
      }

      // Supprimer les neurodivergences associées au profil
      const deleteProfileNeurodivergencesQuery = `
        DELETE FROM profile_neurodivergence
        WHERE profile_id = ?
      `;

      db.query(deleteProfileNeurodivergencesQuery, [userId], (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Failed to delete profile neurodivergences' });
        }
        res.json({ message: 'User and profile deleted successfully' });
      });
    });
  });
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};
