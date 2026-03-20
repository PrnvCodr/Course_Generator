import { useState } from 'react'

export default function MCQBlock({ question, options = [], answer, explanation, index }) {
  const [selected, setSelected] = useState(null)
  const [revealed, setRevealed] = useState(false)

  return (
    <div className="mcq-block">
      <div className="mcq-header">
        <span className="mcq-badge">Quiz</span>
        <h4 className="mcq-question">{question}</h4>
      </div>

      <div className="mcq-options">
        {options.map((opt, i) => {
          let cls = 'mcq-option'
          if (selected === i && !revealed) cls += ' mcq-selected'
          if (revealed && i === answer)   cls += ' mcq-correct'
          if (revealed && selected === i && i !== answer) cls += ' mcq-wrong'
          return (
            <button key={i} className={cls} onClick={() => { if (!revealed) setSelected(i) }} disabled={revealed}>
              <span className="mcq-option-letter">{String.fromCharCode(65 + i)}</span>
              <span>{opt}</span>
              {revealed && i === answer     && <span className="mcq-result-tag correct">Correct</span>}
              {revealed && selected === i && i !== answer && <span className="mcq-result-tag wrong">Wrong</span>}
            </button>
          )
        })}
      </div>

      {selected !== null && !revealed && (
        <button className="btn btn-primary btn-sm" style={{ marginTop: 12 }} onClick={() => setRevealed(true)}>
          Check Answer
        </button>
      )}

      {revealed && explanation && (
        <div className="mcq-explanation animate-fade">
          <span className="mcq-explanation-label">Explanation</span>
          <p>{explanation}</p>
        </div>
      )}

      <style>{`
        .mcq-block { background: var(--bg-card); border: 1px solid var(--border-normal); border-radius: var(--radius-lg); padding: var(--space-lg); display: flex; flex-direction: column; gap: var(--space-md); }
        .mcq-header { display: flex; flex-direction: column; gap: 8px; }
        .mcq-badge { display: inline-flex; align-items: center; padding: 2px 10px; background: rgba(76,201,240,0.1); border: 1px solid rgba(76,201,240,0.2); border-radius: var(--radius-full); font-size: 0.7rem; font-weight: 700; color: #4cc9f0; text-transform: uppercase; letter-spacing: 0.06em; width: fit-content; }
        .mcq-question { font-size: 1rem; font-weight: 600; color: var(--text-primary); line-height: 1.5; }
        .mcq-options { display: flex; flex-direction: column; gap: 8px; }
        .mcq-option { display: flex; align-items: center; gap: var(--space-sm); padding: 10px var(--space-md); border-radius: var(--radius-md); background: var(--bg-elevated); border: 1px solid var(--border-subtle); cursor: pointer; text-align: left; color: var(--text-secondary); font-size: 0.9rem; transition: all var(--transition-fast); font-family: 'Inter', sans-serif; }
        .mcq-option:not(:disabled):hover { border-color: rgba(247,37,133,0.35); background: rgba(247,37,133,0.05); color: var(--text-primary); }
        .mcq-option:disabled { cursor: default; }
        .mcq-selected { border-color: var(--brand-start) !important; background: rgba(247,37,133,0.1) !important; color: #ff85c2 !important; }
        .mcq-correct  { border-color: var(--success) !important; background: rgba(6,214,160,0.08) !important; color: #06d6a0 !important; }
        .mcq-wrong    { border-color: var(--error) !important; background: rgba(239,35,60,0.08) !important; color: #ff6b7a !important; }
        .mcq-option-letter { width: 24px; height: 24px; border-radius: 50%; background: var(--bg-glass); border: 1px solid var(--border-subtle); display: flex; align-items: center; justify-content: center; font-size: 0.72rem; font-weight: 700; flex-shrink: 0; }
        .mcq-result-tag { margin-left: auto; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; }
        .mcq-result-tag.correct { color: var(--success); }
        .mcq-result-tag.wrong   { color: var(--error); }
        .mcq-explanation { display: flex; flex-direction: column; gap: 6px; padding: var(--space-md); background: rgba(76,201,240,0.05); border: 1px solid rgba(76,201,240,0.15); border-radius: var(--radius-md); }
        .mcq-explanation-label { font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #4cc9f0; }
        .mcq-explanation p { font-size: 0.88rem; color: var(--text-secondary); line-height: 1.6; }
      `}</style>
    </div>
  )
}
