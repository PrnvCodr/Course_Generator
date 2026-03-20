export default function LoadingSpinner({ message = 'Generating your course...', inline = false }) {
  if (inline) return <span className="spinner-inline" aria-label="Loading" />

  return (
    <div className="loading-overlay">
      <div className="loading-card">
        <div className="loading-orb">
          <div className="loading-ring" />
          <div className="loading-ring ring-2" />
          <div className="loading-core">✦</div>
        </div>
        <h3 className="loading-title gradient-text">AI at Work</h3>
        <p className="loading-message">{message}</p>
        <div className="loading-dots"><span /><span /><span /></div>
      </div>

      <style>{`
        .loading-overlay { display: flex; align-items: center; justify-content: center; min-height: 400px; padding: var(--space-2xl); }
        .loading-card {
          display: flex; flex-direction: column; align-items: center; gap: var(--space-lg);
          padding: var(--space-2xl);
          background: var(--bg-glass);
          border: 1px solid var(--border-accent);
          border-radius: var(--radius-xl);
          backdrop-filter: blur(16px);
          text-align: center;
          animation: pulse-glow 2s infinite;
          max-width: 360px;
        }
        .loading-orb { position: relative; width: 80px; height: 80px; display: flex; align-items: center; justify-content: center; }
        .loading-ring {
          position: absolute; inset: 0;
          border: 2px solid transparent;
          border-top-color: #f72585;
          border-radius: 50%;
          animation: spin 1.2s linear infinite;
        }
        .ring-2 { inset: 10px; border-top-color: #4cc9f0; animation-duration: 0.8s; animation-direction: reverse; }
        .loading-core { font-size: 1.5rem; background: var(--brand-gradient); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .loading-title { font-size: 1.25rem; margin: 0; }
        .loading-message { color: var(--text-secondary); font-size: 0.9rem; max-width: 240px; }
        .loading-dots { display: flex; gap: 6px; }
        .loading-dots span { width: 6px; height: 6px; background: var(--brand-start); border-radius: 50%; animation: bounce 1.4s infinite; }
        .loading-dots span:nth-child(2) { animation-delay: 0.2s; }
        .loading-dots span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes bounce { 0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; } 40% { transform: scale(1.2); opacity: 1; } }
      `}</style>
    </div>
  )
}
