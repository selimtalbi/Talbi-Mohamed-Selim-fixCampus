export function errorHandler(error, _request, response, next) {
  if (response.headersSent) {
    return next(error);
  }

  const statusCode = Number(error.statusCode || error.status) || 500;
  const isServerError = statusCode >= 500;

  if (isServerError) {
    console.error(error);
  }

  response.status(statusCode).json({
    error: isServerError ? 'Internal server error' : error.message
  });
}
