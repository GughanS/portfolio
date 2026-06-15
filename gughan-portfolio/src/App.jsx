import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import {
  Save,
  Trash2,
  Plus,
  Upload,
  Image as ImageIcon,
  AlertCircle,
} from 'lucide-react';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';

import { PortfolioProvider } from './context/PortfolioContext';
import { ToastProvider, useToast } from './components/Toast';
import LoadingScreen from './components/LoadingScreen';
import Modal from './components/Modal';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Footer from './components/Footer';

// --- Firebase Configuration ---
const firebaseConfig = {
  apiKey: "API_PLACEHOLDER",
  authDomain: "portfolio-cd766.firebaseapp.com",
  projectId: "portfolio-cd766",
  storageBucket: "portfolio-cd766.firebasestorage.app",
  messagingSenderId: "921183592594",
  appId: "1:921183592594:web:b0ca7d6f170b3d9a04064b",
  measurementId: "G-HSF0F88RTV",
};

let app, auth, db;
try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
} catch (error) {
  console.warn('Firebase not initialized. Check your config keys.', error);
}

const APP_ID = 'gughan-portfolio';
const CONTENT_DOC_ID = 'main';

// --- Initial Data ---
const initialContent = {
  personalInfo: {
    name: 'Gughan S',
    role: 'Machine Learning Engineer',
    location: 'Chennai, India',
    profilePic: 'https://github.com/GughanS.png',
    education: {
      college: 'Saveetha Engineering College',
      degree: 'B.Tech Artificial Intelligence & Machine Learning',
      cgpa: '8.05',
    },
    social: {
      github: 'https://github.com/GughanS',
      linkedin: 'https://linkedin.com/in/gughan-s',
      email: 'mailto:gughanguguu@gmail.com',
      resume: 'https://drive.google.com/file/d/1qJJbrLf5SzYiVjlSb67IzPtb0R14w1U9/view?usp=sharing',
    },
  },
  skillCategories: [
    {
      title: 'Machine Learning & DS',
      skills: ['Scikit-learn', 'NumPy', 'Pandas', 'TensorFlow', 'Keras', 'PyTorch', 'Matplotlib/Seaborn', 'NLP', 'ONNX'],
    },
    {
      title: 'Languages',
      skills: ['Python', 'C', 'C++', 'SQL'],
    },
    {
      title: 'Databases',
      skills: ['MySQL', 'PostgreSQL', 'MongoDB', 'Firebase', 'DBMS'],
    },
    {
      title: 'Core Tech & Tools',
      skills: ['RESTful APIs', 'Git/GitHub', 'Data Structures & Algorithms (Intermediate)'],
    },
  ],
  projects: [
    {
      title: 'FastAPI Assets',
      link: 'https://github.com/OpenVerge/fastapi-assets',
      tech: ['FastAPI', 'Python', 'Backend'],
      description: 'A comprehensive collection of assets and utilities designed to streamline FastAPI application development and deployment workflows.',
    },
    {
      title: 'Aegis Emergency Response',
      link: 'https://github.com/GughanS/aegis-emergency-response.git',
      tech: ['Python', 'Real-time Systems', 'Automation'],
      description: 'An intelligent emergency response system designed to optimize incident handling and response times through automated data processing.',
    },
    {
      title: 'EchoSight',
      link: 'https://github.com/GughanS/EchoSight',
      tech: ['Computer Vision', 'Deep Learning', 'Python'],
      description: 'A computer vision application leveraging deep learning models for advanced visual recognition and processing tasks.',
    },
    {
      title: 'Filtered Image Fetcher',
      link: 'https://github.com/GughanS/filtered-image-fetcher',
      tech: ['Python', 'Scripting', 'Data Collection'],
      description: 'An automated tool for fetching, filtering, and organizing datasets of images based on specific criteria or metadata.',
    },
  ],
};

const inputStyle = {
  width: '100%',
  background: 'var(--bg-tertiary)',
  border: '1px solid var(--border-color)',
  borderRadius: '0.5rem',
  padding: '0.6rem 1rem',
  color: 'var(--text-primary)',
  fontFamily: 'inherit',
  fontSize: '0.9rem',
  outline: 'none',
};

const btnStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.5rem',
  padding: '0.6rem 1rem',
  borderRadius: '0.5rem',
  fontWeight: 500,
  fontSize: '0.85rem',
  cursor: 'pointer',
  border: 'none',
  transition: 'all 0.2s',
};

