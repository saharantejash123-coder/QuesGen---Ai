import { useState } from 'react'
import { Check, X, Sparkles, Crown, Building2 } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'

const plans = [
  {
    name: 'Core Access',
    icon: Sparkles,
    price: { monthly: 'FREE', annual: 'FREE' },
    desc: 'Get started with essential tools',
    color: 'slate',
    features: [
      { text: 'Last 3 years PYQ access', included: true },
      { text: '3 Oracle predictions/month', included: true },
      { text: 'Basic performance stats', included: true },
      { text: 'Simulated banner ads', included: true },
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
    color: 'purple',
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
    color: 'blue',
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
]

export default function PricingSection() {
  const [annual, setAnnual] = useState(false)
  const { t } = useLanguage();

  return (
    <section id="pricing" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-(--text) mb-4">
            {t('landing.pricing.title').split(' ').slice(0,2).join(' ')} <span className="text-gradient">{t('landing.pricing.title').split(' ').slice(2).join(' ')}</span>
          </h2>
          <p className="text-(--text3) max-w-xl mx-auto mb-8">{t('landing.pricing.description')}</p>

          {/* Toggle */}
          <div className="inline-flex items-center gap-3 bg-(--bg3) border border-(--border2) rounded-full p-1">
            <button
              onClick={() => setAnnual(false)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${!annual ? 'bg-[#2354F4] text-white' : 'text-(--text3) hover:text-(--text)'}`}
            >
              {t('landing.pricing.monthly')}
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${annual ? 'bg-[#2354F4] text-white' : 'text-(--text3) hover:text-(--text)'}`}
            >
              {t('landing.pricing.annual')} <span className="text-emerald-400 text-xs font-bold ml-1">{t('landing.pricing.save')}</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative glass-card rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 ${
                plan.popular ? 'border-[#2354F4] shadow-[0_0_30px_rgba(35,84,244,0.15)]' : 'border border-(--border)'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-linear-to-r from-blue-600 to-indigo-600 rounded-full text-xs font-bold text-white">
                  Most Popular
                </div>
              )}

              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-lg ${plan.color === 'purple' ? 'bg-purple-500/15' : plan.color === 'blue' ? 'bg-blue-500/15' : 'bg-(--bg3)'} flex items-center justify-center`}>
                  <plan.icon className={`w-5 h-5 ${plan.color === 'purple' ? 'text-purple-400' : plan.color === 'blue' ? 'text-blue-400' : 'text-(--text2)'}`} />
                </div>
                <div>
                  <h3 className="text-(--text) font-bold">{plan.name}</h3>
                  <p className="text-(--text2) text-xs">{plan.desc}</p>
                </div>
              </div>

              <div className="mb-6">
                <span className="text-3xl font-bold text-(--text)">
                  {annual ? plan.price.annual : plan.price.monthly}
                </span>
                {plan.period && (
                  <span className="text-(--text3) text-sm ml-1">{annual ? plan.period.annual : plan.period.monthly}</span>
                )}
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feat, i) => (
                  <li key={i} className="flex items-center gap-2.5 text-sm">
                    {feat.included ? (
                      <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    ) : (
                      <X className="w-4 h-4 text-(--text3) opacity-50 shrink-0" />
                    )}
                    <span className={feat.included ? 'text-(--text)' : 'text-(--text3)'}>{feat.text}</span>
                  </li>
                ))}
              </ul>

              <button className={`w-full py-3 ${
                plan.popular
                  ? 'btn-p justify-center'
                  : 'btn-g justify-center'
              }`}>
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
