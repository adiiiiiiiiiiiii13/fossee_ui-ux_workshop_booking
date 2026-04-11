import { useMemo, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const publicLinks = [
  { to: '/', label: 'Home' },
  { to: '/statistics', label: 'Statistics' },
  { to: '/types', label: 'Workshop Types' },
];

const Navbar = ({ user = null }) => {
  const { logoutUser } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const links = useMemo(() => {
    if (!user) {
      return publicLinks;
    }

    const authLinks = [
      { to: user.isInstructor ? '/dashboard' : '/status', label: user.isInstructor ? 'Dashboard' : 'My Status' },
      { to: '/statistics', label: 'Statistics' },
      { to: '/types', label: 'Workshop Types' },
      { to: '/profile', label: 'Profile' },
    ];

    if (user.isInstructor) {
      authLinks.splice(2, 0, { to: '/team-stats', label: 'Team Stats' });
    } else {
      authLinks.splice(2, 0, { to: '/propose', label: 'Propose Workshop' });
    }

    return authLinks;
  }, [user]);

  const handleLogout = async () => {
    await logoutUser();
    setMenuOpen(false);
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-brand" onClick={() => setMenuOpen(false)}>
          <span className="brand-mark">FW</span>
          <span>
            <strong>FOSSEE Workshops</strong>
            <small>Booking and impact dashboard</small>
          </span>
        </Link>

        <button
          type="button"
          className={`nav-toggle ${menuOpen ? 'is-active' : ''}`}
          onClick={() => setMenuOpen((current) => !current)}
          aria-expanded={menuOpen}
          aria-label="Toggle navigation"
        >
          <span className="hamburger-line" />
          <span className="hamburger-line" />
          <span className="hamburger-line" />
        </button>

        <div className={`nav-panel ${menuOpen ? 'is-open' : ''}`}>
          <div className="nav-links-shell">
            <ul className="nav-links">
              {links.map((link) => (
                <li key={link.to} className="nav-link-item">
                  <NavLink
                    to={link.to}
                    className={({ isActive }) => `nav-item ${isActive ? 'is-active' : ''}`}
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          <div className="nav-actions">
            {user ? (
              <>
                <div className="user-profile">
                  <div className="avatar">{user.name?.charAt(0) || 'U'}</div>
                  <div>
                    <strong>{user.name}</strong>
                    <small>{user.isInstructor ? 'Instructor' : 'Coordinator'}</small>
                  </div>
                </div>
                <button type="button" className="nav-button nav-button-muted" onClick={handleLogout}>
                  Sign Out
                </button>
              </>
            ) : (
              <div className="nav-guest-actions">
                <Link to="/register" className="nav-button nav-button-muted" onClick={() => setMenuOpen(false)}>
                  Register
                </Link>
                <Link to="/login" className="nav-button" onClick={() => setMenuOpen(false)}>
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
