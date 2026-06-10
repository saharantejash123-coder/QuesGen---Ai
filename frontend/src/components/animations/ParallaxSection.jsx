import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { prefersReducedMotion } from '../../utils/animationConfig';

/**
 * ParallaxSection Component
 * Creates parallax scrolling effect using scroll position
 * Perfect for background elements, headers
 * 
 * @param {React.ReactNode} children - Content
 * @param {number} speed - Parallax speed (0.5 = half speed, 2 = double speed)
 * @param {string} className - CSS classes
 */
export default function ParallaxSection({
  children,
  speed = 0.5,
  className = '',
  style = {},
}) {
  const ref = useRef(null);
  const { scrollY } = useScroll();
  const yTransform = useTransform(scrollY, (value) => value * speed);

  if (prefersReducedMotion()) {
    return (
      <div ref={ref} className={className} style={style}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        ...style,
        y: yTransform,
      }}
    >
      {children}
    </motion.div>
  );
}
