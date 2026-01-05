import React, { useState, useEffect } from 'react';
import './App.css'; // Importing the CSS file is crucial!
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
  ChevronRight,
  Pencil,
  Save,
  X,
  Trash2,
  Plus,
  Lock
} from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp 
} from 'firebase/firestore';

// --- Firebase Configuration & Setup ---
const firebaseConfig = {
  apiKey: "AIzaSyD179CAOa6Mp7fh6E55XDCFqVNBP1IdlcE",
  authDomain: "portfolio-cd766.firebaseapp.com",
  projectId: "portfolio-cd766",
  storageBucket: "portfolio-cd766.firebasestorage.app",
  messagingSenderId: "921183592594",
  appId: "1:921183592594:web:b0ca7d6f170b3d9a04064b",
  measurementId: "G-HSF0F88RTV"
};

// Initialize Firebase safely
let app, auth, db;
try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
} catch (error) {
  console.warn("Firebase not initialized. Check your config keys.", error);
}

const appId = 'gughan-portfolio';
const CONTENT_DOC_ID = 'main';

// --- Initial Data ---
const initialContent = {
  personalInfo: {
    name: "Gughan S",
    role: "Machine Learning Engineer",
    location: "Chennai, India",
    education: {
      college: "Saveetha Engineering College",
      degree: "B.Tech Artificial Intelligence & Machine Learning",
      cgpa: "8.05"
    },
    social: {
      github: "https://github.com/GughanS",
      linkedin: "https://linkedin.com/in/gughan-s",
      email: "mailto:gughanguguu@gmail.com",
      resume: "#"
    }
  },
  skillCategories: [
    {
      title: "Machine Learning & DS",
      skills: ["Scikit-learn", "NumPy", "Pandas", "TensorFlow", "Keras", "PyTorch", "Matplotlib/Seaborn", "NLP", "ONNX"]
    },
    {
      title: "Languages",
      skills: ["Python", "C", "C++", "SQL"]
    },
    {
      title: "Databases",
      skills: ["MySQL", "PostgreSQL", "MongoDB", "Firebase", "DBMS"]
    },
    {
      title: "Core Tech & Tools",
      skills: ["RESTful APIs", "Git/GitHub", "Data Structures & Algorithms (Intermediate)"]
    }
  ],
  projects: [
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
  ]
};

