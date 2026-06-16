import { Brain, Mail, Share2, Code2, Link2, MessageCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const PLATFORM_LINKS = [
  { name: 'Exam Generator', path: '/student' },
  { name: 'LogicGen Shuffler', path: '/student' },
  { name: 'SnapSolve AI', path: '/student' },
  { name: 'Studio-Q Papers', path: '/teacher' },
  { name: 'Vision-Grade OCR', path: '/teacher' },
  { name: 'Adaptive Testing', path: '/student' },
];

const COMPANY_LINKS = [
  { name: 'About Us', path: '/' },
  { name: 'Blog', path: '/' },
  { name: 'Careers', path: '/' },
  { name: 'Contact', path: '/' },
];

const LEGAL_LINKS = [
  { name: 'Privacy Policy',   path: '/privacy-policy'  },
  { name: 'Terms of Service', path: '/terms-conditions' },
  { name: 'Cookie Policy',    path: '/cookie-policy'   },
];

const SOCIALS = [
  { Icon: Share2,        href: '#', label: 'Twitter'   },
  { Icon: Link2,         href: '#', label: 'LinkedIn'  },
  { Icon: Code2,         href: '#', label: 'GitHub'    },
  { Icon: MessageCircle, href: '#', label: 'Discord'   },
  { Icon: Mail,          href: '#', label: 'Email'     },
];

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer style={{ background: 'var(--footer-bg)', borderTop: '1px solid var(--footer-border)' }}>

      {/* ── Main Footer Grid ── */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '4rem 1.5rem 2rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr 1fr',
          gap: '3rem',
        }} className="footer-grid">

          {/* Brand column */}
          <div>
            <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none', marginBottom: '1.1rem' }}>
              <div style={{
                width: 38, height: 38, borderRadius: 10,
                background: 'linear-gradient(135deg, #2354F4, #7C3AED)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 14px rgba(35,84,244,0.3)',
              }}>
                <Brain size={18} color="#fff" />
              </div>
              <span style={{
                fontSize: '1.2rem', fontWeight: 800,
                background: 'linear-gradient(135deg, #2354F4, #7C3AED)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>
                QuesGen
              </span>
            </Link>
            <p style={{
              color: 'var(--footer-text2)', fontSize: '0.85rem',
              lineHeight: 1.75, maxWidth: 280, marginBottom: '1.5rem',
            }}>
              {t('landing.footer.brandTagline')}
            </p>

            {/* Social links */}
            <div style={{ display: 'flex', gap: '0.55rem', flexWrap: 'wrap' }}>
              {SOCIALS.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  style={{
                    width: 36, height: 36, borderRadius: 9,
                    background: 'var(--bg2)', border: '1px solid var(--border)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--footer-text3)', textDecoration: 'none',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'rgba(35,84,244,0.1)';
                    e.currentTarget.style.borderColor = 'rgba(35,84,244,0.3)';
                    e.currentTarget.style.color = '#2354F4';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'var(--bg2)';
                    e.currentTarget.style.borderColor = 'var(--border)';
                    e.currentTarget.style.color = 'var(--footer-text3)';
                  }}
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Platform column */}
          <div>
            <h4 style={{
              color: 'var(--footer-logo-text)', fontWeight: 700,
              fontSize: '0.8rem', textTransform: 'uppercase',
              letterSpacing: '0.08em', marginBottom: '1rem',
            }}>
              {t('landing.footer.platform')}
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
              {PLATFORM_LINKS.map(item => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    style={{
                      color: 'var(--footer-text3)', textDecoration: 'none',
                      fontSize: '0.83rem', transition: 'color 0.18s ease',
                      display: 'flex', alignItems: 'center', gap: '0.3rem',
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = '#2354F4'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--footer-text3)'}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company column */}
          <div>
            <h4 style={{
              color: 'var(--footer-logo-text)', fontWeight: 700,
              fontSize: '0.8rem', textTransform: 'uppercase',
              letterSpacing: '0.08em', marginBottom: '1rem',
            }}>
              {t('landing.footer.company')}
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
              {COMPANY_LINKS.map(item => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    style={{
                      color: 'var(--footer-text3)', textDecoration: 'none',
                      fontSize: '0.83rem', transition: 'color 0.18s ease',
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = '#2354F4'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--footer-text3)'}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal + Newsletter column */}
          <div>
            <h4 style={{
              color: 'var(--footer-logo-text)', fontWeight: 700,
              fontSize: '0.8rem', textTransform: 'uppercase',
              letterSpacing: '0.08em', marginBottom: '1rem',
            }}>
              Legal
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
              {LEGAL_LINKS.map(item => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    style={{
                      color: 'var(--footer-text3)', textDecoration: 'none',
                      fontSize: '0.83rem', transition: 'color 0.18s ease',
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = '#2354F4'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--footer-text3)'}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Quick CTA */}
            <div style={{
              background: 'rgba(35,84,244,0.07)',
              border: '1px solid rgba(35,84,244,0.15)',
              borderRadius: 12, padding: '0.9rem',
            }}>
              <p style={{ fontSize: '0.78rem', color: 'var(--footer-text2)', marginBottom: '0.65rem', lineHeight: 1.5 }}>
                Start your AI exam prep journey today.
              </p>
              <Link
                to="/login"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                  fontSize: '0.78rem', fontWeight: 700, color: '#2354F4',
                  textDecoration: 'none',
                }}
                onMouseEnter={e => e.currentTarget.style.gap = '0.5rem'}
                onMouseLeave={e => e.currentTarget.style.gap = '0.35rem'}
              >
                Get Free Access <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div style={{
          borderTop: '1px solid var(--footer-border)',
          marginTop: '3rem', paddingTop: '1.5rem',
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem',
        }}>
          <p style={{ color: 'var(--footer-text3)', fontSize: '0.78rem' }}>
            {t('landing.footer.copyRight')}
          </p>
          <p style={{ color: 'var(--footer-text3)', fontSize: '0.78rem' }}>
            {t('landing.footer.madeWith')}
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; gap: 2rem !important; }
        }
        @media (max-width: 540px) {
          .footer-grid { grid-template-columns: 1fr !important; gap: 1.75rem !important; }
        }
      `}</style>
    </footer>
  );
}
