const { AlbumSchema } = require('./schema');

const AlbumValidator = {
  validateAlbum: (payload) => {
    const albumValidationResult = AlbumSchema.validate(payload);
    if (albumValidationResult.error) {
      throw new Error(albumValidationResult.error.message);
    }
  },
};

module.exports = AlbumValidator;