function AppInner() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [content, setContent] = useState(initialContent);
  const [loading, setLoading] = useState(true);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [editSection, setEditSection] = useState(null);
  const [editData, setEditData] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const addToast = useToast();

  // Auth & Data
  useEffect(() => {
    if (!auth) { setLoading(false); return; }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      const adminEmail = initialContent.personalInfo.social.email.replace('mailto:', '');
      setIsAdmin(currentUser?.email === adminEmail);
    });

    const fetchContent = async () => {
      try {
        const docRef = doc(db, 'artifacts', APP_ID, 'public', 'data', 'content', CONTENT_DOC_ID);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (!data.personalInfo.profilePic) {
            data.personalInfo.profilePic = initialContent.personalInfo.profilePic;
          }
          setContent(data);
        } else {
          await setDoc(docRef, initialContent);
          setContent(initialContent);
        }
      } catch (err) {
        console.error('Error fetching content:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
    return () => unsubscribe();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setIsLoginOpen(false);
      addToast('Logged in successfully', 'success');
    } catch (error) {
      addToast('Login failed: ' + error.message, 'error');
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setIsAdmin(false);
    addToast('Logged out', 'info');
  };

  const handleSave = async () => {
    if (!isAdmin || !db) return;
    try {
      const docRef = doc(db, 'artifacts', APP_ID, 'public', 'data', 'content', CONTENT_DOC_ID);
      let updatedContent = { ...content };
      if (editSection === 'personal') updatedContent.personalInfo = editData;
      if (editSection === 'skills') updatedContent.skillCategories = editData;
      if (editSection === 'projects') updatedContent.projects = editData;
      await updateDoc(docRef, updatedContent);
      setContent(updatedContent);
      setEditSection(null);
      setUploadError(null);
      addToast('Changes saved!', 'success');
    } catch (error) {
      console.error('Error saving:', error);
      addToast('Failed to save: ' + error.message, 'error');
    }
  };

  const handleFileUpload = (e, field) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadError(null);
    if (file.size > 800 * 1024) {
      setUploadError(`File too large (${(file.size / 1024).toFixed(0)}KB). Limit is 800KB.`);
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      if (field === 'profilePic') {
        setEditData({ ...editData, profilePic: reader.result });
      } else if (field === 'resume') {
        setEditData({ ...editData, social: { ...editData.social, resume: reader.result } });
      }
    };
    reader.readAsDataURL(file);
  };

  const openEdit = (section, data) => {
    setEditSection(section);
    setEditData(JSON.parse(JSON.stringify(data)));
    setUploadError(null);
  };

  const contextValue = {
    content,
    isAdmin,
    user,
    db,
    appId: APP_ID,
    openEdit,
    handleLogout,
    setIsLoginOpen,
  };

  return (
    <PortfolioProvider value={contextValue}>
      <LoadingScreen
        isLoading={loading}
        profilePic={content.personalInfo.profilePic}
        name={content.personalInfo.name}
      />

      {!loading && (
        <>
          {/* Animated background */}
          <div className="animated-bg" />

          <Navbar />

          {/* Login Modal */}
          <Modal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} title="Admin Login">
            <form onSubmit={handleLogin}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Email</label>
                <input name="email" type="email" required style={inputStyle} />
              </div>
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Password</label>
                <input name="password" type="password" required style={inputStyle} />
              </div>
              <button
                type="submit"
                style={{
                  ...btnStyle,
                  width: '100%',
                  justifyContent: 'center',
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  color: 'white',
                }}
              >
                Login
              </button>
            </form>
          </Modal>

          {/* Edit Modal */}
          <Modal
            isOpen={!!editSection}
            onClose={() => setEditSection(null)}
            title={`Edit ${editSection}`}
          >
            {uploadError && (
              <div style={{
                background: 'rgba(244,63,94,0.1)',
                border: '1px solid rgba(244,63,94,0.3)',
                padding: '0.75rem',
                borderRadius: '0.5rem',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.5rem',
              }}>
                <AlertCircle size={16} color="#fb7185" style={{ marginTop: 2, flexShrink: 0 }} />
                <p style={{ color: '#fb7185', fontSize: '0.85rem' }}>{uploadError}</p>
              </div>
            )}

            {editSection === 'personal' && editData && (
              <>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Name</label>
                  <input style={inputStyle} value={editData.name} onChange={(e) => setEditData({ ...editData, name: e.target.value })} />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Role</label>
                  <input style={inputStyle} value={editData.role} onChange={(e) => setEditData({ ...editData, role: e.target.value })} />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Location</label>
                  <input style={inputStyle} value={editData.location} onChange={(e) => setEditData({ ...editData, location: e.target.value })} />
                </div>

                {/* Profile Picture Upload */}
                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', marginTop: '0.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>Profile Picture</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
                    <img src={editData.profilePic} alt="Preview" style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border-color)' }} />
                    <label style={{
                      ...btnStyle,
                      background: 'transparent',
                      border: '1px dashed var(--text-muted)',
                      color: 'var(--text-secondary)',
                      cursor: 'pointer',
                      position: 'relative',
                      overflow: 'hidden',
                    }}>
                      <ImageIcon size={14} /> Upload
                      <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'profilePic')} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} />
                    </label>
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '0.3rem' }}>Or use Image URL</label>
                    <input style={inputStyle} placeholder="https://..." value={editData.profilePic} onChange={(e) => setEditData({ ...editData, profilePic: e.target.value })} />
                  </div>
                </div>

                {/* Education */}
                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Education</label>
                  <div style={{ marginBottom: '0.75rem' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '0.3rem' }}>College</label>
                    <input style={inputStyle} value={editData.education.college} onChange={(e) => setEditData({ ...editData, education: { ...editData.education, college: e.target.value } })} />
                  </div>
                  <div style={{ marginBottom: '0.75rem' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '0.3rem' }}>Degree</label>
                    <input style={inputStyle} value={editData.education.degree} onChange={(e) => setEditData({ ...editData, education: { ...editData.education, degree: e.target.value } })} />
                  </div>
                  <div style={{ marginBottom: '0.75rem' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '0.3rem' }}>CGPA</label>
                    <input style={inputStyle} value={editData.education.cgpa} onChange={(e) => setEditData({ ...editData, education: { ...editData.education, cgpa: e.target.value } })} />
                  </div>
                </div>

                {/* Social */}
                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Social & Resume</label>
                  <div style={{ marginBottom: '0.75rem' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '0.3rem' }}>Resume (Link or Upload)</label>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <input style={{ ...inputStyle, flex: 1 }} value={editData.social.resume} onChange={(e) => setEditData({ ...editData, social: { ...editData.social, resume: e.target.value } })} placeholder="Paste Link..." />
                      <label style={{ ...btnStyle, background: 'transparent', border: '1px dashed var(--text-muted)', color: 'var(--text-secondary)', cursor: 'pointer', position: 'relative', overflow: 'hidden' }}>
                        <Upload size={14} />
                        <input type="file" accept="application/pdf" onChange={(e) => handleFileUpload(e, 'resume')} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} />
                      </label>
                    </div>
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '0.3rem' }}>Note: Large PDFs should be hosted on Google Drive.</p>
                  </div>
                  <div style={{ marginBottom: '0.5rem' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '0.3rem' }}>GitHub URL</label>
                    <input style={inputStyle} value={editData.social.github} onChange={(e) => setEditData({ ...editData, social: { ...editData.social, github: e.target.value } })} />
                  </div>
                </div>
              </>
            )}

            {editSection === 'skills' && editData && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {editData.map((cat, idx) => (
                  <div key={idx} style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '0.75rem' }}>
                    <input
                      style={{ ...inputStyle, fontWeight: 600, marginBottom: '0.5rem' }}
                      value={cat.title}
                      onChange={(e) => { const n = [...editData]; n[idx].title = e.target.value; setEditData(n); }}
                    />
                    <textarea
                      style={{ ...inputStyle, resize: 'vertical' }}
                      rows="3"
                      value={cat.skills.join(', ')}
                      onChange={(e) => { const n = [...editData]; n[idx].skills = e.target.value.split(',').map((s) => s.trim()); setEditData(n); }}
                    />
                  </div>
                ))}
              </div>
            )}

            {editSection === 'projects' && editData && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {editData.map((proj, idx) => (
                  <div key={idx} style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '0.75rem', position: 'relative' }}>
                    <button
                      onClick={() => setEditData(editData.filter((_, i) => i !== idx))}
                      style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', background: 'none', border: 'none', color: '#fb7185', cursor: 'pointer', padding: '0.25rem' }}
                    >
                      <Trash2 size={14} />
                    </button>
                    <div style={{ marginBottom: '0.5rem' }}>
                      <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '0.2rem' }}>Title</label>
                      <input style={inputStyle} value={proj.title} onChange={(e) => { const n = [...editData]; n[idx].title = e.target.value; setEditData(n); }} />
                    </div>
                    <div style={{ marginBottom: '0.5rem' }}>
                      <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '0.2rem' }}>Link</label>
                      <input style={inputStyle} value={proj.link} onChange={(e) => { const n = [...editData]; n[idx].link = e.target.value; setEditData(n); }} />
                    </div>
                    <div style={{ marginBottom: '0.5rem' }}>
                      <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '0.2rem' }}>Description</label>
                      <textarea style={{ ...inputStyle, resize: 'vertical' }} value={proj.description} onChange={(e) => { const n = [...editData]; n[idx].description = e.target.value; setEditData(n); }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '0.2rem' }}>Tech (comma-separated)</label>
                      <input style={inputStyle} value={proj.tech.join(', ')} onChange={(e) => { const n = [...editData]; n[idx].tech = e.target.value.split(',').map((s) => s.trim()); setEditData(n); }} />
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => setEditData([...editData, { title: 'New Project', link: '#', tech: [], description: 'Description' }])}
                  style={{ ...btnStyle, width: '100%', justifyContent: 'center', background: 'var(--bg-tertiary)', color: 'var(--text-secondary)', border: '1px solid var(--border-color)' }}
                >
                  <Plus size={14} /> Add Project
                </button>
              </div>
            )}

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button
                onClick={() => setEditSection(null)}
                style={{ ...btnStyle, flex: 1, justifyContent: 'center', background: 'var(--bg-tertiary)', color: 'var(--text-secondary)', border: '1px solid var(--border-color)' }}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                style={{ ...btnStyle, flex: 1, justifyContent: 'center', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white' }}
              >
                <Save size={14} /> Save
              </button>
            </div>
          </Modal>

          <main>
            <Hero />
            <Skills />
            <Projects />
            <Contact />
          </main>

          <Footer />
        </>
      )}
    </PortfolioProvider>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AppInner />
    </ToastProvider>
  );
}
