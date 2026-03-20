import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import CourseCard from '../components/CourseCard'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
import { getCourses, deleteCourse } from '../utils/api'

export default function CoursesPage() {
  const navigate = useNavigate()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState(null)

  useEffect(() => {
    const fetch = async () => {
      setLoading(true)
      try {
        const res = await getCourses()
        setCourses(res.data.courses || [])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  const handleDelete = async (id) => {
    try {
      await deleteCourse(id)
      setCourses(prev => prev.filter(c => c._id !== id))
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="page-container">
      <div className="courses-page-header animate-fade-up">
        <div>
          <h1 className="gradient-text">My Courses</h1>
          <p className="text-secondary" style={{ marginTop: 8 }}>
            All courses you have generated and saved.
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/')}>
          Generate New Course
        </button>
      </div>

      {loading && <LoadingSpinner message="Loading your courses..." />}
      {error   && <ErrorMessage message={error} onRetry={() => setError(null)} />}

      {!loading && !error && courses.length === 0 && (
        <div className="empty-state animate-fade">
          <div className="empty-state-icon">✦</div>
          <h3 className="empty-state-title">No courses yet</h3>
          <p className="empty-state-text">
            Go to the home page to generate your first course.
          </p>
          <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => navigate('/')}>
            Generate a Course
          </button>
        </div>
      )}

      {!loading && courses.length > 0 && (
        <div className="courses-grid animate-stagger" style={{ marginTop: 24 }}>
          {courses.map(course => (
            <CourseCard key={course._id} course={course} onDelete={handleDelete} />
          ))}
        </div>
      )}

      <style>{`
        .courses-page-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: var(--space-lg);
          margin-bottom: var(--space-xl);
          flex-wrap: wrap;
        }
      `}</style>
    </div>
  )
}
