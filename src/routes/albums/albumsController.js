const connexion = require('../../../db-config');
const db = connexion.promise();

const getAll = (req, res) => {
  db.query(`select * from albums`)
    .then(([albums]) => res.json(albums))
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error retrieving data from database');
    });
};

const getOne = (req, res) => {
  db.query(`select * from albums where id = ?`, [req.params.id])
    .then(([album]) => {
      if (album.length > 0) {
        res.status(200).json(album[0]);
      } else {
        res.send(404);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error retrieving data from database');
    });
};

const getTracksByAlbumId = (req, res) => {
  db.query(`select * from track where id_album = ?`, [req.params.id])
    .then(([track]) => {
      if (track.length > 0) {
        res.status(200).json(track);
      } else {
        res.send(404);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error retrieving data from database');
    });
};

const postAlbums = (req, res) => {
  const { title, genre, picture, artist } = req.body;
  db.query(
    'INSERT INTO albums(title, genre, picture, artist) VALUES (?, ?, ?, ?)',
    [title, genre, picture, artist]
  )
    .then(([result]) => {
      res
        .status(201)
        .json({ title, genre, picture, artist, id: result.insertId });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error saving the user');
    });
};

const updateAlbums = (req, res) => {
  const { title, genre, picture, artist } = req.body;
  db.query(
    'UPDATE `albums` SET `title`=?,`genre`=?,`picture`=?,`artist`=? WHERE `id`=?',
    [title, genre, picture, artist, req.params.id]
  )
    .then(([result]) => {
      if (result.affectedRows === 0) {
        res.status(404).send('Not Found');
      } else {
        res.sendStatus(204);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error saving the user');
    });
};

const deleteAlbums = (req, res) => {
  db.query(`delete from albums where id = ?`, [req.params.id])
    .then(() => {
      res.sendStatus(204);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error retrieving data from database');
    });
};

module.exports = {
  getAll,
  getOne,
  getTracksByAlbumId,
  postAlbums,
  updateAlbums,
  deleteAlbums,
};
