import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { useState } from 'react'

export default function CodeBlock({ language = 'javascript', code }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="code-block-wrapper">
      <div className="code-block-header">
        <div className="code-lang-badge">
          <span className="lang-dot" />
          {language}
        </div>
        <button className="copy-btn" onClick={handleCopy}>
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>
      <SyntaxHighlighter
        language={language}
        style={oneDark}
        customStyle={{
          margin: 0,
          borderRadius: '0 0 10px 10px',
          fontSize: '0.88rem',
          lineHeight: 1.6,
          background: '#0d1117',
          padding: '20px',
        }}
        showLineNumbers
        wrapLongLines
      >
        {code}
      </SyntaxHighlighter>

      <style>{`
        .code-block-wrapper {
          border-radius: var(--radius-md);
          overflow: hidden;
          border: 1px solid var(--border-subtle);
          box-shadow: var(--shadow-md);
        }
        .code-block-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 16px;
          background: #161b22;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .code-lang-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.78rem;
          color: var(--text-muted);
          font-family: 'JetBrains Mono', monospace;
          text-transform: lowercase;
        }
        .lang-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #6366f1;
        }
        .copy-btn {
          background: var(--bg-elevated);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          color: var(--text-muted);
          cursor: pointer;
          font-size: 0.75rem;
          padding: 3px 10px;
          transition: all var(--transition-fast);
          font-family: 'Inter', sans-serif;
        }
        .copy-btn:hover { color: var(--text-primary); border-color: var(--border-accent); }
      `}</style>
    </div>
  )
}
