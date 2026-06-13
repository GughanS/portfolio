import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { navSlideDown, hoverScale, tapScale } from '../utils/animations';
import { usePortfolio } from '../context/PortfolioContext';

const navLinks = [
  { href: '#about', label: 'About' },
  { href: '#skills', label: 'Skills' },
  { href: '#projects', label: 'Projects' },
  { href: '#contact', label: 'Contact' },
];

export default function Navbar() {
  const { isAdmin, handleLogout } = usePortfolio();
  const [activeSection, setActiveSection] = useState('');
  const { scrollY } = useScroll();
  const bgOpacity = useTransform(scrollY, [0, 100], [0, 0.9]);
  const blur = useTransform(scrollY, [0, 100], [0, 20]);

  useEffect(() => {
    const handleScroll = () => {
      const sections = navLinks.map(l => l.href.slice(1));
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.getBoundingClientRect().top <= 120) {
          setActiveSection(sections[i]);
          return;
        }
      }
      setActiveSection('');
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e, href) => {
    e.preventDefault();
    const el = document.querySelector(href);
    if (el) {
      const top = el.offsetTop - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <motion.nav
      variants={navSlideDown}
      initial="hidden"
      animate="visible"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        zIndex: 1000,
        height: 'var(--nav-height)',
      }}
    >
      {/* Dynamic blur background */}
      <motion.div style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(5,5,5,0.85)',
        opacity: bgOpacity,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
      }} />

      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '100%',
        position: 'relative',
        zIndex: 1,
      }}>
        {/* Logo */}
        <motion.a
          href="#about"
          onClick={(e) => handleNavClick(e, '#about')}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          style={{
            fontSize: '1.4rem',
            fontWeight: 800,
            background: 'linear-gradient(135deg, #22d3ee, #a855f7)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
            cursor: 'pointer',
            textDecoration: 'none',
            letterSpacing: '-0.03em',
          }}
        >
          GS.
        </motion.a>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.15rem' }}>
          {navLinks.map((link) => {
            const isActive = activeSection === link.href.slice(1);
            return (
              <motion.a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                whileHover={{ color: '#f0f0f0' }}
                style={{
                  color: isActive ? '#f0f0f0' : '#666',
                  fontSize: '0.84rem',
                  fontWeight: 500,
                  padding: '0.5rem 0.85rem',
                  borderRadius: '0.5rem',
                  position: 'relative',
                  transition: 'color 0.2s',
                  textDecoration: 'none',
                }}
              >
                {link.label}
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    style={{
                      position: 'absolute',
                      bottom: 2,
                      left: '20%',
                      right: '20%',
                      height: '2px',
                      borderRadius: '1px',
                      background: 'linear-gradient(90deg, #22d3ee, #a855f7)',
                    }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  />
                )}
              </motion.a>
            );
          })}

          {isAdmin && (
            <motion.button
              onClick={handleLogout}
              whileHover={{ background: 'rgba(251,113,133,0.15)' }}
              whileTap={tapScale}
              style={{
                color: '#fb7185',
                fontSize: '0.78rem',
                fontWeight: 500,
                background: 'rgba(251,113,133,0.08)',
                border: '1px solid rgba(251,113,133,0.12)',
                borderRadius: '0.4rem',
                padding: '0.35rem 0.7rem',
                marginLeft: '0.5rem',
                cursor: 'pointer',
              }}
            >
              Logout
            </motion.button>
          )}
        </div>
      </div>
    </motion.nav>
  );
}
