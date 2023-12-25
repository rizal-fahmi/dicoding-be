const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const { songMapToDBModel } = require('../../utils');

class SongsService {
  constructor() {
    this._pool = new Pool();
  }

  async addSong({ title, year, performer, genre, duration, album_id }) {
    const id = `song-${nanoid(16)}`;
    console.log(title, year, performer, genre, duration, album_id);
    const query = {
      text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      values: [id, title, year, performer, genre, duration, album_id],
    };
    const result = await this._pool.query(query);
    if (!result.rows[0].id) {
      throw new InvariantError('Lagu gagal ditambahkan');
    }
    return result.rows[0].id;
  }

  async getSongs(title, performer) {
    let queryText = 'SELECT id, title, performer FROM songs';
    const values = [];
    if (title && performer) {
      queryText += ' WHERE title ILIKE $1 AND performer ILIKE $2';
      values.push(`%${title}%`, `%${performer}%`);
    } else if (title || performer) {
      queryText += ' WHERE title ILIKE $1 OR performer ILIKE $1';
      values.push(`%${title || performer}%`);
    }
    const query = {
      text: queryText,
      values: values,
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
      throw new NotFoundError('Lagu tidak ditemukan');
    }
    return songMapToDBModel(result.rows[0]);
  }

  async editSongById(id, { title, year, performer, genre, duration }) {
    const query = {
      text: 'UPDATE songs SET title = $1, year = $2, performer = $3, genre = $4, duration = $5 WHERE id = $6 RETURNING id',
      values: [title, year, performer, genre, duration, id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui lagu. Id tidak ditemukan');
    }
  }

  async deleteSongById(id) {
    const query = {
      text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Lagu gagal dihapus. Id tidak ditemukan');
    }
  }
}

module.exports = SongsService;
