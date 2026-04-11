import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import NavLinks from './NavLinks';
import UserMenu from './UserMenu';
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
    if (!user) return publicLinks;

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

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-brand" onClick={closeMenu}>
          <span className="brand-mark">FW</span>
          <span>
            <strong>FOSSEE Workshops</strong>
            <small>Booking and impact dashboard</small>
          </span>
        </Link>

        <button
          type="button"
          className={`nav-toggle ${menuOpen ? 'is-active' : ''}`}
          onClick={() => setMenuOpen(current => !current)}
          aria-expanded={menuOpen}
          aria-label="Toggle navigation"
        >
          <span className="hamburger-line" />
          <span className="hamburger-line" />
          <span className="hamburger-line" />
        </button>

        <div className={`nav-panel ${menuOpen ? 'is-open' : ''}`}>
          <NavLinks links={links} onLinkClick={closeMenu} />
          
          <div className="nav-actions">
            <UserMenu user={user} onLogout={handleLogout} onLinkClick={closeMenu} />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
