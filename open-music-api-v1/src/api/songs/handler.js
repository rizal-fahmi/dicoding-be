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
  }

  async postSongHandler(request, h) {
    try {
      this._validator.validateSong(request.payload);
      const { title, year, performer, genre, duration, albumId } = request.payload;
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
        return ClientErrorResponse(h, error.message);
      }
      return ServerErrorResponse(h);
    }
  }
}

module.exports = SongHandler;
