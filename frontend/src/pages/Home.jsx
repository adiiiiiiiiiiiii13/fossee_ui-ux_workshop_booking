import { Link } from 'react-router-dom';
import Card from '../components/ui/Card';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user } = useAuth();

  const quickLinks = user
    ? user.isInstructor
      ? [
          { title: 'Review pending requests', to: '/dashboard', cta: 'Open dashboard' },
          { title: 'View your team statistics', to: '/team-stats', cta: 'Open team stats' },
          { title: 'Manage workshop catalogue', to: '/types', cta: 'Open workshop types' },
        ]
      : [
          { title: 'Track your bookings', to: '/status', cta: 'Open my status' },
          { title: 'Propose a new workshop', to: '/propose', cta: 'Create proposal' },
          { title: 'Update your profile', to: '/profile', cta: 'Open profile' },
        ]
    : [
        { title: 'Create a coordinator account', to: '/register', cta: 'Register now' },
        { title: 'Browse workshop types', to: '/types', cta: 'See all workshops' },
        { title: 'Explore public statistics', to: '/statistics', cta: 'View statistics' },
      ];

  return (
    <div className="page-shell">
      <section className="hero-panel">
        <div className="hero-copy">
          <p className="eyebrow">FOSSEE Workshop Portal</p>
          <h1>Comprehensive platform to book, approve, and track workshops.</h1>
          <p className="hero-text">
            Streamlined workshop management system that brings together booking workflows, workshop catalogues, 
            team insights, and user profiles in a unified platform for coordinators and instructors.
          </p>
          <div className="hero-actions">
            {user ? (
              <Link className="button-link button-link-primary" to={user.isInstructor ? '/dashboard' : '/status'}>
                Go to workspace
              </Link>
            ) : (
              <>
                <Link className="button-link button-link-primary" to="/login">Sign In</Link>
                <Link className="button-link button-link-muted" to="/register">Create Account</Link>
              </>
            )}
          </div>
        </div>
        <div className="hero-metrics">
          <div>
            <strong>Optimized</strong>
            <span>Fast performance across all devices and screen sizes.</span>
          </div>
          <div>
            <strong>Role-based</strong>
            <span>Coordinators and instructors access relevant features and data.</span>
          </div>
          <div>
            <strong>Real-time</strong>
            <span>Live data integration with comprehensive backend systems.</span>
          </div>
        </div>
      </section>

      <section className="section-heading">
        <div>
          <p className="eyebrow">Quick actions</p>
          <h2>Access key features instantly</h2>
        </div>
      </section>

      <div className="feature-grid">
        {quickLinks.map((item) => (
          <Card key={item.to} className="feature-card">
            <h3>{item.title}</h3>
            <p>{item.cta} and manage your workshop activities efficiently.</p>
            <Link className="text-link" to={item.to}>{item.cta}</Link>
          </Card>
        ))}
      </div>
    </div>
  );
}
