
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HomeIcon, Keyboard, Wand2 } from 'lucide-react';

const HowItWorksSection = () => {
  return (
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
              Take a photo of the room you want to design and upload it to our platform.
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
              Describe the interior design which you want, type it in the prompt field and click on generate.
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
              Our AI takes a few seconds and generates a stunning design of your space.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HowItWorksSection;
