
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Index from "./pages/Index";
import CreateCampaign from "./pages/CreateCampaign";
import CampaignDetails from "./pages/CampaignDetails";
import EditCampaign from "./pages/EditCampaign";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ResetPassword from "./pages/ResetPassword";
import Onboarding from "./pages/Onboarding";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "@/components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen bg-background">
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            
            {/* Protected routes */}
            <Route 
              path="/onboarding" 
              element={
                <ProtectedRoute>
                  <Onboarding />
                </ProtectedRoute>
              } 
            />
            
            {/* Protected app routes with Navbar */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Navbar />
                  <main>
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
                  <main>
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
                  <main>
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
                  <main>
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
                  <main>
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
                  <main>
                    <Settings />
                  </main>
                </ProtectedRoute>
              }
            />
            
            {/* 404 route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
