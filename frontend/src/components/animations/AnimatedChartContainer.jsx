import React from 'react';
import { motion } from 'framer-motion';
import { prefersReducedMotion, easings, staggerChildVariants } from '../../utils/animationConfig';

/**
 * AnimatedChartContainer Component
 * Wraps charts and adds premium entrance animation
 * 
 * @param {React.ReactNode} children - Chart component (e.g., <BarChart>)
 * @param {string} className - CSS classes
 * @param {number} delay - Animation delay in seconds
 */
export default function AnimatedChartContainer({
  children,
  className = '',
  delay = 0,
}) {
  if (prefersReducedMotion()) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{
        opacity: 0,
        y: 30,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.7,
        delay,
        ease: easings.smooth,
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * AnimatedChartBar Component
 * Individual chart bar that animates in sequence
 * Used as a wrapper for recharts Bar components
 */
export function AnimatedChartBar({
  dataKey,
  fill,
  children,
  delay = 0,
}) {
  if (prefersReducedMotion()) {
    return children;
  }

  return (
    <motion.g
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        delay,
        ease: easings.smooth,
      }}
    >
      {children}
    </motion.g>
  );
}
