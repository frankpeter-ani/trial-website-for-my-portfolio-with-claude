import React from 'react';
import { motion } from 'framer-motion';

export const AboutSection: React.FC = () => {
  return (
    <section id="section-aboutus" className="py-20 sm:py-28 bg-[#F7F6F5] relative text-[#000000] overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header with Scroll Reveal */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-2xl mx-auto space-y-4"
        >
          <div className="finara-eyebrow">
            <div className="finara-eyebrow-dots">
              <span className="finara-eyebrow-dot-1" />
              <span className="finara-eyebrow-dot-2" />
            </div>
            <span>About Us</span>
          </div>

          <h2 className="text-3xl sm:text-[40px] font-bold text-[#000000] tracking-[-0.03em] leading-[1.1em] font-geist">
            Payments Without Limits
          </h2>

          <p className="text-base sm:text-lg text-[#707070] font-normal leading-[1.3em]">
            Borderless money movement designed for scale, powered by AI, and built for modern finance.
          </p>
        </motion.div>

        {/* Bento Grid with Staggered Scroll Animation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Bento Card 1: Financial Insights */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -5 }}
            className="bg-white rounded-2xl p-6 sm:p-8 flex flex-col justify-between border border-[#EBEBEB] min-h-[380px] shadow-sm hover:shadow-md transition-all"
          >
            <div className="text-center">
              <h3 className="text-base font-normal text-[#707070]">Financial Insights</h3>
            </div>

            {/* 3 Overlapping Avatar Bubbles */}
            <div className="py-6 flex flex-col items-center justify-center space-y-6">
              <div className="relative w-44 h-16 flex items-center justify-center">
                <img
                  src="https://framerusercontent.com/images/l2g4YzUEefmUV80jwW5MHf3qRw.png?width=900&height=1200"
                  alt="Avatar 1"
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-white object-cover absolute left-2 z-30 shadow-md"
                />
                <img
                  src="https://framerusercontent.com/images/iPDCdDcpSDCNQBsh99172CWU70.png?width=900&height=1200"
                  alt="Avatar 2"
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-white object-cover absolute left-14 z-20 shadow-md"
                />
                <img
                  src="https://framerusercontent.com/images/GKYzBroRD6DLbfUqoRfQPNVrk.png?width=1200&height=1200"
                  alt="Avatar 3"
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-white object-cover absolute left-26 z-10 shadow-md"
                />
              </div>

              <p className="text-center text-lg sm:text-xl font-bold text-[#000000] font-geist leading-snug">
                Backed by world class financial minds
              </p>
            </div>

            <div className="text-center text-sm font-geist text-[#707070]">
              2026
            </div>
          </motion.div>

          {/* Bento Card 2: Metallic / Yellow Balance Card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -5 }}
            className="bg-[#FFFF00] text-[#000000] rounded-2xl p-6 sm:p-8 flex flex-col justify-between min-h-[380px] shadow-md hover:shadow-lg transition-all"
          >
            {/* Top Logo & RFID */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 rounded-full bg-black" />
                <div className="w-4 h-4 rounded-full bg-black/40 -ml-2" />
              </div>
              <div className="text-xs font-mono font-bold tracking-widest text-black/60">
                ((( RFID )))
              </div>
            </div>

            {/* Balance */}
            <div className="py-6 space-y-2">
              <span className="text-xs font-geist text-black/70">Available Balance</span>
              <div className="text-4xl sm:text-5xl font-normal font-geist tracking-tight text-black">
                $29,450
              </div>
            </div>

            {/* Expiry & Card Number */}
            <div className="flex items-center justify-between text-xs font-geist text-black/80 font-medium">
              <span>03/24</span>
              <span>****9468</span>
            </div>
          </motion.div>

          {/* Bento Card 3: Image Card with Headline */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -5 }}
            className="relative rounded-2xl overflow-hidden min-h-[380px] flex items-end p-6 sm:p-8 text-white shadow-lg transition-all"
          >
            <img
              src="https://framerusercontent.com/images/SJ8f2qFvz2YlW5yE9D1ooKYIaMY.png?width=673&height=1200"
              alt="Personalized Investment"
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

            <div className="relative z-10">
              <h3 className="text-xl sm:text-2xl font-bold text-white leading-snug font-geist">
                Personalized investment recommendations daily
              </h3>
            </div>
          </motion.div>
        </div>

        {/* Lower Banner: 50% Metric Bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-[#FFFF00] text-[#000000] rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 shadow-md"
        >
          <div className="text-4xl sm:text-5xl font-normal font-geist">
            50%
          </div>
          <div className="text-sm sm:text-base text-black font-medium max-w-md text-center sm:text-left">
            of Users See Results in 90 Days. Real people. Real returns.
          </div>
        </motion.div>
      </div>
    </section>
  );
};
