import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Cookie, Settings, BarChart2, Shield, Globe, ToggleLeft, Mail } from 'lucide-react';

const sections = [
  {
    icon: Cookie,
    title: '1. What Are Cookies?',
    content: [
      {
        text: 'Cookies are small text files that are placed on your device (computer, smartphone, or tablet) when you visit a website. They are widely used to make websites work more efficiently, remember your preferences, and provide information to the site owners about how the site is being used.',
      },
      {
        text: 'Cookies set by QuesGen are called "first-party cookies." Cookies set by parties other than QuesGen are called "third-party cookies." Third-party cookies enable third-party features or functionality to be provided on or through a website (e.g., analytics, advertising).',
      },
    ],
  },
  {
    icon: Settings,
    title: '2. Types of Cookies We Use',
    content: [
      {
        subtitle: 'Strictly Necessary Cookies',
        text: 'These cookies are essential for the QuesGen platform to function properly. They enable core functionality such as secure login sessions, account authentication, and access to protected areas. Without these cookies, services you have asked for cannot be provided. These cookies do not store any personally identifiable information beyond what is necessary for the session.',
      },
      {
        subtitle: 'Functional Cookies',
        text: 'These cookies allow our platform to remember choices you make and provide enhanced, personalised features. We use them to store your preferences such as language selection (Hindi or English), dark/light theme setting, and display preferences. These cookies are stored in your browser\'s localStorage under keys like "appLanguage" and "questra-theme".',
      },
      {
        subtitle: 'Session & Authentication Cookies',
        text: 'When you log in to QuesGen, we store your session information locally in your browser (localStorage) under the keys "questra_user" and "questra_token". This allows you to remain logged in across browser sessions without re-entering your credentials. These entries are cleared when you click "Sign Out".',
      },
      {
        subtitle: 'Performance & Analytics Cookies',
        text: 'We may use analytics cookies to understand how visitors interact with our platform — such as which pages are visited most frequently, time spent on each section, and how users navigate between features. This data is aggregated and anonymised, and helps us improve the overall experience.',
      },
    ],
  },
  {
    icon: Globe,
    title: '3. Third-Party Cookies & Services',
    content: [
      {
        subtitle: 'Google OAuth',
        text: 'QuesGen offers sign-in via Google (Google OAuth 2.0). When you use this feature, Google may set its own cookies on your device to authenticate your identity. These cookies are governed by Google\'s Privacy Policy. We use Google Client ID: 462752093792 for OAuth integration.',
      },
      {
        subtitle: 'Google Fonts & CDN',
        text: 'Our platform loads fonts (DM Sans, Instrument Serif) from Google Fonts. When your browser requests these fonts, Google may log your IP address. This is governed by Google\'s Privacy Policy.',
      },
      {
        subtitle: 'AI & Backend Services',
        text: 'When you use AI-powered features (question generation, adaptive testing, paper analysis), requests are processed through our backend APIs. These services may use session tokens to authenticate requests but do not set additional browser cookies.',
      },
    ],
  },
  {
    icon: BarChart2,
    title: '4. What We Store Locally',
    content: [
      {
        text: 'QuesGen uses browser localStorage (not traditional HTTP cookies) for most of its persistent data. Here is a summary of what is stored:',
      },
      {
        subtitle: 'questra_user',
        text: 'Your full account profile including name, email, role, and school information. Stored as JSON. Cleared on Sign Out.',
      },
      {
        subtitle: 'questra_token',
        text: 'A local session identifier used to verify your authentication status. Cleared on Sign Out.',
      },
      {
        subtitle: 'questra_bans',
        text: 'Local ban status information used to enforce platform moderation decisions offline.',
      },
      {
        subtitle: 'appLanguage',
        text: 'Your selected interface language (English or Hindi). Persists until changed.',
      },
      {
        subtitle: 'questra-theme',
        text: 'Your selected visual theme (light or dark mode). Persists until changed.',
      },
    ],
  },
  {
    icon: ToggleLeft,
    title: '5. Managing & Controlling Cookies',
    content: [
      {
        subtitle: 'Browser Settings',
        text: 'Most web browsers allow you to control cookies through their settings preferences. You can set your browser to refuse cookies, delete existing cookies, or notify you when cookies are set. However, please note that blocking strictly necessary cookies may impact your ability to use the QuesGen platform, including staying logged in.',
      },
      {
        subtitle: 'Clearing Local Storage',
        text: 'You can clear all QuesGen local data (effectively "logging out" and resetting preferences) by using your browser\'s Developer Tools → Application → Local Storage → Clear all items for quesgen.com, or by clicking "Sign Out" within the platform.',
      },
      {
        subtitle: 'Opting Out of Analytics',
        text: 'If we implement third-party analytics, you can opt out by adjusting your browser\'s cookie preferences or using browser extensions such as uBlock Origin or Privacy Badger.',
      },
    ],
  },
  {
    icon: Shield,
    title: '6. Cookie Security',
    content: [
      {
        text: 'We take the security of your data seriously. Session and authentication data stored in localStorage is protected from cross-site scripting (XSS) attacks through our Content Security Policy headers. We do not transmit sensitive cookie data over unencrypted connections.',
      },
      {
        text: 'We recommend keeping your browser updated to the latest version to ensure you benefit from the most recent security improvements related to cookie and localStorage handling.',
      },
    ],
  },
  {
    icon: Globe,
    title: '7. Changes to This Cookie Policy',
    content: [
      {
        text: 'We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. When we make significant changes, we will notify you by updating the "Last Updated" date at the top of this page. We encourage you to review this policy periodically.',
      },
      {
        text: 'Continued use of the QuesGen platform after any changes to this Cookie Policy will be deemed as your acceptance of those changes.',
      },
    ],
  },
  {
    icon: Mail,
    title: '8. Contact Us',
    content: [
      {
        text: 'If you have any questions about our use of cookies or other local storage technologies, please contact us:',
      },
      {
        subtitle: 'Email',
        text: 'privacy@quesgen.com',
      },
      {
        subtitle: 'Address',
        text: 'QuesGen AI Platform, India',
      },
    ],
  },
];

