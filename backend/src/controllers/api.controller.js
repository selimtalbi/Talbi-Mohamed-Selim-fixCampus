export function getApiInfo(_request, response) {
  response.json({ name: 'FixIt Campus API', documentation: '/swagger' });
}
