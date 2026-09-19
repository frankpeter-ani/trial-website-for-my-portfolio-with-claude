import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FinaraLogo } from '../components/FinaraLogo';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, ArrowRight, ShieldCheck, User, Database, AlertCircle, Sparkles, ShieldAlert } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, loginWithSupabase, signupWithSupabase, isBackendConnected } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      if (isBackendConnected) {
        if (mode === 'signup') {
          await signupWithSupabase(email, password, name || email.split('@')[0]);
        } else {
          await loginWithSupabase(email, password);
        }
        navigate('/dashboard');
      } else {
        login('user');
        navigate('/dashboard');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication error. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoCustomer = () => {
    login('user');
    navigate('/dashboard');
  };

  return (
    <div className="pt-32 pb-24 bg-[#F7F6F5] min-h-screen text-[#000000] font-geist flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl p-8 sm:p-10 max-w-md w-full border border-[#EBEBEB] shadow-xl space-y-7 relative overflow-hidden"
      >
        {/* Backend Indicator Badge */}
        <div className="flex items-center justify-between">
          <FinaraLogo />
          <div className={`inline-flex items-center gap-1.5 text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border ${
            isBackendConnected
              ? 'bg-[#16BD00]/10 text-[#16BD00] border-[#16BD00]/30'
              : 'bg-amber-100 text-amber-800 border-amber-300'
          }`}>
            <Database className="w-3 h-3" />
            <span>{isBackendConnected ? 'SUPABASE LIVE' : 'DEMO MODE'}</span>
          </div>
        </div>

        {/* Header Title */}
        <div className="space-y-1">
          <h1 className="text-2xl font-bold font-geist text-black">
            {mode === 'signin' ? 'Customer Sign In' : 'Create Finara Account'}
          </h1>
          <p className="text-xs text-[#707070]">
            {mode === 'signin'
              ? 'Sign in to access your multi-currency banking portal'
              : 'Start your zero-fee financial journey today'}
          </p>
        </div>

        {/* Fast Customer Demo Switcher */}
        <div className="p-4 bg-[#F7F6F5] rounded-2xl border border-[#EBEBEB] space-y-2.5">
          <div className="text-[10px] font-mono uppercase text-[#707070] font-bold flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#FFFF00] fill-black" />
            <span>Instant Demo Session</span>
          </div>
          <button
            onClick={handleDemoCustomer}
            type="button"
            className="w-full py-3 px-4 bg-[#FFFF00] hover:bg-[#E6E600] text-black font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm active:scale-95"
          >
            <User className="w-4 h-4 text-black" />
            <span>Sign In as Demo Customer (Mila Wilson)</span>
          </button>
        </div>

        {/* Auth Mode Toggle Tabs */}
        <div className="flex bg-[#F7F6F5] p-1 rounded-xl border border-[#EBEBEB] text-xs font-bold font-mono">
          <button
            type="button"
            onClick={() => { setMode('signin'); setErrorMsg(null); }}
            className={`flex-1 py-2 rounded-lg transition-all ${
              mode === 'signin' ? 'bg-black text-[#FFFF00] shadow-sm' : 'text-[#707070]'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('signup'); setErrorMsg(null); }}
            className={`flex-1 py-2 rounded-lg transition-all ${
              mode === 'signup' ? 'bg-black text-[#FFFF00] shadow-sm' : 'text-[#707070]'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Error Alert Box */}
        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-mono flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Customer Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div className="space-y-1">
              <label className="text-[11px] font-mono font-bold uppercase text-[#707070]">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Mila Wilson"
                required
                className="w-full px-4 py-3 bg-[#F7F6F5] border border-[#EBEBEB] rounded-xl text-xs font-geist text-black focus:outline-none focus:border-black"
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[11px] font-mono font-bold uppercase text-[#707070]">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="mila.wilson@finara.com"
              required
              className="w-full px-4 py-3 bg-[#F7F6F5] border border-[#EBEBEB] rounded-xl text-xs font-geist text-black focus:outline-none focus:border-black"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-mono font-bold uppercase text-[#707070]">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              required
              className="w-full px-4 py-3 bg-[#F7F6F5] border border-[#EBEBEB] rounded-xl text-xs font-geist text-black focus:outline-none focus:border-black"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-black hover:bg-neutral-800 text-[#FFFF00] font-bold text-xs rounded-full transition-all flex items-center justify-center gap-2 active:scale-95 shadow-md disabled:opacity-50"
          >
            <Lock className="w-4 h-4 text-[#FFFF00]" />
            <span>{loading ? 'Processing...' : mode === 'signin' ? 'Sign In to Account' : 'Register Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Footer Link to Admin Portal */}
        <div className="pt-2 border-t border-[#EBEBEB] flex items-center justify-between text-[11px] font-mono text-[#707070]">
          <div className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#16BD00]" />
            <span>256-Bit Encrypted</span>
          </div>

          <Link to="/admin/login" className="text-black font-bold hover:underline flex items-center gap-1">
            <ShieldAlert className="w-3.5 h-3.5 text-black" />
            <span>Admin Portal Login</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};
