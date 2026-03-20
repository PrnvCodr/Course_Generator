import { useAuth0 } from '@auth0/auth0-react'
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * ProtectedRoute — wraps any page that requires auth.
 *
 * - While Auth0 is checking session: shows a full-screen loading spinner
 * - If not authenticated: immediately calls loginWithRedirect(), storing the
 *   intended URL as `appState.returnTo` so Auth0 redirects back to the exact
 *   page after login
 * - If authenticated: renders children normally
 */
export default function ProtectedRoute({ children }) {
  const { isLoading, isAuthenticated, loginWithRedirect } = useAuth0()
  const location = useLocation()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      loginWithRedirect({
        appState: { returnTo: location.pathname + location.search },
      })
    }
  }, [isLoading, isAuthenticated, loginWithRedirect, location])

  //  Still checking session
  if (isLoading) {
    return (
      <div className="auth-loading">
        <div className="auth-loading-card">
          <div className="auth-spinner" />
          <p className="auth-loading-text">Verifying your session...</p>
        </div>
        <style>{`
          .auth-loading {
            display: flex; align-items: center; justify-content: center;
            min-height: 100vh; background: var(--bg-base);
          }
          .auth-loading-card {
            display: flex; flex-direction: column; align-items: center;
            gap: 16px; padding: 40px;
            background: var(--bg-glass);
            border: 1px solid var(--border-accent);
            border-radius: 20px;
            backdrop-filter: blur(16px);
            animation: pulse-glow 2s infinite;
          }
          .auth-spinner {
            width: 44px; height: 44px;
            border: 3px solid rgba(247,37,133,0.2);
            border-top-color: #f72585;
            border-radius: 50%;
            animation: spin 0.9s linear infinite;
          }
          .auth-loading-text {
            font-size: 0.9rem;
            color: var(--text-secondary);
          }
        `}</style>
      </div>
    )
  }

  // Redirecting to login — render nothing while Auth0 redirect happens
  if (!isAuthenticated) return null

  return children
}
