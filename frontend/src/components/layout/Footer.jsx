import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-brand">
            <span className="brand-icon">✧</span>
            <span className="brand-text">FOSSEE</span>
          </div>
          <p className="footer-text">
            Developed by FOSSEE group, IIT Bombay
          </p>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} IIT Bombay. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
