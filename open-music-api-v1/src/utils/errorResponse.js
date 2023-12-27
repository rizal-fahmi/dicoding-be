const ServerErrorResponse = (h) => {
  const message = 'Internal Server Error: An unexpected error occurred. Please try again later.';
  const statusCode = 500;
  const response = {
    status: 'fail',
    message,
  };
  return h.response(response).code(statusCode);
};

const ClientErrorResponse = (h, message) => {
  const statusCode = 400;
  const response = {
    status: 'fail',
    message,
  };
  return h.response(response).code(statusCode);
};

module.exports = { ServerErrorResponse, ClientErrorResponse };
