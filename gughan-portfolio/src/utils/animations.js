/**
 * Animation Utilities & Variant Library
 * Centralized Framer Motion configurations for consistent animations.
 */

// --- Duration Constants ---
export const DURATION = {
  fast: 0.2,
  normal: 0.4,
  slow: 0.6,
  hero: 0.7,
  stagger: 0.08,
};

// --- Easing Curves ---
export const EASE = {
  outExpo: [0.16, 1, 0.3, 1],
  inOutCubic: [0.4, 0, 0.2, 1],
  outBack: [0.34, 1.56, 0.64, 1],
  spring: { type: 'spring', damping: 25, stiffness: 120 },
  springBouncy: { type: 'spring', damping: 15, stiffness: 150 },
};

// --- Reduced Motion Detection ---
export const prefersReducedMotion = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Returns instant transition if user prefers reduced motion
const safeTransition = (transition) => {
  return prefersReducedMotion() ? { duration: 0 } : transition;
};

// --- Fade In Variants ---
export const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (custom = 0) => ({
    opacity: 1,
    y: 0,
    transition: safeTransition({
      duration: DURATION.normal,
      ease: EASE.outExpo,
      delay: custom * DURATION.stagger,
    }),
  }),
};

export const fadeInDown = {
  hidden: { opacity: 0, y: -40 },
  visible: (custom = 0) => ({
    opacity: 1,
    y: 0,
    transition: safeTransition({
      duration: DURATION.normal,
      ease: EASE.outExpo,
      delay: custom * DURATION.stagger,
    }),
  }),
};

export const fadeInLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: (custom = 0) => ({
    opacity: 1,
    x: 0,
    transition: safeTransition({
      duration: DURATION.normal,
      ease: EASE.outExpo,
      delay: custom * DURATION.stagger,
    }),
  }),
};

export const fadeInRight = {
  hidden: { opacity: 0, x: 60 },
  visible: (custom = 0) => ({
    opacity: 1,
    x: 0,
    transition: safeTransition({
      duration: DURATION.normal,
      ease: EASE.outExpo,
      delay: custom * DURATION.stagger,
    }),
  }),
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: (custom = 0) => ({
    opacity: 1,
    transition: safeTransition({
      duration: DURATION.normal,
      ease: EASE.outExpo,
      delay: custom * DURATION.stagger,
    }),
  }),
};

// --- Scale Variants ---
export const scaleIn = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: (custom = 0) => ({
    opacity: 1,
    scale: 1,
    transition: safeTransition({
      duration: DURATION.normal,
      ease: EASE.outBack,
      delay: custom * DURATION.stagger,
    }),
  }),
};

// --- Stagger Container ---
export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: DURATION.stagger,
      delayChildren: 0.1,
    },
  },
};

export const staggerContainerSlow = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.15,
    },
  },
};

// --- Hero Text Reveal (word-by-word) ---
export const heroTextContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.3,
    },
  },
};

export const heroTextWord = {
  hidden: {
    opacity: 0,
    y: 30,
    rotateX: -40,
  },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: safeTransition({
      duration: DURATION.slow,
      ease: EASE.outExpo,
    }),
  },
};

// --- Slide Up (for modals) ---
export const slideUp = {
  hidden: { opacity: 0, y: 60, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: safeTransition({
      duration: DURATION.normal,
      ease: EASE.outExpo,
    }),
  },
  exit: {
    opacity: 0,
    y: 40,
    scale: 0.95,
    transition: safeTransition({
      duration: DURATION.fast,
      ease: EASE.inOutCubic,
    }),
  },
};

// --- Overlay fade ---
export const overlayFade = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: safeTransition({ duration: DURATION.fast }),
  },
  exit: {
    opacity: 0,
    transition: safeTransition({ duration: DURATION.fast }),
  },
};

// --- Navbar ---
export const navSlideDown = {
  hidden: { y: -100, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: safeTransition({
      duration: DURATION.slow,
      ease: EASE.outExpo,
      delay: 0.1,
    }),
  },
};

// --- Hover animations (applied via whileHover/whileTap) ---
export const hoverLift = {
  y: -6,
  transition: { duration: DURATION.fast, ease: EASE.outExpo },
};

export const hoverScale = {
  scale: 1.05,
  transition: { duration: DURATION.fast, ease: EASE.outExpo },
};

export const tapScale = {
  scale: 0.97,
};

// --- Toast slide-in ---
export const toastSlideIn = {
  hidden: { opacity: 0, x: 100, scale: 0.9 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: safeTransition(EASE.spring),
  },
  exit: {
    opacity: 0,
    x: 100,
    scale: 0.9,
    transition: safeTransition({ duration: DURATION.fast }),
  },
};

// --- Floating animation for profile picture ---
export const floatingAnimation = {
  y: [0, -8, 0],
  transition: {
    duration: 4,
    ease: 'easeInOut',
    repeat: Infinity,
    repeatType: 'loop',
  },
};

// --- Scroll indicator bounce ---
export const scrollBounce = {
  y: [0, 8, 0],
  transition: {
    duration: 1.5,
    ease: 'easeInOut',
    repeat: Infinity,
  },
};
