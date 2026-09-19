import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight, UserCheck, ShieldAlert } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FinaraLogo } from './FinaraLogo';
import { useAuth } from '../context/AuthContext';

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const appRoutes = ['/dashboard', '/cards', '/analytics', '/wallet', '/transactions', '/savings', '/security', '/kyc', '/support', '/settings'];
  if (appRoutes.includes(location.pathname) || location.pathname.startsWith('/admin')) {
    return null;
  }

  const navLinks = [
    { name: 'About', href: '#section-aboutus', path: '/about' },
    { name: 'Features', href: '#section-features', path: '/features' },
    { name: 'Pricing', href: '#pricing', path: '/pricing' },
    { name: 'Faqs', href: '#section-faqs', path: '/faqs' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, link: typeof navLinks[0]) => {
    setMobileMenuOpen(false);
    if (location.pathname === '/') {
      e.preventDefault();
      const el = document.querySelector(link.href);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else {
        navigate(link.path);
      }
    } else {
      navigate(link.path);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 pt-4 pb-2 transition-all duration-300">
      <div
        className={`max-w-6xl mx-auto rounded-full transition-all duration-300 px-6 py-3 flex items-center justify-between border ${
          scrolled
            ? 'bg-white/90 backdrop-blur-md border-[#EBEBEB] shadow-sm'
            : 'bg-white/70 backdrop-blur-sm border-[#EBEBEB]'
        }`}
      >
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2 group text-black hover:opacity-80 transition-opacity">
          <FinaraLogo />
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={(e) => handleNavClick(e, link)}
              className="text-sm font-medium text-[#707070] hover:text-black transition-colors py-1 font-geist"
            >
              {link.name}
            </Link>
          ))}
          {user && (
            <Link
              to="/dashboard"
              className="text-sm font-bold text-black hover:text-[#3546FC] transition-colors py-1 font-geist"
            >
              Dashboard
            </Link>
          )}
          {user && user.role === 'admin' && (
            <Link
              to="/admin"
              className="text-sm font-bold text-black hover:text-red-600 transition-colors py-1 font-geist flex items-center gap-1"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-black" />
              <span>Admin</span>
            </Link>
          )}
        </nav>

        {/* CTA & Account Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 text-sm font-bold text-black bg-[#FFFF00] hover:bg-[#E6E600] rounded-full transition-all duration-200 active:scale-95 shadow-sm"
            >
              <UserCheck className="w-4 h-4 text-black" />
              <span>My Portal</span>
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-bold text-black hover:text-neutral-600 px-3 py-2"
              >
                Sign In
              </Link>
              <Link
                to="/waitlist"
                className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 text-sm font-bold text-black bg-[#FFFF00] hover:bg-[#E6E600] rounded-full transition-all duration-200 active:scale-95 shadow-sm"
              >
                <span>Join waitlist</span>
                <ArrowUpRight className="w-4 h-4 text-black" />
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-full text-black hover:bg-neutral-100 transition-colors focus:outline-none"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-4 top-20 bg-white/95 backdrop-blur-xl border border-[#EBEBEB] rounded-3xl p-6 shadow-2xl z-50 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={(e) => handleNavClick(e, link)}
                className="text-base font-medium text-black hover:text-[#3546FC] py-2 border-b border-neutral-100 transition-colors font-geist"
              >
                {link.name}
              </Link>
            ))}
            {user ? (
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full mt-2 inline-flex items-center justify-center gap-2 px-6 py-3.5 text-base font-bold text-black bg-[#FFFF00] hover:bg-[#E6E600] rounded-full transition-all active:scale-95 text-center"
              >
                <span>My Dashboard</span>
              </Link>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full mt-2 inline-flex items-center justify-center gap-2 px-6 py-3.5 text-base font-bold text-black bg-[#FFFF00] hover:bg-[#E6E600] rounded-full transition-all active:scale-95 text-center"
              >
                <span>Sign In</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
