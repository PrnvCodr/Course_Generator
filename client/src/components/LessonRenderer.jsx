import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import HeadingBlock from './blocks/HeadingBlock'
import ParagraphBlock from './blocks/ParagraphBlock'
import CodeBlock from './blocks/CodeBlock'
import VideoBlock from './blocks/VideoBlock'
import MCQBlock from './blocks/MCQBlock'

export default function LessonRenderer({ content = [] }) {
  if (!content.length) {
    return (
      <div className="lesson-empty">
        <p className="text-secondary">No content available for this lesson yet.</p>
      </div>
    )
  }

  return (
    <div className="lesson-renderer">
      {content.map((block, i) => {
        switch (block.type) {
          case 'heading':
            return <HeadingBlock key={i} text={block.text} />
          case 'paragraph':
            return <ParagraphBlock key={i} text={block.text} />
          case 'code':
            return <CodeBlock key={i} language={block.language} code={block.text} />
          case 'video':
            return <VideoBlock key={i} query={block.query || block.url} />
          case 'mcq':
            return <MCQBlock key={i} question={block.question} options={block.options} answer={block.answer} explanation={block.explanation} index={i} />
          default:
            return null
        }
      })}

      <style>{`
        .lesson-renderer {
          display: flex;
          flex-direction: column;
          gap: var(--space-lg);
        }
        .lesson-empty {
          padding: var(--space-2xl);
          text-align: center;
        }
      `}</style>
    </div>
  )
}
