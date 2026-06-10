import React from 'react';
import { motion } from 'framer-motion';
import { prefersReducedMotion, easings, staggerContainerVariants, staggerChildVariants } from '../../utils/animationConfig';

/**
 * AnimatedGrid Component
 * Container for staggered animations of grid items (papers, questions, results)
 * 
 * @param {React.ReactNode} children - Grid items
 * @param {string} className - CSS classes
 * @param {Object} containerVariants - Custom container variants
 * @param {Object} itemVariants - Custom item variants
 */
export default function AnimatedGrid({
  children,
  className = '',
  containerVariants = staggerContainerVariants,
  itemVariants = staggerChildVariants,
}) {
  if (prefersReducedMotion()) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {React.Children.map(children, (child, index) => (
        <motion.div key={index} variants={itemVariants}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}

/**
 * AnimatedListItem Component
 * Individual list item with fade and slide animation
 * Use inside AnimatedGrid or standalone
 * 
 * @param {React.ReactNode} children - Item content
 * @param {number} delay - Additional animation delay
 * @param {string} className - CSS classes
 */
export function AnimatedListItem({
  children,
  delay = 0,
  className = '',
}) {
  if (prefersReducedMotion()) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
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
