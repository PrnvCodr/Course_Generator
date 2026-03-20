const { auth } = require('express-oauth2-jwt-bearer');

const domain    = process.env.AUTH0_ISSUER_BASE_URL; // e.g. https://dev-xxx.us.auth0.com/
const audience  = process.env.AUTH0_CLIENT_ID;        // Client ID = audience for ID tokens

const isAuthConfigured =
  domain && audience &&
  !domain.includes('placeholder') &&
  !domain.includes('YOUR_AUTH0') &&
  !audience.includes('YOUR_AUTH0');

// Build middleware lazily so a bad config never crashes the server at startup
let _middleware = null;
const getMiddleware = () => {
  if (!_middleware) {
    try {
      _middleware = auth({ issuerBaseURL: domain, audience });
    } catch (err) {
      console.error('[AUTH] Failed to init Auth0 middleware:', err.message);
      _middleware = (req, res, next) => next(); // safe fallback
    }
  }
  return _middleware;
};

/**
 * requireAuth — validates the Bearer JWT from the Auth0 API.
 * Dev passthrough when not configured.
 */
const requireAuth = (req, res, next) => {
  if (!isAuthConfigured) return next();
  return getMiddleware()(req, res, next);
};

/**
 * optionalAuth — validates token if present, continues as guest otherwise.
 */
const optionalAuth = (req, res, next) => {
  if (!isAuthConfigured) return next();

  const header = req.headers.authorization || '';
  if (!header.startsWith('Bearer ')) return next();

  getMiddleware()(req, res, (err) => {
    if (err) {
      // Invalid token — treat as unauthenticated guest
      req.auth = null;
    }
    next();
  });
};

module.exports = { requireAuth, optionalAuth };
