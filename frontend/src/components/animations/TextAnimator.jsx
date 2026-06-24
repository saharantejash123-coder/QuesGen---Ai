import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { prefersReducedMotion, easings } from '../../utils/animationConfig';

/**
 * TextAnimator Component
 * Animates text with letter-by-letter or word-by-word stagger
 * Creates premium text entrance effects
 * 
 * @param {string} text - Text to animate
 * @param {string} mode - 'letters' | 'words' (default: 'words')
 * @param {number} delay - Initial delay before animation starts
 * @param {string} className - CSS classes
 */
export default function TextAnimator({
  text,
  mode = 'words',
  delay = 0,
  className = '',
  style = {},
}) {
  // Hooks must run on every render \u2014 keep useMemo above any early return.
  const items = useMemo(() => {
    if (mode === 'letters') {
      return text.split('').map((char, i) => ({
        id: i,
        text: char === ' ' ? '\u00A0' : char, // non-breaking space
        isSpace: char === ' ',
      }));
    } else {
      return text.split(' ').map((word, i) => ({
        id: i,
        text: word,
        isSpace: false,
      }));
    }
  }, [text, mode]);

  if (prefersReducedMotion()) {
    return <div className={className} style={style}>{text}</div>;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: mode === 'letters' ? 0.02 : 0.05,
        delayChildren: delay,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 10,
      filter: 'blur(4px)',
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 0.4,
        ease: easings.smooth,
      },
    },
  };

  return (
    <motion.div
      className={className}
      style={style}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {items.map((item) => (
        <motion.span
          key={item.id}
          variants={itemVariants}
          style={{
            display: mode === 'words' ? 'inline-block' : 'inline',
            marginRight: mode === 'words' ? '0.25em' : '0',
          }}
        >
          {item.text}
        </motion.span>
      ))}
    </motion.div>
  );
}
