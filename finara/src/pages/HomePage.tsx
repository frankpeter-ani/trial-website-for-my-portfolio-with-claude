import React from 'react';
import { Hero } from '../components/Hero';
import { AboutSection } from '../components/AboutSection';
import { FeaturesSection } from '../components/FeaturesSection';
import { MetricsBar } from '../components/MetricsBar';
import { AiAssistantSection } from '../components/AiAssistantSection';
import { BentoGridSection } from '../components/BentoGridSection';
import { TestimonialsSection } from '../components/TestimonialsSection';
import { FaqSection } from '../components/FaqSection';
import { WaitlistCtaSection } from '../components/WaitlistCtaSection';

export const HomePage: React.FC = () => {
  return (
    <>
      <Hero />
      <AboutSection />
      <FeaturesSection />
      <MetricsBar />
      <AiAssistantSection />
      <BentoGridSection />
      <TestimonialsSection />
      <FaqSection />
      <WaitlistCtaSection />
    </>
  );
};
