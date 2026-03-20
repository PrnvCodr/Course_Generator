export default function HeadingBlock({ text }) {
  return (
    <div className="heading-block">
      <h2 className="lesson-heading">{text}</h2>
      <style>{`
        .heading-block { margin-top: var(--space-md); }
        .lesson-heading {
          font-size: 1.4rem;
          font-weight: 700;
          color: var(--text-primary);
          padding-bottom: 8px;
          border-bottom: 2px solid;
          border-image: var(--brand-gradient) 1;
          display: inline-block;
        }
      `}</style>
    </div>
  )
}
