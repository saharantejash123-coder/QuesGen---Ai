import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Brain, Zap, Shield } from 'lucide-react';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
} from 'framer-motion';
import WordReveal from '../animations/WordReveal';
import MagneticButton from '../animations/MagneticButton';
import { useLanguage } from '../../context/LanguageContext';

// ─── Spring physics presets ────────────────────────────────────────────────────
const SPRING_SNAPPY  = { type: 'spring', stiffness: 220, damping: 22, mass: 0.6 };
const SPRING_SOFT    = { type: 'spring', stiffness: 140, damping: 20, mass: 0.8 };
const SPRING_BOUNCY  = { type: 'spring', stiffness: 260, damping: 16, mass: 0.5 };

// ─── Stagger container ─────────────────────────────────────────────────────────
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.13,
      delayChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 44 },
  visible: { opacity: 1, y: 0, transition: SPRING_SNAPPY },
};

// ─── Feature card variants (custom per-index delay) ────────────────────────────
const cardVariants = {
  hidden: { opacity: 0, y: 36, scale: 0.94 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { ...SPRING_SOFT, delay: 0.55 + i * 0.11 },
  }),
};

// ─── Floating background orbs ──────────────────────────────────────────────────
const ORBS = [
  { color: 'bg-purple-600', w: 'w-80 h-80', top: '5%',  left: '-12%', parallaxFactor: 0.28 },
  { color: 'bg-blue-600',   w: 'w-72 h-72', bottom: '8%', right: '-10%', parallaxFactor: 0.18 },
  { color: 'bg-indigo-600', w: 'w-[500px] h-[500px]', top: '42%', left: '42%', parallaxFactor: 0.12 },
];

const FEATURES = [
  { icon: Brain,  title: 'Oracle Predictions', desc: 'AI predicts exam topics with 87% accuracy', color: 'purple' },
  { icon: Zap,    title: 'Instant Papers',      desc: 'Generate exam papers in under 10 seconds', color: 'blue'   },
  { icon: Shield, title: 'Anti-Cheat Sets',     desc: '1-click variant generation for fair exams', color: 'emerald' },
];

const STATS = [
  { value: '4,28,500+', label: 'landing.stats.questions' },
  { value: '15 Years',  label: 'landing.stats.pyqData'  },
  { value: '7+',         label: 'landing.stats.boardsCovered' },
];

