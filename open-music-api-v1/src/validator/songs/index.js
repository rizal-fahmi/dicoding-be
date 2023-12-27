const { SongSchema } = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

const SongValidator = {
  validateSong: (payload) => {
    const songValidationResult = SongSchema.validate(payload);
    if (songValidationResult.error) {
      throw new InvariantError(songValidationResult.error.message);
    }
  },
};

module.exports = SongValidator;
