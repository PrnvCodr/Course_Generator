import { useNavigate } from 'react-router-dom'

export default function CourseCard({ course, onDelete }) {
  const navigate = useNavigate()
  const moduleCount = course.modules?.length || 0
  const lessonCount = course.modules?.reduce((acc, m) => acc + (m.lessons?.length || 0), 0) || 0

  return (
    <div className="course-card glass-card" onClick={() => navigate(`/course/${course._id}`)}>
      <div className="course-card-accent" />
      <div className="course-card-body">
        <div className="course-card-tags">
          {(course.tags || []).slice(0, 3).map((tag) => (
            <span key={tag} className="badge badge-purple">{tag}</span>
          ))}
        </div>
        <h3 className="course-card-title">{course.title}</h3>
        <p className="course-card-desc">
          {course.description?.substring(0, 120)}{course.description?.length > 120 ? '...' : ''}
        </p>
        <div className="course-card-stats">
          <span className="stat-item">{moduleCount} modules</span>
          <span className="stat-sep">·</span>
          <span className="stat-item">{lessonCount} lessons</span>
        </div>
      </div>
      <div className="course-card-footer">
        <button className="btn btn-primary btn-sm"
          onClick={(e) => { e.stopPropagation(); navigate(`/course/${course._id}`) }}>
          Start Learning
        </button>
        {onDelete && (
          <button className="btn btn-ghost btn-sm delete-btn"
            onClick={(e) => { e.stopPropagation(); onDelete(course._id) }}>
            Delete
          </button>
        )}
      </div>

      <style>{`
        .course-card { cursor: pointer; position: relative; overflow: hidden; display: flex; flex-direction: column; padding: 0; background: var(--bg-card); border: 1px solid var(--border-subtle); }
        .course-card-accent { height: 3px; background: var(--brand-gradient); }
        .course-card-body { padding: var(--space-lg); flex: 1; display: flex; flex-direction: column; gap: var(--space-sm); }
        .course-card-tags { display: flex; flex-wrap: wrap; gap: var(--space-xs); margin-bottom: var(--space-xs); }
        .course-card-title { font-size: 1.05rem; font-weight: 700; color: var(--text-primary); line-height: 1.3; }
        .course-card-desc { font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5; flex: 1; }
        .course-card-stats { display: flex; align-items: center; gap: 6px; margin-top: var(--space-sm); font-size: 0.8rem; color: var(--text-muted); font-weight: 500; }
        .stat-sep { color: var(--border-normal); }
        .course-card-footer { padding: var(--space-md) var(--space-lg); border-top: 1px solid var(--border-subtle); display: flex; justify-content: space-between; align-items: center; }
        .delete-btn { color: var(--error); }
        .delete-btn:hover { background: rgba(239,35,60,0.08); color: var(--error); }
      `}</style>
    </div>
  )
}
