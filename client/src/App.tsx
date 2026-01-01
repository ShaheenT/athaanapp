import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import LandingSignup from "@/pages/landing-signup";
import Home from "@/pages/home";
import DemoDashboard from "@/pages/demo-dashboard";
import CustomerApp from "@/pages/customer-app";
import PaymentSuccess from "@/pages/payment-success";
import PaymentCancel from "@/pages/payment-cancel";
import Users from "@/pages/users";
import Devices from "@/pages/devices";
import PrayerTimes from "@/pages/prayer-times";
import AudioProfiles from "@/pages/audio-profiles";
import Technicians from "@/pages/technicians";
import SystemSettingsPage from "@/pages/system-settings";
import AdminLogin from "@/pages/admin-login";
import TechnicianPortal from "@/pages/technician-portal";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      <Route path="/signup" component={LandingSignup} />
      <Route path="/demo" component={DemoDashboard} />
      <Route path="/demo/users" component={Users} />
      <Route path="/demo/devices" component={Devices} />
      <Route path="/demo/prayer-times" component={PrayerTimes} />
      <Route path="/demo/audio-profiles" component={AudioProfiles} />
      <Route path="/demo/technicians" component={Technicians} />
      <Route path="/demo/settings" component={SystemSettingsPage} />
      <Route path="/customer" component={CustomerApp} />
      <Route path="/customer/payment/success" component={PaymentSuccess} />
      <Route path="/customer/payment/cancel" component={PaymentCancel} />
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/technician" component={TechnicianPortal} />
      {isLoading || !isAuthenticated ? (
        <Route path="/" component={Landing} />
      ) : (
        <>
          <Route path="/" component={Home} />
          <Route path="/admin" component={Home} />
          <Route path="/admin/users" component={Users} />
          <Route path="/admin/devices" component={Devices} />
          <Route path="/admin/prayer-times" component={PrayerTimes} />
          <Route path="/admin/audio-profiles" component={AudioProfiles} />
          <Route path="/admin/technicians" component={Technicians} />
          <Route path="/admin/settings" component={SystemSettingsPage} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
