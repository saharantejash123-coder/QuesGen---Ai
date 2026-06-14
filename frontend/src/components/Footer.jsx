import { Brain, Mail, Code2, MessageCircle, Share2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer style={{ background: 'var(--footer-bg)', borderTop: '1px solid var(--footer-border)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 2xl:px-16 py-8 sm:py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 lg:gap-12">
          <div className="col-span-1 sm:col-span-2 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg from-purple-500 to-blue-500 flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg sm:text-xl font-bold text-gradient">QuesGen</span>
            </Link>
            <p style={{ color: 'var(--footer-text2)' }} className="text-xs sm:text-sm leading-relaxed max-w-md mb-4">
              {t('landing.footer.brandTagline')}
            </p>
            <div className="flex gap-2 sm:gap-3 flex-wrap">
              {[MessageCircle, Share2, Code2, Mail].map((Icon, i) => (
                <a key={i} href="#" style={{ background: 'var(--bg2)', border: '1px solid var(--border)', color: 'var(--text3)' }} className="w-10 h-10 sm:w-9 sm:h-9 rounded-lg hover:border-purple-500/50 flex items-center justify-center transition-all hover:text-purple-500">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 style={{ color: 'var(--footer-logo-text)' }} className="font-semibold mb-3 sm:mb-4 text-xs sm:text-sm uppercase tracking-wider">{t('landing.footer.platform')}</h4>
            <ul className="space-y-2 sm:space-y-2">
              {[
                { name: 'Exam Generator', path: '/student' },
                { name: 'LogicGen Shuffler', path: '/student' },
                { name: 'SnapSolve AI', path: '/student' },
                { name: 'Studio-Q Papers', path: '/teacher' },
                { name: 'Vision-Grade OCR', path: '/teacher' }
              ].map(item => (
                <li key={item.name}><Link to={item.path} style={{ color: 'var(--footer-text3)' }} className="hover:text-purple-500 text-xs sm:text-sm transition-colors line-clamp-1">{item.name}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 style={{ color: 'var(--footer-logo-text)' }} className="font-semibold mb-3 sm:mb-4 text-xs sm:text-sm uppercase tracking-wider">{t('landing.footer.company')}</h4>
            <ul className="space-y-2 sm:space-y-2">
              {[
                { name: 'About Us', path: '/' },
                { name: 'Blog', path: '/' },
                { name: 'Careers', path: '/' },
                { name: 'Contact', path: '/' },
                { name: 'Privacy Policy', path: '/' }
              ].map(item => (
                <li key={item.name}><Link to={item.path} style={{ color: 'var(--footer-text3)' }} className="hover:text-purple-500 text-xs sm:text-sm transition-colors line-clamp-1">{item.name}</Link></li>
              ))}
            </ul>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--footer-border)' }} className="mt-6 sm:mt-10 pt-4 sm:pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p style={{ color: 'var(--footer-text3)' }} className="text-xs text-center sm:text-left">{t('landing.footer.copyRight')}</p>
          <p style={{ color: 'var(--footer-text3)' }} className="text-xs text-center">{t('landing.footer.madeWith')}</p>
        </div>
      </div>
    </footer>
  )
}
