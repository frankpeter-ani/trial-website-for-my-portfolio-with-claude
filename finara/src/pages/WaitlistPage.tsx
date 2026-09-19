import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, ShieldCheck, Zap, Globe } from 'lucide-react';
import confetti from 'canvas-confetti';

export const WaitlistPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      setSubmitted(true);
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#000000', '#FFFF00', '#16BD00'],
      });
      setTimeout(() => setSubmitted(false), 6000);
      setEmail('');
    }
  };

  return (
    <div className="pt-32 pb-24 bg-[#F7F6F5] min-h-screen text-[#000000] font-geist">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="finara-eyebrow">
            <div className="finara-eyebrow-dots">
              <span className="finara-eyebrow-dot-1" />
              <span className="finara-eyebrow-dot-2" />
            </div>
            <span>PRIORITY WAITLIST</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-bold text-black tracking-[-0.03em] leading-[1.05em]">
            Get Priority Early Access
          </h1>

          <p className="text-lg text-[#707070] max-w-xl mx-auto">
            Lock in lifetime 20% discounts and early access to Finara AI autonomous money management.
          </p>
        </div>

        {/* Priority Card Box */}
        <div className="bg-[#FFFF00] rounded-2xl p-8 sm:p-14 text-black shadow-xl border border-yellow-300 space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-4">
            <h2 className="text-3xl font-bold font-geist">
              Join 280,000+ Account Holders
            </h2>
            <p className="text-sm text-black/80">
              Enter your email below to reserve your Finara account and receive instant early onboarding instructions.
            </p>
          </div>

          {submitted ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="p-6 rounded-2xl bg-black text-[#FFFF00] text-center space-y-2 shadow-lg"
            >
              <CheckCircle2 className="w-10 h-10 mx-auto text-[#16BD00]" />
              <div className="text-xl font-bold font-geist text-white">You're on the priority list!</div>
              <p className="text-xs text-neutral-300">
                Check your inbox shortly for your invite code & early onboarding instructions.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-3 bg-white p-2 rounded-full border border-black/10 shadow-md max-w-lg mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="w-full px-5 py-3 text-sm text-black placeholder-neutral-400 bg-transparent focus:outline-none rounded-full"
              />
              <button
                type="submit"
                className="w-full sm:w-auto whitespace-nowrap inline-flex items-center justify-center gap-2 px-8 py-3.5 text-sm font-bold text-white bg-black hover:bg-neutral-800 rounded-full transition-all active:scale-95 shadow-md"
              >
                <span>Reserve Spot</span>
                <ArrowRight className="w-4 h-4 text-[#FFFF00]" />
              </button>
            </form>
          )}

          {/* Guarantee Badges */}
          <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center border-t border-black/10">
            <div className="flex items-center justify-center gap-2 text-xs font-mono text-black font-semibold">
              <ShieldCheck className="w-4 h-4 text-black" />
              <span>Zero Credit Card Needed</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-xs font-mono text-black font-semibold">
              <Zap className="w-4 h-4 text-black" />
              <span>Instant Confirmation</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-xs font-mono text-black font-semibold">
              <Globe className="w-4 h-4 text-black" />
              <span>150+ Countries Supported</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
