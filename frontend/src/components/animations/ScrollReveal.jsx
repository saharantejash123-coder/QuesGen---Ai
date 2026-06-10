import React, { useEffect, useRef } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';
import { scrollRevealVariants, prefersReducedMotion } from '../../utils/animationConfig';

/**
 * ScrollReveal Component
 * Automatically triggers fade-in + slide-up animation when element enters viewport
 * 
 * @param {React.ReactNode} children - Content to animate
 * @param {Object} variants - Custom animation variants (optional)
 * @param {number} delay - Additional delay in seconds (optional)
 * @param {string} className - CSS classes to apply
 */
export default function ScrollReveal({
  children,
  variants = scrollRevealVariants,
  delay = 0,
  className = '',
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true, // Animate only once
    amount: 0.3, // Trigger when 30% is visible
  });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [isInView, controls]);

  // If reduced motion is preferred, skip animations
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
      variants={{
        ...variants,
        visible: {
          ...variants.visible,
          transition: {
            ...variants.visible.transition,
            delay: variants.visible.transition?.delay || 0 + delay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
