const InvariantError = require('../../exceptions/InvariantError');
const { AlbumSchema } = require('./schema');

const AlbumValidator = {
  validateAlbum: (payload) => {
    const albumValidationResult = AlbumSchema.validate(payload);
    if (albumValidationResult.error) {
      throw new InvariantError(albumValidationResult.error.message);
    }
  },
};

module.exports = AlbumValidator;
