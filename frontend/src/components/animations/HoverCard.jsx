import React from 'react';
import { motion } from 'framer-motion';
import { hoverCardVariants, prefersReducedMotion } from '../../utils/animationConfig';

/**
 * HoverCard Component
 * Wraps any element and applies smooth hover elevation and shadow effect
 * Perfect for cards, buttons, and interactive elements
 * 
 * @param {React.ReactNode} children - Content inside the card
 * @param {string} className - CSS classes
 * @param {function} onClick - Click handler
 * @param {Object} style - Inline styles
 * @param {Object} variants - Custom hover variants
 */
export default function HoverCard({
  children,
  className = '',
  onClick = null,
  style = {},
  variants = hoverCardVariants,
}) {
  // If reduced motion is preferred, render without hover effects
  if (prefersReducedMotion()) {
    return (
      <div className={className} onClick={onClick} style={style}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      initial="initial"
      whileHover="hover"
      variants={variants}
      className={className}
      onClick={onClick}
      style={style}
    >
      {children}
    </motion.div>
  );
}
