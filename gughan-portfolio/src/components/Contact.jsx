import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Mail, Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { useToast } from './Toast';
import ScrollReveal from './ScrollReveal';
import { fadeInLeft, EASE } from '../utils/animations';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

/* Confetti burst */
function ConfettiBurst({ isActive }) {
  if (!isActive) return null;
  const pieces = Array.from({ length: 35 }, (_, i) => ({
    id: i,
    x: (Math.random() - 0.5) * 400,
    y: -(Math.random() * 300 + 100),
    rotate: Math.random() * 720,
    scale: Math.random() * 0.5 + 0.5,
    color: ['#22d3ee', '#a855f7', '#34d399', '#fbbf24', '#fb7185', '#3b82f6'][i % 6],
    delay: Math.random() * 0.3,
  }));

  return (
    <div style={{ position: 'absolute', top: '50%', left: '50%', pointerEvents: 'none', zIndex: 100 }}>
      {pieces.map((p) => (
        <motion.div
          key={p.id}
          initial={{ x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 }}
          animate={{ x: p.x, y: p.y, rotate: p.rotate, scale: p.scale, opacity: 0 }}
          transition={{ duration: 1.2, ease: 'easeOut', delay: p.delay }}
          style={{
            position: 'absolute', width: 7, height: 7,
            borderRadius: Math.random() > 0.5 ? '50%' : '1px',
            background: p.color,
          }}
        />
      ))}
    </div>
  );
}

/* Animated input */
function AnimatedInput({ label, children }) {
  const [isFocused, setIsFocused] = useState(false);
  return (
    <div style={{ marginBottom: '1.25rem' }}>
      <label style={{
        display: 'block', fontSize: '0.8rem', marginBottom: '0.45rem',
        color: isFocused ? '#22d3ee' : '#666', transition: 'color 0.2s',
        fontWeight: 500,
      }}>
        {label}
      </label>
      <div style={{ position: 'relative' }} onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)}>
        {children}
        <motion.div
          animate={{ scaleX: isFocused ? 1 : 0 }}
          transition={{ duration: 0.3, ease: EASE.outExpo }}
          style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: 2,
            background: 'linear-gradient(90deg, #22d3ee, #a855f7)',
            transformOrigin: 'center', borderRadius: 1,
          }}
        />
      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%', background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.06)', borderRadius: '0.5rem',
  padding: '0.6rem 1rem', color: '#f0f0f0', fontFamily: 'inherit',
  fontSize: '0.88rem', outline: 'none', transition: 'border-color 0.2s',
};

function ContactForm() {
  const { db, appId, user } = usePortfolio();
  const addToast = useToast();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle');
  const [showConfetti, setShowConfetti] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    try {
      // Send email via FormSubmit API
      const emailResponse = await fetch("https://formsubmit.co/ajax/gughanguguu@gmail.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
          _subject: "New Contact Form Submission from Portfolio"
        })
      });

      if (!emailResponse.ok) {
        throw new Error("Failed to send email via FormSubmit");
      }

      // Save to Firebase if configured
      if (db) {
        await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'messages'), {
          ...formData, createdAt: serverTimestamp(),
          userId: user ? user.uid : 'anonymous',
        });
      }

      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
      setShowConfetti(true);
      addToast('Message sent successfully!', 'success');
      setTimeout(() => { setStatus('idle'); setShowConfetti(false); }, 3000);
    } catch (error) {
      console.error('Error:', error);
      setStatus('error');
      addToast('Failed to send. Try again.', 'error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <ConfettiBurst isActive={showConfetti} />
      <form onSubmit={handleSubmit}>
        <AnimatedInput label="Name">
          <input type="text" required style={inputStyle} value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
        </AnimatedInput>
        <AnimatedInput label="Email">
          <input type="email" required style={inputStyle} value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
        </AnimatedInput>
        <AnimatedInput label="Message">
          <textarea rows="4" required style={{ ...inputStyle, resize: 'vertical', minHeight: 100 }}
            value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} />
        </AnimatedInput>

        <motion.button
          type="submit" disabled={status === 'loading'}
          whileHover={status !== 'loading' ? {
            y: -2,
            boxShadow: '0 8px 30px rgba(34,211,238,0.15), 0 0 15px rgba(168,85,247,0.1)',
          } : {}}
          whileTap={status !== 'loading' ? { scale: 0.97 } : {}}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: '0.5rem', padding: '0.7rem 1.25rem', borderRadius: '0.55rem',
            fontWeight: 600, fontSize: '0.88rem', border: 'none',
            cursor: status === 'loading' ? 'wait' : 'pointer', transition: 'all 0.3s',
            ...(status === 'success'
              ? { background: 'rgba(52,211,153,0.15)', color: '#34d399' }
              : status === 'error'
                ? { background: 'rgba(251,113,133,0.15)', color: '#fb7185' }
                : { background: 'linear-gradient(135deg, #22d3ee, #a855f7)', color: '#000' }),
          }}
        >
          <AnimatePresence mode="wait">
            {status === 'loading' ? (
              <motion.span key="l" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, ease: 'linear', repeat: Infinity }}>
                  <Loader2 size={15} />
                </motion.div> Sending...
              </motion.span>
            ) : status === 'success' ? (
              <motion.span key="s" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={15} /> Sent!
              </motion.span>
            ) : status === 'error' ? (
              <motion.span key="e" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertCircle size={15} /> Failed
              </motion.span>
            ) : (
              <motion.span key="i" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                Send Message <Send size={14} />
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </form>
    </div>
  );
}

