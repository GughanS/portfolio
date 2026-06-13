import { useRef } from 'react';
import { useInView } from 'framer-motion';

/**
 * Custom hook for scroll-triggered animations.
 * @param {Object} options
 * @param {number} options.threshold - Intersection threshold (0-1). Default 0.2.
 * @param {boolean} options.once - Only trigger once. Default true.
 * @param {string} options.margin - Root margin. Default "0px 0px -80px 0px".
 * @returns {{ ref: React.RefObject, isInView: boolean }}
 */
export function useScrollAnimation({
  threshold = 0.2,
  once = true,
  margin = '0px 0px -80px 0px',
} = {}) {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once,
    amount: threshold,
    margin,
  });

  return { ref, isInView };
}
