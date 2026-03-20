/**
 * Centralized Express error handler.
 * Returns a consistent { error: message } JSON structure.
 */
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.message);

  // Auth errors
  if (err.status === 401 || err.name === 'UnauthorizedError') {
    return res.status(401).json({ error: 'Unauthorized — please log in.' });
  }

  // JSON parse errors from AI
  if (err instanceof SyntaxError && err.message.includes('JSON')) {
    return res.status(502).json({ error: 'AI returned invalid content. Please try again.' });
  }

  // Google API errors
  if (err.message && err.message.includes('API_KEY_INVALID')) {
    return res.status(503).json({ error: 'AI service not configured. Please add your GEMINI_API_KEY.' });
  }

  // Quota exceeded errors
  if (err.message && (err.message.includes('429') || err.message.includes('quota') || err.message.includes('Too Many Requests'))) {
    return res.status(429).json({ error: 'AI quota limit reached. Please wait a minute and try again, or upgrade your Gemini API plan at https://ai.google.dev' });
  }

  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal server error';
  
  res.status(status).json({ error: message });
};

module.exports = errorHandler;
