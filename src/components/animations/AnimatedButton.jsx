import React from 'react';
import { motion } from 'framer-motion';
import { prefersReducedMotion, easings } from '../../utils/animationConfig';

/**
 * AnimatedButton Component
 * Button with smooth hover elevation and tap feedback
 * 
 * @param {string} label - Button text
 * @param {function} onClick - Click handler
 * @param {string} variant - 'primary' | 'secondary' | 'amber'
 * @param {string} className - Additional CSS classes
 * @param {boolean} disabled - Disabled state
 */
export default function AnimatedButton({
  label,
  onClick = () => {},
  variant = 'primary',
  className = '',
  disabled = false,
  ...rest
}) {
  const baseClasses = {
    primary: 'btn-p',
    secondary: 'btn-g',
    amber: 'btn-a',
  };

  if (prefersReducedMotion()) {
    return (
      <button
        className={`${baseClasses[variant]} ${className}`}
        onClick={onClick}
        disabled={disabled}
        {...rest}
      >
        {label}
      </button>
    );
  }

  return (
    <motion.button
      className={`${baseClasses[variant]} ${className}`}
      onClick={onClick}
      disabled={disabled}
      whileHover={{
        y: -2,
        transition: {
          duration: 0.2,
          ease: easings.easeInOut,
        },
      }}
      whileTap={{
        scale: 0.95,
        transition: {
          duration: 0.1,
        },
      }}
      {...rest}
    >
      {label}
    </motion.button>
  );
}
