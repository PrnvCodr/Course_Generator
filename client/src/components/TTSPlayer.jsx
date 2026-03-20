import { useState } from 'react'
import { translateToHinglish } from '../utils/api'

export default function TTSPlayer({ content = [] }) {
  const [loading, setLoading] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [error, setError] = useState(null)

  const extractText = () =>
    content.filter(b => b.type === 'paragraph' || b.type === 'heading')
      .map(b => b.text).join('. ').substring(0, 1500)

  const handlePlay = async () => {
    if (playing) {
      window.speechSynthesis.cancel()
      setPlaying(false)
      return
    }
    setLoading(true)
    setError(null)
    try {
      const text = extractText()
      const res = await translateToHinglish(text)
      const hinglishText = res.data.hinglishText
      const utterance = new SpeechSynthesisUtterance(hinglishText)
      utterance.lang = 'hi-IN'
      utterance.rate = 0.9
      utterance.onend = () => setPlaying(false)
      utterance.onerror = () => { setPlaying(false); setError('Speech synthesis failed') }
      const voices = window.speechSynthesis.getVoices()
      const hindiVoice = voices.find(v => v.lang.startsWith('hi'))
      if (hindiVoice) utterance.voice = hindiVoice
      window.speechSynthesis.speak(utterance)
      setPlaying(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="tts-player">
      <button className="tts-btn" onClick={handlePlay} disabled={loading}>
        {loading ? (
          <><span className="spinner-inline" /> Translating...</>
        ) : playing ? (
          'Stop'
        ) : (
          'Listen in Hinglish'
        )}
      </button>
      {error && <span className="tts-error text-xs">{error}</span>}

      <style>{`
        .tts-player { display: flex; align-items: center; gap: var(--space-sm); }
        .tts-btn {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 7px 14px;
          background: rgba(114,9,183,0.12);
          border: 1px solid rgba(114,9,183,0.3);
          border-radius: var(--radius-full);
          color: #c77dff;
          font-size: 0.82rem; font-weight: 600;
          cursor: pointer; transition: all var(--transition-fast);
          font-family: 'Inter', sans-serif;
        }
        .tts-btn:hover:not(:disabled) { background: rgba(114,9,183,0.22); border-color: rgba(114,9,183,0.5); }
        .tts-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .tts-error { color: var(--error); }
      `}</style>
    </div>
  )
}
