import { Brain, Shuffle, Camera, FileText, BarChart3, Shield, Eye } from 'lucide-react'

const features = [
  {
    icon: Brain,
    title: 'Exam Generator',
    desc: 'AI predicts exam topics with probability scores. Know exactly what to study.',
    color: 'purple',
    tag: 'Student'
  },
  {
    icon: Shuffle,
    title: 'LogicGen Shuffler',
    desc: 'Dynamically alters PYQ parameters. No more rote memorization.',
    color: 'blue',
    tag: 'Student'
  },
  {
    icon: Brain,
    title: 'Adaptive Testing',
    desc: 'AI-powered MCQ papers that adapt to your performance. Questions are weighted 2–4× toward your weak areas for maximum improvement.',
    color: 'cyan',
    tag: 'Student'
  },
  {
    icon: FileText,
    title: 'Studio-Q Papers',
    desc: 'Generate complete exam papers with answer keys in under 10 seconds.',
    color: 'emerald',
    tag: 'Teacher'
  },
  {
    icon: Shield,
    title: 'Vari-Test Anti-Cheat',
    desc: 'One-click paper variants (Set A/B/C) for cheat-proof exams.',
    color: 'amber',
    tag: 'Teacher'
  },
  {
    icon: Eye,
    title: 'Vision-Grade OCR',
    desc: 'Auto-grade handwritten answer sheets with AI-powered OCR technology.',
    color: 'indigo',
    tag: 'Teacher'
  },
  {
    icon: BarChart3,
    title: 'Pilot Dashboard',
    desc: 'Class-wide heatmaps pinpointing weak areas. Bridge reports to parents.',
    color: 'teal',
    tag: 'Teacher'
  },
]

const colorMap = {
  purple: { bg: 'bg-purple-500/10', text: 'text-purple-600 dark:text-purple-400', border: 'border-purple-500/20' },
  blue: { bg: 'bg-blue-500/10', text: 'text-blue-600 dark:text-blue-400', border: 'border-blue-500/20' },
  cyan: { bg: 'bg-cyan-500/10', text: 'text-cyan-600 dark:text-cyan-400', border: 'border-cyan-500/20' },
  rose: { bg: 'bg-rose-500/10', text: 'text-rose-600 dark:text-rose-400', border: 'border-rose-500/20' },
  emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-500/20' },
  amber: { bg: 'bg-amber-500/10', text: 'text-amber-600 dark:text-amber-400', border: 'border-amber-500/20' },
  indigo: { bg: 'bg-indigo-500/10', text: 'text-indigo-600 dark:text-indigo-400', border: 'border-indigo-500/20' },
  teal: { bg: 'bg-teal-500/10', text: 'text-teal-600 dark:text-teal-400', border: 'border-teal-500/20' },
}

export default function FeaturesSection() {
  return (
    <section className="py-20 lg:py-28" style={{ background: 'var(--bg)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 2xl:px-16">
        <div className="text-center mb-14 lg:mb-20">
          <h2 className="st mb-4">
            Every tool you need.<br /><span className="text-gradient">Nothing you don't.</span>
          </h2>
          <p className="ss mx-auto">From predictive analytics to instant paper generation — 8 student modules and 4 teacher tools in one coherent ecosystem.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6 xl:gap-7">
          {features.map((feat) => {
            const colors = colorMap[feat.color]
            return (
              <div key={feat.title} className="glass-card rounded-xl lg:rounded-2xl p-6 lg:p-8 hover:-translate-y-1 group cursor-default">
                <div className="flex items-center justify-between mb-5 lg:mb-6">
                  <div
                    className="w-12 h-12 lg:w-14 lg:h-14 rounded-xl lg:rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform"
                    style={{ background: `${colors.text.includes('blue') ? '#2354F4' : colors.text.includes('purple') ? '#7C3AED' : colors.text.includes('emerald') ? '#10B981' : colors.text.includes('amber') ? '#F59E0B' : '#3B82F6'}14` }}
                  >
                    <feat.icon
                      className="w-6 h-6 lg:w-7 lg:h-7"
                      style={{ color: colors.text.includes('blue') ? '#2354F4' : colors.text.includes('purple') ? '#7C3AED' : colors.text.includes('emerald') ? '#10B981' : colors.text.includes('amber') ? '#F59E0B' : '#3B82F6' }}
                    />
                  </div>
                  <span
                    className="text-[10px] lg:text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
                    style={{
                      background: feat.tag === 'Teacher' ? 'var(--bg3)' : 'rgba(35,84,244,0.1)',
                      color: feat.tag === 'Teacher' ? 'var(--text)' : '#2354F4',
                      border: '1px solid var(--border)'
                    }}
                  >
                    {feat.tag}
                  </span>
                </div>
                <h3 className="text-lg lg:text-xl font-bold mb-2 lg:mb-3" style={{ color: 'var(--text)' }}>{feat.title}</h3>
                <p className="text-sm lg:text-base leading-relaxed" style={{ color: 'var(--text2)' }}>{feat.desc}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
