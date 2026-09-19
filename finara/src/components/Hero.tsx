import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// public/ files are not rewritten by Vite's `base`, so resolve them manually.
const asset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;

// Each slide pans/zooms continuously across its whole turn (Ken Burns).
// Min scale stays >= 1.12 so a +/-4% translate never exposes the frame edge.
const SLIDES = [
  {
    url: asset('/images/hero/hero-1.jpg'),
    caption: 'Built for High-Growth Teams & Enterprise Treasury',
    from: { scale: 1.26, x: '-4%', y: '-2%' },
    to: { scale: 1.12, x: '3%', y: '2%' },
  },
  {
    url: asset('/images/hero/hero-2.jpg'),
    caption: 'Frictionless Mobile & Laptop Banking Anywhere',
    from: { scale: 1.13, x: '4%', y: '2%' },
    to: { scale: 1.27, x: '-3%', y: '-2%' },
  },
  {
    url: asset('/images/hero/hero-3.jpg'),
    caption: 'Financial Freedom That Follows You Anywhere',
    from: { scale: 1.24, x: '3%', y: '2%' },
    to: { scale: 1.12, x: '-4%', y: '-2%' },
  },
];

const SLIDE_MS = 7000;
const FADE_S = 1.6;

export const Hero: React.FC = () => {

  const [currentSlide, setCurrentSlide] = useState(0);

  // Keyed on currentSlide so picking a slide by hand restarts its full dwell
  // time instead of inheriting whatever was left of the previous interval.
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, SLIDE_MS);
    return () => clearTimeout(timer);
  }, [currentSlide]);

  const scrollToWaitlist = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const el = document.querySelector('#section-waitlist');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="relative min-h-[92vh] sm:min-h-screen flex items-center justify-center pt-28 pb-20 sm:pt-36 sm:pb-28 bg-[#000000] text-white overflow-hidden" id="section-hero">
      {/* Panning slide background: layers crossfade while each one pans */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {SLIDES.map((slide, idx) => {
          const active = currentSlide === idx;
          return (
            <motion.div
              key={slide.url}
              className="absolute inset-0 w-full h-full"
              initial={false}
              animate={{ opacity: active ? 1 : 0 }}
              transition={{ duration: FADE_S, ease: 'easeInOut' }}
            >
              <motion.img
                src={slide.url}
                alt=""
                aria-hidden="true"
                draggable={false}
                initial={slide.from}
                animate={active ? slide.to : slide.from}
                transition={
                  active
                    ? { duration: SLIDE_MS / 1000 + FADE_S, ease: 'linear' }
                    // hold position through the fade-out, then reset unseen
                    : { duration: 0, delay: FADE_S }
                }
                className="w-full h-full object-cover object-center will-change-transform"
              />
            </motion.div>
          );
        })}

        {/* Overlay: gradient + vignette, sits above the imagery for contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/45 to-black/92 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_20%,_rgba(0,0,0,0.65)_100%)] pointer-events-none" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6 sm:space-y-8">
        {/* Animated Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/30 text-xs sm:text-sm font-mono uppercase text-[#FFFF00] tracking-wider shadow-lg">
            <span className="w-2 h-2 rounded-full bg-[#16BD00] animate-ping" />
            <span>{SLIDES[currentSlide].caption}</span>
          </div>
        </motion.div>

        {/* H1 Headline with Scroll Reveal Animation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.12, 0.23, 0.17, 0.99] }}
          className="space-y-4"
        >
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-[64px] font-extrabold text-white tracking-[-0.03em] leading-[1.08em] font-geist drop-shadow-md">
            Seamless Payments,<br className="hidden sm:inline" />
            <span className="text-[#FFFF00]">Limitless Possibilities</span>
          </h1>

          <p className="mt-4 text-base sm:text-lg md:text-xl text-[#F3F3F3] font-normal leading-[1.3em] max-w-2xl mx-auto font-geist drop-shadow-sm px-2">
            Manage your money smarter with AI powered insights, real time analytics, and instant transfers.
          </p>

          {/* CTA Buttons with Hover Micro-Interactions */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="#section-waitlist"
              onClick={scrollToWaitlist}
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base font-bold text-[#000000] bg-[#FFFF00] hover:bg-[#E6E600] rounded-full transition-all duration-200 shadow-xl shadow-black/50"
            >
              Join waitlist now
            </motion.a>
          </div>
        </motion.div>

        {/* Slide Indicators */}
        <div className="pt-6 flex items-center justify-center gap-3">
          {SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                currentSlide === idx ? 'w-10 bg-[#FFFF00]' : 'w-2.5 bg-white/50 hover:bg-white'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </header>
  );
};
