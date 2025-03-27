
import React from 'react';
import Navbar from '@/components/Home/Navbar';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section - Starts below the navbar */}
      <div className="pt-24 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col items-center text-center">
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
            <div className="aspect-video bg-gray-100 rounded-md mb-4 flex items-center justify-center">
              <img 
                src="/lovable-uploads/331de363-a3ac-4e9a-b97c-516306902109.png" 
                alt="Decorspace AI" 
                className="h-24 object-contain"
              />
            </div>
            <a 
              href="/design" 
              className="inline-block w-full bg-yellow-500 hover:bg-yellow-600 text-black font-medium py-3 px-4 rounded-md text-center transition-colors"
            >
              Start Designing Now
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
