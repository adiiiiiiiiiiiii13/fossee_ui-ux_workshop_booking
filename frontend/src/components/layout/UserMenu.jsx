import { Link } from 'react-router-dom';

export default function UserMenu({ user, onLogout, onLinkClick }) {
  if (!user) {
    return (
      <div className="nav-guest-actions">
        <Link to="/register" className="nav-button nav-button-muted" onClick={onLinkClick}>
          Register
        </Link>
        <Link to="/login" className="nav-button" onClick={onLinkClick}>
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="user-profile">
        <div className="avatar">{user.name?.charAt(0) || 'U'}</div>
        <div>
          <strong>{user.name}</strong>
          <small>{user.isInstructor ? 'Instructor' : 'Coordinator'}</small>
        </div>
      </div>
      <button type="button" className="nav-button nav-button-muted" onClick={onLogout}>
        Sign Out
      </button>
    </>
  );
}