import React from 'react';
import { motion } from 'framer-motion';
import { prefersReducedMotion } from '../../utils/animationConfig';

/**
 * FloatingElement Component
 * Creates subtle floating/bobbing animation effect
 * Perfect for background globs, decorative elements
 * 
 * @param {React.ReactNode} children - Element to float
 * @param {number} duration - Animation duration in seconds
 * @param {number} distance - Float distance in pixels
 * @param {number} delay - Stagger delay for multiple elements
 * @param {string} direction - 'up' | 'diagonal' (default: 'up')
 */
export default function FloatingElement({
  children,
  duration = 8,
  distance = 20,
  delay = 0,
  direction = 'up',
  className = '',
  style = {},
}) {
  if (prefersReducedMotion()) {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    );
  }

  const variants = {
    float: direction === 'up' ? {
      y: [-distance, distance, -distance],
      transition: {
        duration,
        repeat: Infinity,
        ease: 'easeInOut',
        delay,
      },
    } : {
      x: [-distance, distance, -distance],
      y: [-distance / 2, distance / 2, -distance / 2],
      transition: {
        duration,
        repeat: Infinity,
        ease: 'easeInOut',
        delay,
      },
    },
  };

  return (
    <motion.div
      className={className}
      style={style}
      variants={variants}
      animate="float"
    >
      {children}
    </motion.div>
  );
}
