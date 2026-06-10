import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { pageEnterVariants, prefersReducedMotion } from '../../utils/animationConfig';

/**
 * StepTransition Component
 * Smooth page/step transitions with fade and slide effects
 * Perfect for multi-step workflows (configure → loading → results)
 * 
 * @param {React.ReactNode} children - Content to display
 * @param {number} stepKey - Unique key to trigger re-animation on step change
 * @param {string} direction - 'forward' | 'backward' (affects slide direction)
 */
export default function StepTransition({
  children,
  stepKey = 0,
  direction = 'forward',
}) {
  if (prefersReducedMotion()) {
    return <div>{children}</div>;
  }

  const variants = {
    enter: {
      opacity: 0,
      x: direction === 'forward' ? 20 : -20,
    },
    center: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
        ease: [0.25, 1, 0.5, 1],
      },
    },
    exit: {
      opacity: 0,
      x: direction === 'forward' ? -20 : 20,
      transition: {
        duration: 0.3,
      },
    },
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={stepKey}
        initial="enter"
        animate="center"
        exit="exit"
        variants={variants}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
