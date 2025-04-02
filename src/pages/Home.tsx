
import React from 'react';
import Navbar from '@/components/Home/Navbar';
import HeroSection from '@/components/Home/HeroSection';
import HowItWorksSection from '@/components/Home/HowItWorksSection';
import ImageUpscalerSection from '@/components/Home/ImageUpscalerSection';
import TestimonialsSection from '@/components/Home/TestimonialsSection';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="flex flex-col items-center text-center">
        <HeroSection />
        <HowItWorksSection />
        <ImageUpscalerSection />
        <TestimonialsSection />
      </div>
    </div>
  );
};

export default HomePage;
