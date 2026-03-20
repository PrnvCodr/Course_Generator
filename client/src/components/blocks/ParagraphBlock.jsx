export default function ParagraphBlock({ text }) {
  return (
    <p className="paragraph-block">
      {text}
      <style>{`
        .paragraph-block {
          font-size: 1rem;
          line-height: 1.8;
          color: var(--text-secondary);
        }
      `}</style>
    </p>
  )
}
