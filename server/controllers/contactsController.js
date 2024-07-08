const db = require('../db');

const handleServerError = (res, err) => {
  console.error('Database error:', err);
  res.status(500).json({ error: 'Internal server error' });
};

const getAllContacts = (req, res) => {
  const query = `
    SELECT c._id, c.first_name, c.last_name, c.email, c.phone_number, c.birthday, c.last_contact, GROUP_CONCAT(n.type) AS neurodivergences
    FROM contact c
    LEFT JOIN contact_neurodivergence cn ON c._id = cn.contact_id
    LEFT JOIN neurodivergence n ON cn.neurodivergence_id = n.id
    GROUP BY c._id
    ORDER BY c.first_name ASC, c.last_name ASC
  `;
  db.query(query, (err, results) => {
    if (err) {
      return handleServerError(res, err);
    }
    res.json(results);
  });
};

const getContactById = (req, res) => {
  const contactId = req.params.contactId;
  const query = `
    SELECT c._id, c.first_name, c.last_name, c.email, c.phone_number, c.birthday, c.last_contact, GROUP_CONCAT(n.type) AS neurodivergences
    FROM contact c
    LEFT JOIN contact_neurodivergence cn ON c._id = cn.contact_id
    LEFT JOIN neurodivergence n ON cn.neurodivergence_id = n.id
    WHERE c._id = ?
    GROUP BY c._id
  `;
  db.query(query, [contactId], (err, results) => {
    if (err) {
      return handleServerError(res, err);
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    res.json(results[0]);
  });
};

// Créer un nouveau contact
const createContact = (req, res) => {
  const { first_name, last_name, email, phone_number, birthday, last_contact, neurodivergences, gifts, gift_ideas } = req.body.contact;
  
  db.beginTransaction(err => {
    if (err) {
      return handleServerError(res, err);
    }

    const insertContactQuery = 'INSERT INTO contact SET ?';
    const contactData = { first_name, last_name, email, phone_number, birthday, last_contact };
    
    db.query(insertContactQuery, contactData, (err, result) => {
      if (err) {
        return db.rollback(() => handleServerError(res, err));
      }

      const contactId = result.insertId;

      const insertNeurodivergences = (callback) => {
        if (neurodivergences && neurodivergences.length > 0) {
          const values = neurodivergences.map(nd => [contactId, nd]);

          const insertQuery = `
            INSERT INTO contact_neurodivergence (contact_id, neurodivergence_id)
            VALUES ?
          `;
          db.query(insertQuery, [values], (err) => {
            if (err) {
              console.error('Error inserting neurodivergences:', err);
              return db.rollback(() => handleServerError(res, err));
            }
            callback();
          });
        } else {
          callback();
        }
      };

      const insertGifts = (callback) => {
        if (gifts && gifts.length > 0) {
          const values = gifts.map(gift => [contactId, gift.title, gift.description, gift.date]);

          const insertQuery = `
            INSERT INTO gifts (contact_id, gift_title, gift_description, gift_date)
            VALUES ?
          `;
          db.query(insertQuery, [values], (err) => {
            if (err) {
              console.error('Error inserting gifts:', err);
              return db.rollback(() => handleServerError(res, err));
            }
            callback();
          });
        } else {
          callback();
        }
      };

      const insertGiftIdeas = (callback) => {
        if (gift_ideas && gift_ideas.length > 0) {
          const values = gift_ideas.map(idea => [contactId, idea.title, idea.description, idea.date]);

          const insertQuery = `
            INSERT INTO gift_ideas (contact_id, gift_title, idea_description, idea_date)
            VALUES ?
          `;
          db.query(insertQuery, [values], (err) => {
            if (err) {
              console.error('Error inserting gift ideas:', err);
              return db.rollback(() => handleServerError(res, err));
            }
            callback();
          });
        } else {
          callback();
        }
      };

      insertNeurodivergences(() => {
        insertGifts(() => {
          insertGiftIdeas(() => {
            db.commit(err => {
              if (err) {
                console.error('Error committing transaction:', err);
                return db.rollback(() => handleServerError(res, err));
              }
              res.status(201).json({ message: 'Contact created successfully' });
            });
          });
        });
      });
    });
  });
};


const updateContact = (req, res) => {
  const contactId = req.params.contactId;
  const { first_name, last_name, email, phone_number, birthday, last_contact, profile_id, neurodivergences } = req.body;

  db.beginTransaction(err => {
    if (err) {
      return handleServerError(res, err);
    }

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

        if (neurodivergences) {
          const neurodivergencesArray = neurodivergences.split(',').map(nd => nd.trim());
          if (neurodivergencesArray.length > 0) {
            const getNeurodivergenceIdsQuery = `
              SELECT id FROM neurodivergence WHERE type IN (?)
            `;
            db.query(getNeurodivergenceIdsQuery, [neurodivergencesArray], (err, results) => {
              if (err) {
                console.error('Error fetching neurodivergence ids:', err);
                return db.rollback(() => handleServerError(res, err));
              }

              const neurodivergenceIds = results.map(result => result.id);
              const values = neurodivergenceIds.map(ndId => [contactId, ndId]);

              const insertNeurodivergencesQuery = `
                INSERT INTO contact_neurodivergence (contact_id, neurodivergence_id)
                VALUES ?
              `;
              db.query(insertNeurodivergencesQuery, [values], (err) => {
                if (err) {
                  return db.rollback(() => handleServerError(res, err));
                }
                db.commit(err => {
                  if (err) {
                    return db.rollback(() => handleServerError(res, err));
                  }
                  res.json({ message: 'Contact updated successfully' });
                });
              });
            });
          } else {
            db.commit(err => {
              if (err) {
                return db.rollback(() => handleServerError(res, err));
              }
              res.json({ message: 'Contact updated successfully' });
            });
          }
        } else {
          db.commit(err => {
            if (err) {
              return db.rollback(() => handleServerError(res, err));
            }
            res.json({ message: 'Contact updated successfully' });
          });
        }
      });
    });
  });
};


const deleteContact = (req, res) => {
  const contactId = req.params.contactId;

  const deleteQueries = [
    `DELETE FROM gift_ideas WHERE contact_id = ?`,
    `DELETE FROM gifts WHERE contact_id = ?`,
    `DELETE FROM contact_neurodivergence WHERE contact_id = ?`,
    `DELETE FROM contact WHERE _id = ?`
  ];

  db.beginTransaction(err => {
    if (err) {
      console.error('Error starting transaction:', err);
      return res.status(500).json({ error: 'Failed to start transaction' });
    }

    const executeDeleteQuery = (queryIndex) => {
      if (queryIndex < deleteQueries.length) {
        db.query(deleteQueries[queryIndex], [contactId], (err) => {
          if (err) {
            console.error(`Error executing query ${queryIndex}:`, err);
            return db.rollback(() => res.status(500).json({ error: 'Failed to delete related data' }));
          }
          executeDeleteQuery(queryIndex + 1);
        });
      } else {
        db.commit(err => {
          if (err) {
            console.error('Error committing transaction:', err);
            return db.rollback(() => res.status(500).json({ error: 'Failed to commit transaction' }));
          }

          console.log('Contact and related data deleted successfully');
          res.status(200).json({ message: 'Contact deleted successfully' });
        });
      }
    };

    executeDeleteQuery(0);
  });
};





module.exports = {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact
};
