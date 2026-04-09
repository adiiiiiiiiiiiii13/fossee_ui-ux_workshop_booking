import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar isAuthenticated={false} />
      <main style={{ flex: 1, paddingTop: '80px', paddingBottom: '40px' }}>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
