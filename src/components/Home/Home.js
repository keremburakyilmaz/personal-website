import './Home.css';
import profile_picture from "../../assets/profile_picture.jpg";

export default function Home() {
  return (
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
  );
}

