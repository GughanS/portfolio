import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const EASE_OUT = [0.16, 1, 0.3, 1];

/**
 * Cinematic intro:
 * 1. Black screen → profile pic scales up with ring animation
 * 2. Name + role reveals
 * 3. Ring expands outward and fades, revealing the portfolio
 */
export default function LoadingScreen({ isLoading, profilePic, name }) {
  const [phase, setPhase] = useState(0); // 0=pic, 1=text, 2=ready

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 700);
    const t2 = setTimeout(() => setPhase(2), 1600);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const shouldShow = isLoading || phase < 2;

  return (
    <AnimatePresence>
      {shouldShow && (
        <motion.div
          key="intro"
          exit={{
            opacity: 0,
            scale: 1.15,
            filter: 'blur(30px)',
            transition: { duration: 0.9, ease: EASE_OUT },
          }}
          style={{
            position: 'fixed',
            inset: 0,
            background: '#050505',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
          }}
        >
          {/* Gradient orb behind picture */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: EASE_OUT }}
            style={{
              position: 'absolute',
              width: 300,
              height: 300,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(34,211,238,0.08) 0%, rgba(168,85,247,0.05) 40%, transparent 70%)',
              filter: 'blur(40px)',
            }}
          />

          {/* Orbiting ring */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.4, rotate: 360 }}
            transition={{
              scale: { duration: 0.8, ease: EASE_OUT },
              opacity: { duration: 0.8 },
              rotate: { duration: 8, ease: 'linear', repeat: Infinity },
            }}
            style={{
              position: 'absolute',
              width: 170,
              height: 170,
              borderRadius: '50%',
              border: '1px solid transparent',
              borderTopColor: 'rgba(34,211,238,0.4)',
              borderRightColor: 'rgba(168,85,247,0.2)',
            }}
          />

          {/* Profile Picture */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 18, stiffness: 90, delay: 0.15 }}
            style={{
              width: 120,
              height: 120,
              borderRadius: '50%',
              overflow: 'hidden',
              border: '2px solid rgba(255,255,255,0.08)',
              boxShadow: '0 0 60px rgba(34,211,238,0.1), 0 0 120px rgba(168,85,247,0.05)',
              position: 'relative',
              zIndex: 1,
            }}
          >
            <img
              src={profilePic || 'https://github.com/GughanS.png'}
              alt="Profile"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </motion.div>

          {/* Name + Role */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={phase >= 1 ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: EASE_OUT }}
            style={{ textAlign: 'center', marginTop: '1.5rem', position: 'relative', zIndex: 1 }}
          >
            <h1 style={{
              fontSize: '1.4rem',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              background: 'linear-gradient(135deg, #fff, #888)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
            }}>
              {name || 'Gughan S'}
            </h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={phase >= 1 ? { opacity: 1 } : {}}
              transition={{ delay: 0.2, duration: 0.5 }}
              style={{ color: '#555', fontSize: '0.8rem', marginTop: '0.3rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}
            >
              Machine Learning Engineer
            </motion.p>
          </motion.div>

          {/* Loading bar */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 60 }}
            transition={{ delay: 0.8, duration: 1.2, ease: EASE_OUT }}
            style={{
              height: 1,
              background: 'linear-gradient(90deg, rgba(34,211,238,0.4), rgba(168,85,247,0.4))',
              marginTop: '2rem',
              borderRadius: 1,
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
