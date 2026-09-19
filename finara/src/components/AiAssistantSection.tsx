import React from 'react';
import { motion } from 'framer-motion';

export const AiAssistantSection: React.FC = () => {
  return (
    <section className="py-20 sm:py-28 bg-[#F7F6F5] relative text-[#000000] overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Banner */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
            className="relative rounded-2xl overflow-hidden min-h-[420px] sm:min-h-[480px] p-6 sm:p-8 flex flex-col justify-end text-white shadow-xl"
          >
            <img
              src="https://framerusercontent.com/images/gTmKI5mtdqUv2QDXLkGbAq6uuZA.png?width=1200&height=679"
              alt="Trusted Across Borders"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent" />

            <div className="relative z-10 space-y-6">
              <div className="space-y-2">
                <h3 className="text-2xl sm:text-3xl font-bold text-white font-geist">
                  Trusted Across Borders
                </h3>
                <p className="text-sm sm:text-base text-[#DEDEDE] font-normal font-geist">
                  First time savers to seasoned investors.
                </p>
              </div>

              {/* Chips */}
              <div className="flex flex-wrap items-center gap-2">
                {['secure', 'global', 'instant'].map((chip, idx) => (
                  <span
                    key={idx}
                    className="px-3 sm:px-3.5 py-1.5 rounded-full text-[11px] sm:text-xs font-mono uppercase bg-white text-black font-semibold shadow-sm"
                  >
                    {chip}
                  </span>
                ))}
                <span className="px-3 sm:px-3.5 py-1.5 rounded-full text-[11px] sm:text-xs font-mono uppercase text-white font-semibold border border-white/40 backdrop-blur-sm">
                  rated 4.9/5
                </span>
              </div>
            </div>
          </motion.div>

          {/* Right Banner - AI Chat Interaction Card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-2xl p-6 sm:p-8 flex flex-col justify-between border border-[#EBEBEB] min-h-[420px] sm:min-h-[480px] shadow-sm"
          >
            {/* Messages Feed */}
            <div className="space-y-6">
              {/* Message 1 */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="space-y-1"
              >
                <div className="flex items-center justify-between text-xs text-[#707070] font-mono">
                  <span className="font-bold text-black">Mila Wilson</span>
                  <span>7:21 AM</span>
                </div>
                <div className="bg-[#F7F6F5] p-3.5 rounded-2xl rounded-tl-none text-xs sm:text-sm text-black inline-block font-geist">
                  Can you generate my monthly report?
                </div>
              </motion.div>

              {/* Message 2 */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.5 }}
                className="space-y-2"
              >
                <div className="text-xs text-[#707070] font-mono">
                  You requested a report
                </div>
                <div className="bg-[#FFFF00] p-3.5 sm:p-4 rounded-2xl flex items-center gap-3 shadow-sm max-w-sm">
                  <img
                    src="https://framerusercontent.com/images/KZU6lVkvstwRqoFkL3WFndetizU.png?width=840&height=1200"
                    alt="Annual Report"
                    className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                  />
                  <div>
                    <div className="font-bold text-xs sm:text-sm text-black font-geist">
                      Annual Transaction Report
                    </div>
                    <div className="text-[11px] text-black/70 font-mono">
                      Financial Assist
                    </div>
                  </div>
                </div>
                <div className="text-right text-xs text-[#707070] font-mono">
                  9:35 AM
                </div>
              </motion.div>
            </div>

            {/* Bottom Heading */}
            <div className="pt-6 border-t border-neutral-100 space-y-2">
              <h3 className="text-xl sm:text-2xl font-bold text-black font-geist">
                Your 24/7 AI Money Manager
              </h3>
              <p className="text-xs sm:text-sm text-[#707070] font-geist">
                Ask questions, request reports, set goals.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
