import { useState } from 'react';
import { Check, X, Sparkles, Crown, Building2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import SubscriptionModal from '../questra/SubscriptionModal';

const plans = [
  {
    name: 'Core Access',
    icon: Sparkles,
    price: { monthly: 'FREE', annual: 'FREE' },
    desc: 'Get started with essential tools',
    accentColor: '#64748B',
    accentBg: 'rgba(100,116,139,0.08)',
    features: [
      { text: 'Last 3 years PYQ access', included: true  },
      { text: '3 Oracle predictions/month', included: true  },
      { text: 'Basic performance stats', included: true  },
      { text: 'Simulated banner ads', included: true  },
      { text: 'Full Vault-15 archive', included: false },
      { text: 'Unlimited Oracle scores', included: false },
      { text: 'Script-Lab practice', included: false },
    ],
    cta: 'Start Free',
    popular: false,
  },
  {
    name: 'Student Pro',
    icon: Crown,
    price: { monthly: '₹199', annual: '₹1,599' },
    period: { monthly: '/mo', annual: '/yr' },
    desc: 'Complete exam preparation toolkit',
    accentColor: '#2354F4',
    accentBg: 'rgba(35,84,244,0.08)',
    features: [
      { text: 'Full Vault-15 (15 yrs PYQ)', included: true },
      { text: 'Unlimited Oracle predictions', included: true },
      { text: 'Script-Lab practice mode', included: true },
      { text: 'LogicGen AI Shuffler', included: true },
      { text: 'SnapSolve unlimited uploads', included: true },
      { text: 'Ad-free experience', included: true },
      { text: 'Priority AI responses', included: true },
    ],
    cta: 'Get Student Pro',
    popular: true,
  },
  {
    name: 'School / Coaching',
    icon: Building2,
    price: { monthly: '₹999', annual: '₹7,999' },
    period: { monthly: '/mo', annual: '/yr' },
    desc: 'Power tools for institutions',
    accentColor: '#7C3AED',
    accentBg: 'rgba(124,58,237,0.08)',
    features: [
      { text: 'Studio-Q Paper Generator', included: true },
      { text: 'Vari-Test Anti-Cheat sets', included: true },
      { text: 'Vision-Grade OCR grading', included: true },
      { text: 'Pilot Dashboard analytics', included: true },
      { text: 'Bridge-Reports to parents', included: true },
      { text: 'Unlimited teacher accounts', included: true },
      { text: 'Dedicated support', included: true },
    ],
    cta: 'Contact Sales',
    popular: false,
  },
];

export default function PricingSection() {
  const [annual, setAnnual] = useState(false);
  const [subModal, setSubModal] = useState(null);
  const { t } = useLanguage();

  return (
    <section id="pricing" style={{ padding: 'clamp(3.5rem, 7vw, 5.5rem) 0', background: 'var(--bg3)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 2xl:px-16">

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span className="lp-eyebrow" style={{ marginBottom: '1rem' }}>
            <span className="lp-dot" />
            Pricing
          </span>
          <h2 className="st" style={{ marginBottom: '0.75rem', marginTop: '0.75rem' }}>
            {t('landing.pricing.title').split(' ').slice(0, 2).join(' ')}{' '}
            <span className="text-gradient">
              {t('landing.pricing.title').split(' ').slice(2).join(' ')}
            </span>
          </h2>
          <p style={{ color: 'var(--text3)', maxWidth: 480, margin: '0 auto 1.75rem', fontSize: '0.95rem', lineHeight: 1.7 }}>
            {t('landing.pricing.description')}
          </p>

          {/* Toggle */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
            background: 'var(--card-bg)', border: '1px solid var(--border)',
            borderRadius: 100, padding: '0.3rem',
            boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
          }}>
            <button
              onClick={() => setAnnual(false)}
              style={{
                padding: '0.5rem 1.3rem', borderRadius: 100,
                fontSize: '0.85rem', fontWeight: 600, border: 'none',
                cursor: 'pointer', transition: 'all 0.22s ease',
                background: !annual ? '#2354F4' : 'transparent',
                color: !annual ? '#fff' : 'var(--text3)',
                boxShadow: !annual ? '0 2px 8px rgba(35,84,244,0.3)' : 'none',
              }}
            >
              {t('landing.pricing.monthly')}
            </button>
            <button
              onClick={() => setAnnual(true)}
              style={{
                padding: '0.5rem 1.3rem', borderRadius: 100,
                fontSize: '0.85rem', fontWeight: 600, border: 'none',
                cursor: 'pointer', transition: 'all 0.22s ease',
                background: annual ? '#2354F4' : 'transparent',
                color: annual ? '#fff' : 'var(--text3)',
                boxShadow: annual ? '0 2px 8px rgba(35,84,244,0.3)' : 'none',
                display: 'flex', alignItems: 'center', gap: '0.4rem',
              }}
            >
              {t('landing.pricing.annual')}
              <span style={{
                fontSize: '0.68rem', fontWeight: 800,
                background: annual ? 'rgba(255,255,255,0.2)' : 'rgba(5,150,105,0.12)',
                color: annual ? '#fff' : '#059669',
                padding: '0.12rem 0.45rem', borderRadius: 100,
              }}>
                {t('landing.pricing.save')}
              </span>
            </button>
          </div>
        </div>

        {/* Cards */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
          gap: '1.25rem', maxWidth: 980, margin: '0 auto',
        }} className="pricing-grid lp-grid-safe">
          {plans.map((plan, idx) => (
            <motion.div
              key={plan.name}
              className={plan.popular ? 'lp-spot' : 'lp-glass lp-gborder lp-spot'}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: idx * 0.1, type: 'spring', stiffness: 190, damping: 22 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              onMouseMove={e => {
                const r = e.currentTarget.getBoundingClientRect();
                e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
                e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
              }}
              style={{
                background: plan.popular
                  ? 'linear-gradient(160deg, rgba(35,84,244,0.07), var(--card-bg) 55%)'
                  : undefined,
                border: plan.popular
                  ? '2px solid #2354F4'
                  : '1px solid var(--border)',
                borderRadius: 20,
                padding: '1.75rem',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: plan.popular
                  ? '0 18px 50px rgba(35,84,244,0.22), 0 2px 8px rgba(0,0,0,0.08)'
                  : '0 4px 18px rgba(0,0,0,0.05)',
                transform: plan.popular ? 'scale(1.03)' : 'scale(1)',
                ['--spot']: plan.accentBg.replace('0.08', '0.16'),
              }}
            >
              {/* Glow aura — popular only */}
              {plan.popular && (
                <div aria-hidden style={{
                  position: 'absolute', top: '-30%', left: '50%', transform: 'translateX(-50%)',
                  width: '120%', height: '60%', borderRadius: '50%',
                  background: 'radial-gradient(ellipse, rgba(35,84,244,0.16) 0%, transparent 70%)',
                  pointerEvents: 'none', zIndex: -1,
                }} />
              )}
              {/* Top accent bar */}
              {plan.popular && (
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: 3,
                  background: 'linear-gradient(90deg, #2354F4, #7C3AED)',
                }} />
              )}

              {/* Popular badge */}
              {plan.popular && (
                <div style={{
                  position: 'absolute', top: 16, right: 16,
                  background: 'linear-gradient(135deg, #2354F4, #7C3AED)',
                  color: '#fff', fontSize: '0.65rem', fontWeight: 800,
                  padding: '0.25rem 0.7rem', borderRadius: 100,
                  letterSpacing: '0.04em', textTransform: 'uppercase',
                }}>
                  Most Popular
                </div>
              )}

              {/* Plan header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', marginBottom: '1.25rem' }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: `linear-gradient(145deg, ${plan.accentBg}, transparent)`,
                  border: `1px solid ${plan.accentColor}22`,
                  boxShadow: `inset 0 1px 0 rgba(255,255,255,0.12)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <plan.icon size={18} color={plan.accentColor} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--text)', fontSize: '0.95rem' }}>
                    {plan.name}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text3)' }}>{plan.desc}</div>
                </div>
              </div>

              {/* Price */}
              <div style={{ marginBottom: '1.4rem' }}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={annual ? 'annual' : 'monthly'}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.18 }}
                    style={{ display: 'flex', alignItems: 'baseline', gap: '0.2rem' }}
                  >
                    <span style={{
                      fontSize: 'clamp(1.9rem, 3vw, 2.35rem)',
                      fontWeight: 800,
                      letterSpacing: '-0.03em', lineHeight: 1,
                      ...(plan.popular ? {
                        background: 'linear-gradient(135deg, #2354F4, #7C3AED)',
                        WebkitBackgroundClip: 'text', backgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      } : { color: 'var(--text)' }),
                    }}>
                      {annual ? plan.price.annual : plan.price.monthly}
                    </span>
                    {plan.period && (
                      <span style={{ fontSize: '0.85rem', color: 'var(--text3)', fontWeight: 500 }}>
                        {annual ? plan.period.annual : plan.period.monthly}
                      </span>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Features */}
              <ul style={{ listStyle: 'none', margin: '0 0 1.4rem', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {plan.features.map((feat, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                    {feat.included ? (
                      <div style={{
                        width: 18, height: 18, borderRadius: '50%',
                        background: 'rgba(5,150,105,0.1)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      }}>
                        <Check size={11} color="#059669" strokeWidth={2.5} />
                      </div>
                    ) : (
                      <div style={{
                        width: 18, height: 18, borderRadius: '50%',
                        background: 'var(--bg3)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      }}>
                        <X size={10} color="var(--text3)" strokeWidth={2.5} />
                      </div>
                    )}
                    <span style={{
                      fontSize: '0.82rem',
                      color: feat.included ? 'var(--text)' : 'var(--text3)',
                      lineHeight: 1.4,
                    }}>
                      {feat.text}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <button
                className={plan.popular ? 'btn-p' : 'btn-g'}
                style={{
                  width: '100%', justifyContent: 'center',
                  padding: '0.8rem 1rem', fontSize: '0.88rem', borderRadius: 12,
                }}
                onClick={plan.price.monthly !== 'FREE' ? () => {
                  const price = annual ? plan.price.annual : plan.price.monthly;
                  const period = annual ? (plan.period?.annual || '') : (plan.period?.monthly || '');
                  setSubModal({ name: plan.name, price: price + period });
                } : undefined}
              >
                {plan.cta}
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {subModal && (
        <SubscriptionModal
          planName={subModal.name}
          planPrice={subModal.price}
          onClose={() => setSubModal(null)}
        />
      )}

      <style>{`
        @media (max-width: 900px) {
          .pricing-grid { grid-template-columns: 1fr !important; max-width: 420px !important; }
        }
      `}</style>
    </section>
  );
}
