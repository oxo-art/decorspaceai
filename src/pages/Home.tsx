
import React from 'react';
import Navbar from '@/components/Home/Navbar';
import { Link } from 'react-router-dom';
import ImageSlider from '@/components/Home/ImageSlider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HomeIcon, Keyboard, Wand2 } from 'lucide-react';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section - Starts below the navbar */}
      <div className="pt-24 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-5xl font-volkhov text-gunmetal font-bold mb-4">
            Transform Your Living Space with AI
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mb-8">
            Experience the power of AI to reimagine and enhance your interior spaces with just a few clicks.
            Upload a photo of your room and get stunning design transformations instantly.
          </p>
          
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md w-full max-w-4xl mb-8">
            {/* Before/After Image Slider */}
            <div className="aspect-video w-full mb-6">
              <ImageSlider 
                beforeImage="/lovable-uploads/bd34ac83-6bda-4860-a7c1-597175c2e137.png"
                afterImage="/lovable-uploads/67b8d15c-8ea6-4834-8161-c855e9e18edf.png"
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

          {/* How It Works Section */}
          <div className="w-full max-w-4xl mt-12">
            <h2 className="text-3xl font-volkhov text-gunmetal font-bold mb-8 text-center">
              How It Works
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <HomeIcon className="h-6 w-6 text-yellow-500" />
                    Upload Your Space
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <img 
                      src="/lovable-uploads/6eb8c29f-c0e4-4d6e-9128-d41302fcdf02.png"
                      alt="Room photo example" 
                      className="w-full rounded-lg shadow-sm"
                    />
                  </div>
                  <p className="text-gray-600">
                    Take a photo of the room you want to redesign and upload it to our platform.
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Keyboard className="h-6 w-6 text-yellow-500" />
                    Describe your dream interior
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <img 
                      src="/lovable-uploads/579e3acf-8c33-4d0a-b885-e9c28c09e91d.png"
                      alt="Prompt example" 
                      className="w-full rounded-lg shadow-sm border border-gray-200"
                    />
                  </div>
                  <p className="text-gray-600">
                    Describe the interior design which you want, type it in the prompt field.
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Wand2 className="h-6 w-6 text-yellow-500" />
                    AI Transformation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <img 
                      src="/lovable-uploads/768e5239-2338-4f15-b125-86f67c3a977b.png"
                      alt="AI transformed room" 
                      className="w-full rounded-lg shadow-sm"
                    />
                  </div>
                  <p className="text-gray-600">
                    Our AI instantly generates a stunning design of your space.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
