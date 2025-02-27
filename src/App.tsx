
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen bg-background">
          <Routes>
            {/* Auth routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/onboarding" element={<Onboarding />} />
            
            {/* App routes with Navbar */}
            <Route
              path="/"
              element={
                <>
                  <Navbar />
                  <main>
                    <Index />
                  </main>
                </>
              }
            />
            <Route
              path="/create"
              element={
                <>
                  <Navbar />
                  <main>
                    <CreateCampaign />
                  </main>
                </>
              }
            />
            <Route
              path="/campaign/:id"
              element={
                <>
                  <Navbar />
                  <main>
                    <CampaignDetails />
                  </main>
                </>
              }
            />
            <Route
              path="/edit-campaign/:id"
              element={
                <>
                  <Navbar />
                  <main>
                    <EditCampaign />
                  </main>
                </>
              }
            />
            <Route
              path="/analytics"
              element={
                <>
                  <Navbar />
                  <main>
                    <Analytics />
                  </main>
                </>
              }
            />
            <Route
              path="/settings"
              element={
                <>
                  <Navbar />
                  <main>
                    <Settings />
                  </main>
                </>
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
