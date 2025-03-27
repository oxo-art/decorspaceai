
import React from 'react';
import Navbar from '@/components/Home/Navbar';
import { Link } from 'react-router-dom';
import ImageSlider from '@/components/Home/ImageSlider';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section - Starts below the navbar */}
      <div className="pt-24 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-5xl font-volkhov text-gunmetal font-bold mb-4">
            Transform Your Living Spaces
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mb-8">
            Experience the power of AI to reimagine and enhance your interior spaces with just a few clicks.
            Upload a photo of your room and get stunning design transformations instantly.
          </p>
          
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md w-full max-w-4xl mb-8">
            {/* Before/After Image Slider */}
            <div className="aspect-video w-full mb-6">
              <ImageSlider 
                beforeImage="/lovable-uploads/cf7adebf-34d5-47ef-b3a1-bfb708ebfffa.png"
                afterImage="/lovable-uploads/d16742d4-f63c-4c8b-8575-bbb13c14eeaa.png"
                height="100%"
                width="100%"
              />
            </div>
            
            <Link 
              to="/design" 
              className="inline-block w-full bg-yellow-500 hover:bg-yellow-600 text-black font-medium py-3 px-4 rounded-md text-center transition-colors"
            >
              Start Designing Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
