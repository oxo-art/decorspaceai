
import { Card } from '@/components/ui/card';
import ResultDisplay from './ResultDisplay';
import { useEffect, useState } from 'react';
import { upscaleImage } from '@/services/replicateService';
import { toast } from 'sonner';

interface OutputSectionProps {
  isLoading: boolean;
  output: string | null;
  inputImage: string | null;
}

const OutputSection: React.FC<OutputSectionProps> = ({ isLoading, output, inputImage }) => {
  const [upscaledOutput, setUpscaledOutput] = useState<string | null>(null);
  const [isUpscaling, setIsUpscaling] = useState<boolean>(false);
  
  // Using a key based on the output value will force a re-render when output changes
  const displayKey = upscaledOutput || output || 'no-output';
  
  useEffect(() => {
    // Reset upscaled output whenever the original output changes
    setUpscaledOutput(null);
    
    // Automatically upscale the image when we get a new output
    if (output && !isLoading) {
      handleUpscale();
    }
  }, [output]);
  
  const handleUpscale = async () => {
    if (!output || isUpscaling) return;
    
    setIsUpscaling(true);
    try {
      toast.info("Upscaling generated image for better quality...");
      const result = await upscaleImage(output);
      
      if (result.output) {
        setUpscaledOutput(result.output + "?v=" + new Date().getTime());
        toast.success("Image upscaled successfully!");
      } else {
        // If upscaling fails, we'll still show the original output
        toast.error("Could not upscale image, showing original quality");
      }
    } catch (error) {
      console.error("Error upscaling:", error);
      toast.error("Error upscaling image");
    } finally {
      setIsUpscaling(false);
    }
  };
  
  // Display either the upscaled image or the original, with loading states
  const displayOutput = upscaledOutput || output;
  const isCurrentlyLoading = isLoading || isUpscaling;
  
  return (
    <div className="space-y-6 animate-scale-in" style={{ animationDelay: '0.2s' }}>
      <Card className="overflow-hidden border border-gray-200 shadow-sm">
        <div className="p-6">
          <ResultDisplay 
            key={displayKey} 
            isLoading={isCurrentlyLoading} 
            output={displayOutput} 
          />
        </div>
      </Card>
    </div>
  );
};

export default OutputSection;
