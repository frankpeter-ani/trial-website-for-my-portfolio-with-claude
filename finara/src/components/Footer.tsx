import React from 'react';
import { FinaraLogo } from './FinaraLogo';
import { Globe, Share2, MessageCircle } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export const Footer: React.FC = () => {
  const location = useLocation();
  const appRoutes = ['/dashboard', '/cards', '/analytics', '/wallet', '/transactions', '/savings', '/security', '/kyc', '/support', '/settings'];
  if (appRoutes.includes(location.pathname) || location.pathname.startsWith('/admin')) {
    return null;
  }
  const navLinks = [
    { name: 'About', path: '/about' },
    { name: 'Features', path: '/features' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'Faqs', path: '/faqs' },
    { name: 'Waitlist', path: '/waitlist' },
  ];

  return (
    <footer className="bg-white border-t border-[#EBEBEB] py-16 text-black font-geist">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          {/* Brand & Description */}
          <div className="space-y-3 max-w-sm">
            <Link to="/">
              <FinaraLogo />
            </Link>
            <p className="text-sm text-[#707070] leading-relaxed font-normal">
              Intelligence meets finance. Built for the way you actually live.
            </p>
          </div>

          {/* Nav Links */}
          <nav className="flex flex-wrap items-center justify-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-sm font-medium text-[#707070] hover:text-black transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* Bottom Bar & Copyright */}
        <div className="pt-8 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#707070]">
          <div>© {new Date().getFullYear()} Finara. All rights reserved.</div>
          
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-black transition-colors" aria-label="Global">
              <Globe className="w-4 h-4" />
            </a>
            <a href="#" className="hover:text-black transition-colors" aria-label="Share">
              <Share2 className="w-4 h-4" />
            </a>
            <a href="#" className="hover:text-black transition-colors" aria-label="Community">
              <MessageCircle className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
