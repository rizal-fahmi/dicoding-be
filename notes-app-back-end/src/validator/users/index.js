const InvariantError = require('../../exceptions/InvariantError');
const userPayloadSchema = require('./schema');

const UsersValidator = {
  validateUserPayload: (payload) => {
    const validatonResult = userPayloadSchema.validate(payload);
    if (validatonResult.error) {
      throw new InvariantError(validatonResult.error.message);
    }
  },
};

module.exports = UsersValidator;
