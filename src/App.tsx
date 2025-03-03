import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Index from './pages/Index';
import CreateCampaign from './pages/CreateCampaign';
import CampaignDetails from './pages/CampaignDetails';
import EditCampaign from './pages/EditCampaign';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ResetPassword from './pages/ResetPassword';
import Onboarding from './pages/Onboarding';
import NotFound from './pages/NotFound';
import LandingPage from './pages/LandingPage';
import Subscription from './pages/Subscription';
import ProtectedRoute from '@/components/ProtectedRoute';

/**
 * QueryClient instance with default options for caching and retries.
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

/**
 * Main application component defining routes and layout.
 * @returns {JSX.Element} The rendered application with routing and providers.
 */
const App = (): JSX.Element => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen bg-background">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/reset-password" element={<ResetPassword />} />

              {/* Protected Routes */}
              <Route
                path="/onboarding"
                element={
                  <ProtectedRoute>
                    <Onboarding />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Navbar />
                    <main className="container mx-auto py-6 px-4">
                      <Index />
                    </main>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/create"
                element={
                  <ProtectedRoute>
                    <Navbar />
                    <main className="container mx-auto py-6 px-4">
                      <CreateCampaign />
                    </main>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/campaign/:id"
                element={
                  <ProtectedRoute>
                    <Navbar />
                    <main className="container mx-auto py-6 px-4">
                      <CampaignDetails />
                    </main>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/edit-campaign/:id"
                element={
                  <ProtectedRoute>
                    <Navbar />
                    <main className="container mx-auto py-6 px-4">
                      <EditCampaign />
                    </main>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/analytics"
                element={
                  <ProtectedRoute>
                    <Navbar />
                    <main className="container mx-auto py-6 px-4">
                      <Analytics />
                    </main>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <Navbar />
                    <main className="container mx-auto py-6 px-4">
                      <Settings />
                    </main>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/subscription"
                element={
                  <ProtectedRoute>
                    <Navbar />
                    <main className="container mx-auto py-6 px-4">
                      <Subscription />
                    </main>
                  </ProtectedRoute>
                }
              />

              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;