export default function CookiePolicyPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)' }}>
      {/* ── Header ── */}
      <div style={{
        background: 'linear-gradient(135deg, #2354F4 0%, #7C3AED 100%)',
        padding: '5rem 1.5rem 4rem',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div aria-hidden style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }} />
        <div style={{ maxWidth: 800, margin: '0 auto', position: 'relative' }}>
          <Link
            to="/"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.45rem',
              color: 'rgba(255,255,255,0.8)', textDecoration: 'none',
              fontSize: '0.85rem', fontWeight: 600, marginBottom: '2rem',
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#fff'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.8)'}
          >
            <ArrowLeft size={16} /> Back to Home
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.2rem' }}>
            <div style={{
              width: 52, height: 52, borderRadius: 16,
              background: 'rgba(255,255,255,0.15)',
              border: '1px solid rgba(255,255,255,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Cookie size={26} color="#fff" />
            </div>
            <div>
              <span style={{
                fontSize: '0.72rem', fontWeight: 700, letterSpacing: '2px',
                textTransform: 'uppercase', color: 'rgba(255,255,255,0.65)',
              }}>
                Legal
              </span>
              <h1 style={{
                fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 900,
                color: '#fff', lineHeight: 1.1, letterSpacing: '-0.02em', margin: 0,
              }}>
                Cookie Policy
              </h1>
            </div>
          </div>

          <p style={{
            fontSize: '1.05rem', color: 'rgba(255,255,255,0.8)',
            lineHeight: 1.75, maxWidth: 560, marginBottom: '1.5rem',
          }}>
            This policy explains how QuesGen uses cookies and similar local storage technologies when you use our platform.
          </p>

          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: 8, padding: '0.45rem 0.9rem',
            fontSize: '0.8rem', color: 'rgba(255,255,255,0.85)', fontWeight: 500,
          }}>
            <Shield size={13} />
            Last Updated: June 16, 2026
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '3.5rem 1.5rem 5rem' }}>

        {/* Quick navigation */}
        <div style={{
          background: 'var(--card-bg)', border: '1px solid var(--border)',
          borderRadius: 18, padding: '1.4rem 1.6rem', marginBottom: '3rem',
        }}>
          <p style={{ fontSize: '0.72rem', fontWeight: 800, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: '0.9rem' }}>
            On This Page
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {sections.map(s => (
              <span key={s.title} style={{
                fontSize: '0.8rem', fontWeight: 600, color: '#2354F4',
                background: 'rgba(35,84,244,0.08)', border: '1px solid rgba(35,84,244,0.15)',
                borderRadius: 8, padding: '0.3rem 0.7rem',
              }}>
                {s.title.replace(/^\d+\.\s/, '')}
              </span>
            ))}
          </div>
        </div>

        {/* Sections */}
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <div key={section.title} style={{ marginBottom: '3rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1.25rem' }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 12, flexShrink: 0,
                  background: 'rgba(35,84,244,0.1)', border: '1px solid rgba(35,84,244,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#2354F4',
                }}>
                  <Icon size={19} />
                </div>
                <h2 style={{
                  fontSize: '1.2rem', fontWeight: 800, color: 'var(--text)',
                  margin: 0, letterSpacing: '-0.01em',
                }}>
                  {section.title}
                </h2>
              </div>

              <div style={{
                background: 'var(--card-bg)', border: '1px solid var(--border)',
                borderRadius: 18, padding: '1.5rem 1.75rem',
                display: 'flex', flexDirection: 'column', gap: '1.1rem',
              }}>
                {section.content.map((block, i) => (
                  <div key={i}>
                    {block.subtitle && (
                      <p style={{
                        fontSize: '0.82rem', fontWeight: 800, color: '#2354F4',
                        letterSpacing: '0.3px', marginBottom: '0.35rem',
                        textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '1px',
                      }}>
                        {block.subtitle}
                      </p>
                    )}
                    <p style={{
                      fontSize: '0.92rem', color: 'var(--text2)',
                      lineHeight: 1.8, margin: 0,
                    }}>
                      {block.text}
                    </p>
                    {i < section.content.length - 1 && block.subtitle && (
                      <div style={{ height: 1, background: 'var(--border)', marginTop: '1rem' }} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* Bottom links */}
        <div style={{
          background: 'rgba(35,84,244,0.06)', border: '1px solid rgba(35,84,244,0.15)',
          borderRadius: 18, padding: '1.5rem 1.75rem',
          display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <p style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.25rem' }}>
              Related Legal Documents
            </p>
            <p style={{ fontSize: '0.82rem', color: 'var(--text3)', margin: 0 }}>
              Read our other policies that govern the use of QuesGen.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Link to="/privacy-policy" style={{
              fontSize: '0.84rem', fontWeight: 700, color: '#2354F4',
              textDecoration: 'none', padding: '0.5rem 1rem',
              background: 'rgba(35,84,244,0.1)', borderRadius: 10,
              border: '1px solid rgba(35,84,244,0.2)',
              transition: 'all 0.18s',
            }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(35,84,244,0.18)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(35,84,244,0.1)'}
            >
              Privacy Policy
            </Link>
            <Link to="/terms-conditions" style={{
              fontSize: '0.84rem', fontWeight: 700, color: '#7C3AED',
              textDecoration: 'none', padding: '0.5rem 1rem',
              background: 'rgba(124,58,237,0.08)', borderRadius: 10,
              border: '1px solid rgba(124,58,237,0.2)',
              transition: 'all 0.18s',
            }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(124,58,237,0.15)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(124,58,237,0.08)'}
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
