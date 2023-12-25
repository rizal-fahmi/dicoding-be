class AlbumHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postAlbumHandler = this.postAlbumHandler.bind(this);
  }

  async postAlbumHandler(request, h) {
    try {
      this._validator.validateAlbum(request.payload);
      const { name, year } = request.payload;
      const resultService = await this._service.addAlbum({
        name,
        year,
      });
      return h
        .response({
          status: 'success',
          message: 'Album berhasil ditambahkan',
          data: {
            resultService,
          },
        })
        .code(201);
    } catch (error) {
      if (error.statusCode === 400) {
        return h
          .response({
            status: 'fail',
            message: error.message,
          })
          .code(404);
      }
      return h
        .response({
          status: 'error',
          message: 'Maaf, terjadi kegagalan pada server kami',
        })
        .code(500);
    }
  }
}

module.exports = AlbumHandler;
