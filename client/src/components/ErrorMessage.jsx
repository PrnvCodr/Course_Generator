export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="error-container animate-fade">
      <div className="error-icon">⚠</div>
      <div className="error-content">
        <h4 className="error-title">Something went wrong</h4>
        <p className="error-body">{message || 'An unexpected error occurred. Please try again.'}</p>
        {onRetry && (
          <button className="btn btn-secondary btn-sm" onClick={onRetry} style={{ marginTop: 12 }}>
            Try Again
          </button>
        )}
      </div>

      <style>{`
        .error-container {
          display: flex;
          align-items: flex-start;
          gap: var(--space-md);
          padding: var(--space-md) var(--space-lg);
          background: rgba(239, 68, 68, 0.08);
          border: 1px solid rgba(239, 68, 68, 0.25);
          border-radius: var(--radius-lg);
          margin: var(--space-lg) 0;
        }
        .error-icon {
          font-size: 1.5rem;
          line-height: 1;
          color: var(--error);
          flex-shrink: 0;
          margin-top: 2px;
        }
        .error-title {
          font-family: 'Inter', sans-serif;
          font-size: 0.95rem;
          font-weight: 600;
          color: #fca5a5;
          margin-bottom: 4px;
        }
        .error-body {
          font-size: 0.875rem;
          color: var(--text-secondary);
          line-height: 1.5;
        }
      `}</style>
    </div>
  )
}