export default function HeroSection() {
  const sectionRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();
  const { t } = useLanguage();

  // ── Scroll-based parallax values ──────────────────────────────────────────
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const rawY = [
    useTransform(scrollYProgress, [0, 1], ['0%', `-${ORBS[0].parallaxFactor * 100}%`]),
    useTransform(scrollYProgress, [0, 1], ['0%', `-${ORBS[1].parallaxFactor * 100}%`]),
    useTransform(scrollYProgress, [0, 1], ['0%', `-${ORBS[2].parallaxFactor * 100}%`]),
  ];

  // Smooth the parallax with a spring so it doesn't feel rigid
  const orbY = rawY.map((v) =>
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useSpring(v, { stiffness: 60, damping: 18 })
  );

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16"
    >
      {/* ── Parallax background glows ─────────────────────────────────────── */}
      {!shouldReduceMotion &&
        ORBS.map((orb, i) => (
          <motion.div
            key={i}
            className={`hero-glow ${orb.color} ${orb.w} absolute opacity-60 pointer-events-none`}
            style={{
              ...(orb.top    ? { top:    orb.top    } : {}),
              ...(orb.bottom ? { bottom: orb.bottom } : {}),
              ...(orb.left   ? { left:   orb.left   } : {}),
              ...(orb.right  ? { right:  orb.right  } : {}),
              y: orbY[i],
            }}
          />
        ))}

      {/* Static glows for reduced-motion users */}
      {shouldReduceMotion && (
        <>
          <div className="hero-glow bg-purple-600 top-20 -left-40" />
          <div className="hero-glow bg-blue-600 bottom-20 -right-40" />
          <div className="hero-glow bg-indigo-600 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  opacity-10" />
        </>
      )}

      {/* ── Grid dot pattern ─────────────────────────────────────────────── */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.03)_1px,transparent_1px)]  pointer-events-none" />

      {/* ── Floating micro-orbs (decorative, desktop-only) ───────────────── */}
      {!shouldReduceMotion && (
        <>
          <motion.div
            className="absolute w-2 h-2 rounded-full bg-purple-400/50 top-1/4 left-1/4 hidden sm:block pointer-events-none"
            animate={{ y: [-14, 14, -14], x: [-7, 7, -7] }}
            transition={{ duration: 7.5, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute w-2.5 h-2.5 rounded-full bg-blue-400/35 top-3/4 right-1/3 hidden sm:block pointer-events-none"
            animate={{ y: [10, -10, 10], rotate: [0, 180, 360] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute w-1.5 h-1.5 rounded-full bg-indigo-400/60 top-1/2 right-1/4 hidden sm:block pointer-events-none"
            animate={{ scale: [1, 1.6, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          />
        </>
      )}

      {/* ── Main content ─────────────────────────────────────────────────── */}
      <motion.div
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 2xl:px-16 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Badge */}
        <motion.div
          variants={itemVariants}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-8 lg:mb-10"
        >
          <motion.span
            animate={shouldReduceMotion ? {} : { rotate: [0, 14, -14, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          </motion.span>
          <span className="text-sm sm:text-base text-purple-700 dark:text-purple-300 font-medium">
            {t('landing.hero.badge')}
          </span>
        </motion.div>

        {/* ── Headline — word-by-word spring reveal ──────────────────────── */}
        <motion.div variants={itemVariants} className="mb-3">
          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl 2xl:text-9xl font-bold leading-tight tracking-tight">
            <WordReveal text={t('landing.hero.headlineTop')} delay={0} />
            <br />
            <span className="text-gradient">
              <WordReveal text={t('landing.hero.headlineBottom')} delay={0.12} />
            </span>
          </h1>
        </motion.div>

        {/* Subheadline */}
        <motion.p
          variants={itemVariants}
          className="text-lg sm:text-xl lg:text-2xl text-slate-500 dark:text-slate-400 max-w-3xl mx-auto mb-4 mt-4 lg:mt-6"
        >
          {t('landing.hero.subheadline')}
        </motion.p>

        {/* Stats bar */}
        <motion.div
          variants={itemVariants}
          className="flex flex-wrap justify-center gap-4 sm:gap-8 lg:gap-12 mb-10 lg:mb-12"
        >
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="flex items-center gap-2"
              whileHover={shouldReduceMotion ? {} : { scale: 1.08, transition: SPRING_BOUNCY }}
            >
              <span className="text-slate-900 dark:text-white font-bold text-lg lg:text-2xl">{stat.value}</span>
              <span className="text-slate-500 text-sm lg:text-base">{t(stat.label)}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* ── CTAs with magnetic spring pull ─────────────────────────────── */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-3 lg:gap-5 justify-center px-4"
        >
          <MagneticButton strength={0.22}>
            <Link
              to="/student"
              className="btn-primary flex items-center justify-center gap-2 text-base lg:text-lg px-6 sm:px-8 lg:px-10 py-3 sm:py-4 min-h-[48px] sm:min-h-[44px] w-full sm:w-auto"
            >
              <Brain className="w-5 h-5 lg:w-6 lg:h-6" />
              {t('landing.hero.ctaStudent')}
              <motion.span
                animate={shouldReduceMotion ? {} : { x: [0, 5, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
              >
                <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5" />
              </motion.span>
            </Link>
          </MagneticButton>

          <MagneticButton strength={0.18}>
            <Link
              to="/teacher"
              className="btn-secondary flex items-center justify-center gap-2 text-base lg:text-lg px-6 sm:px-8 lg:px-10 py-3 sm:py-4 min-h-[48px] sm:min-h-[44px] w-full sm:w-auto"
            >
              <Shield className="w-5 h-5 lg:w-6 lg:h-6" />
              {t('landing.hero.ctaTeacher')}
            </Link>
          </MagneticButton>
        </motion.div>

        {/* ── Staggered feature cards ─────────────────────────────────────── */}
        <div className="mt-16 lg:mt-20 grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6 max-w-5xl mx-auto">
          {FEATURES.map((card, i) => (
            <motion.div
              key={card.title}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover={
                shouldReduceMotion
                  ? {}
                  : { y: -8, scale: 1.03, transition: SPRING_SNAPPY }
              }
              className="glass-card rounded-xl lg:rounded-2xl p-5 lg:p-7 text-left border border-slate-200 dark:border-white/10 hover:border-purple-500/30 transition-colors duration-300 cursor-default"
            >
              <motion.div
                className={`w-10 h-10 lg:w-12 lg:h-12 rounded-lg lg:rounded-xl bg-${card.color}-500/10 flex items-center justify-center mb-3 lg:mb-4`}
                whileHover={
                  shouldReduceMotion
                    ? {}
                    : { rotate: [0, -12, 12, 0], transition: { duration: 0.45 } }
                }
              >
                <card.icon className={`w-5 h-5 lg:w-6 lg:h-6 text-${card.color}-600 dark:text-${card.color}-400`} />
              </motion.div>
              <h3 className="text-slate-900 dark:text-white font-semibold text-sm lg:text-base mb-1 lg:mb-2">
                {card.title}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs lg:text-sm">{card.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
