import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldAlert, Lock, ArrowRight, ShieldCheck, KeyRound, AlertCircle } from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const { login, loginWithSupabase, isBackendConnected } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('admin@finara.com');
  const [password, setPassword] = useState('');
  const [securityToken, setSecurityToken] = useState('892014');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      if (isBackendConnected) {
        await loginWithSupabase(email, password);
        navigate('/admin');
      } else {
        login('admin');
        navigate('/admin');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Admin authentication failed. Verify credentials and security token.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoAdmin = () => {
    login('admin');
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-[#0A0D14] text-white font-geist flex items-center justify-center px-4 relative overflow-hidden">
      
      {/* Background Subtle Security Grid Effect */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-neutral-900/90 backdrop-blur-xl rounded-3xl p-8 sm:p-10 max-w-md w-full border border-neutral-800 shadow-2xl space-y-7 relative z-10"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-red-600 text-white font-bold flex items-center justify-center shadow-lg">
              <ShieldAlert className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-sm tracking-wider font-geist text-white uppercase block">Finara Platform</span>
              <span className="text-[10px] font-mono text-neutral-400">Security Access Portal</span>
            </div>
          </div>

          <span className="text-[10px] font-mono font-bold bg-red-500/20 text-red-400 border border-red-500/30 px-2.5 py-0.5 rounded-full uppercase">
            RESTRICTED
          </span>
        </div>

        {/* Portal Title */}
        <div className="space-y-1">
          <h1 className="text-2xl font-bold font-geist text-white">Administrator Login</h1>
          <p className="text-xs text-neutral-400">
            Authorized platform personnel & compliance clearance only.
          </p>
        </div>

        {/* Fast Admin Access Pill */}
        <div className="p-4 bg-black/60 rounded-2xl border border-neutral-800 space-y-2.5">
          <div className="text-[10px] font-mono uppercase text-neutral-400 font-bold flex items-center justify-between">
            <span>⚡ Executive Access Shortcut</span>
            <span className="text-[#FFFF00] font-bold">SUPER ADMIN</span>
          </div>

          <button
            type="button"
            onClick={handleDemoAdmin}
            className="w-full py-3 px-4 bg-[#FFFF00] hover:bg-[#E6E600] text-black font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 shadow-md active:scale-95"
          >
            <ShieldAlert className="w-4 h-4 text-black" />
            <span>Launch Admin Console Portal</span>
          </button>
        </div>

        {/* Error Alert Box */}
        {errorMsg && (
          <div className="p-3 bg-red-950/60 border border-red-800 text-red-300 rounded-xl text-xs font-mono flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Admin Login Form */}
        <form onSubmit={handleAdminSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[11px] font-mono font-bold uppercase text-neutral-400">Admin Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@finara.com"
              required
              className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-xl text-xs font-geist text-white focus:outline-none focus:border-[#FFFF00] transition-all"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-mono font-bold uppercase text-neutral-400">Security Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              required
              className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-xl text-xs font-geist text-white focus:outline-none focus:border-[#FFFF00] transition-all"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-mono font-bold uppercase text-neutral-400 flex items-center justify-between">
              <span>Security Token / 2FA</span>
              <span className="text-[9px] text-[#FFFF00]">TOTP Required</span>
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={securityToken}
                onChange={(e) => setSecurityToken(e.target.value)}
                placeholder="6-Digit Token (e.g. 892014)"
                required
                className="w-full pl-10 pr-4 py-3 bg-neutral-950 border border-neutral-800 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-[#FFFF00] transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#FFFF00] hover:bg-[#E6E600] text-black font-bold text-xs rounded-full transition-all flex items-center justify-center gap-2 active:scale-95 shadow-lg disabled:opacity-50 mt-2"
          >
            <Lock className="w-4 h-4 text-black" />
            <span>{loading ? 'Verifying Credentials...' : 'Authenticate Admin Session'}</span>
            <ArrowRight className="w-4 h-4 text-black" />
          </button>
        </form>

        {/* Footer Navigation Back to Customer Portal */}
        <div className="pt-2 border-t border-neutral-800 text-center flex items-center justify-between text-[11px] font-mono">
          <Link to="/login" className="text-neutral-400 hover:text-white transition-colors flex items-center gap-1">
            ← Customer Login
          </Link>

          <div className="flex items-center gap-1 text-[#16BD00]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>SOC2 Verified</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
