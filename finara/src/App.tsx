import React, { useEffect } from 'react';
import { BrowserRouter, HashRouter, Routes, Route, useLocation } from 'react-router-dom';

// Static hosts (GitHub Pages) can't rewrite deep links to index.html, so those
// builds opt into hash routing. Local dev and real servers keep clean URLs.
const Router = import.meta.env.VITE_HASH_ROUTER === 'true' ? HashRouter : BrowserRouter;
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { FeaturesPage } from './pages/FeaturesPage';
import { PricingPage } from './pages/PricingPage';
import { FaqPage } from './pages/FaqPage';
import { WaitlistPage } from './pages/WaitlistPage';
import { LoginPage } from './pages/LoginPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

// ScrollToTop helper on route change
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <div className="min-h-screen bg-[#F7F6F5] text-[#000000] font-geist selection:bg-[#FFFF00] selection:text-black relative flex flex-col justify-between">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/features" element={<FeaturesPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/testimonials" element={<HomePage />} />
              <Route path="/faqs" element={<FaqPage />} />
              <Route path="/waitlist" element={<WaitlistPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/cards" element={<DashboardPage />} />
              <Route path="/analytics" element={<DashboardPage />} />
              <Route path="/wallet" element={<DashboardPage />} />
              <Route path="/transactions" element={<DashboardPage />} />
              <Route path="/savings" element={<DashboardPage />} />
              <Route path="/security" element={<DashboardPage />} />
              <Route path="/kyc" element={<DashboardPage />} />
              <Route path="/support" element={<DashboardPage />} />
              <Route path="/settings" element={<DashboardPage />} />

              <Route path="/admin" element={<AdminDashboardPage />} />
              <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
              <Route path="/admin/users" element={<AdminDashboardPage />} />
              <Route path="/admin/kyc" element={<AdminDashboardPage />} />
              <Route path="/admin/transactions" element={<AdminDashboardPage />} />
              <Route path="/admin/risk" element={<AdminDashboardPage />} />
              <Route path="/admin/compliance" element={<AdminDashboardPage />} />
              <Route path="/admin/audit-logs" element={<AdminDashboardPage />} />
              <Route path="/admin/reports" element={<AdminDashboardPage />} />
              <Route path="/admin/settings" element={<AdminDashboardPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
