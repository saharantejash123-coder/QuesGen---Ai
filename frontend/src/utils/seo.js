// Route-level SEO manager for the SPA.
// Swaps <title>, meta description/keywords, canonical and social tags as the
// user navigates, so every crawlable view carries targeted on-page SEO.

const ORIGIN = 'https://quesgenai.vercel.app';

const DEFAULTS = {
  title: 'QuesGen AI — AI Exam Generator & Adaptive Learning Platform',
  description:
    'QuesGen AI is an AI exam generator and adaptive learning platform. Generate personalized test papers from 15 years of PYQs, predict exam patterns, and track student performance in real time.',
  keywords:
    'AI Exam Generator, Adaptive Learning Platform, Personalized Test Papers, question paper generator, PYQ practice, adaptive testing',
  path: '/',
};

// Keyed by router path OR QuestraShell internal page id.
export const SEO_ROUTES = {
  '/': DEFAULTS,
  home: DEFAULTS,
  features: {
    title: 'Features — AI Question Prediction & Adaptive Testing | QuesGen AI',
    description:
      'Explore QuesGen AI features: Exam Generator, Vault-15 PYQ bank, Script-Lab handwriting analysis, adaptive testing, Studio-Q paper builder, Vari-Test anti-cheat sets and Vision-Grade auto-checking.',
    keywords: 'AI question prediction, adaptive testing, exam paper builder, PYQ question bank, anti-cheat exam sets',
    path: '/',
  },
  vault15: {
    title: 'Vault-15 — 15 Years of PYQs & Personalized Test Papers | QuesGen AI',
    description:
      'Vault-15 gives you 15 years of previous year questions with AI-generated, board-authentic personalized test papers for CBSE and RBSE Class 10 & 12.',
    keywords: 'previous year questions, PYQ bank, personalized test papers, CBSE PYQ, RBSE PYQ',
    path: '/',
  },
  scriptlab: {
    title: 'Script-Lab — AI Handwriting Analysis for Students | QuesGen AI',
    description:
      'Script-Lab analyses handwritten answers with AI, scoring legibility and presentation so students improve the answers examiners actually read.',
    keywords: 'handwriting analysis, answer presentation, AI answer checking, exam writing skills',
    path: '/',
  },
  logicgen: {
    title: 'LogicGen — Unlimited AI Question Shuffles | QuesGen AI',
    description:
      'LogicGen creates unlimited fresh variations of practice questions so students never memorise answers — they master concepts.',
    keywords: 'AI question generator, question variations, unlimited practice questions',
    path: '/',
  },
  adaptive: {
    title: 'Adaptive Testing — Difficulty That Tracks Your Performance | QuesGen AI',
    description:
      'QuesGen adaptive tests tune question difficulty to each student in real time, targeting weak chapters detected from performance analytics.',
    keywords: 'adaptive learning platform, adaptive testing, weakness-based learning, personalized quizzes',
    path: '/',
  },
  oracle: {
    title: 'Oracle Engine — AI Exam Pattern Prediction | QuesGen AI',
    description:
      'The Oracle Engine studies 15 years of exam patterns to predict likely questions and generate full mock papers with probability scores.',
    keywords: 'exam prediction, AI exam generator, mock paper generator, question probability',
    path: '/',
  },
  pricing: {
    title: 'Pricing — Free, Student Pro ₹199/mo, Schools ₹999/mo | QuesGen AI',
    description:
      'Fair pricing, maximum impact: free Core Access, Student Pro at ₹199/month, and the full School/Coaching suite with Pilot Dashboard at ₹999/month.',
    keywords: 'QuesGen pricing, edtech subscription, school exam software pricing',
    path: '/',
  },
  '/login': {
    title: 'Sign In | QuesGen AI',
    description: 'Sign in to QuesGen AI to access your personalized dashboard, adaptive tests and AI-generated exam papers.',
    path: '/login',
  },
  '/register': {
    title: 'Create Your Free Account | QuesGen AI',
    description:
      'Join QuesGen AI free: AI exam generation, 3 years of PYQs and adaptive practice for students, teachers and schools.',
    path: '/register',
  },
  '/privacy-policy': {
    title: 'Privacy Policy | QuesGen AI',
    description: 'How QuesGen AI collects, uses and protects your data.',
    path: '/privacy-policy',
  },
  '/terms-conditions': {
    title: 'Terms & Conditions | QuesGen AI',
    description: 'Terms and conditions for using the QuesGen AI platform.',
    path: '/terms-conditions',
  },
  '/cookie-policy': {
    title: 'Cookie Policy | QuesGen AI',
    description: 'How QuesGen AI uses cookies and local storage.',
    path: '/cookie-policy',
  },
};

function setMeta(attr, name, content) {
  if (!content) return;
  let el = document.head.querySelector(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setCanonical(url) {
  let el = document.head.querySelector('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', url);
}

/**
 * Apply SEO tags for a route path ('/login') or shell page id ('vault15').
 * Falls back to platform defaults for unknown keys (e.g. private dashboards).
 */
export function applySeo(key) {
  const meta = SEO_ROUTES[key] || DEFAULTS;
  const url = ORIGIN + (meta.path ?? '/');

  document.title = meta.title;
  setMeta('name', 'description', meta.description);
  setMeta('name', 'keywords', meta.keywords || DEFAULTS.keywords);
  setCanonical(url);

  setMeta('property', 'og:title', meta.title);
  setMeta('property', 'og:description', meta.description);
  setMeta('property', 'og:url', url);
  setMeta('name', 'twitter:title', meta.title);
  setMeta('name', 'twitter:description', meta.description);
}
