import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, useNavigate } from 'react-router-dom'
import { Auth0Provider } from '@auth0/auth0-react'
import App from './App.jsx'
import './index.css'

const domain   = import.meta.env.VITE_AUTH0_DOMAIN   || 'placeholder.auth0.com'
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID || 'placeholder'
const audience = import.meta.env.VITE_AUTH0_AUDIENCE  || ''

/**
 * Auth0ProviderWithNavigate — must be inside BrowserRouter so useNavigate works.
 * onRedirectCallback sends the user back to the page they originally tried to visit.
 */
function Auth0ProviderWithNavigate({ children }) {
  const navigate = useNavigate()

  const onRedirectCallback = (appState) => {
    navigate(appState?.returnTo || '/', { replace: true })
  }

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: window.location.origin,
      }}
      onRedirectCallback={onRedirectCallback}
      cacheLocation="localstorage"
    >
      {children}
    </Auth0Provider>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Auth0ProviderWithNavigate>
        <App />
      </Auth0ProviderWithNavigate>
    </BrowserRouter>
  </React.StrictMode>,
)
