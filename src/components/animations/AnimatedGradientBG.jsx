import React from 'react';
import { motion } from 'framer-motion';
import { prefersReducedMotion } from '../../utils/animationConfig';

/**
 * AnimatedGradientBG Component
 * Creates an animated gradient background that shifts colors
 * Perfect for hero sections and decorative backgrounds
 * 
 * @param {Array<string>} colors - Array of hex colors to cycle through
 * @param {number} duration - Animation duration in seconds
 * @param {React.ReactNode} children - Content
 */
export default function AnimatedGradientBG({
  colors = ['#2354F4', '#0891B2', '#7C3AED', '#2354F4'],
  duration = 10,
  children,
  className = '',
  style = {},
}) {
  if (prefersReducedMotion()) {
    return (
      <div
        className={className}
        style={{
          ...style,
          background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})`,
        }}
      >
        {children}
      </div>
    );
  }

  const gradientVariants = {
    animate: {
      backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
      transition: {
        duration,
        repeat: Infinity,
        ease: 'linear',
      },
    },
  };

  return (
    <motion.div
      className={className}
      style={{
        ...style,
        background: `linear-gradient(135deg, ${colors.join(', ')})`,
        backgroundSize: '200% 200%',
        backgroundPosition: '0% 0%',
      }}
      variants={gradientVariants}
      animate="animate"
    >
      {children}
    </motion.div>
  );
}
