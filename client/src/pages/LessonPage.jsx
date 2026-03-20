import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import LessonRenderer from '../components/LessonRenderer'
import LessonPDFExporter from '../components/LessonPDFExporter'
import TTSPlayer from '../components/TTSPlayer'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
import { getCourseById, generateLesson, updateLesson } from '../utils/api'

export default function LessonPage() {
  const { courseId, moduleIndex, lessonIndex } = useParams()
  const navigate = useNavigate()

  const [course, setCourse] = useState(null)
  const [lesson, setLesson] = useState(null)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  const mi = parseInt(moduleIndex)
  const li = parseInt(lessonIndex)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await getCourseById(courseId)
        const c = res.data.course
        setCourse(c)
        const mod = c.modules?.[mi]
        const ls = mod?.lessons?.[li]
        if (!ls) throw new Error('Lesson not found')
        if (!ls.content || ls.content.length === 0) {
          await doGenerate(c, mod, ls)
        } else {
          setLesson(ls)
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [courseId, moduleIndex, lessonIndex])

  const doGenerate = async (c, mod, ls) => {
    setGenerating(true)
    try {
      const res = await generateLesson(c.title, mod.title, ls.title)
      const generated = res.data.lesson
      setLesson({ ...generated, _id: ls._id })
      if (ls._id) await updateLesson(ls._id, { content: generated.content, objectives: generated.objectives })
    } catch (err) {
      setError(err.message)
    } finally {
      setGenerating(false)
    }
  }

  const regenerate = async () => {
    if (!course) return
    const mod = course.modules?.[mi]
    const ls = mod?.lessons?.[li]
    if (!mod || !ls) return
    setLesson(null)
    await doGenerate(course, mod, ls)
  }

  const mod = course?.modules?.[mi]
  const totalLessons = mod?.lessons?.length || 0
  const prevLesson = li > 0 ? `/course/${courseId}/module/${mi}/lesson/${li - 1}` : null
  const nextLesson = li < totalLessons - 1 ? `/course/${courseId}/module/${mi}/lesson/${li + 1}` : null
  const nextModule = mi < (course?.modules?.length || 0) - 1 ? `/course/${courseId}/module/${mi + 1}/lesson/0` : null

  if (loading || generating) {
    return <div className="page-container"><LoadingSpinner message={generating ? 'Generating lesson content with AI...' : 'Loading lesson...'} /></div>
  }

  if (error) return <div className="page-container"><ErrorMessage message={error} onRetry={regenerate} /></div>
  if (!lesson) return null

  return (
    <div className="lesson-page">
      <aside className="lesson-sidebar">
        <div className="lesson-sidebar-inner">
          <Link to={`/course/${courseId}`} className="lesson-back-link">← Back to Course</Link>
          <div className="lesson-sidebar-module">
            <span className="text-xs text-muted">Module {mi + 1}</span>
            <p className="lesson-sidebar-module-title">{mod?.title}</p>
          </div>
          <nav className="lesson-sidebar-nav">
            {(mod?.lessons || []).map((l, i) => (
              <Link key={i} to={`/course/${courseId}/module/${mi}/lesson/${i}`}
                className={`lesson-sidebar-item ${i === li ? 'active' : ''}`}>
                <span className="lesson-sidebar-num">{i + 1}</span>
                <span className="lesson-sidebar-title truncate">{l.title}</span>
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      <main className="lesson-main page-container">
        <nav className="breadcrumb animate-fade">
          <Link to="/">Home</Link>
          <span>›</span>
          <Link to={`/course/${courseId}`}>{course?.title}</Link>
          <span>›</span>
          <span>{lesson.title}</span>
        </nav>

        <header className="lesson-header animate-fade-up">
          <div className="lesson-meta">
            <span className="badge badge-purple">Module {mi + 1}</span>
            <span className="badge badge-cyan">Lesson {li + 1}</span>
          </div>
          <h1 className="lesson-title">{lesson.title}</h1>
          <div className="lesson-actions">
            <TTSPlayer content={lesson.content || []} />
            <LessonPDFExporter lesson={lesson} content={lesson.content || []} />
            <button className="btn btn-ghost btn-sm" onClick={regenerate}>Regenerate</button>
          </div>
        </header>

        {lesson.objectives?.length > 0 && (
          <div className="objectives-banner animate-fade-up">
            <div className="objectives-header">
              <span className="objectives-label">Learning Objectives</span>
            </div>
            <ul className="objectives-list">
              {lesson.objectives.map((obj, i) => (
                <li key={i} className="objective-item">
                  <span className="objective-check">+</span>
                  {obj}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="lesson-content animate-fade">
          <LessonRenderer content={lesson.content || []} />
        </div>

        <div className="lesson-nav-footer">
          {prevLesson ? (
            <Link className="btn btn-secondary" to={prevLesson}>← Previous</Link>
          ) : <div />}
          {nextLesson ? (
            <Link className="btn btn-primary" to={nextLesson}>Next Lesson →</Link>
          ) : nextModule ? (
            <Link className="btn btn-primary" to={nextModule}>Next Module →</Link>
          ) : (
            <Link className="btn btn-primary" to={`/course/${courseId}`}>Course Complete →</Link>
          )}
        </div>
      </main>

      <style>{`
        .lesson-page { display: flex; min-height: 100vh; width: 100%; }
        .lesson-sidebar { width: 280px; flex-shrink: 0; border-right: 1px solid var(--border-subtle); background: var(--bg-surface); position: sticky; top: 0; height: 100vh; overflow-y: auto; }
        .lesson-sidebar-inner { padding: var(--space-lg); display: flex; flex-direction: column; gap: var(--space-md); }
        .lesson-back-link { font-size: 0.85rem; color: var(--text-secondary); }
        .lesson-back-link:hover { color: #ff85c2; }
        .lesson-sidebar-module { padding: var(--space-sm); background: var(--bg-elevated); border-radius: var(--radius-md); border: 1px solid var(--border-subtle); }
        .lesson-sidebar-module-title { font-size: 0.875rem; font-weight: 600; color: var(--text-primary); margin-top: 4px; }
        .lesson-sidebar-nav { display: flex; flex-direction: column; gap: 2px; }
        .lesson-sidebar-item { display: flex; align-items: center; gap: var(--space-sm); padding: 8px var(--space-sm); border-radius: var(--radius-md); text-decoration: none; color: var(--text-secondary); font-size: 0.82rem; transition: all var(--transition-fast); }
        .lesson-sidebar-item:hover { background: var(--bg-elevated); color: var(--text-primary); }
        .lesson-sidebar-item.active { background: rgba(247,37,133,0.1); color: #ff85c2; border: 1px solid rgba(247,37,133,0.2); }
        .lesson-sidebar-num { width: 20px; height: 20px; border-radius: 50%; background: var(--bg-glass); border: 1px solid var(--border-subtle); display: flex; align-items: center; justify-content: center; font-size: 0.65rem; font-weight: 700; flex-shrink: 0; }
        .lesson-sidebar-title { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .lesson-main { flex: 1; min-width: 0; max-width: 860px; }
        .lesson-header { margin-bottom: var(--space-xl); }
        .lesson-meta { display: flex; gap: var(--space-sm); margin-bottom: var(--space-sm); }
        .lesson-title { font-size: clamp(1.5rem, 3vw, 2.25rem); line-height: 1.2; margin-bottom: var(--space-md); }
        .lesson-actions { display: flex; align-items: center; gap: var(--space-sm); flex-wrap: wrap; }
        .objectives-banner { background: rgba(247,37,133,0.05); border: 1px solid rgba(247,37,133,0.2); border-radius: var(--radius-lg); padding: var(--space-lg); margin-bottom: var(--space-xl); }
        .objectives-header { margin-bottom: var(--space-md); }
        .objectives-label { font-size: 0.78rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.07em; color: #ff85c2; }
        .objectives-list { list-style: none; display: flex; flex-direction: column; gap: 8px; }
        .objective-item { display: flex; align-items: center; gap: var(--space-sm); font-size: 0.9rem; color: var(--text-secondary); }
        .objective-check { color: var(--brand-start); font-weight: 700; flex-shrink: 0; }
        .lesson-content { margin-bottom: var(--space-2xl); }
        .lesson-nav-footer { display: flex; justify-content: space-between; align-items: center; padding: var(--space-xl) 0; border-top: 1px solid var(--border-subtle); gap: var(--space-md); }
        .breadcrumb { display: flex; align-items: center; gap: 6px; font-size: 0.82rem; color: var(--text-muted); margin-bottom: var(--space-xl); flex-wrap: wrap; }
        .breadcrumb a { color: var(--text-secondary); }
        .breadcrumb a:hover { color: #ff85c2; }
        @media (max-width: 900px) { .lesson-sidebar { display: none; } .lesson-main { max-width: 100%; } }
      `}</style>
    </div>
  )
}
