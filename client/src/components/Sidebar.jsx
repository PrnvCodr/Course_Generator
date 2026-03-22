import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'
import projectLogo from '../assets/logo.png'

const NAV_ITEMS = [
  { label: 'Home', to: '/', icon: 'H' },
  { label: 'My Courses', to: '/courses', icon: 'C' },
]

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const { isAuthenticated, isLoading, user, loginWithRedirect, logout } = useAuth0()

  const handleLogin = () => loginWithRedirect()
  const handleLogout = () => logout({ logoutParams: { returnTo: window.location.origin } })

  return (
    <>
      <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">
            <img src={projectLogo} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'inherit' }} />
          </div>

          {!collapsed && (
            <span className="sidebar-logo-text gradient-text">Text-to-Learn</span>
          )}
        </div>

        <div className="sidebar-divider" />

        {/* Nav Links */}
        <nav className="sidebar-nav">
          <NavLink to="/" end className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
            <span className="sidebar-nav-icon">H</span>
            {!collapsed && <span className="sidebar-nav-label">Home</span>}
          </NavLink>

          {isAuthenticated && (
            <NavLink to="/courses" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
              <span className="sidebar-nav-icon">C</span>
              {!collapsed && <span className="sidebar-nav-label">My Courses</span>}
            </NavLink>
          )}
        </nav>

        <div style={{ flex: 1 }} />

        {/* Auth0 Login / User Section */}
        {!collapsed && (
          <div className="sidebar-auth">
            {isLoading ? (
              <div className="sidebar-auth-loading">Authenticating...</div>
            ) : isAuthenticated && user ? (
              <div className="sidebar-user">
                <img
                  src={user.picture}
                  alt={user.name}
                  className="sidebar-user-avatar"
                />
                <div className="sidebar-user-info">
                  <p className="sidebar-user-name">{user.name}</p>
                  <p className="sidebar-user-email text-xs text-muted truncate">{user.email}</p>
                </div>
                <button
                  className="sidebar-logout-btn"
                  onClick={handleLogout}
                  title="Logout"
                >
                  Out
                </button>
              </div>
            ) : (
              <button className="btn btn-primary w-full" onClick={handleLogin} id="login-btn">
                Sign In
              </button>
            )}
          </div>
        )}

        {/* Collapse toggle */}
        <button
          className="sidebar-collapse-btn"
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? '›' : '‹'}
        </button>

        {/* Footer badge */}
        {!collapsed && (
          <div className="sidebar-footer">
            <span className="badge badge-purple">AI Powered</span>
            <p className="text-xs text-muted" style={{ marginTop: 6 }}>Gemini 2.5</p>
          </div>
        )}
      </aside>

      <style>{`
        .sidebar {
          position: fixed;
          left: 0; top: 0;
          height: 100vh;
          width: var(--sidebar-width);
          background: var(--bg-surface);
          border-right: 1px solid var(--border-subtle);
          display: flex;
          flex-direction: column;
          padding: var(--space-lg) var(--space-md);
          transition: width var(--transition-normal);
          z-index: 100;
          overflow: hidden;
        }
        .sidebar.collapsed { width: 64px; padding: var(--space-lg) var(--space-sm); }
        .sidebar-logo {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          padding: var(--space-sm);
          margin-bottom: var(--space-sm);
        }
        .sidebar-logo-icon {
          width: 36px; height: 36px;
          background: var(--brand-gradient);
          border-radius: var(--radius-md);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          box-shadow: var(--shadow-glow);
          animation: pulse-glow 3s infinite;
        }
        .sidebar-logo-star { color: white; font-size: 1rem; }
        .sidebar-logo-text {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1rem;
          font-weight: 700;
          white-space: nowrap;
        }
        .sidebar-divider {
          height: 1px;
          background: var(--border-subtle);
          margin: var(--space-sm) 0 var(--space-md);
        }
        .sidebar-nav { display: flex; flex-direction: column; gap: 3px; }
        .sidebar-nav-item {
          display: flex; align-items: center; gap: var(--space-sm);
          padding: 9px var(--space-sm);
          border-radius: var(--radius-md);
          color: var(--text-secondary);
          font-size: 0.875rem;
          font-weight: 500;
          transition: all var(--transition-fast);
          text-decoration: none;
          white-space: nowrap;
        }
        .sidebar-nav-item:hover { background: var(--bg-elevated); color: var(--text-primary); }
        .sidebar-nav-item.active {
          background: rgba(247, 37, 133, 0.1);
          color: #ff85c2;
          border: 1px solid rgba(247, 37, 133, 0.2);
        }
        .sidebar-nav-icon {
          width: 22px; height: 22px;
          border-radius: var(--radius-sm);
          background: var(--bg-elevated);
          display: flex; align-items: center; justify-content: center;
          font-size: 0.7rem; font-weight: 800;
          flex-shrink: 0;
          color: var(--text-muted);
        }
        .sidebar-nav-item.active .sidebar-nav-icon {
          background: rgba(247,37,133,0.15);
          color: #ff85c2;
        }

        /* Auth section */
        .sidebar-auth { margin-bottom: var(--space-sm); }
        .sidebar-auth-loading {
          font-size: 0.78rem;
          color: var(--text-muted);
          text-align: center;
          padding: 8px;
        }
        .sidebar-user {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          padding: var(--space-sm);
          background: var(--bg-elevated);
          border-radius: var(--radius-md);
          border: 1px solid var(--border-subtle);
        }
        .sidebar-user-avatar {
          width: 32px; height: 32px;
          border-radius: 50%;
          border: 2px solid rgba(247,37,133,0.4);
          flex-shrink: 0;
          object-fit: cover;
        }
        .sidebar-user-info { flex: 1; min-width: 0; }
        .sidebar-user-name {
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .sidebar-logout-btn {
          background: rgba(247,37,133,0.12);
          border: 1px solid rgba(247,37,133,0.25);
          border-radius: var(--radius-sm);
          color: #ff85c2;
          font-size: 0.7rem;
          font-weight: 700;
          padding: 3px 8px;
          cursor: pointer;
          transition: all var(--transition-fast);
          font-family: 'Inter', sans-serif;
          flex-shrink: 0;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .sidebar-logout-btn:hover { background: rgba(247,37,133,0.25); }

        .sidebar-collapse-btn {
          background: var(--bg-elevated);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          color: var(--text-muted);
          cursor: pointer;
          padding: 8px;
          width: 100%;
          transition: all var(--transition-fast);
          font-size: 1rem;
          margin-bottom: var(--space-sm);
          font-family: monospace;
        }
        .sidebar-collapse-btn:hover { color: var(--text-primary); border-color: var(--border-accent); }
        .sidebar-footer { padding: var(--space-sm); text-align: center; }

        @media (max-width: 768px) { .sidebar { display: none; } }
      `}</style>
    </>
  )
}
