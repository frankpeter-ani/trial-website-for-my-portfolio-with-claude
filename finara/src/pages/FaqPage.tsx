import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Minus, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const FaqPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'security' | 'transfers' | 'ai'>('all');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      category: 'security',
      question: 'What exactly is Finara?',
      answer:
        'Finara is an AI-powered financial platform designed for seamless payments, automated budgeting, and real-time treasury management for individuals and global teams.',
    },
    {
      category: 'security',
      question: 'Is Finara safe to use?',
      answer:
        'Yes, Finara uses 256-bit AES bank-grade encryption, multi-factor authentication, and is fully compliant with global financial regulations and SOC2 security standards.',
    },
    {
      category: 'security',
      question: 'Does Finara replace my current bank?',
      answer:
        'Finara works seamlessly alongside your existing bank accounts or as a standalone primary payment platform, aggregating all your accounts into one intelligent dashboard.',
    },
    {
      category: 'transfers',
      question: 'Which countries does Finara support?',
      answer:
        'Finara supports instant money transfers, multi-currency balances, and localized payouts across 150+ countries worldwide with zero hidden markup fees.',
    },
    {
      category: 'ai',
      question: 'How does the AI Cash Flow Assistant work?',
      answer:
        'Our machine learning models analyze historical spending patterns to forecast recurring income, detect upcoming cash flow shortages, and automatically balance liquidity across accounts.',
    },
    {
      category: 'transfers',
      question: 'How long do international transfers take?',
      answer:
        'Over 95% of international transfers sent via Finara settle instantly (< 3 seconds) through direct real-time payout networks.',
    },
    {
      category: 'security',
      question: 'How much does Finara cost?',
      answer:
        'Finara offers a free personal tier for standard transfers. Joining the waitlist guarantees lifetime discounted pricing on advanced AI automated features.',
    },
  ];

  const filteredFaqs = faqs.filter((faq) => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    const matchesSearch =
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="pt-32 pb-24 bg-[#F7F6F5] min-h-screen text-[#000000] font-geist">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center space-y-6">
          <div className="finara-eyebrow">
            <div className="finara-eyebrow-dots">
              <span className="finara-eyebrow-dot-1" />
              <span className="finara-eyebrow-dot-2" />
            </div>
            <span>KNOWLEDGE BASE</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-bold text-black tracking-[-0.03em] leading-[1.05em]">
            Frequently Asked Questions
          </h1>

          <p className="text-lg text-[#707070] max-w-xl mx-auto">
            Everything you need to know about Finara security, transfers, pricing, and AI automation.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-md mx-auto pt-2">
            <Search className="w-5 h-5 absolute left-4 top-6 text-[#707070]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search questions or keywords..."
              className="w-full bg-white border border-[#EBEBEB] pl-12 pr-4 py-3.5 rounded-full text-sm text-black placeholder-neutral-400 focus:outline-none focus:border-black shadow-sm"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {[
            { id: 'all', label: 'All Questions' },
            { id: 'security', label: 'Security & Banking' },
            { id: 'transfers', label: 'Global Transfers' },
            { id: 'ai', label: 'AI Engine' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as any)}
              className={`px-5 py-2.5 rounded-full text-xs font-mono font-medium transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-black text-[#FFFF00] font-bold shadow-sm'
                  : 'bg-white text-black border border-[#EBEBEB] hover:border-black'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-[#EBEBEB] text-[#707070]">
              No questions found matching your search. Reach out to support anytime!
            </div>
          ) : (
            filteredFaqs.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-[#EBEBEB] overflow-hidden transition-all duration-200 shadow-sm"
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-neutral-50/80 transition-colors focus:outline-none"
                  >
                    <span className="text-base sm:text-lg font-bold text-black font-geist pr-4">
                      {faq.question}
                    </span>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-200 ${isOpen ? 'bg-[#FFFF00] text-black' : 'bg-[#F7F6F5] text-black'}`}>
                      {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    </div>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="px-6 pb-6 pt-1 text-sm sm:text-base text-[#707070] leading-relaxed border-t border-neutral-100">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })
          )}
        </div>

        {/* Still Have Questions CTA */}
        <div className="bg-[#FFFF00] rounded-2xl p-8 sm:p-12 text-center text-black space-y-4 shadow-lg border border-yellow-300">
          <h3 className="text-2xl font-bold font-geist">Still have questions?</h3>
          <p className="text-sm text-black/80 max-w-md mx-auto">
            Our 24/7 AI Money Manager and support team are always ready to assist you.
          </p>
          <div className="pt-2">
            <Link
              to="/waitlist"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold text-white bg-black hover:bg-neutral-800 rounded-full transition-all shadow-md"
            >
              <span>Contact Support</span>
              <ArrowUpRight className="w-4 h-4 text-[#FFFF00]" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
