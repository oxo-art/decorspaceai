
import React from 'react';
import { Card } from '@/components/ui/card';
import { Loader } from 'lucide-react';

interface UpscalerOutputProps {
  isLoading: boolean;
  output: string | null;
  inputImage: string | null;
}

const UpscalerOutput: React.FC<UpscalerOutputProps> = ({ 
  isLoading, 
  output,
  inputImage
}) => {
  const handleDownload = () => {
    if (output) {
      const link = document.createElement('a');
      link.href = output;
      link.download = 'upscaled-image.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="space-y-6 animate-scale-in" style={{ animationDelay: '0.2s' }}>
      <Card className="overflow-hidden border border-gray-200 shadow-sm h-full flex flex-col">
        <div className="p-6 flex-1 flex flex-col">
          <h2 className="text-xl font-medium mb-4">Result</h2>

          <div className="flex-1 flex items-center justify-center bg-gray-50 rounded-lg overflow-hidden min-h-[600px]">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <Loader className="animate-spin h-8 w-8 mb-4 text-yellow-500" />
                <p className="text-gray-500">Upscaling your image...</p>
                <p className="text-sm text-gray-400 mt-2">This may take a moment</p>
              </div>
            ) : output ? (
              <div className="relative w-full h-full min-h-[600px] flex flex-col">
                <div className="flex-1 overflow-hidden p-4">
                  <img 
                    src={output} 
                    alt="Upscaled result" 
                    className="w-full h-full object-contain max-h-[700px]"
                  />
                </div>
                <button 
                  onClick={handleDownload}
                  className="mx-4 mb-4 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-medium rounded-md text-center transition-colors"
                >
                  Download Upscaled Image
                </button>
              </div>
            ) : inputImage ? (
              <div className="text-center p-8">
                <p className="text-gray-500">Click "Upscale Image" to enhance your photo</p>
              </div>
            ) : (
              <div className="text-center p-8">
                <p className="text-gray-500">Upload an image to get started</p>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default UpscalerOutput;
