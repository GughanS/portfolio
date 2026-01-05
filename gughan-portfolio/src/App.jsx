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
  Server, 
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

  // UI States
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [editSection, setEditSection] = useState(null);
  const [editData, setEditData] = useState(null);

  // --- Auth & Data Fetching ---
  useEffect(() => {
    if (!auth) {
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      // Simple Admin Check: Matches the email in the portfolio
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
          // Initialize DB if empty
          await setDoc(docRef, initialContent);
          setContent(initialContent);
        }
      } catch (err) {
        console.error("Error fetching content:", err);
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
        onClick={() => {
          setEditSection(section);
          setEditData(JSON.parse(JSON.stringify(data)));
        }}
        className="absolute top-4 right-4 z-10 p-2 bg-blue-500/20 hover:bg-blue-500 text-blue-400 hover:text-white rounded-lg transition-all"
      >
        <Pencil className="w-4 h-4" />
      </button>
    );
  };

  const Modal = ({ children, title, onClose }) => (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-slate-700 sticky top-0 bg-slate-900 z-10">
          <h3 className="text-lg font-bold text-white">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-4 space-y-4">
          {children}
        </div>
      </div>
    </div>
  );

  const EditForm = () => {
    if (!editSection) return null;

    return (
      <Modal title={`Edit ${editSection}`} onClose={() => setEditSection(null)}>
        {editSection === 'personal' && (
          <>
            <div className="space-y-3">
              <input className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white" placeholder="Name" value={editData.name} onChange={e => setEditData({...editData, name: e.target.value})} />
              <input className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white" placeholder="Role" value={editData.role} onChange={e => setEditData({...editData, role: e.target.value})} />
              <input className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white" placeholder="Location" value={editData.location} onChange={e => setEditData({...editData, location: e.target.value})} />
              <div className="pt-2 border-t border-slate-700">
                <label className="text-xs text-slate-400">Education</label>
                <input className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white mt-1" placeholder="College" value={editData.education.college} onChange={e => setEditData({...editData, education: {...editData.education, college: e.target.value}})} />
                <input className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white mt-2" placeholder="Degree" value={editData.education.degree} onChange={e => setEditData({...editData, education: {...editData.education, degree: e.target.value}})} />
                <input className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white mt-2" placeholder="CGPA" value={editData.education.cgpa} onChange={e => setEditData({...editData, education: {...editData.education, cgpa: e.target.value}})} />
              </div>
              <div className="pt-2 border-t border-slate-700">
                <label className="text-xs text-slate-400">Links</label>
                <input className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white mt-1" placeholder="Resume URL" value={editData.social.resume} onChange={e => setEditData({...editData, social: {...editData.social, resume: e.target.value}})} />
                <input className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white mt-2" placeholder="GitHub URL" value={editData.social.github} onChange={e => setEditData({...editData, social: {...editData.social, github: e.target.value}})} />
              </div>
            </div>
          </>
        )}

        {editSection === 'skills' && (
          <div className="space-y-4">
            {editData.map((cat, idx) => (
              <div key={idx} className="p-3 bg-slate-800/50 rounded border border-slate-700">
                <input className="w-full bg-transparent font-bold text-white mb-2 outline-none" value={cat.title} onChange={e => {
                  const newData = [...editData]; newData[idx].title = e.target.value; setEditData(newData);
                }} />
                <textarea className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-sm text-slate-300 h-20" value={cat.skills.join(', ')} onChange={e => {
                  const newData = [...editData]; newData[idx].skills = e.target.value.split(',').map(s=>s.trim()); setEditData(newData);
                }} />
              </div>
            ))}
          </div>
        )}

        {editSection === 'projects' && (
          <div className="space-y-4">
            {editData.map((proj, idx) => (
              <div key={idx} className="p-3 bg-slate-800/50 rounded border border-slate-700 relative">
                <button onClick={() => setEditData(editData.filter((_, i) => i !== idx))} className="absolute top-2 right-2 text-red-400 hover:text-red-300"><Trash2 className="w-4 h-4" /></button>
                <input className="w-full bg-transparent font-bold text-white mb-2 outline-none border-b border-transparent focus:border-slate-600" placeholder="Project Title" value={proj.title} onChange={e => {
                  const newData = [...editData]; newData[idx].title = e.target.value; setEditData(newData);
                }} />
                <input className="w-full bg-transparent text-blue-400 text-sm mb-2 outline-none" placeholder="Project Link" value={proj.link} onChange={e => {
                  const newData = [...editData]; newData[idx].link = e.target.value; setEditData(newData);
                }} />
                <textarea className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-sm text-slate-300" rows="2" placeholder="Description" value={proj.description} onChange={e => {
                  const newData = [...editData]; newData[idx].description = e.target.value; setEditData(newData);
                }} />
                <input className="w-full bg-transparent text-xs text-slate-500 mt-2 outline-none" placeholder="Tech stack (comma separated)" value={proj.tech.join(', ')} onChange={e => {
                  const newData = [...editData]; newData[idx].tech = e.target.value.split(',').map(s=>s.trim()); setEditData(newData);
                }} />
              </div>
            ))}
            <button onClick={() => setEditData([...editData, {title: "New Project", link: "", description: "", tech: []}])} className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" /> Add Project
            </button>
          </div>
        )}

        <div className="flex gap-3 pt-4 border-t border-slate-700">
          <button onClick={() => setEditSection(null)} className="flex-1 py-2 text-slate-400 hover:text-white">Cancel</button>
          <button onClick={handleSave} className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium flex items-center justify-center gap-2">
            <Save className="w-4 h-4" /> Save Changes
          </button>
        </div>
      </Modal>
    );
  };

  const Navbar = () => (
    <nav className="fixed top-0 left-0 right-0 bg-slate-900/90 backdrop-blur-sm border-b border-slate-800 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
          GS.
        </span>
        <div className="flex gap-6 text-sm font-medium text-slate-300 items-center">
          <a href="#about" className="hover:text-white transition-colors">About</a>
          <a href="#skills" className="hover:text-white transition-colors">Skills</a>
          <a href="#projects" className="hover:text-white transition-colors">Projects</a>
          <a href="#contact" className="hover:text-white transition-colors">Contact</a>
          {isAdmin && (
            <button onClick={handleLogout} className="px-3 py-1 bg-red-500/10 text-red-400 rounded hover:bg-red-500/20 text-xs">
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );

  const ContactForm = () => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [status, setStatus] = useState('idle');

    const handleSubmit = async (e) => {
      e.preventDefault();
      // Ensure we use the correct collection path as per instructions
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
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">Name</label>
          <input 
            type="text" required
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">Email</label>
          <input 
            type="email" required
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">Message</label>
          <textarea 
            rows="4" required
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            value={formData.message}
            onChange={(e) => setFormData({...formData, message: e.target.value})}
          ></textarea>
        </div>
        <button 
          type="submit" disabled={status === 'loading'}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === 'loading' ? <span className="animate-pulse">Sending...</span> : status === 'success' ? <span className="text-green-300">Message Sent!</span> : <>Send Message <Send className="w-4 h-4" /></>}
        </button>
      </form>
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-blue-500/30">
      <Navbar />
      <EditForm />
      
      {isLoginOpen && (
        <Modal title="Admin Login" onClose={() => setIsLoginOpen(false)}>
          <form onSubmit={handleLogin} className="space-y-4">
            <input name="email" type="email" placeholder="Email" required className="w-full bg-slate-800 border border-slate-700 rounded p-3 text-white" />
            <input name="password" type="password" placeholder="Password" required className="w-full bg-slate-800 border border-slate-700 rounded p-3 text-white" />
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded">Login</button>
          </form>
        </Modal>
      )}

      {/* Hero Section */}
      <section id="about" className="pt-32 pb-20 px-4 relative group/section">
        <EditBtn section="personal" data={content.personalInfo} />
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-start justify-between gap-12">
            <div className="flex-1 space-y-6">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-sm font-medium border border-emerald-500/20">
                <span className="relative flex h-2 w-2 mr-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                Open to Opportunities
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight">
                {content.personalInfo.name}
              </h1>
              <h2 className="text-2xl md:text-3xl text-slate-400 font-light">
                {content.personalInfo.role}
              </h2>
              <p className="text-lg text-slate-400 max-w-xl leading-relaxed">
                Passionate about leveraging data to build intelligent systems. 
                Specializing in Deep Learning, NLP, and scalable data architectures.
                Based in <span className="text-white">{content.personalInfo.location}</span>.
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                <a href={content.personalInfo.social.github} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-5 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700">
                  <Github className="w-5 h-5" /> GitHub
                </a>
                <a href={content.personalInfo.social.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-lg shadow-blue-900/20">
                  <Linkedin className="w-5 h-5" /> LinkedIn
                </a>
                <a href={content.personalInfo.social.resume} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-5 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700">
                  <Download className="w-5 h-5" /> Resume
                </a>
              </div>
            </div>

            {/* Stats Card */}
            <div className="w-full md:w-80 bg-slate-900/50 backdrop-blur border border-slate-800 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-blue-400" /> Education
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-slate-100 font-medium">{content.personalInfo.education.college}</p>
                  <p className="text-sm text-slate-350 font-medium">Degree: {content.personalInfo.education.degree}</p>
                  <p className="text-sm text-slate-400">CGPA: {content.personalInfo.education.cgpa}</p>
                </div>
                <div className="h-px bg-slate-800" />
                <div>
                  <p className="text-sm text-slate-400 mb-2">Key Competencies</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 text-xs rounded bg-slate-800 text-slate-300">DSA</span>
                    <span className="px-2 py-1 text-xs rounded bg-slate-800 text-slate-300">Model Deployment</span>
                    <span className="px-2 py-1 text-xs rounded bg-slate-800 text-slate-300">Data pipelines</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-20 bg-slate-900/30 relative group/section">
        <EditBtn section="skills" data={content.skillCategories} />
        <div className="max-w-6xl mx-auto px-4">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Technical Arsenal</h2>
            <p className="text-slate-400">Tools and technologies I use to bring data to life.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {content.skillCategories.map((category, idx) => (
              <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-all hover:shadow-xl hover:shadow-blue-900/10 group">
                <div className="mb-4 p-3 bg-slate-950 rounded-lg inline-block group-hover:scale-110 transition-transform">
                  {idx === 0 ? <Brain className="w-6 h-6 text-purple-400" /> : idx === 1 ? <Code2 className="w-6 h-6 text-blue-400" /> : idx === 2 ? <Database className="w-6 h-6 text-emerald-400" /> : <Terminal className="w-6 h-6 text-orange-400" />}
                </div>
                <h3 className="text-lg font-semibold text-white mb-4">{category.title}</h3>
                <ul className="space-y-2">
                  {category.skills.map((skill, sIdx) => (
                    <li key={sIdx} className="flex items-center text-slate-400 text-sm">
                      <ChevronRight className="w-3 h-3 text-slate-600 mr-2" />
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
      <section id="projects" className="py-20 px-4 relative group/section">
        <EditBtn section="projects" data={content.projects} />
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-white mb-4">Featured Projects</h2>
              <p className="text-slate-400">A selection of my recent work in ML and Software Development.</p>
            </div>
            <a href={content.personalInfo.social.github} target="_blank" rel="noreferrer" className="hidden md:flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors">
              View all on GitHub <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {content.projects.map((project, idx) => (
              <a 
                key={idx} 
                href={project.link}
                target="_blank"
                rel="noreferrer"
                className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-blue-500/30 transition-all group flex flex-col"
              >
                <div className="h-48 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center p-8 group-hover:from-slate-800 group-hover:to-blue-900/20 transition-colors relative">
                   <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ExternalLink className="w-5 h-5 text-blue-400" />
                   </div>
                  <Cpu className="w-16 h-16 text-slate-700 group-hover:text-blue-400 transition-colors" />
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">{project.title}</h3>
                  <p className="text-slate-400 text-sm mb-4 leading-relaxed flex-1">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-auto">
                    {project.tech.map((t, tIdx) => (
                      <span key={tIdx} className="px-2 py-1 bg-slate-800 text-slate-300 text-xs rounded border border-slate-700">
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
      <section id="contact" className="py-20 bg-slate-900/30">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl border border-slate-800 p-8 md:p-12 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -ml-32 -mb-32"></div>
            
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl font-bold text-white mb-4">Let's Connect</h2>
                <p className="text-slate-400 mb-8">
                  I'm currently looking for new opportunities in Machine Learning and Data Science. 
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-slate-300">
                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-blue-400" />
                    </div>
                    <span>{content.personalInfo.location}</span>
                  </div>
                  <div className="flex items-center gap-4 text-slate-300">
                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center">
                      <Mail className="w-5 h-5 text-emerald-400" />
                    </div>
                    <a href={content.personalInfo.social.email} className="hover:text-white transition-colors">gughanguguu@gmail.com</a>
                  </div>
                </div>
              </div>

              <div className="bg-slate-950/50 p-6 rounded-xl border border-slate-800/50">
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-8 text-center text-slate-500 text-sm">
        <p>© {new Date().getFullYear()} {content.personalInfo.name}. Built with React & Tailwind.</p>
        <div className="mt-4">
          <button 
            onClick={() => setIsLoginOpen(true)} 
            className="text-slate-700 hover:text-slate-500 text-xs flex items-center justify-center gap-1 mx-auto"
          >
            <Lock className="w-3 h-3" /> Admin Login
          </button>
        </div>
      </footer>
    </div>
  );
}