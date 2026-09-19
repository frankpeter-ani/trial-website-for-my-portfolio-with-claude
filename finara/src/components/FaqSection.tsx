import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: 'What exactly is Finara?',
      answer:
        'Finara is an AI-powered financial platform designed for seamless payments, automated budgeting, and real-time treasury management for individuals and global teams.',
    },
    {
      question: 'Is Finara safe to use?',
      answer:
        'Yes, Finara uses 256-bit AES bank-grade encryption, multi-factor authentication, and is fully compliant with global financial regulations and SOC2 security standards.',
    },
    {
      question: 'Does Finara replace my current bank?',
      answer:
        'Finara works seamlessly alongside your existing bank accounts or as a standalone primary payment platform, aggregating all your accounts into one intelligent dashboard.',
    },
    {
      question: 'Which countries does Finara support?',
      answer:
        'Finara supports instant money transfers, multi-currency balances, and localized payouts across 150+ countries worldwide.',
    },
    {
      question: 'How much does Finara cost?',
      answer:
        'Finara offers a free personal tier for standard transfers. Joining the waitlist guarantees lifetime discounted pricing on advanced AI automated features.',
    },
  ];

  return (
    <section id="section-faqs" className="py-20 sm:py-28 bg-[#F7F6F5] border-t border-[#DEDEDE] relative text-[#000000] overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4"
        >
          <div className="finara-eyebrow">
            <div className="finara-eyebrow-dots">
              <span className="finara-eyebrow-dot-1" />
              <span className="finara-eyebrow-dot-2" />
            </div>
            <span>faq</span>
          </div>

          <h2 className="text-3xl sm:text-[40px] font-bold text-[#000000] tracking-[-0.03em] leading-[1.1em] font-geist">
            Frequently Asked Questions
          </h2>

          <p className="text-base sm:text-lg text-[#707070] font-normal leading-[1.3em]">
            Can't find your answer? Reach out to our team anytime.
          </p>
        </motion.div>

        {/* Accordion List */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="bg-white rounded-2xl border border-[#EBEBEB] overflow-hidden transition-all duration-200 shadow-sm"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-neutral-50/80 transition-colors focus:outline-none cursor-pointer"
                >
                  <span className="text-base sm:text-lg font-bold text-black font-geist pr-4">
                    {faq.question}
                  </span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-200 flex-shrink-0 ${isOpen ? 'bg-[#FFFF00] text-black' : 'bg-[#F7F6F5] text-black'}`}>
                    {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <div className="px-6 pb-6 pt-1 text-sm sm:text-base text-[#707070] leading-relaxed border-t border-neutral-100">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
