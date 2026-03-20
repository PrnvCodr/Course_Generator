import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import ErrorMessage from '../components/ErrorMessage'
import LoadingSpinner from '../components/LoadingSpinner'
import { getCourseById } from '../utils/api'

export default function CoursePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [expandedModules, setExpandedModules] = useState({})

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getCourseById(id)
        setCourse(res.data.course)
        // Expand first module by default
        if (res.data.course.modules?.length > 0) {
          setExpandedModules({ 0: true })
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [id])

  const toggleModule = (i) => setExpandedModules(prev => ({ ...prev, [i]: !prev[i] }))

  if (loading) return <div className="page-container"><LoadingSpinner message="Loading course..." /></div>
  if (error) return <div className="page-container"><ErrorMessage message={error} /></div>
  if (!course) return null

  const totalLessons = course.modules?.reduce((a, m) => a + (m.lessons?.length || 0), 0) || 0

  return (
    <div className="page-container">
      {/* Breadcrumb */}
      <nav className="breadcrumb animate-fade">
        <Link to="/">Home</Link>
        <span className="breadcrumb-sep">›</span>
        <span>{course.title}</span>
      </nav>

      {/* Course Header */}
      <header className="course-header animate-fade-up">
        <div className="course-header-content">
          <div className="course-header-tags">
            {course.tags?.map(t => <span key={t} className="badge badge-purple">{t}</span>)}
          </div>
          <h1 className="course-header-title">{course.title}</h1>
          <p className="course-header-desc">{course.description}</p>
          <div className="course-header-stats">
            <div className="stat-pill">
              <span>◫</span>
              <strong>{course.modules?.length}</strong> Modules
            </div>
            <div className="stat-pill">
              <span>◎</span>
              <strong>{totalLessons}</strong> Lessons
            </div>
            <div className="stat-pill">
              <span>⚡</span>
              AI Generated
            </div>
          </div>
        </div>
        <div className="course-header-cta">
          {course.modules?.[0]?.lessons?.[0] && (
            <button
              className="btn btn-primary btn-lg"
              onClick={() => navigate(`/course/${id}/module/0/lesson/0`)}
            >
              Start Learning →
            </button>
          )}
        </div>
      </header>

      <div className="divider" />

      {/* Modules Accordion */}
      <section className="modules-section animate-stagger">
        <h2 className="modules-section-title">Course Curriculum</h2>
        {course.modules?.map((mod, mi) => (
          <div key={mod._id || mi} className="module-accordion glass-card">
            <button
              className="module-accordion-header"
              onClick={() => toggleModule(mi)}
              aria-expanded={!!expandedModules[mi]}
            >
              <div className="module-accordion-left">
                <span className="module-index-badge">M{mi + 1}</span>
                <div>
                  <h3 className="module-accordion-title">{mod.title}</h3>
                  <span className="text-xs text-muted">{mod.lessons?.length || 0} lessons</span>
                </div>
              </div>
              <span className={`accordion-chevron ${expandedModules[mi] ? 'open' : ''}`}>›</span>
            </button>

            {expandedModules[mi] && (
              <ul className="lessons-list animate-fade">
                {(mod.lessons || []).map((lesson, li) => (
                  <li key={lesson._id || li}>
                    <Link
                      to={`/course/${id}/module/${mi}/lesson/${li}`}
                      className="lesson-link"
                    >
                      <span className="lesson-link-num">{li + 1}</span>
                      <span className="lesson-link-title">{lesson.title}</span>
                      <span className="lesson-link-arrow">→</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </section>

      <style>{`
        .breadcrumb {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.85rem;
          color: var(--text-muted);
          margin-bottom: var(--space-xl);
        }
        .breadcrumb a { color: var(--text-secondary); }
        .breadcrumb a:hover { color: var(--text-accent); }
        .breadcrumb-sep { color: var(--text-muted); }
        .course-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: var(--space-xl);
          flex-wrap: wrap;
          margin-bottom: var(--space-xl);
        }
        .course-header-content { flex: 1; min-width: 280px; }
        .course-header-tags {
          display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: var(--space-sm);
        }
        .course-header-title {
          font-size: clamp(1.5rem, 3vw, 2.5rem);
          margin-bottom: var(--space-sm);
        }
        .course-header-desc {
          font-size: 1rem;
          color: var(--text-secondary);
          line-height: 1.7;
          max-width: 600px;
          margin-bottom: var(--space-lg);
        }
        .course-header-stats {
          display: flex; gap: var(--space-sm); flex-wrap: wrap;
        }
        .stat-pill {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          background: var(--bg-elevated);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-full);
          font-size: 0.82rem;
          color: var(--text-secondary);
        }
        .stat-pill strong { color: var(--text-primary); }
        .course-header-cta { padding-top: var(--space-sm); }
        .modules-section-title {
          font-size: 1.3rem;
          margin-bottom: var(--space-md);
        }
        .modules-section {
          display: flex;
          flex-direction: column;
          gap: var(--space-sm);
        }
        .module-accordion {
          overflow: hidden;
        }
        .module-accordion-header {
          width: 100%;
          background: transparent;
          border: none;
          cursor: pointer;
          padding: var(--space-md) var(--space-lg);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--space-md);
          color: var(--text-primary);
          text-align: left;
          transition: background var(--transition-fast);
        }
        .module-accordion-header:hover { background: var(--bg-elevated); }
        .module-accordion-left {
          display: flex; align-items: center; gap: var(--space-md);
        }
        .module-index-badge {
          width: 36px;
          height: 36px;
          background: var(--brand-gradient);
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.78rem;
          font-weight: 700;
          color: white;
          flex-shrink: 0;
        }
        .module-accordion-title {
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 2px;
        }
        .accordion-chevron {
          font-size: 1.3rem;
          color: var(--text-muted);
          transition: transform var(--transition-fast);
          line-height: 1;
        }
        .accordion-chevron.open { transform: rotate(90deg); }
        .lessons-list {
          list-style: none;
          border-top: 1px solid var(--border-subtle);
          padding: var(--space-sm) 0;
        }
        .lesson-link {
          display: flex;
          align-items: center;
          gap: var(--space-md);
          padding: 10px var(--space-lg);
          color: var(--text-secondary);
          text-decoration: none;
          transition: all var(--transition-fast);
          font-size: 0.9rem;
        }
        .lesson-link:hover {
          background: rgba(99,102,241,0.06);
          color: var(--text-accent);
          padding-left: calc(var(--space-lg) + 4px);
        }
        .lesson-link-num {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: var(--bg-elevated);
          border: 1px solid var(--border-subtle);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.7rem;
          font-weight: 600;
          flex-shrink: 0;
        }
        .lesson-link-title { flex: 1; }
        .lesson-link-arrow {
          opacity: 0;
          transition: opacity var(--transition-fast);
          font-size: 0.9rem;
        }
        .lesson-link:hover .lesson-link-arrow { opacity: 1; }
      `}</style>
    </div>
  )
}
