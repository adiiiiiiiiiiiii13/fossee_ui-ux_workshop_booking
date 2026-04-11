import { NavLink } from 'react-router-dom';

export default function NavLinks({ links, onLinkClick }) {
  return (
    <div className="nav-links-shell">
      <ul className="nav-links">
        {links.map((link) => (
          <li key={link.to} className="nav-link-item">
            <NavLink
              to={link.to}
              className={({ isActive }) => `nav-item ${isActive ? 'is-active' : ''}`}
              onClick={onLinkClick}
            >
              {link.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
}