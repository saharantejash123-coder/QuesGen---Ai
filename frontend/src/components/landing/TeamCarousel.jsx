/* Brand icons (lucide removed these for trademark reasons) — inline SVG instead. */
const IconLinkedin = (props) => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zM7.119 20.452H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
  </svg>
);
const IconGithub = (props) => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M12 .5C5.37.5 0 5.78 0 12.292c0 5.211 3.438 9.63 8.205 11.188.6.111.82-.254.82-.567 0-.28-.01-1.022-.015-2.005-3.338.711-4.042-1.582-4.042-1.582-.546-1.361-1.335-1.725-1.335-1.725-1.087-.731.084-.716.084-.716 1.205.082 1.838 1.215 1.838 1.215 1.07 1.797 2.809 1.278 3.495.977.108-.76.417-1.278.76-1.572-2.665-.295-5.466-1.309-5.466-5.827 0-1.287.465-2.339 1.235-3.164-.135-.298-.54-1.497.105-3.121 0 0 1.005-.31 3.3 1.209.96-.262 1.98-.392 3-.398 1.02.006 2.04.136 3 .398 2.28-1.519 3.285-1.209 3.285-1.209.645 1.624.24 2.823.12 3.121.765.825 1.23 1.877 1.23 3.164 0 4.53-2.805 5.527-5.475 5.817.42.354.81 1.077.81 2.182 0 1.578-.015 2.846-.015 3.229 0 .315.21.689.825.572C20.565 21.917 24 17.495 24 12.292 24 5.78 18.627.5 12 .5z" />
  </svg>
);

/* ── Edit this list with your real team (swap img URLs for real photos) ── */
const TEAM = [
  { name: 'Aarav Sharma',  title: 'Founder & AI Lead',     img: 'https://i.pravatar.cc/200?img=12', linkedin: '#', github: '#', c: '#2354F4' },
  { name: 'Priya Menon',   title: 'ML Research Engineer',  img: 'https://i.pravatar.cc/200?img=45', linkedin: '#', github: '#', c: '#7C3AED' },
  { name: 'Rohan Verma',   title: 'Full-Stack Engineer',   img: 'https://i.pravatar.cc/200?img=15', linkedin: '#', github: '#', c: '#059669' },
  { name: 'Sneha Iyer',    title: 'Product Designer',      img: 'https://i.pravatar.cc/200?img=32', linkedin: '#', github: '#', c: '#D97706' },
  { name: 'Kabir Singh',   title: 'Data Scientist',        img: 'https://i.pravatar.cc/200?img=51', linkedin: '#', github: '#', c: '#0891B2' },
  { name: 'Ananya Rao',    title: 'Backend Engineer',      img: 'https://i.pravatar.cc/200?img=20', linkedin: '#', github: '#', c: '#EC4899' },
  { name: 'Vikram Nair',   title: 'DevOps & Infra',        img: 'https://i.pravatar.cc/200?img=33', linkedin: '#', github: '#', c: '#6366F1' },
];

