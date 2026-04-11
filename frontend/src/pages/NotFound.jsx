import { Link } from 'react-router-dom';
import Card from '../components/ui/Card';

export default function NotFound() {
  return (
    <div className="auth-shell">
      <Card className="auth-card">
        <p className="eyebrow">404</p>
        <h1>That page does not exist.</h1>
        <p className="muted-text">The route may have changed while we were moving the portal into React.</p>
        <Link className="button-link button-link-primary" to="/">Go home</Link>
      </Card>
    </div>
  );
}
