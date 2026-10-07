import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Topbar } from './components/Topbar';
import { Sidebar } from './components/Sidebar';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { JobsView } from './pages/JobsView';
import { JobDetails } from './pages/JobDetails';
import { NotFound } from './pages/NotFound';
import './App.css';

const PROTECTED_PATHS = ['/dashboard', '/jobs'];

function AppShell() {
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(
    () => typeof window !== 'undefined' && window.innerWidth > 768
  );

  const isProtected = PROTECTED_PATHS.some((p) =>
    location.pathname.startsWith(p)
  );

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <>
      {isProtected && <Topbar onMenuClick={toggleSidebar} />}

      {isProtected && (
        <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
      )}

      <div
        className={`app-main-area ${
          isProtected && sidebarOpen ? '' : 'collapsed'
        } ${!isProtected ? 'no-shell' : ''}`}
      >
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/jobs"
            element={
              <ProtectedRoute>
                <JobsView />
              </ProtectedRoute>
            }
          />
          <Route
            path="/jobs/:id"
            element={
              <ProtectedRoute>
                <JobDetails />
              </ProtectedRoute>
            }
          />

          <Route path="/home" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;