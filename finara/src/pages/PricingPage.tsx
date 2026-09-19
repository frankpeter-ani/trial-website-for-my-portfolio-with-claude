import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';

export const PricingPage: React.FC = () => {
  const [annual, setAnnual] = useState(true);

  const tiers = [
    {
      name: 'Starter',
      price: annual ? '$0' : '$0',
      period: 'Forever free',
      description: 'Essential multi-currency account and instant domestic transfers for individuals.',
      features: [
        '150+ Countries multi-currency wallet',
        'Instant peer-to-peer transfers',
        'Standard transaction categorization',
        'Bank-grade 256-bit AES encryption',
        'Community support',
      ],
      popular: false,
      cta: 'Get Started Free',
    },
    {
      name: 'Pro AI',
      price: annual ? '$14' : '$19',
      period: 'per month',
      description: 'Full AI Money Manager, zero transfer markups, and predictive cash flow analytics.',
      features: [
        'Everything in Starter',
        '24/7 Finara AI Money Manager Assistant',
        'Zero-markup mid-market FX rates',
        'Automated Machine Learning Categorization',
        'Goal-based savings micro-transfers',
        'Priority 24/7 customer support',
      ],
      popular: true,
      cta: 'Claim Waitlist Discount',
    },
    {
      name: 'Enterprise Treasury',
      price: annual ? '$79' : '$99',
      period: 'per month',
      description: 'Advanced treasury automation, multi-user permissions, and dedicated API access for corporate teams.',
      features: [
        'Everything in Pro AI',
        'Multi-user team permissions & roles',
        'Custom REST & Webhook API access',
        'SOC2 Type II & PCI-DSS compliance reports',
        'Dedicated account manager',
        'Custom corporate invoicing & SLA',
      ],
      popular: false,
      cta: 'Contact Sales',
    },
  ];

  return (
    <div className="pt-32 pb-24 bg-[#F7F6F5] min-h-screen text-[#000000] font-geist">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="finara-eyebrow">
            <div className="finara-eyebrow-dots">
              <span className="finara-eyebrow-dot-1" />
              <span className="finara-eyebrow-dot-2" />
            </div>
            <span>TRANSPARENT PRICING</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-bold text-black tracking-[-0.03em] leading-[1.05em]">
            Simple Tiers, Zero Hidden Fees
          </h1>

          <p className="text-lg sm:text-xl text-[#707070] font-normal leading-relaxed">
            Join the waitlist today to lock in lifetime discounted pricing on all Pro AI features.
          </p>

          {/* Billing Switcher */}
          <div className="pt-4 flex items-center justify-center gap-4">
            <span className={`text-sm font-medium ${!annual ? 'text-black font-bold' : 'text-[#707070]'}`}>
              Monthly Billing
            </span>
            <button
              onClick={() => setAnnual(!annual)}
              className="w-14 h-8 bg-black rounded-full p-1 relative transition-all duration-200 cursor-pointer"
            >
              <div
                className={`w-6 h-6 rounded-full bg-[#FFFF00] transition-transform duration-200 ${
                  annual ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
            <div className="flex items-center gap-1.5">
              <span className={`text-sm font-medium ${annual ? 'text-black font-bold' : 'text-[#707070]'}`}>
                Annual Billing
              </span>
              <span className="px-2 py-0.5 bg-[#FFFF00] text-black font-mono font-bold text-[10px] rounded-full">
                SAVE 20%
              </span>
            </div>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {tiers.map((tier, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className={`rounded-2xl p-8 flex flex-col justify-between transition-all duration-300 relative ${
                tier.popular
                  ? 'bg-black text-white shadow-2xl border-2 border-[#FFFF00]'
                  : 'bg-white text-black border border-[#EBEBEB] shadow-sm'
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#FFFF00] text-black font-mono font-bold text-xs uppercase px-4 py-1 rounded-full shadow-md">
                  Most Popular
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <h3 className={`text-xl font-bold font-geist ${tier.popular ? 'text-white' : 'text-black'}`}>
                    {tier.name}
                  </h3>
                  <p className={`text-xs mt-1 ${tier.popular ? 'text-neutral-400' : 'text-[#707070]'}`}>
                    {tier.description}
                  </p>
                </div>

                <div className="space-y-1 border-y py-4 border-neutral-200/20">
                  <div className="flex items-baseline gap-1">
                    <span className={`text-4xl sm:text-5xl font-extrabold font-geist tracking-tight ${tier.popular ? 'text-[#FFFF00]' : 'text-black'}`}>
                      {tier.price}
                    </span>
                    <span className={`text-xs font-mono ${tier.popular ? 'text-neutral-400' : 'text-[#707070]'}`}>
                      / {tier.period}
                    </span>
                  </div>
                </div>

                <ul className="space-y-3 text-sm">
                  {tier.features.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${tier.popular ? 'bg-[#FFFF00] text-black' : 'bg-black text-[#FFFF00]'}`}>
                        <Check className="w-3 h-3" />
                      </div>
                      <span className={tier.popular ? 'text-neutral-200' : 'text-neutral-700'}>
                        {feat}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-8">
                <Link
                  to="/waitlist"
                  className={`w-full py-3.5 px-6 rounded-full font-bold text-sm text-center block transition-all active:scale-95 ${
                    tier.popular
                      ? 'bg-[#FFFF00] text-black hover:bg-[#E6E600] shadow-md'
                      : 'bg-black text-white hover:bg-neutral-800 shadow-sm'
                  }`}
                >
                  {tier.cta}
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
