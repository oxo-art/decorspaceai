
import React, { useState } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import UpscalerInput from '@/components/Upscaler/UpscalerInput';
import UpscalerOutput from '@/components/Upscaler/UpscalerOutput';
import { transformImage } from '@/services/replicateService';

const Upscaler = () => {
  const navigate = useNavigate();
  const [image, setImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [output, setOutput] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [scale, setScale] = useState(2);

  const handleGoBack = () => {
    navigate('/');
  };

  const handleUpscale = async () => {
    if (!image) {
      toast.error('Please upload an image first');
      return;
    }
    
    setOutput(null);
    setIsLoading(true);
    
    try {
      const result = await transformImage({
        prompt: "",  // Not needed for upscaling
        image: image,
        model: "denoise",
        scale: scale
      });
      
      if (result.output) {
        setOutput(result.output);
        toast.success('Image upscaled successfully!');
      } else {
        toast.error('Failed to upscale image');
      }
    } catch (error) {
      console.error('Error upscaling image:', error);
      toast.error(error.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-4xl animate-fade-in">
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={handleGoBack} 
            className="flex items-center gap-2 hover:bg-gray-100"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Button>
        </div>

        <div className="bg-yellow-50 p-6 rounded-lg mb-8 shadow-sm border border-yellow-100">
          <h1 className="text-3xl md:text-4xl font-volkhov text-gunmetal text-center mb-2 tracking-tight">
            Image <span className="font-semibold">Upscaler</span>
          </h1>
          <p className="text-muted-foreground text-center">
            Enhance your images with AI-powered upscaling
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <UpscalerInput
            image={image}
            setImage={setImage}
            scale={scale}
            setScale={setScale}
            isDragging={isDragging}
            setIsDragging={setIsDragging}
            isLoading={isLoading}
            handleUpscale={handleUpscale}
          />
          
          <UpscalerOutput 
            isLoading={isLoading}
            output={output}
            inputImage={image}
          />
        </div>
        
        <p className="text-sm text-muted-foreground text-center mt-8">
          Powered by AI to enhance and upscale your images.
        </p>
      </div>
    </div>
  );
};

export default Upscaler;
