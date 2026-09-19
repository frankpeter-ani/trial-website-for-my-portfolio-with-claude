import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const FeaturesSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'payments' | 'ai' | 'tracking'>('payments');

  return (
    <section id="section-features" className="py-20 sm:py-28 bg-[#F7F6F5] border-t border-[#DEDEDE] relative text-[#000000] overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header with Scroll Animation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto space-y-4"
        >
          <div className="finara-eyebrow">
            <div className="finara-eyebrow-dots">
              <span className="finara-eyebrow-dot-1" />
              <span className="finara-eyebrow-dot-2" />
            </div>
            <span>Features</span>
          </div>

          <h2 className="text-3xl sm:text-[40px] font-bold text-[#000000] tracking-[-0.03em] leading-[1.1em] font-geist">
            Send Money Anywhere, Instantly
          </h2>

          <p className="text-base sm:text-lg text-[#707070] font-normal leading-[1.3em]">
            Track every move, analyze your performance, and get real-time coaching, all from your wrist.
          </p>
        </motion.div>

        {/* 3 Tab Links Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 bg-white p-2 rounded-2xl border border-[#EBEBEB] max-w-3xl mx-auto shadow-sm"
        >
          <button
            onClick={() => setActiveTab('payments')}
            className={`w-full sm:w-auto flex items-center justify-center gap-3 px-5 py-3 rounded-xl font-medium text-xs sm:text-sm transition-all duration-200 cursor-pointer ${
              activeTab === 'payments'
                ? 'bg-[#FFFF00] text-[#000000] font-bold shadow-sm'
                : 'text-[#000000] hover:bg-neutral-50'
            }`}
          >
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${activeTab === 'payments' ? 'bg-[#FFFF00]' : 'bg-neutral-100'}`}>
              <svg className="w-4 h-4 text-black" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <span>Seamless Payments</span>
          </button>

          <button
            onClick={() => setActiveTab('ai')}
            className={`w-full sm:w-auto flex items-center justify-center gap-3 px-5 py-3 rounded-xl font-medium text-xs sm:text-sm transition-all duration-200 cursor-pointer ${
              activeTab === 'ai'
                ? 'bg-[#FFFF00] text-[#000000] font-bold shadow-sm'
                : 'text-[#000000] hover:bg-neutral-50'
            }`}
          >
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${activeTab === 'ai' ? 'bg-[#FFFF00]' : 'bg-neutral-100'}`}>
              <svg className="w-4 h-4 text-black" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm1 15h-2v-6h2zm0-8h-2V7h2z" />
              </svg>
            </div>
            <span>AI Financial Insights</span>
          </button>

          <button
            onClick={() => setActiveTab('tracking')}
            className={`w-full sm:w-auto flex items-center justify-center gap-3 px-5 py-3 rounded-xl font-medium text-xs sm:text-sm transition-all duration-200 cursor-pointer ${
              activeTab === 'tracking'
                ? 'bg-[#FFFF00] text-[#000000] font-bold shadow-sm'
                : 'text-[#000000] hover:bg-neutral-50'
            }`}
          >
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${activeTab === 'tracking' ? 'bg-[#FFFF00]' : 'bg-neutral-100'}`}>
              <svg className="w-4 h-4 text-black" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z" />
              </svg>
            </div>
            <span>Smart Tracking</span>
          </button>
        </motion.div>

        {/* Tab Showcase Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-5xl mx-auto"
        >
          <AnimatePresence mode="wait">
            {activeTab === 'payments' && (
              <motion.div
                key="payments"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-2xl p-6 sm:p-12 border border-[#EBEBEB] grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 items-center shadow-sm"
              >
                <div className="space-y-4">
                  <h3 className="text-2xl sm:text-3xl font-bold text-[#000000] font-geist">
                    Seamless Payments
                  </h3>
                  <p className="text-sm sm:text-base text-[#707070] leading-relaxed">
                    Send and receive money instantly across 150+ countries. No transfer fees, no waiting periods just frictionless global finance.
                  </p>
                </div>

                {/* Overlaid Balance Card Graphic */}
                <div className="relative rounded-2xl overflow-hidden min-h-[300px] sm:min-h-[340px] flex items-center justify-center p-4 sm:p-6 border border-neutral-100 shadow-inner">
                  <img
                    src="https://framerusercontent.com/images/klnZ51t4iVr4ijH1eRmR4BLvWIU.png?width=1200&height=715"
                    alt="Seamless Payments"
                    className="absolute inset-0 w-full h-full object-cover"
                  />

                  {/* Floating Action Card */}
                  <div className="relative z-10 bg-white/95 backdrop-blur-md p-5 sm:p-6 rounded-3xl shadow-xl w-full max-w-sm space-y-4 sm:space-y-5 border border-neutral-200/80">
                    <div className="flex items-center gap-2 text-xs font-geist text-[#707070]">
                      <span className="font-semibold text-black">All Accounts</span>
                      <span>•</span>
                      <span>Total Balance</span>
                    </div>

                    <div className="text-2xl sm:text-3xl font-bold text-black font-geist">
                      $2,375.00
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3 pt-1">
                      <button className="flex-1 py-2.5 px-3 sm:px-4 bg-[#FFFF00] hover:bg-[#E6E600] text-black font-bold text-xs sm:text-sm rounded-full transition-all text-center">
                        Top Up
                      </button>
                      <button className="flex-1 py-2.5 px-3 sm:px-4 bg-black hover:bg-neutral-800 text-white font-bold text-xs sm:text-sm rounded-full transition-all text-center">
                        Transfer
                      </button>
                      <button className="w-9 h-9 sm:w-10 sm:h-10 bg-[#F7F6F5] hover:bg-neutral-200 text-black font-bold text-lg rounded-full flex items-center justify-center transition-all flex-shrink-0">
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'ai' && (
              <motion.div
                key="ai"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-2xl p-6 sm:p-12 border border-[#EBEBEB] grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 items-center shadow-sm"
              >
                <div className="space-y-4">
                  <h3 className="text-2xl sm:text-3xl font-bold text-[#000000] font-geist">
                    AI Financial Insights
                  </h3>
                  <p className="text-sm sm:text-base text-[#707070] leading-relaxed">
                    Our AI analyzes your spending patterns, predicts cash flow gaps, and suggests optimizations before you even notice a problem.
                  </p>
                </div>

                <div className="p-4 sm:p-6 bg-[#F7F6F5] rounded-2xl border border-neutral-200 space-y-4">
                  <div className="text-xs font-mono uppercase tracking-wider text-[#707070] pb-2 border-b border-neutral-200">
                    Recent Transactions
                  </div>

                  <div className="p-3.5 sm:p-4 bg-white rounded-xl border border-neutral-200 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-sm text-black">Dave</div>
                      <div className="text-xs text-[#707070] font-mono">20 Sep 2025</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-sm font-mono text-black">$24,553</div>
                      <span className="inline-block text-[11px] font-mono text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                        In-Process
                      </span>
                    </div>
                  </div>

                  <div className="p-3.5 sm:p-4 bg-white rounded-xl border border-neutral-200 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-sm text-black">Dave</div>
                      <div className="text-xs text-[#707070] font-mono">20 Sep 2025</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-sm font-mono text-black">$24,553</div>
                      <span className="inline-block text-[11px] font-mono text-[#16BD00] bg-[#16BD00]/10 px-2.5 py-0.5 rounded-full border border-[#16BD00]/30">
                        Completed
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'tracking' && (
              <motion.div
                key="tracking"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-2xl p-6 sm:p-12 border border-[#EBEBEB] grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 items-center shadow-sm"
              >
                <div className="space-y-4">
                  <h3 className="text-2xl sm:text-3xl font-bold text-[#000000] font-geist">
                    Smart Tracking
                  </h3>
                  <p className="text-sm sm:text-base text-[#707070] leading-relaxed">
                    Connect all your accounts and investments. Get a single, real-time view of your full financial picture.
                  </p>
                </div>

                <div className="p-6 bg-black text-white rounded-2xl space-y-4 shadow-xl">
                  <div className="flex justify-between text-xs font-mono text-neutral-400">
                    <span>Spending By Month</span>
                    <span>3 Months</span>
                  </div>

                  <div className="space-y-1">
                    <div className="text-xs text-neutral-400 font-mono">Running Total</div>
                    <div className="text-2xl sm:text-3xl font-bold font-mono text-white">$12,447.00</div>
                  </div>

                  <div className="h-28 w-full flex items-end justify-between gap-4 pt-4">
                    {['May', 'June', 'Aug'].map((month, idx) => (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                        <div
                          className="w-full bg-[#FFFF00] rounded-t-md"
                          style={{ height: `${(idx + 1) * 30 + 20}%` }}
                        />
                        <span className="text-xs font-mono text-neutral-400">{month}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};
