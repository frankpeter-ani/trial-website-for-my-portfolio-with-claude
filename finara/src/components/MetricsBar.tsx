import React from 'react';
import { motion } from 'framer-motion';

export const MetricsBar: React.FC = () => {
  return (
    <section className="py-16 sm:py-20 bg-white border-b border-[#DEDEDE] overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10 sm:mb-12"
        >
          <p className="text-xs font-mono font-medium uppercase tracking-widest text-[#383838]">
            Growing Every Day
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-neutral-200">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="pt-6 md:pt-0 md:px-6 space-y-2"
          >
            <div className="text-4xl sm:text-5xl font-normal text-[#000000] font-geist tracking-tight">
              280k+
            </div>
            <div className="text-xs sm:text-sm font-geist text-[#707070]">
              Active users worldwide
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="pt-6 md:pt-0 md:px-6 space-y-2"
          >
            <div className="text-4xl sm:text-5xl font-normal text-[#000000] font-geist tracking-tight">
              40M+
            </div>
            <div className="text-xs sm:text-sm font-geist text-[#707070]">
              Transactions processed
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="pt-6 md:pt-0 md:px-6 space-y-2"
          >
            <div className="text-4xl sm:text-5xl font-normal text-[#000000] font-geist tracking-tight">
              120+
            </div>
            <div className="text-xs sm:text-sm font-geist text-[#707070]">
              Countries supported
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
