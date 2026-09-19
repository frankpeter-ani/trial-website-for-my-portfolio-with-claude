import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Zap, Globe, Lock, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AboutPage: React.FC = () => {
  const stats = [
    { label: 'Global Treasury Volume', value: '$40B+' },
    { label: 'Active Account Holders', value: '280,000+' },
    { label: 'Countries Supported', value: '150+' },
    { label: 'Average Customer Rating', value: '4.9/5' },
  ];

  const values = [
    {
      title: 'Zero Friction Transfers',
      description: 'Money should move as fast as a text message. We eliminated cross-border delays and high markup fees.',
      icon: Zap,
    },
    {
      title: 'AI-First Intelligence',
      description: 'Our core architecture uses machine learning to forecast cash flows and automate savings before issues occur.',
      icon: Shield,
    },
    {
      title: 'Bank-Grade Security',
      description: '256-bit AES encryption, multi-sig authorization, and continuous compliance monitoring keep assets bulletproof.',
      icon: Lock,
    },
    {
      title: 'Built for Modern Finance',
      description: 'Designed for individuals, freelancers, and enterprise teams operating across global currencies seamlessly.',
      icon: Globe,
    },
  ];

  const team = [
    { name: 'Elena Rostova', role: 'Co-Founder & CEO', bio: 'Former Head of Treasury at Revolut & Fintech Innovator.' },
    { name: 'David Chen', role: 'CTO & AI Lead', bio: 'PhD in Machine Learning from Stanford, Ex-Stripe Infrastructure.' },
    { name: 'Marcus Vance', role: 'Chief Security Officer', bio: 'Former Senior Security Lead at Block & Cybersecurity Strategist.' },
  ];

  return (
    <div className="pt-32 pb-24 bg-[#F7F6F5] min-h-screen text-[#000000] font-geist">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        {/* Page Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="finara-eyebrow">
            <div className="finara-eyebrow-dots">
              <span className="finara-eyebrow-dot-1" />
              <span className="finara-eyebrow-dot-2" />
            </div>
            <span>OUR MISSION & VISION</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-bold text-black tracking-[-0.03em] leading-[1.05em]">
            Building the Next Generation of Global Finance
          </h1>

          <p className="text-lg sm:text-xl text-[#707070] font-normal leading-relaxed">
            Finara is an AI-powered financial operating system engineered for instant cross-border payments, smart automated budgeting, and real-time treasury management.
          </p>
        </div>

        {/* Big Numbers Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-white p-8 rounded-2xl border border-[#EBEBEB] shadow-sm">
          {stats.map((stat, idx) => (
            <div key={idx} className="text-center space-y-2">
              <div className="text-3xl sm:text-5xl font-extrabold text-black font-geist tracking-tight">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm font-mono text-[#707070]">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Values Bento Grid */}
        <div className="space-y-8">
          <div className="text-center space-y-3">
            <h2 className="text-3xl sm:text-4xl font-bold text-black tracking-tight">
              Why We Built Finara
            </h2>
            <p className="text-base text-[#707070]">
              The core principles behind our autonomous financial platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="bg-white p-8 rounded-2xl border border-[#EBEBEB] space-y-4 hover:border-black transition-all shadow-sm"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#FFFF00] flex items-center justify-center text-black">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-black font-geist">
                    {item.title}
                  </h3>
                  <p className="text-sm text-[#707070] leading-relaxed">
                    {item.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Leadership Team */}
        <div className="space-y-8">
          <div className="text-center space-y-3">
            <h2 className="text-3xl sm:text-4xl font-bold text-black tracking-tight">
              Backed by Financial Pioneers
            </h2>
            <p className="text-base text-[#707070]">
              Our leadership team brings decades of experience building tier-1 global fintech infrastructure.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {team.map((member, idx) => (
              <div key={idx} className="bg-white p-8 rounded-2xl border border-[#EBEBEB] space-y-4 shadow-sm text-center">
                <div className="w-20 h-20 rounded-full bg-black text-[#FFFF00] flex items-center justify-center font-bold text-xl mx-auto font-mono shadow-md">
                  {member.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-black font-geist">{member.name}</h3>
                  <div className="text-xs font-mono text-[#707070]">{member.role}</div>
                </div>
                <p className="text-xs text-[#707070] leading-relaxed">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Box */}
        <div className="bg-[#FFFF00] rounded-2xl p-10 sm:p-14 text-center text-black space-y-6 shadow-xl border border-yellow-300">
          <h2 className="text-3xl sm:text-5xl font-bold font-geist tracking-tight">
            Ready to experience frictionless money?
          </h2>
          <p className="text-base sm:text-lg text-black/80 max-w-xl mx-auto">
            Join 280,000+ individuals and business leaders already using Finara.
          </p>
          <div className="pt-2">
            <Link
              to="/waitlist"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-bold text-white bg-black hover:bg-neutral-800 rounded-full transition-all shadow-lg active:scale-95"
            >
              <span>Get Priority Access</span>
              <ArrowUpRight className="w-5 h-5 text-[#FFFF00]" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
