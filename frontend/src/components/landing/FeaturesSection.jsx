import { Brain, Shuffle, Camera, FileText, BarChart3, Shield, Eye, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';
import ModuleSwiper from './ModuleSwiper';

const features = [
  {
    icon: Trophy,
    title: 'Exam Generator',
    desc: 'AI predicts exam topics with probability scores. Know exactly what to study.',
    color: '#2354F4',
    bg: 'rgba(35,84,244,0.08)',
    tag: 'Student',
    tagColor: '#2354F4',
    tagBg: 'rgba(35,84,244,0.08)',
  },
  {
    icon: Shuffle,
    title: 'LogicGen Shuffler',
    desc: 'Dynamically alters PYQ parameters so no two questions feel the same.',
    color: '#7C3AED',
    bg: 'rgba(124,58,237,0.08)',
    tag: 'Student',
    tagColor: '#2354F4',
    tagBg: 'rgba(35,84,244,0.08)',
  },
  {
    icon: Brain,
    title: 'Adaptive Testing',
    desc: 'AI-powered MCQ papers that adapt to your performance, weighting weak areas 2–4×.',
    color: '#0EA5E9',
    bg: 'rgba(14,165,233,0.08)',
    tag: 'Student',
    tagColor: '#2354F4',
    tagBg: 'rgba(35,84,244,0.08)',
  },
  {
    icon: FileText,
    title: 'Studio-Q Papers',
    desc: 'Generate complete exam papers with answer keys in under 10 seconds.',
    color: '#059669',
    bg: 'rgba(5,150,105,0.08)',
    tag: 'Teacher',
    tagColor: '#059669',
    tagBg: 'rgba(5,150,105,0.08)',
  },
  {
    icon: Shield,
    title: 'Vari-Test Anti-Cheat',
    desc: 'One-click paper variants (Set A/B/C) for cheat-proof, fair exams.',
    color: '#D97706',
    bg: 'rgba(217,119,6,0.08)',
    tag: 'Teacher',
    tagColor: '#059669',
    tagBg: 'rgba(5,150,105,0.08)',
  },
  {
    icon: Eye,
    title: 'Vision-Grade OCR',
    desc: 'Auto-grade handwritten answer sheets with AI-powered OCR technology.',
    color: '#6366F1',
    bg: 'rgba(99,102,241,0.08)',
    tag: 'Teacher',
    tagColor: '#059669',
    tagBg: 'rgba(5,150,105,0.08)',
  },
  {
    icon: BarChart3,
    title: 'Pilot Dashboard',
    desc: 'Class-wide heatmaps pinpointing weak areas with bridge reports to parents.',
    color: '#0D9488',
    bg: 'rgba(13,148,136,0.08)',
    tag: 'Teacher',
    tagColor: '#059669',
    tagBg: 'rgba(5,150,105,0.08)',
  },
  {
    icon: Camera,
    title: 'SnapSolve AI',
    desc: 'Photograph any question and get a step-by-step AI solution instantly.',
    color: '#EC4899',
    bg: 'rgba(236,72,153,0.08)',
    tag: 'Student',
    tagColor: '#2354F4',
    tagBg: 'rgba(35,84,244,0.08)',
  },
];

export default function FeaturesSection() {
  return (
    <section style={{ padding: 'clamp(3.5rem, 7vw, 5.5rem) 0', background: 'var(--bg)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 2xl:px-16">

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span className="lp-eyebrow" style={{ marginBottom: '1rem' }}>
            <span className="lp-dot" />
            Platform Features
          </span>
          <h2 className="st" style={{ marginBottom: '0.75rem', marginTop: '0.75rem' }}>
            Every tool you need.{' '}
            <span className="text-gradient">Nothing you don't.</span>
          </h2>
          <p className="ss" style={{ margin: '0 auto' }}>
            Eight intelligent AI modules in an auto-playing carousel — hover to pause and explore, from predictive analytics to instant paper generation.
          </p>
        </div>

        {/* Swiper coverflow carousel (autoplay) */}
        <ModuleSwiper items={features.map(f => ({ Icon: f.icon, name: f.title, desc: f.desc, color: f.color }))} />
      </div>
    </section>
  );
}
