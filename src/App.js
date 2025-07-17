import { useState, useEffect } from 'react';
import './App.css';
import profile_picture from "./assets/profile_picture.jpg"
import roya from "./assets/roya_arkhmammadova.JPG"
import deniz from "./assets/deniz_soylular.jpg"
import my_love from "./assets/emiliya_rafiyeva.jpg"
import aina from "./assets/ainaapp_logo.jpg"

export default function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    try {
      await fetch("https://formsubmit.co/kyilmaz22@ku.edu.tr", {
        method: "POST",
        body: formData
      });

      setPopupVisible(true);
      setTimeout(() => setPopupVisible(false), 3000);
      e.target.reset();
    } catch (err) {
      alert("Message failed to send.");
    }
  };
  
  const projects = [
    {
      title: "Business Solution Discovery Chatbot (RAG-based)",
      description: [
        "Designed an end-to-end chatbot using Retrieval-Augmented Generation (RAG) to match users with tailored business solutions.",
        "Implemented semantic search with FAISS and SentenceTransformers; integrated LLaMA-3 via Groq API for real-time generation.",
        "Built a feedback-aware retraining pipeline using MySQL logs and CosineSimilarityLoss.",
        "Automated web scraping with Selenium and developed analytics dashboards with Matplotlib and Pandas.",
        "Deployed production backend on AWS EC2 and managed cloud database with RDS."
      ],
      tags: ["RAG", "FAISS", "LLaMA-3", "MySQL", "AWS EC2", "RDS", "Selenium", "Matplotlib", "Pandas"]
    },
    {
      title: "QuantFusion - AI-Powered Financial Intelligence Platform",
      description: [
        "Building a modular AI-powered finance platform integrating portfolio optimization, risk analytics, sentiment analysis, and algorithmic trading into a unified backend-frontend system.",
        "Developed FastAPI-based risk analysis supporting VaR, CVaR, volatility, drawdown, CAPM beta, and risk attribution using both historical and parametric methods.",
        "Implemented advanced portfolio construction strategies including Mean-Variance Optimization (Markowitz), Risk Parity, and Black-Litterman with real-world constraints like sector limits, weight bounds, and tracking error.",
        "Roadmap includes deployment of options pricing models, a sentiment-driven market forecasting engine, and a rule-based trading module."
      ],
      tags: ["FastAPI", "React", "Portfolio Optimization", "Risk Analytics", "CAPM", "Markowitz", "Black-Litterman", "Sentiment Analysis"]
    },
    {
      title: "ChurnSight - End-to-End MLOps Pipeline",
      description: [
        "Developed a complete end-to-end MLOps pipeline for customer churn prediction with custom implementations of Logistic Regression, Decision Tree, Random Forest, XGBoost, MLP, and Gaussian Naive Bayes classifiers, and implemented a meta classifier using all the custom models.",
        "Automated hyperparameter tuning with Optuna and evaluated models using ROC-AUC and accuracy.",
        "Deployed FastAPI inference API with support for batch predictions and SHAP-based feature explanations.",
        "Containerized the app with Docker and integrated basic CI/CD workflows via GitHub Actions."
      ],
      tags: ["MLOps", "XGBoost", "FastAPI", "Docker", "SHAP", "Optuna", "GitHub Actions", "Meta Classifier"]
    },
    {
      title: "F1 Predictor - Driver Outcome Classification",
      description: [
        "Built a multithreaded data pipeline with FastF1 and ThreadPoolExecutor to collect historical F1 race, weather, and qualifying data.",
        "Trained a custom Random Forest classifier to predict driver categories (Top 3, Midfield, Backmarker) with 77% accuracy.",
        "Achieved 100% recall on Top 3 predictions; validated model with precision/recall scores and confusion matrix analysis."
      ],
      tags: ["Random Forest", "FastF1", "ThreadPoolExecutor", "Data Pipeline", "Classification", "Precision/Recall"]
    }
  ];
  
  const experience = [
    {
      company: "AINA",
      position: "Co-founder",
      period: "Oct 2024 - Present (Remote)",
      description: [
        "Developing our hackathon-winner idea into a business.",
        "Building a mobile app for entertainment of clothing customers where they can use AI to rate their outfits and get recommendations, create outfits with their clothes, and find shopping options to add to their closet.",
        "Responsible for the full-stack Flutter + Supabase, the recommendation model and the rating system."
      ]
    },
    {
      company: "Exin Health AI",
      position: "AI Engineering Intern",
      period: "June 2025 - Present (Remote)",
      description: [
        "Developing an IOS mobile app that digitalizes operation rooms and makes it easier to fill out forms using ASR, vision recognition, OCR and LLMs.",
        "Implemented LLM-as-a-judge system to our LangGraph in order to decrease the hallucinations.",
        "Created a thorough testing system to automatically test our endpoints for both voice recognition and image recognition."
      ]
    },
    {
      company: "Digitopia",
      position: "AI Engineering Intern",
      period: "May 2025 - Present (Hybrid - Beyoglu/Istanbul)",
      description: [
        "Coded several chatbots that, included but not limited to:",
        "- Help customers understand their DMI scores.",
        "- Motivate customers with success stories.",
        "- Give customers bullet-point, step-by-step plan to achieve their DMI score goals.",
        "- Guide customers execute their plan.",
        "Working on how to orchestrate all these chatbots in a single, tool-calling workflow."
      ]
    },
    {
      company: "Genarion",
      position: "AI Engineering Intern",
      period: "Feb 2025 - May 2025 (Remote)",
      description: [
        "Worked on software applications based on LLM.",
        "Wrote an interview script which generates questions evaluating multiple areas including hard and soft skills based on the given job post, CV, and previous answers using TTS and STT.",
        "Finetuned multiple TTS models to speak Turkish naturally with self written scripts to create dataset from youtube videos automatically."
      ]
    },
    {
      company: "Forma Makine",
      position: "Machine Learning Intern",
      period: "Dec 2024 - Feb 2025 (Remote)",
      description: [
        "Learnt about statistics and mathematics of the machine learning algorithms."
      ]
    }
  ];
  
  const education = [
    {
      institution: "Koç University",
      degree: "BEng in Computer Engineering",
      period: "Sept 2022 - June 2026",
      description: "GPA: 3.83 • Vehbi Koç Honor List"
    },
    {
      institution: "Koç University",
      degree: "BBA in Business Administration",
      period: "Jan 2024 - June 2027",
      description: "GPA: 3.83 • Vehbi Koç Honor List"
    }
  ];
  
  const skills = [
    "Machine Learning", "MLOps", "Generative AI", "Quantitative Analysis", "FastAPI", "Docker", "AWS EC2/RDS", "LangGraph", "MLflow", "Feedback-aware Fine-tuning", "Object-Oriented Programming", "Data Structures", "UI/UX", "Teamwork", "Flutter", "Supabase", "Vision Recognition", "OCR", "LLMs", "ASR", "TTS", "Selenium", "Matplotlib", "Pandas", "Optuna", "SHAP", "CI/CD", "GitHub Actions", "Python", "English (C1 Advanced)", "Turkish (Native)"
  ];
  
  return (
    <div className="app-container">
      {/* Navigation */}
      <nav className={`nav-container ${isScrolled ? 'scrolled' : ''}`}>
        <div className="nav-content">
          <div className="nav-brand">
            <span className="nav-brand-name">Kerem Burak Yılmaz</span>
            <span className="nav-brand-title">AI/ML Engineer</span>
          </div>
          
          <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)}>
            <div className={`menu-icon ${menuOpen ? 'open' : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </button>
          
          <div className="desktop-nav">
            <button 
              className={`nav-item ${activeSection === 'home' ? 'active' : ''}`} 
              onClick={() => setActiveSection('home')}
            >
              <span>Home</span>
            </button>
            <button 
              className={`nav-item ${activeSection === 'projects' ? 'active' : ''}`} 
              onClick={() => setActiveSection('projects')}
            >
              <span>Projects</span>
            </button>
            <button 
              className={`nav-item ${activeSection === 'resume' ? 'active' : ''}`} 
              onClick={() => setActiveSection('resume')}
            >
              <span>Resume</span>
            </button>
            <button 
              className={`nav-item ${activeSection === 'contact' ? 'active' : ''}`} 
              onClick={() => setActiveSection('contact')}
            >
              <span>Contact</span>
            </button>
          </div>
        </div>
      </nav>
      
      {/* Mobile Navigation */}
      {menuOpen && (
        <div className="mobile-nav">
          <button 
            className={`nav-item ${activeSection === 'home' ? 'active' : ''}`} 
            onClick={() => {setActiveSection('home'); setMenuOpen(false)}}
          >
            <span>Home</span>
          </button>
          <button 
            className={`nav-item ${activeSection === 'projects' ? 'active' : ''}`} 
            onClick={() => {setActiveSection('projects'); setMenuOpen(false)}}
          >
            <span>Projects</span>
          </button>
          <button 
            className={`nav-item ${activeSection === 'resume' ? 'active' : ''}`} 
            onClick={() => {setActiveSection('resume'); setMenuOpen(false)}}
          >
            <span>Resume</span>
          </button>
          <button 
            className={`nav-item ${activeSection === 'contact' ? 'active' : ''}`} 
            onClick={() => {setActiveSection('contact'); setMenuOpen(false)}}
          >
            <span>Contact</span>
          </button>
        </div>
      )}
      
      {/* Main Content */}
      <main>
        {activeSection === 'home' && (
          <section className="home-section">
            <div className="home-content">
              <div className="profile-intro">
                <div className="profile-image-and-name">
                  <h1 className="profile-title">
                    <span>Kerem Burak</span>
                    <span>Yılmaz</span>
                  </h1>
                  <div className="profile-image-container">
                    <div className="profile-image">
                      <img src={profile_picture} alt="Kerem Burak Yılmaz" />
                    </div>
                    <div className="image-highlight"></div>
                  </div>
                </div>
                <div className="profile-content">
                  <h2 className="profile-subtitle">
                    <span>Passionate Computer Engineering student (GPA: 3.83) with hands-on experience in machine learning, MLOps, generative AI and quantitative analysis.</span>
                  </h2>
                  <ul className="profile-bio">
                    <li>Designed and deployed full-stack AI systems including a Retrieval-Augmented Generation (RAG) chatbot for business solution discovery, end-to-end ML pipelines for financial forecasting and automatic AI workflows using LangGraph.</li>
                    <li>Skilled in deploying applications with Docker, FastAPI, and AWS EC2/RDS, and integrating model monitoring with MLflow and feedback-aware fine-tuning loops.</li>
                    <li>Strong foundations in object-oriented programming, data structures, UI/UX, and teamwork through diverse collaborative projects and hackathons.</li>
                  </ul>
                  <div className="social-links">
                    <a href="https://github.com/keremburakyilmaz" target="_blank" rel="noopener noreferrer" className="social-link">
                      <div className="social-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                        </svg>
                      </div>
                      <span>GitHub</span>
                    </a>
                    <a href="https://linkedin.com/in/keremburakyilmaz" target="_blank" rel="noopener noreferrer" className="social-link">
                      <div className="social-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                          <rect x="2" y="9" width="4" height="12"></rect>
                          <circle cx="4" cy="4" r="2"></circle>
                        </svg>
                      </div>
                      <span>LinkedIn</span>
                    </a>
                    <a href="mailto:kyilmaz22@ku.edu.tr" className="social-link">
                      <div className="social-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                          <polyline points="22,6 12,13 2,6"></polyline>
                        </svg>
                      </div>
                      <span>Email</span>
                    </a>
                  </div>
                </div>
              </div>
              
              <div className="expertise-section">
                <div className="expertise-card">
                  <div className="expertise-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 20h9"></path>
                      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                    </svg>
                  </div>
                  <div className="expertise-content">
                    <h3>AI & ML Engineering</h3>
                    <p>Hands-on experience in generative AI, RAG systems, and quantitative analysis.</p>
                  </div>
                </div>
                
                <div className="expertise-card">
                  <div className="expertise-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                      <line x1="8" y1="21" x2="16" y2="21"></line>
                      <line x1="12" y1="17" x2="12" y2="21"></line>
                    </svg>
                  </div>
                  <div className="expertise-content">
                    <h3>Full-Stack & MLOps</h3>
                    <p>Deploying with Docker, FastAPI, AWS, MLflow, and feedback-aware fine-tuning.</p>
                  </div>
                </div>
                
                <div className="expertise-card">
                  <div className="expertise-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                  </div>
                  <div className="expertise-content">
                    <h3>Programming & Collaboration</h3>
                    <p>Strong in OOP, data structures, UI/UX, and teamwork in diverse projects.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
        
        {activeSection === 'projects' && (
          <section className="projects-section">
            <div className="section-header">
              <h1>Featured <span>Projects</span></h1>
              <div className="section-subtitle">Innovative solutions leveraging cutting-edge AI technologies</div>
            </div>
            
            <div className="projects-grid">
              {projects.map((project, index) => (
                <div key={index} className="project-card">
                  <div className="project-number">{String(index + 1).padStart(2, '0')}</div>
                  <div className="project-content">
                    <h2 className="project-title">{project.title}</h2>
                    <ul className="project-description">
                      {project.description.map((point, i) => (
                        <li key={i}>{point}</li>
                      ))}
                    </ul>
                    <div className="project-tags">
                      {project.tags.map((tag, tagIndex) => (
                        <span key={tagIndex} className="project-tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
        
        {activeSection === 'resume' && (
          <section className="resume-section">
            <div className="section-header">
              <h1>Professional <span>Experience</span></h1>
              <div className="section-subtitle">My journey through AI and entrepreneurship</div>
            </div>
            
            <div className="timeline-container">
              {experience.map((job, index) => (
                <div key={index} className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'}`}>
                  <div className="timeline-content">
                    <div className="timeline-period">{job.period}</div>
                    <div className="timeline-header">
                      <h3>{job.position}</h3>
                      <span>at {job.company}</span>
                    </div>
                    <ul className="timeline-description">
                      {job.description.map((point, i) => (
                        <li key={i}>{point}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="timeline-dot"></div>
                </div>
              ))}
            </div>
            
            <div className="education-section">
              <div className="section-header">
                <h1>Education & <span>Skills</span></h1>
              </div>
              
              <div className="education-cards">
                {education.map((edu, index) => (
                  <div key={index} className="education-card">
                    <div className="education-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path>
                      </svg>
                    </div>
                    <div className="education-content">
                      <h3>{edu.degree}</h3>
                      <div className="education-institution">{edu.institution}</div>
                      <div className="education-period">{edu.period}</div>
                      <p>{edu.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="skills-section">
                <h3>Technical Expertise</h3>
                <div className="skills-grid">
                  {skills.map((skill, index) => (
                    <div key={index} className="skill-item">
                      {skill}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}
        
        {activeSection === 'contact' && (
          <section className="contact-section">
            <div className="section-header">
              <h1>Let's <span>Connect</span></h1>
              <div className="section-subtitle"> I'm always open to new opportunities and collaborations. Feel free to reach out through any of the channels!</div>
            </div>
            
            <div className="contact-container">
              <div className="contact-info">
                <div className="contact-method">
                  <div className="contact-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                  </div>
                  <div className="contact-details">
                    <h3>Email</h3>
                    <a href="mailto:kyilmaz22@ku.edu.tr">kyilmaz22@ku.edu.tr</a>
                  </div>
                </div>
                
                <div className="contact-method">
                  <div className="contact-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                  </div>
                  <div className="contact-details">
                    <h3>Phone</h3>
                    <a href="tel:+905555555555">+90 (531) 379 28 91</a>
                  </div>
                </div>
                
                <div className="contact-method">
                  <div className="contact-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                  </div>
                  <div className="contact-details">
                    <h3>Location</h3>
                    <span>Istanbul, Turkey</span>
                  </div>
                </div>
              </div>
              
              <div className="contact-form">
                <h3>Send me a message</h3>
                  <form onSubmit={handleSubmit}>
                    <input type="hidden" name="_captcha" value="false" />
                    <input type="hidden" name="_template" value="table" />
                    <input type="hidden" name="_subject" value="New Portfolio Message" />

                    <div className="form-group">
                      <input type="text" name="name" placeholder="Name" required />
                    </div>
                    <div className="form-group">
                      <input type="email" name="email" placeholder="Email" required />
                    </div>
                    <div className="form-group">
                      <textarea name="message" placeholder="Message" rows="4" required></textarea>
                    </div>
                    <button type="submit" className="submit-button">
                      Send Message
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="22" y1="2" x2="11" y2="13"></line>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                      </svg>
                    </button>
                  </form>

                  {popupVisible && (
                    <div className="popup-success">
                      ✅ Message sent successfully!
                    </div>
                  )}

              </div>
            </div>

            <hr className="section-divider" />

            <div className="secondary-section-header">
              <h1>Additional Links</h1>
            </div>

            <div className="additional-links">
              <div className="additional-link-box special-box-love">
                <div className="link-box-content">
                  <img src={my_love} alt="Emiliya Rafiyeva" className="link-avatar" />
                  <div>
                    <h3>Emiliya Rafiyeva</h3>
                    <a href="https://www.linkedin.com/in/emiliya-rafiyeva/" target="_blank" rel="noopener noreferrer">
                      www.linkedin.com/in/emiliya-rafiyeva ↗
                    </a>
                  </div>
                </div>
              </div>
              <div className="additional-link-box">
                <div className="link-box-content">
                  <img src={roya} alt="Roya Arkhmammadova" className="link-avatar" />
                  <div>
                    <h3>Roya Arkhmammadova</h3>
                    <a href="https://www.royaarkh.com" target="_blank" rel="noopener noreferrer">
                      www.royaarkh.com ↗
                    </a>
                  </div>
                </div>
              </div>

              <div className="additional-link-box">
                <div className="link-box-content">
                  <img src={deniz} alt="Deniz Soylular" className="link-avatar" />
                  <div>
                    <h3>Deniz Soylular</h3>
                    <a href="https://www.linkedin.com/in/deniz-soylular/" target="_blank" rel="noopener noreferrer">
                      www.linkedin.com/in/deniz-soylular ↗
                    </a>
                  </div>
                </div>
              </div>

              <div className="additional-link-box">
                <div className="link-box-content">
                  <img src={aina} alt="AINA" className="link-avatar" />
                  <div>
                    <h3>AINA - Tinder for Your Clothing</h3>
                    <a href="https://www.aina.one" target="_blank" rel="noopener noreferrer">
                      www.aina.one ↗
                    </a>
                  </div>
                </div>
              </div>
            </div>

          </section>
        )}
      </main>
      
      {/* Footer */}
      {/*

      <footer>
        <div className="footer-content">
          <div className="footer-brand">Kerem Burak Yılmaz</div>
          <div className="footer-links">
            <button onClick={() => setActiveSection('home')}>Home</button>
            <button onClick={() => setActiveSection('projects')}>Projects</button>
            <button onClick={() => setActiveSection('resume')}>Resume</button>
            <button onClick={() => setActiveSection('contact')}>Contact</button>
          </div>
          <div className="footer-social">
            <a href="https://github.com/keremburakyilmaz" target="_blank" rel="noopener noreferrer">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
              </svg>
            </a>
            <a href="https://linkedin.com/in/keremburakyilmaz" target="_blank" rel="noopener noreferrer">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                <rect x="2" y="9" width="4" height="12"></rect>
                <circle cx="4" cy="4" r="2"></circle>
              </svg>
            </a>
            <a href="mailto:kyilmaz22@ku.edu.tr">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
            </a>
          </div>
        </div>
        <div className="footer-copyright">
          © {new Date().getFullYear()} Kerem Burak Yılmaz. All rights reserved.
        </div>
      </footer>
      */}
    </div>
  );
}