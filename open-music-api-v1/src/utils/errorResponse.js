const ServerErrorResponse = (h) => {
  const message = 'Internal Server Error: An unexpected error occurred. Please try again later.';
  const statusCode = 500;
  const response = {
    status: 'fail',
    message,
  };
  return h.response(response).code(statusCode);
};

const ClientErrorResponse = (h, error) => {
  const response = h.response({
    status: 'fail',
    message: error.message,
  });
  response.code(error.statusCode);
  return response;
};

module.exports = { ServerErrorResponse, ClientErrorResponse };