export default function TeamCarousel() {
  // Duplicate the list so the loop is seamless (track scrolls exactly one set width).
  const loop = [...TEAM, ...TEAM];

  return (
    <section className="tc-section">
      <div className="tc-head">
        <span className="tc-eyebrow"><span className="tc-dot" /> Our Team</span>
        <h2 className="tc-title">The minds behind <span className="tc-grad">QuesGen</span></h2>
        <p className="tc-sub">A small, focused team of engineers, designers, and researchers building India's smartest exam-prep AI.</p>
      </div>

      <div className="tc-marquee">
        <div className="tc-track">
          {loop.map((m, i) => (
            <article className="tc-card" key={i} aria-hidden={i >= TEAM.length ? 'true' : undefined}>
              <div className="tc-avatar-ring" style={{ background: `conic-gradient(from 180deg, ${m.c}, transparent 70%)` }}>
                <div className="tc-avatar" style={{ background: `linear-gradient(145deg, ${m.c}33, ${m.c}10)` }}>
                  <img src={m.img} alt={m.name} loading="lazy" draggable="false" />
                </div>
              </div>
              <h3 className="tc-name">{m.name}</h3>
              <p className="tc-role">{m.title}</p>
              <div className="tc-links">
                <a className="tc-link" href={m.linkedin} target="_blank" rel="noopener noreferrer" aria-label={`${m.name} on LinkedIn`} style={{ ['--lc']: '#0A66C2' }}>
                  <IconLinkedin />
                </a>
                <a className="tc-link" href={m.github} target="_blank" rel="noopener noreferrer" aria-label={`${m.name} on GitHub`} style={{ ['--lc']: 'var(--text)' }}>
                  <IconGithub />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>

      <style>{`
        .tc-section { padding: clamp(3.5rem, 7vw, 6rem) 0; background: var(--bg); overflow: hidden; }
        .tc-head { text-align: center; padding: 0 1.25rem; margin-bottom: clamp(2rem, 4vw, 3rem); }
        .tc-eyebrow {
          display: inline-flex; align-items: center; gap: 0.45rem;
          padding: 0.34rem 0.95rem; border-radius: 100px; margin-bottom: 1rem;
          font-size: 0.72rem; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: #2354F4;
          background: color-mix(in srgb, var(--card-bg) 60%, transparent);
          -webkit-backdrop-filter: blur(10px); backdrop-filter: blur(10px);
          border: 1px solid rgba(35,84,244,0.22);
        }
        .tc-dot { width: 6px; height: 6px; border-radius: 50%; background: linear-gradient(135deg,#2354F4,#7C3AED); }
        .tc-title { font-family: 'Instrument Serif', serif; font-size: clamp(1.9rem, 4.5vw, 3rem); line-height: 1.08; color: var(--text); letter-spacing: -0.5px; }
        .tc-grad { background: linear-gradient(135deg,#2354F4,#7C3AED); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; }
        .tc-sub { color: var(--text3); font-size: clamp(0.9rem, 1.4vw, 1.05rem); line-height: 1.7; max-width: 560px; margin: 0.8rem auto 0; }

        /* ── Marquee viewport ── */
        .tc-marquee {
          width: 100%; overflow: hidden;
          -webkit-mask-image: linear-gradient(90deg, transparent, #000 7%, #000 93%, transparent);
          mask-image: linear-gradient(90deg, transparent, #000 7%, #000 93%, transparent);
        }
        /* ── Scrolling track (two copies → animate to -50% for a seamless loop) ── */
        .tc-track {
          display: flex; width: max-content; gap: clamp(1rem, 2vw, 1.5rem);
          padding: 1rem 0.75rem;
          animation: tc-scroll 38s linear infinite;
          will-change: transform;
        }
        .tc-marquee:hover .tc-track { animation-play-state: paused; }
        @keyframes tc-scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }

        /* ── Card ── */
        .tc-card {
          flex: 0 0 auto;
          width: clamp(216px, 70vw, 248px);
          box-sizing: border-box;
          display: flex; flex-direction: column; align-items: center; text-align: center;
          padding: 1.75rem 1.4rem 1.5rem;
          background: var(--card-bg);
          border: 1px solid var(--border);
          border-radius: 22px;
          box-shadow: 0 12px 40px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.12);
          transition: transform .3s ease, box-shadow .3s ease, border-color .3s ease;
        }
        .tc-card:hover {
          transform: translateY(-6px);
          border-color: color-mix(in srgb, #2354F4 35%, var(--border));
          box-shadow: 0 22px 56px rgba(35,84,244,0.16), inset 0 1px 0 rgba(255,255,255,0.16);
        }

        .tc-avatar-ring {
          width: 92px; height: 92px; border-radius: 50%; padding: 3px;
          margin-bottom: 1rem; flex-shrink: 0;
        }
        .tc-avatar {
          width: 100%; height: 100%; border-radius: 50%; overflow: hidden;
          border: 3px solid var(--card-bg);
          display: flex; align-items: center; justify-content: center;
        }
        .tc-avatar img { width: 100%; height: 100%; object-fit: cover; display: block; }

        .tc-name { font-weight: 800; font-size: 1.02rem; color: var(--text); letter-spacing: -0.01em; margin-bottom: 0.2rem; }
        .tc-role { font-size: 0.8rem; color: var(--text3); font-weight: 500; margin-bottom: 1rem; }

        .tc-links { display: flex; gap: 0.6rem; }
        .tc-link {
          width: 36px; height: 36px; border-radius: 11px;
          display: flex; align-items: center; justify-content: center;
          color: var(--text2); background: var(--bg3); border: 1px solid var(--border);
          transition: all .2s ease; text-decoration: none;
        }
        .tc-link:hover { color: #fff; background: var(--lc); border-color: var(--lc); transform: translateY(-2px); }

        @media (prefers-reduced-motion: reduce) {
          .tc-track { animation: none; }
        }
      `}</style>
    </section>
  );
}
