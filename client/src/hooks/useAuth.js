import { useAuth0 } from '@auth0/auth0-react'

// Whether Auth0 is actually configured with real credentials
export const isAuth0Configured = !!(
  import.meta.env.VITE_AUTH0_DOMAIN &&
  !import.meta.env.VITE_AUTH0_DOMAIN.includes('placeholder') &&
  !import.meta.env.VITE_AUTH0_DOMAIN.includes('YOUR_AUTH0')
)

/**
 * useAuth — safe wrapper around useAuth0.
 * Works even when Auth0 credentials are not configured.
 */
export function useAuth() {
  const auth = useAuth0()

  const safeLogin = () => {
    if (!isAuth0Configured) {
      alert('Auth0 is not configured. Add VITE_AUTH0_DOMAIN and VITE_AUTH0_CLIENT_ID to client/.env to enable login.')
      return
    }
    auth.loginWithRedirect()
  }

  const safeLogout = () => {
    if (!isAuth0Configured) return
    auth.logout({ logoutParams: { returnTo: window.location.origin } })
  }

  return {
    ...auth,
    isConfigured: isAuth0Configured,
    safeLogin,
    safeLogout,
  }
}
