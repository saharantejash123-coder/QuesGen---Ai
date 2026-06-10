import React, { useRef, useEffect } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';
import {
  staggerContainerVariants,
  staggerChildVariants,
  prefersReducedMotion,
} from '../../utils/animationConfig';

/**
 * StaggerContainer Component
 * Wraps a grid/flex container and automatically staggered animates all direct children
 * Each child fades in and slides up with a 0.12s delay between them
 * 
 * @param {React.ReactNode} children - Child elements to stagger animate
 * @param {Object} containerVariants - Custom container animation variants
 * @param {Object} childVariants - Custom child animation variants
 * @param {string} className - CSS classes to apply to the container
 */
export default function StaggerContainer({
  children,
  containerVariants = staggerContainerVariants,
  childVariants = staggerChildVariants,
  className = '',
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true,
    amount: 0.3,
  });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [isInView, controls]);

  // If reduced motion is preferred, render without animation
  if (prefersReducedMotion()) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={containerVariants}
      className={className}
    >
      {React.Children.map(children, (child) => (
        <motion.div
          variants={childVariants}
          key={child.key}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}
