import { Link } from 'react-router-dom';

export default function UserMenu({ user, onLogout, onLinkClick }) {
  if (!user) {
    return (
      <div className="nav-guest-actions">
        <Link to="/register" className="nav-button nav-button-muted" onClick={onLinkClick}>
          Register
        </Link>
        <Link to="/login" className="nav-button nav-button-primary" onClick={onLinkClick}>
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="nav-user-section">
      <div className="user-profile-card">
        <div className="avatar-wrapper">
          <div className="avatar">{user.name?.charAt(0) || 'U'}</div>
          <div className="status-indicator"></div>
        </div>
        <div className="user-info">
          <span className="user-name">{user.name}</span>
          <span className="user-role">{user.isInstructor ? 'Instructor' : 'Coordinator'}</span>
        </div>
      </div>
      <button type="button" className="sign-out-btn" onClick={onLogout} title="Sign Out">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
          <polyline points="16,17 21,12 16,7"/>
          <line x1="21" y1="12" x2="9" y2="12"/>
        </svg>
      </button>
    </div>
  );
}