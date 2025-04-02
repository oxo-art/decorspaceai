
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

const ImageUpscalerSection = () => {
  return (
    <div className="w-full max-w-4xl mt-16">
      <h2 className="text-3xl font-volkhov text-gunmetal font-bold mb-4 text-center">
        Image Upscaler
      </h2>
      <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8 text-center">
        Enhance the quality of your images with our AI-powered upscaling tool.
      </p>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="grid md:grid-cols-2 gap-6 items-center">
          <div>
            <h3 className="text-xl font-medium mb-4">Upgrade Your Images</h3>
            <p className="text-gray-600 mb-6">
              Our AI upscaler can enhance your low-resolution images with incredible detail. 
              Perfect for enhancing photos for printing, presentations, or social media.
            </p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start gap-2">
                <span className="text-yellow-500 font-bold mt-1">✓</span>
                <span>Increase resolution up to 4x</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-500 font-bold mt-1">✓</span>
                <span>Enhance details and clarity</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-500 font-bold mt-1">✓</span>
                <span>Remove noise and artifacts</span>
              </li>
            </ul>
            <Link 
              to="/upscaler" 
              className="inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-black font-medium py-2 px-4 rounded-md transition-colors"
            >
              Try Image Upscaler <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="flex justify-center">
            <div className="relative group">
              <img 
                src="/lovable-uploads/6fc60683-eb0b-4727-88c4-240b41938100.png" 
                alt="Original image" 
                className="w-4/5 rounded-lg shadow-sm transition-all group-hover:opacity-0"
              />
              <img 
                src="/lovable-uploads/acfd0014-3a08-4687-955b-28675e7d4974.png" 
                alt="Upscaled image" 
                className="w-4/5 rounded-lg shadow-sm absolute inset-0 opacity-0 transition-all group-hover:opacity-100"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="bg-black bg-opacity-70 text-white px-3 py-1 rounded text-sm">
                  Hover to see comparison
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageUpscalerSection;
