import React from 'react'
import Layout from './components/layout/Layout'
import Card from './components/ui/Card'
import Button from './components/ui/Button'
import Input from './components/ui/Input'
import './index.css'

function App() {
  return (
    <Layout>
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: '700', marginBottom: '1rem', letterSpacing: '-1px' }}>
            FOSSEE Workshops
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}>
            A minimal, fast, and modern interface for managing workshop bookings and tracking completion statistics.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          
          <Card>
            <h2 style={{ fontSize: '1.3rem', marginBottom: '0.8rem' }}>Welcome Back</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
              Sign in to manage your workshop proposals and check real-time attendance stats.
            </p>
            <form onSubmit={(e) => e.preventDefault()}>
              <Input label="Email Address" id="email" type="email" placeholder="you@example.com" />
              <Input label="Password" id="password" type="password" placeholder="••••••••" />
              <div style={{ marginTop: '1.5rem' }}>
                <Button fullWidth>Sign In</Button>
              </div>
            </form>
          </Card>

          <Card>
            <h2 style={{ fontSize: '1.3rem', marginBottom: '0.8rem' }}>Browse Available</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
              You don't need to be authenticated to view current public workshops and general statistics.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <Button variant="outline">View All Workshops</Button>
              <Button variant="outline">Global Statistics</Button>
            </div>
          </Card>

        </div>
      </div>
    </Layout>
  )
}

export default App
