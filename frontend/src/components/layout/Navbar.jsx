import React, { useState, useEffect } from 'react';
import './Navbar.css';

const Navbar = ({ isAuthenticated = false, user = null }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'nav-scrolled' : ''}`}>
      <div className="nav-container">
        <a href="/" className="nav-brand">
          <span className="brand-icon">✧</span>
          <span className="brand-text">FOSSEE Workshops</span>
        </a>

        <ul className="nav-links">
          <li><a href="/" className="nav-item">Home</a></li>
          <li><a href="/statistics" className="nav-item">Statistics</a></li>
          
          {isAuthenticated && (
            <>
              {user?.isInstructor && (
                <li><a href="/team-stats" className="nav-item">Team Stats</a></li>
              )}
              <li><a href="/status" className="nav-item">Status</a></li>
              {!user?.isInstructor && (
                <li><a href="/propose" className="nav-item nav-highlight">Propose Workshop</a></li>
              )}
              <li><a href="/types" className="nav-item">Workshop Types</a></li>
            </>
          )}
        </ul>

        <div className="nav-actions">
          {isAuthenticated ? (
            <div className="user-profile">
              <div className="avatar">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <span className="user-name">{user?.name || 'User'}</span>
            </div>
          ) : (
            <a href="/login" className="btn-primary">Sign In</a>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
