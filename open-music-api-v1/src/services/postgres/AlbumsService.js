const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const { albumMapToDBModel } = require('../../utils');
const NotFoundError = require('../../exceptions/NotFoundError');
const InvariantError = require('../../exceptions/InvariantError');

class AlbumService {
  constructor() {
    this._pool = new Pool();
  }

  async addAlbum({ name, year }) {
    const id = `album-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO albums VALUES($1, $2, $3) RETURNING id',
      values: [id, name, year],
    };
    const result = await this._pool.query(query);
    if (!result.rows[0].id) {
      throw new InvariantError('failed to add the album.');
    }
    return result.rows[0].id;
  }

  async getAlbums() {
    const query = {
      text: 'SELECT id, name, year FROM albums',
    };
    const result = await this._pool.query(query);
    return result.rows;
  }

  async getAlbumById(id) {
    const query = {
      text: 'SELECT a.id, a.name, a.year, s.id AS song_id, s.title AS song_title, s.performer AS song_performer FROM albums a LEFT JOIN songs s ON a.id = s.album_id WHERE a.id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('album not found');
    }
    const album = result.rows[0];
    const songs = result.rows
      .map((songData) => {
        if (songData.song_id !== null) {
          return {
            id: songData.song_id,
            title: songData.song_title,
            performer: songData.song_performer,
          };
        }
        return null;
      })
      .filter((song) => song !== null);

    return albumMapToDBModel(album, songs);
  }

  async editAlbum(id, { name, year }) {
    const query = {
      text: 'UPDATE albums SET name = $1, year = $2 WHERE id = $3 RETURNING id;',
      values: [name, year, id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('failed to update the album. Id not found.');
    }
  }
}

module.exports = AlbumService;
