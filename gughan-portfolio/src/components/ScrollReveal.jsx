import { motion } from 'framer-motion';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { fadeInUp, fadeInDown, fadeInLeft, fadeInRight, fadeIn, scaleIn } from '../utils/animations';

const variantMap = {
  up: fadeInUp,
  down: fadeInDown,
  left: fadeInLeft,
  right: fadeInRight,
  fade: fadeIn,
  scale: scaleIn,
};

/**
 * Wrapper that animates children when scrolled into view.
 * @param {Object} props
 * @param {'up'|'down'|'left'|'right'|'fade'|'scale'} props.direction - Animation direction.
 * @param {number} props.delay - Custom delay index for stagger calculations.
 * @param {string} props.className - Additional CSS class.
 * @param {Object} props.style - Inline styles.
 * @param {React.ReactNode} props.children
 */
export default function ScrollReveal({
  children,
  direction = 'up',
  delay = 0,
  className = '',
  style = {},
  ...props
}) {
  const { ref, isInView } = useScrollAnimation();
  const variants = variantMap[direction] || fadeInUp;

  return (
    <motion.div
      ref={ref}
      className={className}
      style={style}
      variants={variants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      custom={delay}
      {...props}
    >
      {children}
    </motion.div>
  );
}
