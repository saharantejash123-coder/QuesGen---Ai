import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { prefersReducedMotion, easings } from '../../utils/animationConfig';

/**
 * NumberCounter Component
 * Animated number counting from 0 to final value
 * Perfect for stats and metrics
 * 
 * @param {number} value - Final count value
 * @param {number} duration - Animation duration in seconds
 * @param {string} suffix - Optional suffix (e.g., '+', '%')
 */
export default function NumberCounter({
  value,
  duration = 2,
  suffix = '',
  delay = 0,
}) {
  const [displayValue, setDisplayValue] = useState(0);
  const reduced = prefersReducedMotion();

  // Hooks must run on every render — keep this above any early return.
  useEffect(() => {
    if (reduced) return;
    let startTime;
    const startValue = 0;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = (timestamp - startTime) / 1000;
      const progress = Math.min(elapsed / duration, 1);

      const currentValue = Math.floor(startValue + (value - startValue) * progress);
      setDisplayValue(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    const timeoutId = setTimeout(() => {
      requestAnimationFrame(animate);
    }, delay * 1000);

    return () => clearTimeout(timeoutId);
  }, [value, duration, delay, reduced]);

  if (reduced) {
    return <span>{value}{suffix}</span>;
  }

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        delay,
        duration: 0.5,
        ease: easings.smooth,
      }}
    >
      {displayValue.toLocaleString()}{suffix}
    </motion.span>
  );
}
