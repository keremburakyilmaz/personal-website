import { useState } from 'react';
import './App.css';
import profile_picture from "./assets/profile_picture.jpg"

export default function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [menuOpen, setMenuOpen] = useState(false);
  
  const projects = [
    {
      title: "Business Solution Discovery Chatbot (RAG-based)",
      description: "Designed an end-to-end chatbot using Retrieval-Augmented Generation (RAG) to match users with tailored business solutions. Implemented semantic search with FAISS and integrated LLaMA-3 via Groq API for real-time generation.",
      tags: ["RAG", "FAISS", "LLaMA-3", "MySQL", "AWS EC2", "RDS", "Selenium"]
    },
    {
      title: "QuantFusion – AI-Powered Financial Intelligence Platform",
      description: "Building a modular AI-powered finance platform integrating portfolio optimization, risk analytics, sentiment analysis, and algorithmic trading. Developed FastAPI-based risk analysis supporting VaR, CVaR, and advanced portfolio construction strategies.",
      tags: ["FastAPI", "React", "Portfolio Optimization", "Risk Analytics", "CAPM", "Markowitz"]
    },
    {
      title: "ChurnSight – End-to-End MLOps Pipeline",
      description: "Developed a complete MLOps pipeline for customer churn prediction with custom implementations of multiple ML algorithms. Automated hyperparameter tuning with Optuna and deployed FastAPI inference API with SHAP-based explanations.",
      tags: ["MLOps", "XGBoost", "FastAPI", "Docker", "SHAP", "Optuna", "GitHub Actions"]
    },
    {
      title: "F1 Predictor – Driver Outcome Classification",
      description: "Built a multithreaded data pipeline to collect historical F1 race data and trained a Random Forest classifier to predict driver categories with 77% accuracy and 100% recall on Top 3 predictions.",
      tags: ["Random Forest", "FastF1", "ThreadPoolExecutor", "Data Pipeline", "Classification"]
    }
  ];
  
  const experience = [
    {
      company: "Exin Health AI",
      position: "AI Engineering Intern",
      period: "June 2025 - Present",
      description: "Developing an iOS mobile app that digitalizes operation rooms and makes it easier to fill out forms using ASR and LLMs. Working on decreasing hallucination in LLM outputs and improving JSON accuracy from speech input."
    },
    {
      company: "Digitopia",
      position: "AI Engineering Intern",
      period: "May 2025 - Present",
      description: "Working on a chatbot to help customers understand which DMI level they are currently at and what steps they should take to achieve their goals."
    },
    {
      company: "AINA",
      position: "Co-founder",
      period: "Oct 2024 - Present",
      description: "Developing hackathon-winner idea into a business. Building a mobile app for clothing customers using AI to rate outfits and get recommendations. Responsible for full-stack Flutter + Supabase, recommendation model and rating system."
    },
    {
      company: "Genarion",
      position: "AI Engineering Intern",
      period: "Feb 2025 - May 2025",
      description: "Worked on LLM-based software applications. Wrote interview script generating questions for multiple skill areas based on job posts and CVs. Finetuned TTS models to speak Turkish naturally with automated dataset creation from YouTube videos."
    },
    {
      company: "Forma Makine",
      position: "Machine Learning Intern",
      period: "Dec 2024 - Feb 2025",
      description: "Learned about statistics and mathematics of machine learning algorithms, building foundational knowledge for advanced ML implementations."
    }
  ];
  
  const education = [
    {
      institution: "Koç University",
      degree: "BEng in Computer Engineering",
      period: "Sept 2022 - June 2026",
      description: "GPA: 3.86 • Vehbi Koç Honor List • Strong foundations in object-oriented programming, data structures, and algorithms."
    },
    {
      institution: "Koç University",
      degree: "BBA in Business Administration",
      period: "Jan 2024 - June 2027",
      description: "GPA: 3.86 • Vehbi Koç Honor List • Double major focusing on business strategy and entrepreneurship."
    }
  ];
  
  const skills = [
    "Machine Learning", "MLOps", "Generative AI", "Python", "FastAPI", "Docker", 
    "AWS EC2/RDS", "React", "Flutter", "LLM Fine-tuning", "RAG Systems", 
    "FAISS", "MySQL", "TensorFlow", "XGBoost", "SHAP", "Optuna", 
    "Git", "CI/CD", "Selenium", "Data Structures", "Turkish (Native)", "English (C1)"
  ];
  
  return (
    <div className="app-container">
      {/* Navigation */}
      <nav>
        <div className="nav-brand">Kerem Burak Yılmaz</div>
        
        <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? 'X' : '☰'}
        </button>
        
        <div className="desktop-nav">
          <button 
            className={`nav-item ${activeSection === 'home' ? 'active' : ''}`} 
            onClick={() => setActiveSection('home')}
          >
            Home
          </button>
          <button 
            className={`nav-item ${activeSection === 'projects' ? 'active' : ''}`} 
            onClick={() => setActiveSection('projects')}
          >
            Projects
          </button>
          <button 
            className={`nav-item ${activeSection === 'resume' ? 'active' : ''}`} 
            onClick={() => setActiveSection('resume')}
          >
            Resume
          </button>
          <button 
            className={`nav-item ${activeSection === 'contact' ? 'active' : ''}`} 
            onClick={() => setActiveSection('contact')}
          >
            Contact
          </button>
        </div>
      </nav>
      
      {/* Mobile Navigation */}
      {menuOpen && (
        <div className="mobile-nav">
          <button 
            className={`nav-item ${activeSection === 'home' ? 'active' : ''}`} 
            onClick={() => {setActiveSection('home'); setMenuOpen(false)}}
          >
            Home
          </button>
          <button 
            className={`nav-item ${activeSection === 'projects' ? 'active' : ''}`} 
            onClick={() => {setActiveSection('projects'); setMenuOpen(false)}}
          >
            Projects
          </button>
          <button 
            className={`nav-item ${activeSection === 'resume' ? 'active' : ''}`} 
            onClick={() => {setActiveSection('resume'); setMenuOpen(false)}}
          >
            Resume
          </button>
          <button 
            className={`nav-item ${activeSection === 'contact' ? 'active' : ''}`} 
            onClick={() => {setActiveSection('contact'); setMenuOpen(false)}}
          >
            Contact
          </button>
        </div>
      )}
      
      {/* Main Content */}
      <main>
        {activeSection === 'home' && (
          <section className="home-section">
            <div className="profile-image">
              <img src={profile_picture} alt="Kerem Burak Yılmaz" />
            </div>
            
            <div className="profile-content">
              <h1 className="profile-title">Kerem Burak Yılmaz</h1>
              <h2 className="profile-subtitle">Co-founder @AINA <br/> AI Engineer @Digitopia & @ExinHealthAI</h2>
              <p className="profile-bio">
                A concise bio highlighting your expertise, experience, and what drives you. This is your chance to make a great first impression and connect with visitors to your site.
              </p>
              
            <div className="social-links">
                <a href="https://github.com/keremburakyilmaz" target="_blank" rel="noopener noreferrer" className="social-link">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                    </svg>
                </a>
                <a href="https://linkedin.com/in/keremburakyilmaz" target="_blank" rel="noopener noreferrer" className="social-link">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                        <rect x="2" y="9" width="4" height="12"></rect>
                        <circle cx="4" cy="4" r="2"></circle>
                    </svg>
                </a>
                <a href="mailto:kyilmaz22@ku.edu.tr" className="social-link">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                        <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                </a>
            </div>

            </div>
          </section>
        )}
        
        {activeSection === 'projects' && (
          <section>
            <h1 className="projects-heading">Projects</h1>
            <div className="projects-grid">
              {projects.map((project, index) => (
                <div key={index} className="project-card">
                  <h2 className="project-title">{project.title}</h2>
                  <p className="project-description">{project.description}</p>
                  <div className="project-tags">
                    {project.tags.map((tag, tagIndex) => (
                      <span key={tagIndex} className="project-tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
        
        {activeSection === 'resume' && (
          <section>
            <h1 className="resume-heading">Resume</h1>
            
            <div className="resume-section">
              <h2 className="section-heading">Experience</h2>
              {experience.map((job, index) => (
                <div key={index} className="experience-item">
                  <div className="experience-header">
                    <h3 className="job-title">{job.position} at {job.company}</h3>
                    <span className="job-period">{job.period}</span>
                  </div>
                  <p className="job-description">{job.description}</p>
                </div>
              ))}
            </div>
            
            <div className="resume-section">
              <h2 className="section-heading">Education</h2>
              {education.map((edu, index) => (
                <div key={index} className="education-item">
                  <div className="education-header">
                    <h3 className="degree-title">{edu.degree} • {edu.institution}</h3>
                    <span className="education-period">{edu.period}</span>
                  </div>
                  <p className="education-description">{edu.description}</p>
                </div>
              ))}
            </div>
            
            <div className="resume-section">
              <h2 className="section-heading">Skills</h2>
              <div className="skills-container">
                {skills.map((skill, index) => (
                  <span key={index} className="skill-badge">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </section>
        )}
        
        {activeSection === 'contact' && (
          <section className="contact-section">
            <h1 className="contact-heading">Contact Me</h1>
            <div className="contact-card">
              <p className="contact-intro">
                I'm always open to new opportunities and collaborations. Feel free to reach out through any of the channels below:
              </p>
              
              <div className="contact-list">
                <a href="https://github.com/keremburakyilmaz" target="_blank" rel="noopener noreferrer" className="contact-item">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                  </svg>
                </a>
                <a href="https://linkedin.com/in/keremburakyilmaz" target="_blank" rel="noopener noreferrer" className="contact-item">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect x="2" y="9" width="4" height="12"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                </a>
                <a href="mailto:kyilmaz22@ku.edu.tr" className="contact-item">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                </a>
              </div>

              <hr className="contact-divider" />

              <p className="external-link">
                <a href="https://royaarkh.com" target="_blank" rel="noopener noreferrer">
                  Also visit royaarkh.com!
                </a>
              </p>
            </div>
          </section>
        )}
      </main>
      
      {/* Footer */}
      <footer>
        <p>© {new Date().getFullYear()} Kerem Burak Yılmaz. All rights reserved.</p>
      </footer>
    </div>
  );
}