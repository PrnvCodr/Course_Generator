import { useState } from 'react'

const EXAMPLE_PROMPTS = [
  'Introduction to Machine Learning',
  'JavaScript Promises and Async/Await',
  'Basics of Copyright Law',
  'Docker and Containerization',
  'React Hooks Deep Dive',
]

export default function PromptForm({ onGenerate, loading }) {
  const [topic, setTopic] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (topic.trim().length >= 3) onGenerate(topic.trim())
  }

  return (
    <div className="prompt-form-wrapper">
      <form className="prompt-form" onSubmit={handleSubmit}>
        <div className="prompt-textarea-wrap">
          <span className="prompt-star">✦</span>
          <textarea
            id="topic-input"
            className="input-field prompt-textarea"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter any learning topic... e.g. 'Introduction to Machine Learning'"
            rows={3}
            disabled={loading}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(e) }
            }}
          />
        </div>

        <div className="prompt-actions">
          <div className="prompt-hint text-sm text-muted">
            Press <kbd className="kbd">Enter</kbd> or click Generate
          </div>
          <button
            type="submit"
            id="generate-btn"
            className="btn btn-primary btn-lg"
            disabled={loading || topic.trim().length < 3}
          >
            {loading ? (
              <><span className="spinner-inline" /> Generating...</>
            ) : (
              'Generate Course'
            )}
          </button>
        </div>
      </form>

      <div className="example-prompts">
        <span className="text-xs text-muted" style={{ marginRight: 8 }}>Try:</span>
        {EXAMPLE_PROMPTS.map((p) => (
          <button key={p} className="example-chip" onClick={() => setTopic(p)} disabled={loading}>
            {p}
          </button>
        ))}
      </div>

      <style>{`
        .prompt-form-wrapper { display: flex; flex-direction: column; gap: var(--space-md); width: 100%; }
        .prompt-form {
          background: var(--bg-glass);
          border: 1px solid var(--border-normal);
          border-radius: var(--radius-xl);
          padding: var(--space-lg);
          backdrop-filter: blur(16px);
          display: flex; flex-direction: column; gap: var(--space-md);
          transition: border-color var(--transition-fast);
        }
        .prompt-form:focus-within {
          border-color: var(--border-accent);
          box-shadow: 0 0 0 3px rgba(247, 37, 133, 0.1);
        }
        .prompt-textarea-wrap { position: relative; display: flex; align-items: flex-start; gap: var(--space-sm); }
        .prompt-star {
          margin-top: 14px;
          font-size: 1rem;
          background: var(--brand-gradient);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          flex-shrink: 0;
        }
        .prompt-textarea {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
          font-size: 1rem;
          resize: none;
          min-height: 72px;
          padding: var(--space-sm) 0;
        }
        .prompt-textarea:focus { box-shadow: none !important; }
        .prompt-actions { display: flex; align-items: center; justify-content: space-between; gap: var(--space-md); }
        .kbd {
          display: inline-block;
          padding: 1px 6px;
          border: 1px solid var(--border-normal);
          border-radius: 4px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.7rem;
          color: var(--text-secondary);
          background: var(--bg-elevated);
        }
        .example-prompts { display: flex; flex-wrap: wrap; align-items: center; gap: var(--space-sm); }
        .example-chip {
          padding: 4px 12px;
          background: var(--bg-elevated);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-full);
          color: var(--text-secondary);
          font-size: 0.78rem;
          cursor: pointer;
          transition: all var(--transition-fast);
          font-family: 'Inter', sans-serif;
        }
        .example-chip:hover:not(:disabled) {
          border-color: rgba(247,37,133,0.4);
          color: #ff85c2;
          background: rgba(247,37,133,0.07);
        }
        .example-chip:disabled { opacity: 0.5; cursor: not-allowed; }
      `}</style>
    </div>
  )
}
