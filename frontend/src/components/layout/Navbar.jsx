import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
        <Link to="/" className="nav-brand">
          <span className="brand-icon">✧</span>
          <span className="brand-text">FOSSEE Workshops</span>
        </Link>

        <ul className="nav-links">
          <li><Link to="/" className="nav-item">Home</Link></li>
          <li><Link to="/statistics" className="nav-item">Statistics</Link></li>
          
          {isAuthenticated && (
            <>
              {user?.isInstructor && (
                <li><Link to="/team-stats" className="nav-item">Team Stats</Link></li>
              )}
              <li><Link to="/status" className="nav-item">Status</Link></li>
              {!user?.isInstructor && (
                <li><Link to="/propose" className="nav-item nav-highlight">Propose Workshop</Link></li>
              )}
              <li><Link to="/types" className="nav-item">Workshop Types</Link></li>
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
            <Link to="/login" className="btn-primary">Sign In</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
