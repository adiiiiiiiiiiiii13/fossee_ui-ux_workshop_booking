import Footer from './Footer';
import Navbar from './Navbar';
import { useAuth } from '../../context/AuthContext';

const Layout = ({ children }) => {
  const { user } = useAuth();

  return (
    <div className="app-shell">
      <Navbar user={user} />
      <main className="app-main">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
