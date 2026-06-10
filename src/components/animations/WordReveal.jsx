import { motion, useReducedMotion } from 'framer-motion';

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.055,
      delayChildren: 0.05,
    },
  },
};

const wordVariants = {
  hidden: { y: '110%', opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 24,
      mass: 0.7,
    },
  },
};

const reducedVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
};

/**
 * WordReveal
 * Splits text into words and reveals each word with a spring-physics
 * upward slide out of a clipping overflow:hidden parent — staggered.
 *
 * Props:
 *   text        – The string to animate
 *   className   – Applied to each word span
 *   style       – Applied to the outer wrapper
 *   delay       – Extra delay before the whole sequence starts (seconds)
 */
export default function WordReveal({ text, className = '', style = {}, delay = 0 }) {
  const shouldReduceMotion = useReducedMotion();
  const words = text.split(' ');

  const containerVars = shouldReduceMotion
    ? { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.3 } } }
    : {
        ...containerVariants,
        visible: {
          ...containerVariants.visible,
          transition: {
            ...containerVariants.visible.transition,
            delayChildren: containerVariants.visible.transition.delayChildren + delay,
          },
        },
      };

  const wordVars = shouldReduceMotion ? reducedVariants : wordVariants;

  return (
    <motion.span
      variants={containerVars}
      initial="hidden"
      animate="visible"
      style={{
        display: 'inline-flex',
        flexWrap: 'wrap',
        gap: '0 0.3em',
        ...style,
      }}
    >
      {words.map((word, i) => (
        <span
          key={i}
          style={{ overflow: 'hidden', display: 'inline-block', lineHeight: 'inherit' }}
        >
          <motion.span
            variants={wordVars}
            style={{ display: 'inline-block' }}
            className={className}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}
