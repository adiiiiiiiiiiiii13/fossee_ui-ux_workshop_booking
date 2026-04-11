import { Link, useLocation } from 'react-router-dom';
import Card from '../components/ui/Card';
import './ActivationPending.css';

export default function ActivationPending() {
  const location = useLocation();
  const devActivationUrl = location.state?.devActivationUrl || '';
  const email = location.state?.email || '';

  return (
    <div className="auth-shell">
      <Card className="auth-card">
        <div className="success-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
            <path d="M8 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <p className="eyebrow">Account Created Successfully</p>
        <h1>Check Your Email</h1>
        
        {email && (
          <p className="muted-text" style={{ marginBottom: '1rem' }}>
            We've sent an activation link to <strong>{email}</strong>
          </p>
        )}

        <div className="activation-instructions">
          <h3>Next Steps:</h3>
          <ol>
            <li>Open your email inbox</li>
            <li>Look for the activation email from FOSSEE Workshops</li>
            <li>Click the activation link in the email</li>
            <li>Return here to sign in</li>
          </ol>
        </div>

        <div className="info-box">
          <p>
            <strong>Note:</strong> The activation link will expire in 24 hours. 
            If you don't see the email, check your spam folder.
          </p>
        </div>

        {devActivationUrl && (
          <div className="dev-activation-box">
            <strong>Development Mode:</strong>
            <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
              For local testing, you can use this activation link directly:
            </p>
            <div style={{ marginTop: '0.75rem' }}>
              <a 
                href={devActivationUrl} 
                className="button-link button-link-primary" 
                target="_blank" 
                rel="noreferrer"
                style={{ wordBreak: 'break-all', display: 'inline-block' }}
              >
                Activate Account Now
              </a>
            </div>
            <p style={{ marginTop: '0.5rem', fontSize: '0.85rem', opacity: 0.7 }}>
              Also available in: <code>workshop_app/logs/last_activation_link.txt</code>
            </p>
          </div>
        )}

        <div style={{ marginTop: '2rem' }}>
          <Link className="button-link button-link-primary" to="/login">
            Go to Sign In
          </Link>
        </div>

        <p className="auth-footer" style={{ marginTop: '1.5rem' }}>
          Didn't receive the email? <Link to="/register">Try registering again</Link>
        </p>
      </Card>
    </div>
  );
}
