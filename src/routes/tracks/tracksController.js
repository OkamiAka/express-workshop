const connexion = require('../../../db-config');
const db = connexion.promise();

const getOne = (req, res) => {
  db.query(`select * from track where id= ?`, [req.params.id])
    .then(([track]) => {
      if (track.length > 0) {
        res.status(200).json(track[0]);
      } else {
        res.send(404);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error retrieving data from database');
    });
};

const getAll = (req, res) => {
  db.query(`select * from track`)
    .then(([tracks]) => res.json(tracks))
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error retrieving data from database');
    });
};

const postTracks = (req, res) => {
  const { title, youtube_url, id_album } = req.body;
  db.query('INSERT INTO track(title, youtube_url, id_album) VALUES (?, ?, ?)', [
    title,
    youtube_url,
    id_album,
  ])
    .then(([result]) => {
      res
        .status(201)
        .json({ title, youtube_url, id_album, id: result.insertId });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error saving the user');
    });
};

const updateTracks = (req, res) => {
  const { title, youtube_url, id_album } = req.body;
  db.query(
    'UPDATE `track` SET `title`=?,`youtube_url`=?,`id_album`=? WHERE `id`=?',
    [title, youtube_url, id_album, req.params.id]
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

const deleteTracks = (req, res) => {
  db.query(`delete from track where id = ?`, [req.params.id])
    .then(() => {
      res.sendStatus(204);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error retrieving data from database');
    });
};

module.exports = { getOne, getAll, postTracks, updateTracks, deleteTracks };
