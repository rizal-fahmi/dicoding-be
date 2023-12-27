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
    this.getAlbumsHandler = this.getAlbumsHandler.bind(this);
    this.getAlbumByIdHandler = this.getAlbumByIdHandler.bind(this);
    this.putAlbumHandler = this.putAlbumHandler.bind(this);
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

  async getAlbumsHandler(h) {
    try {
      const albums = await this._service.getAlbums();
      return {
        status: 'success',
        data: {
          albums,
        },
      };
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

  async putAlbumHandler(request, h) {
    try {
      this._validator.validateAlbum(request.payload);
      const { id } = request.params;
      await this._service.editAlbum(id, request.payload);
      return {
        status: 'success',
        message: 'Album successfully updated.',
      };
    } catch (error) {
      if (error instanceof ClientError) {
        return ClientErrorResponse(h, error.message);
      }
      return ServerErrorResponse(h);
    }
  }
}

module.exports = AlbumHandler;
