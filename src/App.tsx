import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { ThemeProvider } from "@/hooks/useTheme";
import { useProfile } from "@/hooks/useProfile";
import { AppLayout } from "@/components/AppLayout";
import Auth from "@/pages/Auth";
import Onboarding from "@/pages/Onboarding";
import Dashboard from "@/pages/Dashboard";
import Tasks from "@/pages/Tasks";
import ProgressPage from "@/pages/ProgressPage";
import Resume from "@/pages/Resume";
import Jobs from "@/pages/Jobs";
import Mentor from "@/pages/Mentor";
import Profile from "@/pages/Profile";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();
const SKIP_AUTH_FOR_TESTING = true;

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const { profile, isLoading } = useProfile();

  if (loading || isLoading) {
    return <div className="flex h-screen items-center justify-center"><div className="animate-pulse text-muted-foreground">Loading...</div></div>;
  }
  if (SKIP_AUTH_FOR_TESTING) return <AppLayout>{children}</AppLayout>;
  if (!user) return <Navigate to="/auth" replace />;
  if (profile && !profile.onboarding_completed) return <Navigate to="/onboarding" replace />;

  return <AppLayout>{children}</AppLayout>;
}

function OnboardingRoute() {
  const { user, loading } = useAuth();
  const { profile, isLoading } = useProfile();

  if (loading || isLoading) {
    return <div className="flex h-screen items-center justify-center"><div className="animate-pulse text-muted-foreground">Loading...</div></div>;
  }
  if (SKIP_AUTH_FOR_TESTING) return <Navigate to="/" replace />;
  if (!user) return <Navigate to="/auth" replace />;
  if (profile?.onboarding_completed) return <Navigate to="/" replace />;

  return <Onboarding />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/auth" element={SKIP_AUTH_FOR_TESTING ? <Navigate to="/" replace /> : <Auth />} />
      <Route path="/onboarding" element={<OnboardingRoute />} />
      <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/tasks" element={<ProtectedRoute><Tasks /></ProtectedRoute>} />
      <Route path="/progress" element={<ProtectedRoute><ProgressPage /></ProtectedRoute>} />
      <Route path="/resume" element={<ProtectedRoute><Resume /></ProtectedRoute>} />
      <Route path="/jobs" element={<ProtectedRoute><Jobs /></ProtectedRoute>} />
      <Route path="/mentor" element={<ProtectedRoute><Mentor /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
