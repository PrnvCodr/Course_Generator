import { useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'

const FEATURES = [
  { icon: '✦', title: 'AI Course Generation',   desc: 'Type any topic — get a structured course with modules, lessons and objectives in seconds.', color: '#f72585' },
  { icon: '◈', title: 'Rich Lesson Content',    desc: 'Headings, paragraphs, syntax-highlighted code, YouTube videos, and MCQ quizzes.',          color: '#7209b7' },
  { icon: '▣', title: 'PDF Export',             desc: 'Download any lesson as a formatted PDF for offline reading and revision.',                   color: '#4cc9f0' },
  { icon: '◎', title: 'Hinglish Audio',         desc: 'Listen to AI-translated Hinglish narration of every lesson for better accessibility.',        color: '#c77dff' },
  { icon: '◫', title: 'Personal Library',       desc: 'All saved courses are private to your account. Come back and continue anytime.',               color: '#06d6a0' },
  { icon: '◬', title: 'Auth0 Secured',          desc: 'OAuth 2.0 login keeps your courses and progress private and secure.',                         color: '#ffd60a' },
]

export default function LandingPage() {
  const { loginWithRedirect } = useAuth0()

  // Auth0 may bounce back with ?error=...&error_description=... in the URL
  const urlParams = new URLSearchParams(window.location.search)
  const urlError = urlParams.get('error_description') || urlParams.get('error')

  const [loginError, setLoginError] = useState(urlError || null)

  const handleLogin = async () => {
    try {
      setLoginError(null)
      await loginWithRedirect()
    } catch (err) {
      console.error('[Auth0] loginWithRedirect error:', err)
      setLoginError(err.message || 'Auth0 login failed — check your browser console.')
    }
  }

  return (
    <div className="landing">
      {/* Hero */}
      <section className="landing-hero">
        <div className="landing-hero-glow" />
        <div className="landing-badges">
          <span className="badge badge-pink">AI Powered</span>
          <span className="badge badge-cyan">Free</span>
          <span className="badge badge-purple">Auth0 Secured</span>
        </div>

        <h1 className="landing-title">
          Turn Any Topic Into a<br />
          <span className="gradient-text">Complete Course</span>
        </h1>

        <p className="landing-subtitle">
          An AI-powered platform that generates structured courses, rich lessons,
          quizzes, and video content from a single text prompt.
        </p>

        <div className="landing-cta-group">
          <button id="landing-signin-btn" className="btn btn-primary btn-lg landing-cta-btn" onClick={handleLogin}>
            Get Started — Sign In
          </button>
          <p className="text-xs text-muted" style={{ marginTop: 8 }}>
            Free · No credit card · Your courses stay private
          </p>
          {loginError && (
            <div style={{ marginTop: 12, padding: '10px 16px', background: 'rgba(239,35,60,0.1)', border: '1px solid rgba(239,35,60,0.3)', borderRadius: 8, maxWidth: 400 }}>
              <p style={{ fontSize: '0.85rem', color: '#ff6b7a' }}>{loginError}</p>
            </div>
          )}
        </div>

        {/* Course preview card */}
        <div className="landing-preview-card">
          <div className="landing-preview-line" />
          <div className="landing-preview-content">
            <span className="badge badge-purple" style={{ marginBottom: 8, display: 'inline-flex' }}>Generated Course</span>
            <p className="landing-preview-title">Introduction to Machine Learning</p>
            <p className="text-xs text-muted">6 modules · 24 lessons · Quizzes included</p>
          </div>
          <div className="landing-preview-modules">
            {['Basics of ML', 'Supervised Learning', 'Neural Networks', 'Model Evaluation'].map((m, i) => (
              <div key={i} className="landing-preview-module">
                <span className="landing-preview-module-dot" />
                <span className="text-sm text-secondary">{m}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="landing-features">
        <h2 className="landing-section-title">
          Everything you need to <span className="gradient-text">learn faster</span>
        </h2>
        <div className="features-grid">
          {FEATURES.map((f) => (
            <div key={f.title} className="feature-card glass-card">
              <span className="feature-icon" style={{ color: f.color }}>{f.icon}</span>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="landing-bottom-cta">
        <h2 className="landing-section-title">
          Ready to start <span className="gradient-text">learning?</span>
        </h2>
        <button className="btn btn-primary btn-lg" onClick={handleLogin}>
          Create Your First Course
        </button>
      </section>

      <style>{`
        .landing { min-height: 100vh; display: flex; flex-direction: column; gap: var(--space-3xl); padding: var(--space-2xl) var(--space-2xl) var(--space-3xl); max-width: 1100px; margin: 0 auto; width: 100%; }
        .landing-hero { position: relative; display: flex; flex-direction: column; align-items: center; text-align: center; gap: var(--space-lg); padding: var(--space-3xl) 0 var(--space-2xl); }
        .landing-hero-glow { position: absolute; width: 600px; height: 300px; top: 0; left: 50%; transform: translateX(-50%); background: radial-gradient(ellipse, rgba(247,37,133,0.12) 0%, transparent 70%); pointer-events: none; }
        .landing-badges { display: flex; gap: var(--space-sm); flex-wrap: wrap; justify-content: center; }
        .landing-title { font-size: clamp(2.2rem, 6vw, 3.8rem); line-height: 1.1; font-weight: 800; }
        .landing-subtitle { font-size: 1.1rem; max-width: 540px; color: var(--text-secondary); line-height: 1.7; }
        .landing-cta-group { display: flex; flex-direction: column; align-items: center; }
        .landing-cta-btn { font-size: 1.05rem; padding: 16px 36px; animation: pulse-glow 3s infinite; }
        .landing-preview-card { background: var(--bg-glass); border: 1px solid var(--border-accent); border-radius: var(--radius-xl); padding: var(--space-lg); max-width: 360px; width: 100%; text-align: left; backdrop-filter: blur(16px); margin-top: var(--space-md); animation: fadeInUp 0.8s ease 0.2s both; }
        .landing-preview-line { height: 3px; background: var(--brand-gradient); border-radius: 2px; margin-bottom: var(--space-md); }
        .landing-preview-title { font-size: 1rem; font-weight: 700; color: var(--text-primary); margin-bottom: 4px; }
        .landing-preview-content { margin-bottom: var(--space-md); }
        .landing-preview-modules { display: flex; flex-direction: column; gap: 6px; }
        .landing-preview-module { display: flex; align-items: center; gap: var(--space-sm); }
        .landing-preview-module-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--brand-start); flex-shrink: 0; }
        .landing-features { display: flex; flex-direction: column; gap: var(--space-xl); }
        .landing-section-title { font-size: clamp(1.6rem, 4vw, 2.4rem); text-align: center; font-weight: 700; }
        .features-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(290px, 1fr)); gap: var(--space-lg); }
        .feature-card { padding: var(--space-lg); display: flex; flex-direction: column; gap: var(--space-sm); }
        .feature-icon { font-size: 1.5rem; }
        .feature-title { font-size: 1rem; font-weight: 700; color: var(--text-primary); }
        .feature-desc { font-size: 0.88rem; color: var(--text-secondary); line-height: 1.6; }
        .landing-bottom-cta { display: flex; flex-direction: column; align-items: center; gap: var(--space-xl); padding: var(--space-2xl); background: var(--bg-glass); border: 1px solid var(--border-accent); border-radius: var(--radius-xl); text-align: center; backdrop-filter: blur(16px); }
        @media (max-width: 600px) { .landing { padding: var(--space-lg); gap: var(--space-2xl); } }
      `}</style>
    </div>
  )
}
