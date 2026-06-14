import { Users, BookOpen, Award, TrendingUp } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'

export default function StatsSection() {
  const { t } = useLanguage();
  const stats = [
    { icon: Users, value: '2,50,000+', label: 'landing.stats.students', color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { icon: BookOpen, value: '4,28,500+', label: 'landing.stats.vaultQuestions', color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { icon: Award, value: '7+', label: 'landing.stats.boardsCovered', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { icon: TrendingUp, value: '92%', label: 'landing.stats.improvementRate', color: 'text-amber-400', bg: 'bg-amber-500/10' },
  ]

  return (
    <section className="py-12 sm:py-16 lg:py-20 border-y border-slate-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 2xl:px-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 xl:gap-10">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center group p-4 sm:p-0">
              <div className={`w-12 h-12 lg:w-16 lg:h-16 rounded-xl lg:rounded-2xl ${stat.bg} flex items-center justify-center mx-auto mb-3 lg:mb-4 group-hover:scale-110 transition-transform`}>
                <stat.icon className={`w-6 h-6 lg:w-8 lg:h-8 ${stat.color.replace('400', '600 dark:text-' + stat.color.split('-')[1] + '-400')}`} />
              </div>
              <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-1">{stat.value}</div>
              <div className="text-xs sm:text-sm lg:text-base text-slate-500 dark:text-slate-400">{t(stat.label)}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
