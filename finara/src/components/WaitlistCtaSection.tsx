import React, { useState } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

export const WaitlistCtaSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      setSubmitted(true);
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.7 },
        colors: ['#000000', '#FFFF00', '#16BD00'],
      });
      setTimeout(() => setSubmitted(false), 5000);
      setEmail('');
    }
  };

  return (
    <section id="section-waitlist" className="py-20 sm:py-28 bg-[#F7F6F5] relative text-[#000000] overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 30 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative rounded-2xl p-6 sm:p-14 bg-[#FFFF00] text-[#000000] shadow-xl overflow-hidden border border-yellow-300"
        >
          <div className="relative z-10 text-center max-w-2xl mx-auto space-y-6">
            <div className="finara-eyebrow bg-black/10 border-black/20 text-black">
              <div className="finara-eyebrow-dots">
                <span className="finara-eyebrow-dot-1" />
                <span className="finara-eyebrow-dot-2" />
              </div>
              <span>early access</span>
            </div>

            <h2 className="text-3xl sm:text-[40px] font-bold tracking-[-0.03em] leading-[1.1em] font-geist text-black">
              Join the waitlist
            </h2>

            <p className="text-base sm:text-lg text-black/80 leading-[1.3em] font-normal font-geist">
              Lock in lifetime pricing and priority access to every new AI feature.
            </p>

            {/* Email Form */}
            <div className="pt-4 max-w-md mx-auto">
              {submitted ? (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="p-4 rounded-full bg-black text-[#FFFF00] font-bold text-sm text-center shadow-md"
                >
                  Success! You're on the priority waitlist.
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-3 bg-white p-2 rounded-full border border-black/10 shadow-md">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jane@framer.com"
                    required
                    className="w-full px-5 py-3 text-sm text-black placeholder-neutral-400 bg-transparent focus:outline-none rounded-full"
                  />
                  <button
                    type="submit"
                    className="w-full sm:w-auto whitespace-nowrap inline-flex items-center justify-center px-8 py-3.5 text-sm font-bold text-white bg-black hover:bg-neutral-800 rounded-full transition-all active:scale-95 shadow-md"
                  >
                    Submit
                  </button>
                </form>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
