import { XCircle, CheckCircle, Clock, Brain, FileText, BarChart3, AlertTriangle, Sparkles, Zap, Shield } from 'lucide-react'

export default function ProblemSolution() {
  const problems = [
    { icon: AlertTriangle, text: '100% syllabus overload — students study everything blindly', color: 'text-rose-400' },
    { icon: Clock, text: 'Teachers spend 4-6 hours creating a single question paper', color: 'text-rose-400' },
    { icon: XCircle, text: 'No predictive insights — students guess what topics matter', color: 'text-rose-400' },
    { icon: FileText, text: 'Manual grading delays — results take weeks to process', color: 'text-rose-400' },
  ]

  const solutions = [
    { icon: Brain, text: 'Oracle AI predicts high-weightage topics with 87% accuracy', color: 'text-emerald-400' },
    { icon: Zap, text: 'Studio-Q generates papers in <10 seconds with full answer keys', color: 'text-emerald-400' },
    { icon: Sparkles, text: 'LogicGen shuffles PYQs to prevent rote memorization', color: 'text-emerald-400' },
    { icon: Shield, text: 'Vision-Grade OCR auto-grades handwritten papers instantly', color: 'text-emerald-400' },
  ]

  return (
    <section id="features" className="py-20 lg:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 2xl:px-16">
        <div className="text-center mb-14 lg:mb-20">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            The Broken System vs. <span className="text-gradient">1 AI Ecosystem</span>
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-sm lg:text-base">See how QuesGen replaces an entire broken workflow with one intelligent platform.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 xl:gap-10">
          {/* Problems */}
          <div className="glass-card rounded-2xl p-6 sm:p-8 lg:p-10 border-rose-500/20">
            <div className="flex items-center gap-3 mb-6 lg:mb-8">
              <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-rose-500/10 flex items-center justify-center">
                <XCircle className="w-5 h-5 lg:w-6 lg:h-6 text-rose-400" />
              </div>
              <h3 className="text-lg lg:text-xl font-bold text-rose-400">The Current Problem</h3>
            </div>
            <div className="space-y-4 lg:space-y-5">
              {problems.map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-3 lg:p-4 rounded-xl bg-rose-500/5 border border-rose-500/10">
                  <item.icon className={`w-5 h-5 ${item.color} mt-0.5 shrink-0`} />
                  <span className="text-slate-600 dark:text-slate-300 text-sm">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Solutions */}
          <div className="glass-card rounded-2xl p-6 sm:p-8 lg:p-10 border-emerald-500/20 relative overflow-hidden">
            <div className="absolute inset-0 animate-shimmer"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6 lg:mb-8">
                <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 lg:w-6 lg:h-6 text-emerald-400" />
                </div>
                <h3 className="text-lg lg:text-xl font-bold text-emerald-400">The QuesGen Solution</h3>
              </div>
              <div className="space-y-4 lg:space-y-5">
                {solutions.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 lg:p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                    <item.icon className={`w-5 h-5 ${item.color} mt-0.5 shrink-0`} />
                    <span className="text-slate-600 dark:text-slate-300 text-sm">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
