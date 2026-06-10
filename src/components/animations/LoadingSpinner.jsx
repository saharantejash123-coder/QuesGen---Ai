import React from 'react';
import { motion } from 'framer-motion';
import { prefersReducedMotion, easings } from '../../utils/animationConfig';

/**
 * LoadingSpinner Component
 * Premium loading indicator with pulsing center and rotating border
 * 
 * @param {string} size - 'sm' | 'md' | 'lg' (default: 'md')
 * @param {string} message - Optional loading message
 * @param {string} color - Hex color or CSS color (default: '#2354F4')
 */
export default function LoadingSpinner({
  size = 'md',
  message = null,
  color = '#2354F4',
}) {
  if (prefersReducedMotion()) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <div style={{ fontSize: '0.9rem', color: 'var(--text3)' }}>Loading...</div>
      </div>
    );
  }

  const sizes = {
    sm: { outer: 48, inner: 36 },
    md: { outer: 80, inner: 64 },
    lg: { outer: 120, inner: 96 },
  };

  const s = sizes[size];

  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <div style={{ position: 'relative', width: s.outer, height: s.outer, margin: '0 auto', marginBottom: message ? '1.5rem' : 0 }}>
        {/* Outer rotating ring */}
        <motion.div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            border: `3px solid ${color}`,
            borderTopColor: 'transparent',
            opacity: 0.3,
          }}
          animate={{ rotate: 360 }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'linear',
          }}
        />

        {/* Inner pulsing element */}
        <motion.div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: s.inner,
            height: s.inner,
            marginLeft: -s.inner / 2,
            marginTop: -s.inner / 2,
            borderRadius: '50%',
            border: `2px solid ${color}`,
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: easings.easeInOut,
          }}
        />

        {/* Center pulse dot */}
        <motion.div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: 8,
            height: 8,
            marginLeft: -4,
            marginTop: -4,
            borderRadius: '50%',
            background: color,
          }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [1, 0.5, 1],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: easings.easeInOut,
          }}
        />
      </div>

      {message && (
        <motion.p
          style={{
            fontSize: '0.9rem',
            color: 'var(--text3)',
            margin: 0,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {message}
        </motion.p>
      )}
    </div>
  );
}
