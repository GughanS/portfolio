import { motion } from 'framer-motion';
import {
  Github, Linkedin, Download, GraduationCap, ChevronDown, MapPin, Sparkles,
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import AnimatedText from './AnimatedText';
import {
  fadeInUp, fadeInLeft, fadeInRight, staggerContainer, floatingAnimation,
  scrollBounce, tapScale, hoverScale, EASE,
} from '../utils/animations';

/* Animated floating orbs */
function FloatingOrbs() {
  const orbs = [
    { size: 400, x: '5%', y: '15%', color: 'rgba(168,85,247,0.04)', dur: 20, delay: 0 },
    { size: 350, x: '70%', y: '25%', color: 'rgba(34,211,238,0.035)', dur: 25, delay: 3 },
    { size: 250, x: '50%', y: '65%', color: 'rgba(59,130,246,0.03)', dur: 22, delay: 1 },
    { size: 200, x: '85%', y: '70%', color: 'rgba(52,211,153,0.025)', dur: 28, delay: 5 },
  ];

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {orbs.map((o, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute', left: o.x, top: o.y,
            width: o.size, height: o.size, borderRadius: '50%',
            background: o.color, filter: 'blur(80px)',
          }}
          animate={{ x: [0, 40, -30, 0], y: [0, -30, 20, 0] }}
          transition={{ duration: o.dur, ease: 'easeInOut', repeat: Infinity, delay: o.delay }}
        />
      ))}
    </div>
  );
}

