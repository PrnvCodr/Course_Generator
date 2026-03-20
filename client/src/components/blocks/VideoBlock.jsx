import { useState, useEffect } from 'react'
import { getYouTubeVideo } from '../../utils/api'

export default function VideoBlock({ query }) {
  const [videoData, setVideoData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!query) { setLoading(false); return }
    const fetch = async () => {
      try {
        const res = await getYouTubeVideo(query)
        setVideoData(res.data)
      } catch {
        setVideoData({ fallback: true, searchUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}` })
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [query])

  return (
    <div className="video-block">
      <div className="video-block-header">
        <span className="video-icon">▶</span>
        <span className="video-label">Video Resource</span>
        {query && <span className="text-muted text-xs">"{query}"</span>}
      </div>

      {loading ? (
        <div className="video-placeholder skeleton" />
      ) : videoData?.embedUrl ? (
        <div className="video-iframe-wrap">
          <iframe
            src={videoData.embedUrl}
            title={videoData.title || query}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
          />
        </div>
      ) : (
        <a
          href={videoData?.searchUrl || `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="video-fallback"
        >
          <span className="video-fallback-icon">▶</span>
          <div>
            <p className="video-fallback-title">Search on YouTube</p>
            <p className="text-xs text-muted">{query}</p>
          </div>
          <span className="video-fallback-arrow">↗</span>
        </a>
      )}

      <style>{`
        .video-block {
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-lg);
          overflow: hidden;
          background: var(--bg-card);
        }
        .video-block-header {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          background: var(--bg-elevated);
          border-bottom: 1px solid var(--border-subtle);
        }
        .video-icon {
          color: #ef4444;
          font-size: 0.9rem;
        }
        .video-label {
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--text-secondary);
        }
        .video-placeholder {
          width: 100%;
          aspect-ratio: 16/9;
        }
        .video-iframe-wrap {
          position: relative;
          aspect-ratio: 16/9;
        }
        .video-iframe-wrap iframe {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
        }
        .video-fallback {
          display: flex;
          align-items: center;
          gap: var(--space-md);
          padding: var(--space-lg);
          text-decoration: none;
          transition: background var(--transition-fast);
        }
        .video-fallback:hover { background: var(--bg-elevated); }
        .video-fallback-icon {
          font-size: 1.5rem;
          width: 48px;
          height: 48px;
          background: #ef4444;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: white;
        }
        .video-fallback-title {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-primary);
        }
        .video-fallback-arrow {
          margin-left: auto;
          color: var(--text-muted);
          font-size: 1rem;
        }
      `}</style>
    </div>
  )
}
