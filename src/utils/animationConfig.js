/**
 * Premium Animation Configuration
 * Tech-Startup Aesthetic (Stripe, Vercel, VultusGo style)
 */

// Check for accessibility preference
export const prefersReducedMotion = () => {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

// Easing curves - corporate, elegant, no bounce
export const easings = {
  smooth: [0.25, 1, 0.5, 1], // Custom cubic-bezier for premium feel
  easeOut: [0.16, 1, 0.3, 1],
  easeInOut: [0.4, 0, 0.2, 1],
  easeIn: [0.4, 0, 1, 1],
};

// ─── Spring physics presets ────────────────────────────────────────────────────
// Use these instead of duration-based easings for organic, physical motion.
export const springs = {
  // Crisp, responsive — ideal for button hover/tap
  snappy: { type: 'spring', stiffness: 220, damping: 22, mass: 0.6 },
  // Gentle, floaty — ideal for card entrances
  soft:   { type: 'spring', stiffness: 140, damping: 20, mass: 0.8 },
  // Bouncy pop — ideal for icon/badge entrances
  bouncy: { type: 'spring', stiffness: 300, damping: 14, mass: 0.5 },
  // Slow & weighty — ideal for large modal/panel reveals
  heavy:  { type: 'spring', stiffness: 90,  damping: 22, mass: 1.2 },
  // Magnetic cursor follow — tight and immediate
  magnetic: { stiffness: 280, damping: 18, mass: 0.4 },
};

// Spring entrance variant factory — supply optional delay (seconds)
export const springEnterVariants = (delay = 0) => ({
  hidden: { opacity: 0, y: 40, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { ...springs.soft, delay },
  },
});

// Stagger container that uses spring children
export const springStaggerVariants = (stagger = 0.1, delayChildren = 0.1) => ({
  hidden: {},
  visible: {
    transition: { staggerChildren: stagger, delayChildren },
  },
});

// Pop-in for small badges, icons, chips
export const popInVariants = {
  hidden: { opacity: 0, scale: 0.7 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: springs.bouncy,
  },
};

// Base animation variants for scroll reveals
export const scrollRevealVariants = {
  hidden: {
    opacity: 0,
    y: 40,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: easings.smooth,
    },
  },
};

// Container variants for staggered animations
export const staggerContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

// Child item variants for staggered animations
export const staggerChildVariants = {
  hidden: {
    opacity: 0,
    y: 40,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: easings.smooth,
    },
  },
};

// Hover interaction for cards and buttons
export const hoverCardVariants = {
  initial: {
    y: 0,
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
  },
  hover: {
    y: -5,
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
    transition: {
      duration: 0.25,
      ease: easings.easeInOut,
    },
  },
};

// Scale hover variant (alternative)
export const hoverScaleVariants = {
  initial: {
    scale: 1,
  },
  hover: {
    scale: 1.02,
    transition: {
      duration: 0.25,
      ease: easings.easeInOut,
    },
  },
};

// Radial entrance (for hub diagrams)
export const radialCenterVariants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: easings.smooth,
    },
  },
};

// Radial node pop-in (for surrounding elements)
export const radialNodeVariants = {
  hidden: {
    opacity: 0,
    scale: 0,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: easings.smooth,
    },
  },
};

// Line draw animation (for connecting lines)
export const lineDrawVariants = {
  hidden: {
    strokeDasharray: 1000,
    strokeDashoffset: 1000,
  },
  visible: {
    strokeDashoffset: 0,
    transition: {
      duration: 0.8,
      ease: easings.smooth,
    },
  },
};

// Button click feedback
export const buttonTapVariants = {
  tap: {
    scale: 0.95,
    transition: {
      duration: 0.1,
    },
  },
};

// Header entrance (sticky header blur on scroll)
export const headerScrollVariants = {
  initial: {
    backdropFilter: "blur(0px)",
    backgroundColor: "rgba(255, 255, 255, 0)",
  },
  scrolled: {
    backdropFilter: "blur(12px)",
    backgroundColor: "rgba(255, 255, 255, 0.94)",
    transition: {
      duration: 0.3,
      ease: easings.easeOut,
    },
  },
};

// Page fade in on route change
export const pageEnterVariants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: easings.smooth,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.3,
    },
  },
};

// Text blur-in effect
export const textBlurInVariants = {
  hidden: {
    opacity: 0,
    filter: "blur(10px)",
  },
  visible: {
    opacity: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.6,
      ease: easings.smooth,
    },
  },
};

// Floating animation (for background elements)
export const floatVariants = {
  float: {
    y: [-10, 10, -10],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

// Scroll animation configuration
export const scrollAnimationConfig = {
  threshold: 0.15, // Trigger when 15% of element is visible from bottom
  margin: "0px 0px -80px 0px", // Trigger 80px before bottom of viewport
};

// Step/Workflow transition variants
export const stepTransitionVariants = {
  enter: {
    opacity: 0,
    x: 20,
  },
  center: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4,
      ease: easings.smooth,
    },
  },
  exit: {
    opacity: 0,
    x: -20,
    transition: {
      duration: 0.3,
    },
  },
};

// Loading state variants
export const loadingVariants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: easings.smooth,
    },
  },
};

// Skeleton/placeholder animations
export const skeletonVariants = {
  initial: {
    background: 'var(--bg2)',
  },
  animate: {
    background: ['var(--bg2)', 'rgba(100, 100, 100, 0.1)', 'var(--bg2)'],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

// Question/Card entrance with highlight effect
export const questionCardVariants = {
  hidden: {
    opacity: 0,
    y: 40,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.7,
      ease: easings.smooth,
    },
  },
  highlight: {
    borderColor: 'rgba(35, 84, 244, 0.5)',
    background: 'rgba(35, 84, 244, 0.02)',
    transition: {
      duration: 0.3,
    },
  },
};

// Filter/selector animations (for paper browser)
export const filterPanelVariants = {
  hidden: {
    opacity: 0,
    x: -20,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

export const filterItemVariants = {
  hidden: {
    opacity: 0,
    x: -10,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4,
      ease: easings.easeOut,
    },
  },
};

// Results/output entrance animation
export const resultsEnterVariants = {
  hidden: {
    opacity: 0,
    y: 50,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: easings.smooth,
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

export const resultItemVariants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: easings.smooth,
    },
  },
};

// Reduced motion overrides
export const getAnimationVariants = (variants) => {
  if (prefersReducedMotion()) {
    return {
      ...variants,
      visible: {
        ...variants.visible,
        transition: { duration: 0 },
      },
      animate: {
        ...variants.animate,
        transition: { duration: 0 },
      },
    };
  }
  return variants;
};
