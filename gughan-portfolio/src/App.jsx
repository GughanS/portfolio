import React, { useState, useEffect } from 'react';
import './App.css'; // CRITICAL: This imports the styling
import { 
  Github, 
  Linkedin, 
  Mail, 
  MapPin, 
  Download, 
  Code2, 
  Database, 
  Brain, 
  Terminal, 
  Send,
  Cpu,
  GraduationCap,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInAnonymously, 
  signInWithCustomToken,
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  serverTimestamp 
} from 'firebase/firestore';

// --- Firebase Configuration & Setup ---
// Replace the values below with your ACTUAL Firebase project keys
const firebaseConfig = {
  // Example format:
  // apiKey: "AIzaSy...",
  // authDomain: "your-project.firebaseapp.com",
  // projectId: "your-project",
  // ...
};

// Initialize Firebase (wrapped in try/catch to prevent crashes if config is empty during setup)
let app, auth, db;
try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
} catch (e) {
    console.error("Firebase init failed. Did you add your config keys?", e);
}

const appId = 'gughan-portfolio';

export default function App() {
  const [user, setUser] = useState(null);
  
  // Auth Effect
  useEffect(() => {
    if (!auth) return; // Skip if firebase not init
    
    const initAuth = async () => {
      try {
          await signInAnonymously(auth);
      } catch (error) {
        console.error("Auth error:", error);
      }
    };
    initAuth();

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // --- Data & Content ---
  const personalInfo = {
    name: "Gughan S",
    role: "Machine Learning Engineer",
    location: "Chennai, India",
    education: {
      college: "Saveetha Engineering College",
      degree: "B.Tech AI & ML",
      cgpa: "8.05"
    },
    social: {
      github: "https://github.com/GughanS",
      linkedin: "https://linkedin.com/in/gughan-s",
      email: "mailto:gughanguguu@gmail.com"
    }
  };

  const skillCategories = [
    {
      title: "Machine Learning & DS",
      icon: <Brain size={24} color="#c084fc" />, // Purple
      skills: ["Scikit-learn", "NumPy", "Pandas", "TensorFlow", "Keras", "PyTorch", "Matplotlib/Seaborn", "NLP", "ONNX"]
    },
    {
      title: "Languages",
      icon: <Code2 size={24} color="#60a5fa" />, // Blue
      skills: ["Python", "C", "C++", "SQL"]
    },
    {
      title: "Databases",
      icon: <Database size={24} color="#34d399" />, // Emerald
      skills: ["MySQL", "PostgreSQL", "MongoDB", "Firebase", "DBMS"]
    },
    {
      title: "Core Tech & Tools",
      icon: <Terminal size={24} color="#fb923c" />, // Orange
      skills: ["RESTful APIs", "Git/GitHub", "Data Structures & Algorithms (Intermediate)"]
    }
  ];

  const projects = [
    {
      title: "FastAPI Assets",
      link: "https://github.com/OpenVerge/fastapi-assets",
      tech: ["FastAPI", "Python", "Backend"],
      description: "A comprehensive collection of assets and utilities designed to streamline FastAPI application development and deployment workflows.",
    },
    {
      title: "Aegis Emergency Response",
      link: "https://github.com/GughanS/aegis-emergency-response.git",
      tech: ["Python", "Real-time Systems", "Automation"],
      description: "An intelligent emergency response system designed to optimize incident handling and response times through automated data processing.",
    },
    {
      title: "EchoSight",
      link: "https://github.com/GughanS/EchoSight",
      tech: ["Computer Vision", "Deep Learning", "Python"],
      description: "A computer vision application leveraging deep learning models for advanced visual recognition and processing tasks.",
    },
    {
      title: "Filtered Image Fetcher",
      link: "https://github.com/GughanS/filtered-image-fetcher",
      tech: ["Python", "Scripting", "Data Collection"],
      description: "An automated tool for fetching, filtering, and organizing datasets of images based on specific criteria or metadata.",
    }
  ];

  // --- Components ---

  const Navbar = () => (
    <nav className="navbar">
      <div className="container nav-content">
        <span className="logo">GS.</span>
        <div className="nav-links">
          <a href="#about">About</a>
          <a href="#skills">Skills</a>
          <a href="#projects">Projects</a>
          <a href="#contact">Contact</a>
        </div>
      </div>
    </nav>
  );

  const ContactForm = () => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [status, setStatus] = useState('idle');

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!user || !db) return;

      setStatus('loading');
      try {
        await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'messages'), {
          ...formData,
          createdAt: serverTimestamp(),
          userId: user.uid
        });
        setStatus('success');
        setFormData({ name: '', email: '', message: '' });
        setTimeout(() => setStatus('idle'), 3000);
      } catch (error) {
        console.error("Error sending message:", error);
        setStatus('error');
      }
    };

    return (
      <form onSubmit={handleSubmit} className="contact-form">
        <div className="form-group">
          <label>Name</label>
          <input 
            type="text" 
            required
            className="form-input"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input 
            type="email" 
            required
            className="form-input"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
        </div>
        <div className="form-group">
          <label>Message</label>
          <textarea 
            rows="4"
            required
            className="form-input"
            value={formData.message}
            onChange={(e) => setFormData({...formData, message: e.target.value})}
          ></textarea>
        </div>
        <button 
          type="submit" 
          disabled={status === 'loading'}
          className="btn btn-primary submit-btn"
        >
          {status === 'loading' ? (
            <span className="animate-pulse">Sending...</span>
          ) : status === 'success' ? (
            <span className="text-success">Message Sent!</span>
          ) : (
            <>Send Message <Send size={16} /></>
          )}
        </button>
        {status === 'error' && <p className="text-error" style={{textAlign: 'center', marginTop: '1rem'}}>Something went wrong.</p>}
      </form>
    );
  };

  return (
    <div className="app-container">
      <Navbar />
      
      {/* Hero Section */}
      <section id="about" className="section hero-section">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <div className="status-badge">
                <span className="status-dot"></span>
                Open to Opportunities
              </div>
              
              <h1 className="title">{personalInfo.name}</h1>
              <h2 className="subtitle">{personalInfo.role}</h2>
              <p className="description">
                Passionate about leveraging data to build intelligent systems. 
                Specializing in Deep Learning, NLP, and scalable data architectures.
                Based in <span style={{color: 'white'}}>{personalInfo.location}</span>.
              </p>

              <div className="social-links">
                <a href={personalInfo.social.github} target="_blank" rel="noreferrer" className="btn btn-secondary">
                  <Github size={20} /> GitHub
                </a>
                <a href={personalInfo.social.linkedin} target="_blank" rel="noreferrer" className="btn btn-primary">
                  <Linkedin size={20} /> LinkedIn
                </a>
                <button className="btn btn-secondary">
                  <Download size={20} /> Resume
                </button>
              </div>
            </div>

            {/* Stats Card */}
            <div className="stats-card">
              <h3 className="stats-header">
                <GraduationCap size={20} color="#60a5fa" /> Education
              </h3>
              <div>
                <p style={{color: '#f8fafc', fontWeight: 500}}>{personalInfo.education.college}</p>
                <p style={{fontSize: '0.875rem', color: '#cbd5e1'}}>Degree: {personalInfo.education.degree}</p>
                <p style={{fontSize: '0.875rem', color: '#94a3b8'}}>CGPA: {personalInfo.education.cgpa}</p>
              </div>
              <div className="stats-divider" />
              <div>
                <p style={{fontSize: '0.875rem', color: '#94a3b8', marginBottom: '0.5rem'}}>Key Competencies</p>
                <div className="tag-container">
                  <span className="tag">DSA</span>
                  <span className="tag">Model Deployment</span>
                  <span className="tag">Data pipelines</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="section skills-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Technical Arsenal</h2>
            <p style={{color: '#94a3b8'}}>Tools and technologies I use to bring data to life.</p>
          </div>

          <div className="grid grid-4">
            {skillCategories.map((category, idx) => (
              <div key={idx} className="skill-card">
                <div className="skill-icon-wrapper">
                  {category.icon}
                </div>
                <h3 style={{fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem', color: 'white'}}>
                  {category.title}
                </h3>
                <ul className="skill-list">
                  {category.skills.map((skill, sIdx) => (
                    <li key={sIdx}>
                      <ChevronRight size={14} />
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="section">
        <div className="container">
          <div className="projects-header">
            <div>
              <h2 className="section-title">Featured Projects</h2>
              <p style={{color: '#94a3b8'}}>A selection of my recent work in ML and Software Development.</p>
            </div>
            <a href={personalInfo.social.github} target="_blank" rel="noreferrer" className="github-link">
              View all on GitHub <ExternalLink size={16} />
            </a>
          </div>

          <div className="grid grid-2">
            {projects.map((project, idx) => (
              <a 
                key={idx} 
                href={project.link}
                target="_blank"
                rel="noreferrer"
                className="project-card"
              >
                <div className="project-image">
                   <div className="project-external-icon">
                      <ExternalLink size={20} color="#60a5fa" />
                   </div>
                  <Cpu size={64} color="#334155" />
                </div>
                <div className="project-content">
                  <h3 className="project-title">{project.title}</h3>
                  <p className="project-desc">{project.description}</p>
                  <div className="tech-tags">
                    {project.tech.map((t, tIdx) => (
                      <span key={tIdx} className="tech-tag">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="section" style={{background: 'rgba(15, 23, 42, 0.3)'}}>
        <div className="container">
          <div className="contact-container">
            <div className="contact-grid">
              <div>
                <h2 className="section-title">Let's Connect</h2>
                <p style={{color: '#94a3b8', marginBottom: '2rem'}}>
                  I'm currently looking for new opportunities in Machine Learning and Data Science. 
                  Whether you have a question or just want to say hi, I'll try my best to get back to you!
                </p>
                
                <div>
                  <div className="contact-info-item">
                    <div className="icon-box">
                      <MapPin size={20} color="#60a5fa" />
                    </div>
                    <span>{personalInfo.location}</span>
                  </div>
                  <div className="contact-info-item">
                    <div className="icon-box">
                      <Mail size={20} color="#34d399" />
                    </div>
                    <a href={personalInfo.social.email}>gughanguguu@gmail.com</a>
                  </div>
                </div>
              </div>

              <div className="form-box">
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <p>© {new Date().getFullYear()} {personalInfo.name}. Built with React & Vanilla CSS.</p>
      </footer>
    </div>
  );
}