export default function Hero() {
  const { content, isAdmin, openEdit } = usePortfolio();
  const { personalInfo } = content;

  return (
    <section
      id="about"
      style={{
        paddingTop: 'calc(var(--nav-height) + 4rem)',
        paddingBottom: 'var(--section-padding)',
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <FloatingOrbs />

      {isAdmin && (
        <motion.button
          onClick={() => openEdit('personal', personalInfo)}
          whileHover={hoverScale}
          whileTap={tapScale}
          style={{
            position: 'absolute', top: 'calc(var(--nav-height) + 1rem)', right: '1.5rem',
            background: 'rgba(34,211,238,0.08)', border: '1px solid rgba(34,211,238,0.2)',
            color: '#22d3ee', padding: '0.5rem 0.75rem', borderRadius: '0.5rem',
            cursor: 'pointer', zIndex: 50, fontSize: '0.78rem', fontWeight: 500,
          }}
        >
          ✏️ Edit
        </motion.button>
      )}

      <div className="container" style={{ position: 'relative', zIndex: 1, width: '100%' }}>
        <div style={{ display: 'flex', gap: '3.5rem', width: '100%', flexWrap: 'wrap', alignItems: 'flex-start' }}>
          {/* Left: text content */}
          <motion.div
            style={{ flex: '1 1 480px', minWidth: 0 }}
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {/* Profile pic with animated ring */}
            {personalInfo.profilePic && (
              <motion.div variants={fadeInUp} style={{ marginBottom: '2rem', display: 'inline-block' }}>
                <motion.div animate={floatingAnimation} style={{ position: 'relative', display: 'inline-block' }}>
                  {/* Orbiting ring */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10, ease: 'linear', repeat: Infinity }}
                    style={{
                      position: 'absolute', inset: -8, borderRadius: '50%',
                      border: '1.5px solid transparent',
                      borderTopColor: 'rgba(34,211,238,0.4)',
                      borderRightColor: 'rgba(168,85,247,0.2)',
                    }}
                  />
                  {/* Glow */}
                  <div style={{
                    position: 'absolute', inset: -20, borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(34,211,238,0.08) 0%, rgba(168,85,247,0.04) 50%, transparent 70%)',
                    filter: 'blur(20px)', pointerEvents: 'none',
                  }} />
                  <div style={{
                    width: 110, height: 110, borderRadius: '50%', overflow: 'hidden',
                    border: '2px solid rgba(255,255,255,0.08)',
                    position: 'relative', zIndex: 1,
                  }}>
                    <img src={personalInfo.profilePic} alt={personalInfo.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* Status badge */}
            <motion.div
              variants={fadeInLeft}
              style={{
                display: 'inline-flex', alignItems: 'center', padding: '0.3rem 0.85rem',
                background: 'rgba(52,211,153,0.06)', border: '1px solid rgba(52,211,153,0.12)',
                borderRadius: '9999px', color: '#34d399', fontSize: '0.82rem',
                fontWeight: 500, marginBottom: '1.5rem', gap: '0.5rem',
              }}
            >
              <motion.span
                style={{ width: 6, height: 6, backgroundColor: '#34d399', borderRadius: '50%' }}
                animate={{ boxShadow: ['0 0 0 0 rgba(52,211,153,0.4)', '0 0 0 8px rgba(52,211,153,0)'] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              Open to Opportunities
            </motion.div>

            {/* Name — animated text */}
            <div style={{ marginBottom: '0.5rem' }}>
              <h1 style={{
                fontSize: 'clamp(2.5rem, 5vw, 3.8rem)', fontWeight: 800,
                lineHeight: 1.05, letterSpacing: '-0.04em',
              }}>
                <AnimatedText text={personalInfo.name} />
              </h1>
            </div>

            {/* Role — gradient */}
            <motion.h2 variants={fadeInUp} custom={2} style={{
              fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)', fontWeight: 400, marginBottom: '1.5rem',
              background: 'linear-gradient(135deg, #22d3ee, #a855f7)',
              WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent',
            }}>
              {personalInfo.role}
            </motion.h2>

            {/* Description */}
            <motion.p variants={fadeInUp} custom={4} style={{
              color: '#777', fontSize: '1rem', maxWidth: 520, marginBottom: '2rem', lineHeight: 1.75,
            }}>
              Passionate about leveraging data to build intelligent systems.
              Specializing in Deep Learning, NLP, and scalable data architectures.
              Based in <span style={{ color: '#bbb', fontWeight: 500 }}>{personalInfo.location}</span>.
            </motion.p>

            {/* Social buttons */}
            <motion.div variants={staggerContainer} initial="hidden" animate="visible"
              style={{ display: 'flex', flexWrap: 'wrap', gap: '0.7rem' }}
            >
              {[
                { href: personalInfo.social.github, icon: <Github size={16} />, label: 'GitHub', primary: false },
                { href: personalInfo.social.linkedin, icon: <Linkedin size={16} />, label: 'LinkedIn', primary: true },
                { href: personalInfo.social.resume, icon: <Download size={16} />, label: 'Resume', primary: false },
              ].map((btn, i) => (
                <motion.a
                  key={btn.label}
                  href={btn.href} target="_blank" rel="noreferrer"
                  variants={fadeInUp} custom={i + 6}
                  whileHover={{
                    y: -3,
                    boxShadow: btn.primary
                      ? '0 8px 30px rgba(34,211,238,0.2), 0 0 15px rgba(168,85,247,0.1)'
                      : '0 8px 25px rgba(0,0,0,0.5)',
                  }}
                  whileTap={tapScale}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.45rem',
                    padding: '0.6rem 1.1rem', borderRadius: '0.55rem',
                    fontWeight: 500, fontSize: '0.85rem', transition: 'box-shadow 0.3s',
                    textDecoration: 'none',
                    ...(btn.primary
                      ? { background: 'linear-gradient(135deg, #22d3ee, #a855f7)', color: '#000', border: 'none' }
                      : { background: 'rgba(255,255,255,0.04)', color: '#bbb', border: '1px solid rgba(255,255,255,0.08)' }),
                  }}
                >
                  {btn.icon} {btn.label}
                </motion.a>
              ))}
            </motion.div>
          </motion.div>

          {/* Right: Education card */}
          <motion.div
            variants={fadeInRight} initial="hidden" animate="visible" custom={3}
            className="glow-card"
            style={{
              width: '100%', maxWidth: 330, padding: '1.75rem', alignSelf: 'flex-start',
            }}
          >
            <div style={{
              display: 'flex', alignItems: 'center', gap: '0.6rem',
              fontSize: '1rem', fontWeight: 600, marginBottom: '1.2rem', color: '#f0f0f0',
            }}>
              <div style={{
                background: 'linear-gradient(135deg, rgba(34,211,238,0.1), rgba(168,85,247,0.1))',
                padding: '0.5rem', borderRadius: '0.5rem', display: 'flex',
              }}>
                <GraduationCap size={18} color="#22d3ee" />
              </div>
              Education
            </div>

            <p style={{ color: '#ccc', fontWeight: 500, fontSize: '0.9rem' }}>
              {personalInfo.education.college}
            </p>
            <p style={{ fontSize: '0.82rem', color: '#777', marginTop: '0.3rem' }}>
              {personalInfo.education.degree}
            </p>
            <p style={{ fontSize: '0.82rem', color: '#555', marginTop: '0.15rem' }}>
              CGPA: {personalInfo.education.cgpa}
            </p>

            <div style={{ height: 1, background: 'rgba(255,255,255,0.05)', margin: '1.2rem 0' }} />

            <p style={{
              fontSize: '0.72rem', color: '#555', marginBottom: '0.5rem',
              fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em',
            }}>
              Key Competencies
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
              {['DSA', 'Model Deployment', 'Data Pipelines'].map((tag) => (
                <motion.span
                  key={tag}
                  whileHover={{ background: 'rgba(34,211,238,0.08)', borderColor: 'rgba(34,211,238,0.15)' }}
                  style={{
                    background: 'rgba(255,255,255,0.03)', color: '#888',
                    padding: '0.2rem 0.55rem', borderRadius: '0.3rem', fontSize: '0.72rem',
                    border: '1px solid rgba(255,255,255,0.05)', transition: 'all 0.2s',
                  }}
                >
                  {tag}
                </motion.span>
              ))}
            </div>

            <div style={{
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              marginTop: '1rem', color: '#555', fontSize: '0.75rem',
            }}>
              <MapPin size={12} /> {personalInfo.location}
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5, duration: 0.8 }}
          style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            gap: '0.4rem', marginTop: '3rem',
          }}
        >
          <span style={{ fontSize: '0.68rem', color: '#444', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
            Scroll to explore
          </span>
          <motion.div animate={scrollBounce}>
            <ChevronDown size={16} color="#444" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
