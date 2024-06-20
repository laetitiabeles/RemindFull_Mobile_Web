const db = require('../db');

// Récupérer le profil d'un utilisateur par ID utilisateur
const getProfileByUserId = (req, res) => {
  const userId = req.params.userId;

  const query = `
    SELECT p.*, GROUP_CONCAT(n.name SEPARATOR ', ') AS neurodivergence
    FROM profile p
    LEFT JOIN profile_neurodivergence pn ON p.id = pn.profile_id
    LEFT JOIN neurodivergence n ON pn.neurodivergence_id = n.id
    WHERE p.user_id = ?
    GROUP BY p.id
  `;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    res.json(results[0]);
  });
};

// Créer un profil pour un utilisateur
const createProfile = (req, res) => {
  const userId = req.params.userId;
  const { birthday, neurodivergences } = req.body;

  const insertProfileQuery = `
    INSERT INTO profile (user_id, birthday)
    VALUES (?, ?)
  `;

  db.query(insertProfileQuery, [userId, birthday], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to create profile' });
    }

    const profileId = result.insertId;

    if (neurodivergences && neurodivergences.length > 0) {
      const insertProfileNeurodivergencesQuery = `
        INSERT INTO profile_neurodivergence (profile_id, neurodivergence_id)
        VALUES ?
      `;

      const values = neurodivergences.map(ndId => [profileId, ndId]);

      db.query(insertProfileNeurodivergencesQuery, [values], (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Failed to associate neurodivergences' });
        }
        res.status(201).json({ message: 'Profile created successfully' });
      });
    } else {
      res.status(201).json({ message: 'Profile created successfully' });
    }
  });
};

// Mettre à jour le profil d'un utilisateur
const updateProfile = (req, res) => {
  const userId = req.params.userId;
  const { birthday, neurodivergences } = req.body;

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

    const getProfileIdQuery = `
      SELECT id FROM profile
      WHERE user_id = ?
    `;

    db.query(getProfileIdQuery, [userId], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to retrieve profile ID' });
      }

      const profileId = result[0].id;

      const deletePreviousNeurodivergencesQuery = `
        DELETE FROM profile_neurodivergence
        WHERE profile_id = ?
      `;

      db.query(deletePreviousNeurodivergencesQuery, [profileId], (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Failed to update profile neurodivergences' });
        }

        if (neurodivergences && neurodivergences.length > 0) {
          const insertProfileNeurodivergencesQuery = `
            INSERT INTO profile_neurodivergence (profile_id, neurodivergence_id)
            VALUES ?
          `;
          const values = neurodivergences.map(ndId => [profileId, ndId]);

          db.query(insertProfileNeurodivergencesQuery, [values], (err, result) => {
            if (err) {
              console.error(err);
              return res.status(500).json({ error: 'Failed to update profile neurodivergences' });
            }
            res.json({ message: 'Profile updated successfully' });
          });
        } else {
          res.json({ message: 'Profile updated successfully' });
        }
      });
    });
  });
};

// Supprimer le profil d'un utilisateur
const deleteProfile = (req, res) => {
  const userId = req.params.userId;

  const deleteProfileQuery = `
    DELETE FROM profile
    WHERE user_id = ?
  `;

  db.query(deleteProfileQuery, [userId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to delete profile' });
    }

    const deleteProfileNeurodivergencesQuery = `
      DELETE FROM profile_neurodivergence
      WHERE profile_id = (SELECT id FROM profiles WHERE user_id = ?)
    `;

    db.query(deleteProfileNeurodivergencesQuery, [userId], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to delete profile neurodivergences' });
      }
      res.json({ message: 'Profile deleted successfully' });
    });
  });
};

module.exports = {
  getProfileByUserId,
  createProfile,
  updateProfile,
  deleteProfile
};
