import { Link } from 'react-router-dom';
import Card from '../components/ui/Card';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user } = useAuth();

  const quickLinks = user
    ? user.isInstructor
      ? [
          { title: 'Review pending requests', to: '/dashboard', cta: 'Open dashboard' },
          { title: 'View your team stats', to: '/team-stats', cta: 'Open team stats' },
          { title: 'Manage workshop catalogue', to: '/types', cta: 'Open workshop types' },
        ]
      : [
          { title: 'Track your bookings', to: '/status', cta: 'Open my status' },
          { title: 'Propose a fresh workshop', to: '/propose', cta: 'Create proposal' },
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
          <h1>One responsive place to book, approve, and track workshops.</h1>
          <p className="hero-text">
            This React frontend brings the booking flow, workshop catalogue, team insights, and profiles into a cleaner
            mobile-first experience for coordinators and instructors.
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
            <strong>Mobile-first</strong>
            <span>Fast on phone screens before anything else.</span>
          </div>
          <div>
            <strong>Role-aware</strong>
            <span>Coordinators and instructors see what matters to them.</span>
          </div>
          <div>
            <strong>Data-backed</strong>
            <span>Every page is connected to live Django data endpoints.</span>
          </div>
        </div>
      </section>

      <section className="section-heading">
        <div>
          <p className="eyebrow">Quick actions</p>
          <h2>Jump straight into the flow</h2>
        </div>
      </section>

      <div className="feature-grid">
        {quickLinks.map((item) => (
          <Card key={item.to} className="feature-card">
            <h3>{item.title}</h3>
            <p>{item.cta} and continue in the responsive workspace.</p>
            <Link className="text-link" to={item.to}>{item.cta}</Link>
          </Card>
        ))}
      </div>
    </div>
  );
}
