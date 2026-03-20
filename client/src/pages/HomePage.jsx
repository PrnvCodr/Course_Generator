import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import PromptForm from '../components/PromptForm'
import CourseCard from '../components/CourseCard'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
import { generateCourse, saveCourse, getCourses, deleteCourse } from '../utils/api'

export default function HomePage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [previewCourse, setPreviewCourse] = useState(null)
  const [savedCourses, setSavedCourses] = useState([])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      const res = await getCourses()
      setSavedCourses(res.data.courses || [])
    } catch { /* ignore */ }
  }

  const handleGenerate = async (topic) => {
    setLoading(true)
    setError(null)
    setPreviewCourse(null)
    try {
      const res = await generateCourse(topic)
      setPreviewCourse(res.data.course)
    } catch (err) {
      setError(err.response?.data?.error || err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!previewCourse) return
    setSaving(true)
    try {
      const res = await saveCourse(previewCourse)
      const saved = res.data.course
      setSavedCourses(prev => [saved, ...prev])
      setPreviewCourse(null)
      navigate(`/course/${saved._id}`)
    } catch (err) {
      setError(err.response?.data?.error || err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteCourse(id)
      setSavedCourses(prev => prev.filter(c => c._id !== id))
    } catch (err) {
      setError(err.response?.data?.error || err.message)
    }
  }

  return (
    <div className="page-container home-page">
      {/* Hero */}
      <div className="hero-section animate-fade-up">
        <div className="hero-badges">
          <span className="badge badge-pink">AI-Powered</span>
          <span className="badge badge-cyan">Free</span>
        </div>
        <h1 className="hero-title">
          Turn Any Topic Into a{' '}
          <span className="gradient-text">Complete Course</span>
        </h1>
        <p className="hero-sub">
          Type a subject — get structured modules, lessons, quizzes,
          videos, and more in seconds.
        </p>
      </div>

      {/* Prompt Form */}
      <div className="prompt-section animate-fade-up" style={{ animationDelay: '0.1s' }}>
        <PromptForm onGenerate={handleGenerate} loading={loading} />
      </div>

      {/* Loading state */}
      {loading && <LoadingSpinner message="Crafting your course with AI..." />}

      {/* Error */}
      {error && !loading && (
        <ErrorMessage message={error} onRetry={() => setError(null)} />
      )}

      {/* Preview Course */}
      {previewCourse && !loading && (
        <div className="preview-section animate-fade-up">
          <div className="preview-header">
            <div>
              <h2 className="preview-title">{previewCourse.title}</h2>
              <p className="text-secondary" style={{ marginTop: 8, fontSize: '0.9rem' }}>
                {previewCourse.description}
              </p>
            </div>
            <div className="preview-actions">
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? <><span className="spinner-inline" /> Saving...</> : 'Save and Open'}
              </button>
              <button className="btn btn-ghost" onClick={() => setPreviewCourse(null)}>Discard</button>
            </div>
          </div>
          <div className="preview-modules">
            {previewCourse.modules?.map((mod, i) => (
              <div key={i} className="preview-module">
                <div className="preview-module-header">
                  <span className="preview-module-num">{i + 1}</span>
                  <span className="preview-module-title">{mod.title}</span>
                  <span className="text-xs text-muted">{mod.lessons?.length} lessons</span>
                </div>
                <div className="preview-lessons">
                  {mod.lessons?.map((ls, j) => (
                    <div key={j} className="preview-lesson">
                      <span className="preview-lesson-dot" />
                      <span className="text-sm text-secondary">{typeof ls === 'string' ? ls : ls.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Saved Courses */}
      {savedCourses.length > 0 && (
        <div className="saved-section">
          <div className="section-header">
            <h2 className="section-title">Your Courses</h2>
            <span className="badge badge-pink">{savedCourses.length}</span>
          </div>
          <div className="courses-grid animate-stagger">
            {savedCourses.map(course => (
              <CourseCard key={course._id} course={course} onDelete={handleDelete} />
            ))}
          </div>
        </div>
      )}

      {savedCourses.length === 0 && !loading && !previewCourse && (
        <div className="empty-state animate-fade">
          <div className="empty-state-icon">✦</div>
          <h3 className="empty-state-title">No courses yet</h3>
          <p className="empty-state-text">Generate your first course from any topic using the form above.</p>
        </div>
      )}

      <style>{`
        .home-page { display: flex; flex-direction: column; gap: var(--space-2xl); }
        .hero-section { text-align: center; max-width: 760px; margin: 0 auto; display: flex; flex-direction: column; gap: var(--space-md); }
        .hero-badges { display: flex; justify-content: center; gap: var(--space-sm); }
        .hero-title { font-size: clamp(2rem, 5vw, 3.5rem); line-height: 1.1; }
        .hero-sub { color: var(--text-secondary); font-size: 1.1rem; max-width: 520px; margin: 0 auto; }
        .prompt-section { max-width: 760px; margin: 0 auto; width: 100%; }
        .preview-section { background: var(--bg-card); border: 1px solid var(--border-normal); border-radius: var(--radius-xl); overflow: hidden; }
        .preview-header { display: flex; justify-content: space-between; align-items: flex-start; gap: var(--space-lg); padding: var(--space-xl); border-bottom: 1px solid var(--border-subtle); flex-wrap: wrap; }
        .preview-title { font-size: 1.3rem; }
        .preview-actions { display: flex; gap: var(--space-sm); flex-shrink: 0; }
        .preview-modules { padding: var(--space-lg); display: flex; flex-direction: column; gap: var(--space-md); }
        .preview-module { background: var(--bg-elevated); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); overflow: hidden; }
        .preview-module-header { display: flex; align-items: center; gap: var(--space-md); padding: var(--space-md); border-bottom: 1px solid var(--border-subtle); }
        .preview-module-num { width: 24px; height: 24px; border-radius: 50%; background: var(--brand-gradient); display: flex; align-items: center; justify-content: center; font-size: 0.7rem; font-weight: 800; color: white; flex-shrink: 0; }
        .preview-module-title { font-size: 0.9rem; font-weight: 600; color: var(--text-primary); flex: 1; }
        .preview-lessons { padding: var(--space-md); display: flex; flex-direction: column; gap: 6px; }
        .preview-lesson { display: flex; align-items: center; gap: var(--space-sm); }
        .preview-lesson-dot { width: 5px; height: 5px; border-radius: 50%; background: rgba(247,37,133,0.5); flex-shrink: 0; }
        .saved-section { display: flex; flex-direction: column; gap: var(--space-lg); }
        .section-header { display: flex; align-items: center; gap: var(--space-sm); }
        .section-title { font-size: 1.4rem; font-weight: 700; }
        .empty-state { text-align: center; padding: var(--space-3xl) var(--space-2xl); display: flex; flex-direction: column; align-items: center; gap: var(--space-md); }
        .empty-state-icon { font-size: 2.5rem; background: var(--brand-gradient); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .empty-state-title { font-size: 1.2rem; color: var(--text-primary); }
        .empty-state-text { color: var(--text-secondary); max-width: 320px; }
      `}</style>
    </div>
  )
}