export default function App() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [content, setContent] = useState(initialContent);
  const [loading, setLoading] = useState(true);

  // UI States
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [editSection, setEditSection] = useState(null);
  const [editData, setEditData] = useState(null);

  // --- Auth & Data Fetching ---
  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      const adminEmail = initialContent.personalInfo.social.email.replace('mailto:', '');
      if (currentUser && currentUser.email === adminEmail) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    });

    const fetchContent = async () => {
      try {
        const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'content', CONTENT_DOC_ID);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setContent(docSnap.data());
        } else {
          await setDoc(docRef, initialContent);
          setContent(initialContent);
        }
      } catch (err) {
        console.error("Error fetching content:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
    return () => unsubscribe();
  }, []);

  // --- Handlers ---
  const handleLogin = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setIsLoginOpen(false);
    } catch (error) {
      alert("Login failed: " + error.message);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setIsAdmin(false);
  };

  const handleSave = async () => {
    if (!isAdmin || !db) return;
    try {
      const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'content', CONTENT_DOC_ID);
      let updatedContent = { ...content };

      if (editSection === 'personal') updatedContent.personalInfo = editData;
      if (editSection === 'skills') updatedContent.skillCategories = editData;
      if (editSection === 'projects') updatedContent.projects = editData;

      await updateDoc(docRef, updatedContent);
      setContent(updatedContent);
      setEditSection(null);
    } catch (error) {
      console.error("Error saving:", error);
      alert("Failed to save. Check console.");
    }
  };

  // --- UI Components ---
  const EditBtn = ({ section, data }) => {
    if (!isAdmin) return null;
    return (
      <button 
        className="edit-btn" 
        onClick={() => {
          setEditSection(section);
          setEditData(JSON.parse(JSON.stringify(data)));
        }}
      >
        <Pencil size={16} />
      </button>
    );
  };

  const EditForm = () => {
    if (!editSection) return null;

    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="modal-header">
            <h3 className="modal-title">Edit {editSection}</h3>
            <button className="modal-close" onClick={() => setEditSection(null)}><X /></button>
          </div>
          
          <div className="space-y-4">
            {editSection === 'personal' && (
              <>
                <div className="form-group"><label>Name</label><input className="form-input" value={editData.name} onChange={e => setEditData({...editData, name: e.target.value})} /></div>
                <div className="form-group"><label>Role</label><input className="form-input" value={editData.role} onChange={e => setEditData({...editData, role: e.target.value})} /></div>
                <div className="form-group"><label>Location</label><input className="form-input" value={editData.location} onChange={e => setEditData({...editData, location: e.target.value})} /></div>
                <div className="form-group"><label>College</label><input className="form-input" value={editData.education.college} onChange={e => setEditData({...editData, education: {...editData.education, college: e.target.value}})} /></div>
                <div className="form-group"><label>Degree</label><input className="form-input" value={editData.education.degree} onChange={e => setEditData({...editData, education: {...editData.education, degree: e.target.value}})} /></div>
                <div className="form-group"><label>CGPA</label><input className="form-input" value={editData.education.cgpa} onChange={e => setEditData({...editData, education: {...editData.education, cgpa: e.target.value}})} /></div>
                <div className="form-group"><label>Resume URL</label><input className="form-input" value={editData.social.resume} onChange={e => setEditData({...editData, social: {...editData.social, resume: e.target.value}})} /></div>
                <div className="form-group"><label>GitHub URL</label><input className="form-input" value={editData.social.github} onChange={e => setEditData({...editData, social: {...editData.social, github: e.target.value}})} /></div>
              </>
            )}

            {editSection === 'skills' && (
              <div className="space-y-6">
                {editData.map((cat, idx) => (
                  <div key={idx} className="p-4 border border-slate-700 rounded-lg">
                    <input className="form-input mb-2 font-bold" value={cat.title} onChange={e => { const newCats = [...editData]; newCats[idx].title = e.target.value; setEditData(newCats); }} />
                    <textarea className="form-input" rows="3" value={cat.skills.join(', ')} onChange={e => { const newCats = [...editData]; newCats[idx].skills = e.target.value.split(',').map(s => s.trim()); setEditData(newCats); }} />
                  </div>
                ))}
              </div>
            )}

            {editSection === 'projects' && (
              <div className="space-y-6">
                {editData.map((proj, idx) => (
                  <div key={idx} className="p-4 border border-slate-700 rounded-lg relative">
                    <button onClick={() => { const newProjs = editData.filter((_, i) => i !== idx); setEditData(newProjs); }} className="absolute top-2 right-2 text-red-400 hover:text-red-300"><Trash2 size={16} /></button>
                    <div className="form-group"><label>Title</label><input className="form-input" value={proj.title} onChange={e => { const newProjs = [...editData]; newProjs[idx].title = e.target.value; setEditData(newProjs); }} /></div>
                    <div className="form-group"><label>Link</label><input className="form-input" value={proj.link} onChange={e => { const newProjs = [...editData]; newProjs[idx].link = e.target.value; setEditData(newProjs); }} /></div>
                    <div className="form-group"><label>Description</label><textarea className="form-input" value={proj.description} onChange={e => { const newProjs = [...editData]; newProjs[idx].description = e.target.value; setEditData(newProjs); }} /></div>
                    <div className="form-group"><label>Tech</label><input className="form-input" value={proj.tech.join(', ')} onChange={e => { const newProjs = [...editData]; newProjs[idx].tech = e.target.value.split(',').map(s => s.trim()); setEditData(newProjs); }} /></div>
                  </div>
                ))}
                <button onClick={() => setEditData([...editData, { title: "New Project", link: "#", tech: [], description: "Description" }])} className="btn btn-secondary w-full justify-center"><Plus size={16} /> Add Project</button>
              </div>
            )}
          </div>

          <div className="modal-actions">
            <button className="btn btn-secondary flex-1 justify-center" onClick={() => setEditSection(null)}>Cancel</button>
            <button className="btn btn-primary flex-1 justify-center" onClick={handleSave}><Save size={16} /> Save Changes</button>
          </div>
        </div>
      </div>
    );
  };

  const Navbar = () => (
    <nav className="navbar">
      <div className="container nav-content">
        <span className="logo">GS.</span>
        <div className="nav-links">
          <a href="#about">About</a>
          <a href="#skills">Skills</a>
          <a href="#projects">Projects</a>
          <a href="#contact">Contact</a>
          {isAdmin && <button onClick={handleLogout} className="text-red-400 text-sm ml-4">Logout</button>}
        </div>
      </div>
    </nav>
  );

  const ContactForm = () => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [status, setStatus] = useState('idle');

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!db) return;
      setStatus('loading');
      try {
        await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'messages'), {
          ...formData,
          createdAt: serverTimestamp(),
          userId: user ? user.uid : 'anonymous'
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
        <div className="form-group"><label>Name</label><input type="text" required className="form-input" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} /></div>
        <div className="form-group"><label>Email</label><input type="email" required className="form-input" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} /></div>
        <div className="form-group"><label>Message</label><textarea rows="4" required className="form-input" value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})}></textarea></div>
        <button type="submit" disabled={status === 'loading'} className="btn btn-primary submit-btn">
          {status === 'loading' ? <span className="animate-pulse">Sending...</span> : status === 'success' ? <span className="text-success">Message Sent!</span> : <>Send Message <Send size={16} /></>}
        </button>
      </form>
    );
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-400">Loading portfolio...</div>;

  return (
    <div className="app-container">
      <Navbar />
      <EditForm />
      
      {isLoginOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Admin Login</h3>
              <button className="modal-close" onClick={() => setIsLoginOpen(false)}><X /></button>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="form-group"><label>Email</label><input name="email" type="email" required className="form-input" /></div>
              <div className="form-group"><label>Password</label><input name="password" type="password" required className="form-input" /></div>
              <button type="submit" className="btn btn-primary w-full justify-center">Login</button>
            </form>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section id="about" className="section hero-section">
        <EditBtn section="personal" data={content.personalInfo} />
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <div className="status-badge">
                <span className="status-dot"></span>Open to Opportunities
              </div>
              
              <h1 className="title">{content.personalInfo.name}</h1>
              <h2 className="subtitle">{content.personalInfo.role}</h2>
              <p className="description">
                Passionate about leveraging data to build intelligent systems. 
                Specializing in Deep Learning, NLP, and scalable data architectures.
                Based in <span style={{color: 'white'}}>{content.personalInfo.location}</span>.
              </p>

              <div className="social-links">
                <a href={content.personalInfo.social.github} target="_blank" rel="noreferrer" className="btn btn-secondary"><Github size={20} /> GitHub</a>
                <a href={content.personalInfo.social.linkedin} target="_blank" rel="noreferrer" className="btn btn-primary"><Linkedin size={20} /> LinkedIn</a>
                <a href={content.personalInfo.social.resume} target="_blank" rel="noreferrer" className="btn btn-secondary"><Download size={20} /> Resume</a>
              </div>
            </div>

            <div className="stats-card">
              <h3 className="stats-header"><GraduationCap size={20} color="#60a5fa" /> Education</h3>
              <div>
                <p style={{color: '#f8fafc', fontWeight: 500}}>{content.personalInfo.education.college}</p>
                <p style={{fontSize: '0.875rem', color: '#cbd5e1'}}>Degree: {content.personalInfo.education.degree}</p>
                <p style={{fontSize: '0.875rem', color: '#94a3b8'}}>CGPA: {content.personalInfo.education.cgpa}</p>
              </div>
              <div className="stats-divider" />
              <div>
                <p style={{fontSize: '0.875rem', color: '#94a3b8', marginBottom: '0.5rem'}}>Key Competencies</p>
                <div className="tag-container">
                  <span className="tag">DSA</span><span className="tag">Model Deployment</span><span className="tag">Data pipelines</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="section skills-section">
        <EditBtn section="skills" data={content.skillCategories} />
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Technical Arsenal</h2>
            <p style={{color: '#94a3b8'}}>Tools and technologies I use to bring data to life.</p>
          </div>

          <div className="grid grid-4">
            {content.skillCategories.map((category, idx) => (
              <div key={idx} className="skill-card">
                <div className="skill-icon-wrapper">
                  {idx === 0 ? <Brain size={24} color="#c084fc" /> : 
                   idx === 1 ? <Code2 size={24} color="#60a5fa" /> :
                   idx === 2 ? <Database size={24} color="#34d399" /> :
                   <Terminal size={24} color="#fb923c" />}
                </div>
                <h3 style={{fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem', color: 'white'}}>{category.title}</h3>
                <ul className="skill-list">
                  {category.skills.map((skill, sIdx) => (
                    <li key={sIdx}><ChevronRight size={14} />{skill}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="section">
        <EditBtn section="projects" data={content.projects} />
        <div className="container">
          <div className="projects-header">
            <div>
              <h2 className="section-title">Featured Projects</h2>
              <p style={{color: '#94a3b8'}}>A selection of my recent work in ML and Software Development.</p>
            </div>
            <a href={content.personalInfo.social.github} target="_blank" rel="noreferrer" className="github-link">View all on GitHub <ExternalLink size={16} /></a>
          </div>

          <div className="grid grid-2">
            {content.projects.map((project, idx) => (
              <a key={idx} href={project.link} target="_blank" rel="noreferrer" className="project-card">
                <div className="project-image">
                   <div className="project-external-icon"><ExternalLink size={20} color="#60a5fa" /></div>
                  <Cpu size={64} color="#334155" />
                </div>
                <div className="project-content">
                  <h3 className="project-title">{project.title}</h3>
                  <p className="project-desc">{project.description}</p>
                  <div className="tech-tags">
                    {project.tech.map((t, tIdx) => (
                      <span key={tIdx} className="tech-tag">{t}</span>
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
                </p>
                <div>
                  <div className="contact-info-item"><div className="icon-box"><MapPin size={20} color="#60a5fa" /></div><span>{content.personalInfo.location}</span></div>
                  <div className="contact-info-item"><div className="icon-box"><Mail size={20} color="#34d399" /></div><a href={content.personalInfo.social.email}>{content.personalInfo.social.email.replace('mailto:', '')}</a></div>
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
        <p>© {new Date().getFullYear()} {content.personalInfo.name}. Built with React & Vanilla CSS.</p>
        <span className="admin-login-trigger" onClick={() => setIsLoginOpen(true)}>
           • Admin Login
        </span>
      </footer>
    </div>
  );
}