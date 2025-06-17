import { useState } from 'react';
import './App.css';
import profile_picture from "./assets/profile_picture.jpg"

export default function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [menuOpen, setMenuOpen] = useState(false);
  
  const projects = [
    {
      title: "Project One",
      description: "A brief description of your first project and what technologies you used.",
      tags: ["React", "Node.js", "MongoDB"]
    },
    {
      title: "Project Two",
      description: "Description of your second project, highlighting your role and accomplishments.",
      tags: ["JavaScript", "CSS", "API Integration"]
    },
    {
      title: "Project Three",
      description: "Overview of another project showcasing different skills or approaches.",
      tags: ["TypeScript", "Next.js", "Tailwind CSS"]
    }
  ];
  
  const experience = [
    {
      company: "Company Name",
      position: "Job Title",
      period: "Jan 2022 - Present",
      description: "Description of your responsibilities and achievements."
    },
    {
      company: "Previous Company",
      position: "Previous Role",
      period: "Mar 2020 - Dec 2021",
      description: "Overview of your previous position and notable accomplishments."
    }
  ];
  
  const education = [
    {
      institution: "University Name",
      degree: "Degree Type",
      period: "2016 - 2020",
      description: "Relevant coursework and achievements."
    }
  ];
  
  const skills = ["JavaScript", "React", "HTML/CSS", "Node.js", "Git", "Responsive Design", "UI/UX Principles"];
  
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
           {/*<a href="https://royaarkh.com" className="corner-badge" target="_blank" rel="noopener noreferrer">
                Also visit royaarkh.com!
              </a>*/}
            </div>
            
            <div className="profile-content">
              <h1 className="profile-title">Kerem Burak Yılmaz</h1>
              <h2 className="profile-subtitle">Co-founder @AIKUT, AI Engineer @Genarion</h2>
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