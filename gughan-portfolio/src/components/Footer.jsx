import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import ScrollReveal from './ScrollReveal';

export default function Footer() {
  const { content, setIsLoginOpen } = usePortfolio();

  return (
    <ScrollReveal direction="up">
      <footer style={{ textAlign: 'center', padding: '3rem 1.5rem 2rem', position: 'relative' }}>
        {/* Gradient divider */}
        <div style={{
          width: '100%', maxWidth: 400, height: 1, margin: '0 auto 2.5rem',
          background: 'linear-gradient(90deg, transparent, rgba(34,211,238,0.12), rgba(168,85,247,0.12), transparent)',
        }} />

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          style={{ color: '#333', fontSize: '0.8rem', marginBottom: '0.5rem' }}
        >
          Designed & Built by
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{
            fontSize: '0.9rem', fontWeight: 600, marginBottom: '1rem',
            background: 'linear-gradient(135deg, #22d3ee, #a855f7)',
            WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent',
            display: 'inline-block',
          }}
        >
          {content.personalInfo.name}
        </motion.p>
        <p style={{ color: '#333', fontSize: '0.72rem', marginBottom: '1.5rem' }}>
          © {new Date().getFullYear()} — React + Framer Motion
        </p>

        <motion.button
          onClick={() => setIsLoginOpen(true)}
          whileHover={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.1)' }}
          whileTap={{ scale: 0.95 }}
          style={{
            color: '#333', cursor: 'pointer', fontSize: '0.72rem',
            display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
            padding: '0.35rem 0.7rem', border: '1px solid rgba(255,255,255,0.04)',
            borderRadius: '0.4rem', background: 'transparent', transition: 'all 0.2s',
          }}
        >
          <Lock size={10} /> Admin
        </motion.button>
      </footer>
    </ScrollReveal>
  );
}
