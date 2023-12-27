const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const { songMapToDBModel } = require('../../utils');

class SongService {
  constructor() {
    this._pool = new Pool();
  }

  async addSong({ title, year, performer, genre, duration, albumId }) {
    const id = `song-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      values: [id, title, year, performer, genre, duration, albumId],
    };
    const result = await this._pool.query(query);
    if (!result.rows[0].id) {
      throw new InvariantError('failed to add the song.');
    }
    return result.rows[0].id;
  }

  async getSongs(title, performer) {
    let queryOptions = 'SELECT id, title, performer FROM songs';
    const values = [];
    if (title && performer) {
      queryOptions += ' WHERE title ILIKE $1 AND performer ILIKE $2';
      values.push(`%${title}%`, `%${performer}%`);
    } else if (title || performer) {
      queryOptions += ' WHERE title ILIKE $1 OR performer ILIKE $1';
      values.push(`%${title || performer}%`);
    }
    const query = {
      text: queryOptions,
      values,
    };
    const result = await this._pool.query(query);
    return result.rows;
  }

  async getSongById(id) {
    const query = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('song not found');
    }
    return songMapToDBModel(result.rows[0]);
  }

  async editSong(id, { title, year, performer, genre, duration, albumId }) {
    const query = {
      text: 'UPDATE songs SET title = $1, year = $2, performer = $3, genre = $4, duration = $5, album_id = $6 WHERE id = $7 RETURNING id',
      values: [title, year, performer, genre, duration, albumId, id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('failed to update the song. Id not found.');
    }
  }

  async deleteSong(id) {
    const query = {
      text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('failed to delete the song. Id not found.');
    }
  }
}

module.exports = SongService;
