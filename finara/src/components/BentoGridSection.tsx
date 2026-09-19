import React, { useState } from 'react';
import { motion } from 'framer-motion';

export const BentoGridSection: React.FC = () => {
  const [openItem, setOpenItem] = useState<number>(1);

  const accordionItems = [
    {
      id: 0,
      title: 'Total Financial Visibility',
      description: 'All your accounts, cards, and goals in one clean view updated in real time, always.',
    },
    {
      id: 1,
      title: 'Automated Categorization',
      description: 'AI sorts every transaction instantly. No manual tagging, no spreadsheets.',
    },
    {
      id: 2,
      title: 'Goal-Based Planning',
      description: 'Set custom savings targets with AI micro-transfers that automatically invest spare change.',
    },
  ];

  return (
    <section id="section-build-around" className="py-20 sm:py-28 bg-white relative text-[#000000] overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 sm:gap-12 items-center">
          {/* Left Column Text & Accordion */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <div className="finara-eyebrow">
                <div className="finara-eyebrow-dots">
                  <span className="finara-eyebrow-dot-1" />
                  <span className="finara-eyebrow-dot-2" />
                </div>
                <span>build around you</span>
              </div>

              <h2 className="text-3xl sm:text-[40px] font-bold text-[#000000] tracking-[-0.03em] leading-[1.1em] font-geist">
                Your Wealth. Your Rules.
              </h2>

              <p className="text-base sm:text-lg text-[#707070] font-normal leading-[1.3em]">
                Just one smart platform that learns, adapts, and grows alongside you.
              </p>
            </div>

            {/* Interactive Accordion List */}
            <div className="space-y-3">
              {accordionItems.map((item) => {
                const isOpen = openItem === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => setOpenItem(isOpen ? -1 : item.id)}
                    className="bg-white rounded-xl border border-[#EBEBEB] p-4 cursor-pointer transition-all duration-200 hover:border-black"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${isOpen ? 'bg-[#FFFF00]' : 'bg-neutral-100'}`}>
                        <svg className="w-4 h-4 text-black" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                        </svg>
                      </div>
                      <h3 className="font-bold text-base text-black font-geist">
                        {item.title}
                      </h3>
                    </div>

                    {isOpen && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-3 text-xs sm:text-sm text-[#707070] font-geist pl-10 leading-relaxed"
                      >
                        {item.description}
                      </motion.p>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Right Column Image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
            className="rounded-2xl overflow-hidden shadow-xl border border-[#EBEBEB] h-[380px] sm:h-[480px]"
          >
            <img
              src="https://framerusercontent.com/images/0Ri9EYr2Y17LlRBRNIzFau3N4S8.png?width=1200&height=679"
              alt="Your Wealth Your Rules"
              className="w-full h-full object-cover object-center"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};
