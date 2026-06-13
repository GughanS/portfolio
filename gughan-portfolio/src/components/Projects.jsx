import { motion } from 'framer-motion';
import { ExternalLink, Cpu, ArrowUpRight } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import ScrollReveal from './ScrollReveal';
import { fadeInUp, hoverScale, tapScale, EASE } from '../utils/animations';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const gradients = [
  'linear-gradient(135deg, rgba(168,85,247,0.08), rgba(34,211,238,0.04))',
  'linear-gradient(135deg, rgba(34,211,238,0.08), rgba(52,211,153,0.04))',
  'linear-gradient(135deg, rgba(59,130,246,0.08), rgba(168,85,247,0.04))',
  'linear-gradient(135deg, rgba(52,211,153,0.08), rgba(251,191,36,0.04))',
];

function ProjectCard({ project, index }) {
  const { ref, isInView } = useScrollAnimation();

  return (
    <motion.a
      ref={ref}
      href={project.link}
      target="_blank"
      rel="noreferrer"
      variants={fadeInUp}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      custom={index}
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', damping: 20, stiffness: 150 }}
      className="glow-card shine-card"
      style={{
        display: 'flex', flexDirection: 'column', textDecoration: 'none',
        color: 'inherit', cursor: 'pointer', overflow: 'hidden',
      }}
    >
      {/* Image area with gradient */}
      <div style={{
        height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative', overflow: 'hidden',
        background: gradients[index % gradients.length],
      }}>
        {/* Grid pattern */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }} />
        <Cpu size={48} color="rgba(255,255,255,0.06)" />

        {/* Hover overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(135deg, rgba(34,211,238,0.1), rgba(168,85,247,0.1))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileHover={{ scale: 1, opacity: 1 }}
            style={{
              background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)',
              padding: '0.5rem 1rem', borderRadius: '2rem',
              display: 'flex', alignItems: 'center', gap: '0.3rem',
              fontSize: '0.78rem', color: '#f0f0f0', fontWeight: 500,
            }}
          >
            View Project <ArrowUpRight size={14} />
          </motion.div>
        </motion.div>

        {/* Corner external icon */}
        <motion.div
          initial={{ opacity: 0, x: 5, y: -5 }}
          whileHover={{ opacity: 1, x: 0, y: 0 }}
          style={{ position: 'absolute', top: '0.75rem', right: '0.75rem' }}
        >
          <ExternalLink size={14} color="rgba(255,255,255,0.4)" />
        </motion.div>
      </div>

      {/* Content */}
      <div style={{
        padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column',
      }}>
        {/* Title with underline animation */}
        <div style={{ marginBottom: '0.5rem', position: 'relative', display: 'inline-block' }}>
          <h3 style={{
            fontSize: '1.1rem', fontWeight: 700, color: '#f0f0f0',
          }}>
            {project.title}
          </h3>
        </div>

        <p style={{
          color: '#666', fontSize: '0.83rem', marginBottom: '1.1rem',
          flex: 1, lineHeight: 1.65,
        }}>
          {project.description}
        </p>

        {/* Tech tags with staggered animation */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: 'auto' }}>
          {project.tech.map((t, tIdx) => (
            <motion.span
              key={tIdx}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: index * 0.1 + tIdx * 0.06 + 0.2, duration: 0.35 }}
              style={{
                background: 'rgba(34,211,238,0.06)',
                border: '1px solid rgba(34,211,238,0.1)',
                color: '#22d3ee', fontSize: '0.7rem',
                padding: '0.18rem 0.5rem', borderRadius: '0.25rem',
                fontWeight: 500,
              }}
            >
              {t}
            </motion.span>
          ))}
        </div>
      </div>
    </motion.a>
  );
}

export default function Projects() {
  const { content, isAdmin, openEdit } = usePortfolio();

  return (
    <section id="projects" style={{ padding: `var(--section-padding) 0`, position: 'relative' }}>
      <div className="section-divider" />

      {isAdmin && (
        <motion.button
          onClick={() => openEdit('projects', content.projects)}
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
            <motion.p style={{
              fontSize: '0.72rem', color: '#a855f7', textTransform: 'uppercase',
              letterSpacing: '0.15em', fontWeight: 600, marginBottom: '0.75rem',
            }}>
              Recent Work
            </motion.p>
            <h2 style={{
              fontSize: '2.2rem', fontWeight: 700, marginBottom: '0.75rem',
              letterSpacing: '-0.02em',
              background: 'linear-gradient(135deg, #f0f0f0, #666)',
              WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent',
            }}>
              Featured Projects
            </h2>
            <div style={{
              width: 50, height: 2, borderRadius: 1, margin: '0 auto 0.75rem',
              background: 'linear-gradient(90deg, #a855f7, #22d3ee)',
            }} />
            <p style={{ color: '#555', fontSize: '0.9rem', maxWidth: 420, margin: '0 auto' }}>
              A selection of my recent work in ML and Software Development.
            </p>
          </div>
        </ScrollReveal>

        {/* GitHub link */}
        <div style={{ textAlign: 'right', marginBottom: '1.5rem' }}>
          <motion.a
            href={content.personalInfo.social.github} target="_blank" rel="noreferrer"
            whileHover={{ x: 4, color: '#22d3ee' }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
              color: '#555', fontWeight: 500, fontSize: '0.82rem',
            }}
          >
            View all on GitHub <ExternalLink size={13} />
          </motion.a>
        </div>

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))',
          gap: '1.25rem',
        }}>
          {content.projects.map((project, idx) => (
            <ProjectCard key={idx} project={project} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}
