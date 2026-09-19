import React from 'react';
import { motion } from 'framer-motion';

export const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      name: 'Sarah Mitchell',
      role: 'CFO',
      quote:
        '"I was juggling three different apps just to track spending. Now everything from transfers to reports lives in one place."',
      avatar:
        'https://framerusercontent.com/images/k4gqPEak6TgRrlQAStc1eynTE5I.png?width=715&height=1200',
    },
    {
      name: 'Michael Jordan',
      role: 'Investment Analyst',
      quote:
        '"I\'ve used every major fintech app out there. Nothing comes close to the intelligence and simplicity Finara delivers."',
      avatar:
        'https://framerusercontent.com/images/bKbAFvorvNU808H4mT8GvmDWs.png?width=960&height=1200',
    },
    {
      name: 'James Okafor',
      role: 'Startup Founder',
      quote:
        '"Real-time alerts, clean UI, and the smartest financial dashboard. We called it the best fintech decision we\'ve made."',
      avatar:
        'https://framerusercontent.com/images/gCWSXAO0S7Yge7XqXml0JxHQJo.png?width=902&height=1200',
    },
    {
      name: 'Lena Park',
      role: 'Graduate Student',
      quote:
        '"I\'m not a finance person at all. But Finara makes everything so simple that I actually understand my money for the first time in my life."',
      avatar:
        'https://framerusercontent.com/images/bTON9HdlExg6ZevUHwdyFGIMvE.png?width=800&height=1200',
    },
  ];

  return (
    <section id="section-testimonials" className="py-20 sm:py-28 bg-[#F7F6F5] border-t border-[#DEDEDE] relative text-[#000000] overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
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
            <span>testimonials</span>
          </div>

          <h2 className="text-3xl sm:text-[40px] font-bold text-[#000000] tracking-[-0.03em] leading-[1.1em] font-geist">
            Real People. Real Results.
          </h2>

          <p className="text-base sm:text-lg text-[#707070] font-normal leading-[1.3em]">
            See what individual investors and enterprise finance teams are saying after making the switch.
          </p>
        </motion.div>

        {/* Testimonials Cards Grid with Staggered Entrance */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Ratings Card in Bright Yellow (#FFFF00) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5 }}
            className="bg-[#FFFF00] text-[#000000] rounded-2xl p-6 sm:p-8 flex flex-col justify-between h-[340px] sm:h-[360px] shadow-sm"
          >
            <div className="text-xs sm:text-sm font-bold font-geist uppercase tracking-wider">
              4.9 Ratings
            </div>

            <div className="text-center space-y-3">
              <div className="flex items-center justify-center gap-1 text-black">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 fill-black" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 9.27l-5-4.87 6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold font-geist text-black">
                App of the year
              </h3>
            </div>

            <div className="text-right text-xs sm:text-sm font-bold font-geist">
              24 Reviews
            </div>
          </motion.div>

          {/* Testimonial Cards */}
          {testimonials.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: (idx + 1) * 0.1 }}
              whileHover={{ y: -4 }}
              className="bg-white rounded-2xl p-6 sm:p-8 border border-[#EBEBEB] flex flex-col justify-between h-[340px] sm:h-[360px] shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-sm sm:text-base text-black font-geist">{item.name}</div>
                  <div className="text-xs text-[#707070] font-mono">{item.role}</div>
                </div>
                <img
                  src={item.avatar}
                  alt={item.name}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border border-neutral-200"
                />
              </div>

              <p className="text-xs sm:text-sm text-black font-geist leading-relaxed">
                {item.quote}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
