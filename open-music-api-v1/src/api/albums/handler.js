const ClientError = require('../../exceptions/ClientError');
const {
  ClientErrorResponse,
  ServerErrorResponse,
} = require('../../utils/errorResponse');

class AlbumHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postAlbumHandler = this.postAlbumHandler.bind(this);
    this.getAlbumByIdHandler = this.getAlbumByIdHandler.bind(this);
  }

  async postAlbumHandler(request, h) {
    try {
      this._validator.validateAlbum(request.payload);
      const { name, year } = request.payload;
      const albumId = await this._service.addAlbum({
        name,
        year,
      });
      return h
        .response({
          status: 'success',
          message: 'album successfully added.',
          data: {
            albumId,
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

  async getAlbumByIdHandler(request, h) {
    try {
      const { id } = request.params;
      const album = await this._service.getAlbumById(id);
      return h
        .response({
          status: 'success',
          data: {
            album,
          },
        })
        .code(200);
    } catch (error) {
      if (error instanceof ClientError) {
        return ClientErrorResponse(h, error.message);
      }
      return ServerErrorResponse(h);
    }
  }
}

module.exports = AlbumHandler;