export default function Contact() {
  const { content } = usePortfolio();
  const { ref, isInView } = useScrollAnimation();

  return (
    <section id="contact" ref={ref} style={{ padding: `var(--section-padding) 0`, position: 'relative' }}>
      <div className="section-divider" />

      <div className="container" style={{ paddingTop: '3rem' }}>
        <ScrollReveal direction="up">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <motion.p style={{
              fontSize: '0.72rem', color: '#34d399', textTransform: 'uppercase',
              letterSpacing: '0.15em', fontWeight: 600, marginBottom: '0.75rem',
            }}>
              Get In Touch
            </motion.p>
            <h2 style={{
              fontSize: '2.2rem', fontWeight: 700, marginBottom: '0.75rem',
              letterSpacing: '-0.02em',
              background: 'linear-gradient(135deg, #f0f0f0, #666)',
              WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent',
            }}>
              Let's Connect
            </h2>
            <div style={{
              width: 50, height: 2, borderRadius: 1, margin: '0 auto',
              background: 'linear-gradient(90deg, #34d399, #22d3ee)',
            }} />
          </div>
        </ScrollReveal>

        <div className="glow-card" style={{
          padding: '2.5rem', position: 'relative', overflow: 'hidden',
        }}>
          {/* Background glow */}
          <div style={{
            position: 'absolute', top: '-30%', right: '-10%',
            width: 400, height: 400, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(34,211,238,0.03) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />

          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '3rem', position: 'relative', zIndex: 1,
          }}>
            {/* Left: info */}
            <div>
              <p style={{ color: '#666', marginBottom: '2rem', lineHeight: 1.75, fontSize: '0.92rem' }}>
                I'm currently looking for new opportunities in Machine Learning and Data Science.
              </p>

              <motion.div
                variants={fadeInLeft} initial="hidden" animate={isInView ? 'visible' : 'hidden'} custom={2}
                style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1rem' }}
              >
                <div style={{
                  width: 40, height: 40,
                  background: 'linear-gradient(135deg, rgba(34,211,238,0.1), rgba(168,85,247,0.1))',
                  borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <MapPin size={16} color="#22d3ee" />
                </div>
                <span style={{ color: '#888', fontSize: '0.88rem' }}>{content.personalInfo.location}</span>
              </motion.div>

              <motion.div
                variants={fadeInLeft} initial="hidden" animate={isInView ? 'visible' : 'hidden'} custom={4}
                style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}
              >
                <div style={{
                  width: 40, height: 40,
                  background: 'linear-gradient(135deg, rgba(52,211,153,0.1), rgba(34,211,238,0.1))',
                  borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Mail size={16} color="#34d399" />
                </div>
                <a href={content.personalInfo.social.email}
                  style={{ color: '#888', fontSize: '0.88rem', transition: 'color 0.2s' }}
                  onMouseEnter={(e) => e.target.style.color = '#34d399'}
                  onMouseLeave={(e) => e.target.style.color = '#888'}>
                  {content.personalInfo.social.email.replace('mailto:', '')}
                </a>
              </motion.div>
            </div>

            {/* Right: form */}
            <ScrollReveal direction="right" delay={2}>
              <div style={{
                background: 'rgba(255,255,255,0.02)', padding: '1.75rem',
                borderRadius: '0.875rem', border: '1px solid rgba(255,255,255,0.04)',
              }}>
                <ContactForm />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
