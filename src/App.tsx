
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { Toaster } from '@/components/ui/toaster';

// Pages
import LandingPage from '@/pages/LandingPage';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import ResetPassword from '@/pages/ResetPassword';
import Dashboard from '@/pages/SuperUserDashboard';
import NotFound from '@/pages/NotFound';
import Onboarding from '@/pages/Onboarding';
import ProtectedRoute from '@/components/ProtectedRoute';
import { AuthProvider } from '@/hooks/useAuth';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-background">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Protected routes */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />

            {/* 404 route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
