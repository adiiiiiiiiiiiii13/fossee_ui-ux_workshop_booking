import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Statistics from './pages/Statistics'
import WorkshopTypes from './pages/WorkshopTypes'
import './index.css'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/types" element={<WorkshopTypes />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
