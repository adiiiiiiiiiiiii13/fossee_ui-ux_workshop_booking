import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div>
          <p className="eyebrow">Built for workshops</p>
          <h3>FOSSEE booking experience in React</h3>
          <p className="footer-copy">
            Coordinators can propose workshops, instructors can manage approvals, and everyone can track workshop impact.
          </p>
        </div>
        <div className="footer-meta">
          <div>
            <strong>IIT Bombay</strong>
            <p>FOSSEE Group</p>
          </div>
          <div>
            <strong>{new Date().getFullYear()}</strong>
            <p>Workshop Portal</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
