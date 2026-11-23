export function notFoundHandler(_request, _response, next) {
  const error = new Error('Route not found');
  error.statusCode = 404;
  next(error);
}
