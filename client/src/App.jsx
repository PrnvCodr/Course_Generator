import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'
import Sidebar from './components/Sidebar'
import ProtectedRoute from './components/ProtectedRoute'
import LandingPage from './pages/LandingPage'
import HomePage from './pages/HomePage'
import CoursesPage from './pages/CoursesPage'
import CoursePage from './pages/CoursePage'
import LessonPage from './pages/LessonPage'
import LoadingSpinner from './components/LoadingSpinner'
import { setTokenGetter } from './utils/api'


function App() {
  const { isAuthenticated, isLoading, getIdTokenClaims } = useAuth0()

  // Wire Auth0 ID token into Axios — all API requests include Bearer token
  useEffect(() => {
    if (isAuthenticated) {
      setTokenGetter(async () => {
        try {
          const claims = await getIdTokenClaims()
          return claims?.__raw ?? null  // __raw is the raw JWT string
        } catch (err) {
          console.warn('[Auth] Token error:', err.message)
          return null
        }
      })
    } else {
      setTokenGetter(null)
    }
  }, [isAuthenticated, getIdTokenClaims])

  // Show loading spinner while Auth0 checks the session
  if (isLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <LoadingSpinner message="Checking your session..." />
      </div>
    )
  }

  return (
    <div className="app-shell">
      {/* Sidebar is only shown to authenticated users */}
      {isAuthenticated && <Sidebar />}

      <div className={`main-content ${!isAuthenticated ? 'no-sidebar' : ''}`}>
        <Routes>
          {/*
           * "/" — Landing page for guests, Course Generator for logged-in users.
           * This is the gateway: if not logged in you see the marketing page.
           */}
          <Route
            path="/"
            element={isAuthenticated ? <HomePage /> : <LandingPage />}
          />

          {/* My Courses — protected */}
          <Route
            path="/courses"
            element={
              <ProtectedRoute>
                <CoursesPage />
              </ProtectedRoute>
            }
          />

          {/* Course viewer — protected */}
          <Route
            path="/course/:id"
            element={
              <ProtectedRoute>
                <CoursePage />
              </ProtectedRoute>
            }
          />

          {/* Lesson viewer — protected */}
          <Route
            path="/course/:courseId/module/:moduleIndex/lesson/:lessonIndex"
            element={
              <ProtectedRoute>
                <LessonPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>

      <style>{`
        .no-sidebar { margin-left: 0 !important; }
      `}</style>
    </div>
  )
}

export default App
