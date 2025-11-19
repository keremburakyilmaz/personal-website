import { useState } from 'react';
import './Contact.css';
import roya from "../../assets/roya_arkhmammadova.JPG";
import deniz from "../../assets/deniz_soylular.jpg";
import my_love from "../../assets/emiliya_rafiyeva.jpg";
import aina from "../../assets/ainaapp_logo.jpg";

export default function Contact() {
  const [popupVisible, setPopupVisible] = useState(false);

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

  return (
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
  );
}

