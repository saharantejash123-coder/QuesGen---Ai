/**
 * 3D tilt card (re-themed blue/purple). CSS lives in index.css (.tcw*).
 * props: { title, text, Icon?, accent?, accent2?, actionLabel?, onAction? }
 */
export default function TiltCard({ title, text, Icon, emoji, accent = '#2354F4', accent2 = '#7C3AED', actionLabel = 'View more', onAction }) {
  return (
    <div className="tcw">
      <div className="tcw-card" style={{ ['--a']: accent, ['--a2']: accent2 }}>
        <div className="tcw-logo">
          <span className="tcw-circle tcw-c1" />
          <span className="tcw-circle tcw-c2" />
          <span className="tcw-circle tcw-c3" />
          <span className="tcw-circle tcw-c4" />
          <span className="tcw-circle tcw-c5">
            {Icon ? <Icon size={20} color="#fff" strokeWidth={2.2} /> : emoji ? <span style={{ fontSize: 20, lineHeight: 1 }}>{emoji}</span> : null}
          </span>
        </div>
        <div className="tcw-glass" />
        <div className="tcw-content">
          <span className="tcw-title">{title}</span>
          <span className="tcw-text">{text}</span>
        </div>
        <div className="tcw-bottom">
          <div className="tcw-view">
            <button className="tcw-view-btn" type="button" onClick={onAction}>{actionLabel}</button>
            <svg className="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
              <path d="m6 9 6 6 6-6" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
