const { SongSchema } = require('./schema');

const SongValidator = {
  validateSong: (payload) => {
    const songValidationResult = SongSchema.validate(payload);
    if (songValidationResult.error) {
      throw new Error(songValidationResult.error.message);
    }
  },
};

module.exports = SongValidator;
