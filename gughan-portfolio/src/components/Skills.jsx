import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Brain, Code2, Database, Terminal, ChevronRight } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import ScrollReveal from './ScrollReveal';
import { fadeInUp, fadeInLeft, fadeInRight, hoverScale, tapScale, EASE } from '../utils/animations';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const iconMap = [
  { Icon: Brain, color: '#a855f7', glow: 'rgba(168,85,247,0.15)' },
  { Icon: Code2, color: '#22d3ee', glow: 'rgba(34,211,238,0.15)' },
  { Icon: Database, color: '#34d399', glow: 'rgba(52,211,153,0.15)' },
  { Icon: Terminal, color: '#fbbf24', glow: 'rgba(251,191,36,0.15)' },
];

/* Skill proficiency for progress bars */
const skillLevels = { 'Machine Learning & DS': 92, Languages: 85, Databases: 80, 'Core Tech & Tools': 78 };

function SkillCard({ category, index }) {
  const { ref, isInView } = useScrollAnimation();
  const direction = index % 2 === 0 ? fadeInLeft : fadeInRight;
  const { Icon, color, glow } = iconMap[index % iconMap.length];
  const level = skillLevels[category.title] || 75;

  return (
    <motion.div
      ref={ref}
      variants={direction}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      custom={index}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: 'spring', damping: 20, stiffness: 150 }}
      className="glow-card shine-card"
      style={{ padding: '1.75rem', cursor: 'default' }}
    >
      {/* Top gradient line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 0.7, ease: EASE.outExpo, delay: index * 0.12 }}
        style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 2,
          background: `linear-gradient(90deg, ${color}, transparent)`,
          transformOrigin: 'left', borderRadius: '1rem 1rem 0 0',
        }}
      />

      {/* Icon with glow */}
      <motion.div
        whileHover={{ rotate: 20, scale: 1.15 }}
        transition={{ type: 'spring', damping: 12 }}
        style={{
          background: glow, padding: '0.75rem', borderRadius: '0.65rem',
          display: 'inline-flex', marginBottom: '1rem',
          boxShadow: `0 0 20px ${glow}`,
        }}
      >
        <Icon size={22} color={color} />
      </motion.div>

      <h3 style={{
        fontSize: '1.05rem', fontWeight: 600, marginBottom: '0.75rem',
        color: '#f0f0f0',
      }}>
        {category.title}
      </h3>

      {/* Progress bar */}
      <div style={{ marginBottom: '1rem' }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem',
        }}>
          <span style={{ fontSize: '0.7rem', color: '#555', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Proficiency
          </span>
          <motion.span
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: index * 0.15 + 0.5 }}
            style={{ fontSize: '0.72rem', color, fontWeight: 600 }}
          >
            {level}%
          </motion.span>
        </div>
        <div style={{
          height: 3, background: 'rgba(255,255,255,0.04)', borderRadius: 2, overflow: 'hidden',
        }}>
          <motion.div
            initial={{ width: 0 }}
            animate={isInView ? { width: `${level}%` } : { width: 0 }}
            transition={{ duration: 1, ease: EASE.outExpo, delay: index * 0.15 + 0.3 }}
            style={{
              height: '100%', borderRadius: 2,
              background: `linear-gradient(90deg, ${color}, ${color}88)`,
              boxShadow: `0 0 8px ${glow}`,
            }}
          />
        </div>
      </div>

      {/* Skills list */}
      <ul style={{ padding: 0 }}>
        {category.skills.map((skill, sIdx) => (
          <motion.li
            key={sIdx}
            initial={{ opacity: 0, x: -12 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: index * 0.08 + sIdx * 0.04 + 0.2, duration: 0.35, ease: EASE.outExpo }}
            style={{
              display: 'flex', alignItems: 'center', color: '#777',
              fontSize: '0.83rem', marginBottom: '0.4rem', gap: '0.35rem',
            }}
          >
            <ChevronRight size={11} color="#444" />
            {skill}
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}

export default function Skills() {
  const { content, isAdmin, openEdit } = usePortfolio();

  return (
    <section
      id="skills"
      style={{ padding: `var(--section-padding) 0`, position: 'relative' }}
    >
      {/* Section divider */}
      <div className="section-divider" />

      {isAdmin && (
        <motion.button
          onClick={() => openEdit('skills', content.skillCategories)}
          whileHover={hoverScale} whileTap={tapScale}
          style={{
            position: 'absolute', top: '1.5rem', right: '1.5rem',
            background: 'rgba(34,211,238,0.08)', border: '1px solid rgba(34,211,238,0.2)',
            color: '#22d3ee', padding: '0.5rem 0.75rem', borderRadius: '0.5rem',
            cursor: 'pointer', zIndex: 50, fontSize: '0.78rem', fontWeight: 500,
          }}
        >
          ✏️ Edit
        </motion.button>
      )}

      <div className="container" style={{ paddingTop: '3rem' }}>
        <ScrollReveal direction="up">
          <div style={{ marginBottom: '3.5rem', textAlign: 'center' }}>
            <motion.p
              style={{
                fontSize: '0.72rem', color: '#22d3ee', textTransform: 'uppercase',
                letterSpacing: '0.15em', fontWeight: 600, marginBottom: '0.75rem',
              }}
            >
              What I Work With
            </motion.p>
            <h2 style={{
              fontSize: '2.2rem', fontWeight: 700, marginBottom: '0.75rem',
              letterSpacing: '-0.02em',
              background: 'linear-gradient(135deg, #f0f0f0, #666)',
              WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent',
            }}>
              Technical Arsenal
            </h2>
            <div style={{
              width: 50, height: 2, borderRadius: 1, margin: '0 auto 0.75rem',
              background: 'linear-gradient(90deg, #22d3ee, #a855f7)',
            }} />
            <p style={{ color: '#555', fontSize: '0.9rem', maxWidth: 450, margin: '0 auto' }}>
              Tools and technologies I use to bring data to life.
            </p>
          </div>
        </ScrollReveal>

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.25rem',
        }}>
          {content.skillCategories.map((category, idx) => (
            <SkillCard key={idx} category={category} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}
