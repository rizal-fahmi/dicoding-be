const ClientError = require('../../exceptions/ClientError');
const {
  ClientErrorResponse,
  ServerErrorResponse,
} = require('../../utils/errorResponse');

class SongHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postSongHandler = this.postSongHandler.bind(this);
    this.getSongsHandler = this.getSongsHandler.bind(this);
    this.getSongByIdHandler = this.getSongByIdHandler.bind(this);
    this.putSongHandler = this.putSongHandler.bind(this);
    this.deleteSongHandler = this.deleteSongHandler.bind(this);
  }

  async postSongHandler(request, h) {
    try {
      this._validator.validateSong(request.payload);
      const { title, year, performer, genre, duration, albumId } =
        request.payload;
      const songId = await this._service.addSong({
        title,
        year,
        performer,
        genre,
        duration,
        albumId,
      });
      return h
        .response({
          status: 'success',
          message: 'Song successfully added.',
          data: {
            songId,
          },
        })
        .code(201);
    } catch (error) {
      if (error instanceof ClientError) {
        return ClientErrorResponse(h, error.message, error.statusCode);
      }
      return ServerErrorResponse(h);
    }
  }

  async getSongsHandler(request, h) {
    try {
      const { title, performer } = request.query;
      const songs = await this._service.getSongs(title, performer);
      return {
        status: 'success',
        data: {
          songs,
        },
      };
    } catch (error) {
      if (error instanceof ClientError) {
        return ClientErrorResponse(h, error.message, error.statusCode);
      }
      return ServerErrorResponse(h);
    }
  }

  async getSongByIdHandler(request, h) {
    try {
      const { id } = request.params;
      const song = await this._service.getSongById(id);
      return h
        .response({
          status: 'success',
          data: {
            song,
          },
        })
        .code(200);
    } catch (error) {
      if (error instanceof ClientError) {
        return ClientErrorResponse(h, error.message, error.statusCode);
      }
      return ServerErrorResponse(h);
    }
  }

  async putSongHandler(request, h) {
    try {
      this._validator.validateSong(request.payload);
      const { id } = request.params;
      await this._service.editSong(id, request.payload);
      return {
        status: 'success',
        message: 'Song successfully updated.',
      };
    } catch (error) {
      if (error instanceof ClientError) {
        return ClientErrorResponse(h, error.message, error.statusCode);
      }
      return ServerErrorResponse(h);
    }
  }

  async deleteSongHandler(request, h) {
    try {
      const { id } = request.params;
      await this._service.deleteSong(id);
      return {
        status: 'success',
        message: 'Song successfully deleted.',
      };
    } catch (error) {
      if (error instanceof ClientError) {
        return ClientErrorResponse(h, error.message, error.statusCode);
      }
      return ServerErrorResponse(h);
    }
  }
}

module.exports = SongHandler;
