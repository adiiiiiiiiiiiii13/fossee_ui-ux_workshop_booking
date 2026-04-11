import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/common/ProtectedRoute';
import ActivationPending from './pages/ActivationPending';
import Home from './pages/Home';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import Profile from './pages/Profile';
import ProposeWorkshop from './pages/ProposeWorkshop';
import PublicProfile from './pages/PublicProfile';
import Register from './pages/Register';
import Statistics from './pages/Statistics';
import StatusPage from './pages/StatusPage';
import TeamStats from './pages/TeamStats';
import WorkshopDetails from './pages/WorkshopDetails';
import WorkshopTypeDetails from './pages/WorkshopTypeDetails';
import WorkshopTypeEditor from './pages/WorkshopTypeEditor';
import WorkshopTypes from './pages/WorkshopTypes';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/activation-pending" element={<ActivationPending />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/types" element={<WorkshopTypes />} />
          <Route path="/types/:id" element={<WorkshopTypeDetails />} />
          <Route
            path="/types/new"
            element={(
              <ProtectedRoute requireInstructor>
                <WorkshopTypeEditor />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/types/:id/edit"
            element={(
              <ProtectedRoute requireInstructor>
                <WorkshopTypeEditor />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/status"
            element={(
              <ProtectedRoute>
                <StatusPage />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/dashboard"
            element={(
              <ProtectedRoute requireInstructor>
                <StatusPage />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/propose"
            element={(
              <ProtectedRoute requireCoordinator>
                <ProposeWorkshop />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/workshops/:id"
            element={(
              <ProtectedRoute>
                <WorkshopDetails />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/profile"
            element={(
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/profile/:userId"
            element={(
              <ProtectedRoute>
                <PublicProfile />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/team-stats"
            element={(
              <ProtectedRoute requireInstructor>
                <TeamStats />
              </ProtectedRoute>
            )}
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
