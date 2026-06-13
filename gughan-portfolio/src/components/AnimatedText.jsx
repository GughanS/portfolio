import { motion } from 'framer-motion';
import { heroTextContainer, heroTextWord } from '../utils/animations';

/**
 * Animated text reveal — word by word with 3D rotation.
 * @param {Object} props
 * @param {string} props.text - The text to animate.
 * @param {string} props.className - Additional CSS class.
 * @param {string} props.as - HTML tag to render (default: 'span').
 */
export default function AnimatedText({ text, className = '', as: Tag = 'span' }) {
  const words = text.split(' ');

  return (
    <motion.span
      className={className}
      variants={heroTextContainer}
      initial="hidden"
      animate="visible"
      style={{ display: 'inline-flex', flexWrap: 'wrap', perspective: '500px' }}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          variants={heroTextWord}
          style={{
            display: 'inline-block',
            marginRight: '0.3em',
            transformOrigin: 'center bottom',
          }}
        >
          {word}
        </motion.span>
      ))}
    </motion.span>
  );
}
