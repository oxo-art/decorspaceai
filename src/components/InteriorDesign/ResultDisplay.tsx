
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Eye, Maximize, Minimize } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ResultDisplayProps {
  isLoading: boolean;
  output: string | null;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ isLoading, output }) => {
  const [isUpscaling, setIsUpscaling] = useState(false);
  const [upscaledImage, setUpscaledImage] = useState<string | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);

  const handleDownload = async () => {
    if (!output && !upscaledImage) return;
    
    const imageUrl = upscaledImage || output;
    
    try {
      // Fetch the image first to handle potential CORS issues
      const response = await fetch(imageUrl!);
      if (!response.ok) {
        throw new Error('Failed to download image');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      // Create an anchor element and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = 'interior-design.png';
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
      
      toast.success('Download started');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download image. Try right-clicking and Save Image As instead.');
    }
  };

  const handlePreview = async () => {
    if (!output || isUpscaling) return;
    
    if (!upscaledImage) {
      setIsUpscaling(true);
      toast.info('Preparing high-resolution preview...');
      
      try {
        // Simulate upscaling with a delay
        // In a real implementation, this would call an API to upscale the image
        setTimeout(() => {
          setUpscaledImage(output);
          setIsPreviewMode(true);
          setIsUpscaling(false);
          toast.success('High-resolution preview ready!');
        }, 2000);
        
      } catch (error) {
        console.error('Preview error:', error);
        toast.error('Failed to generate preview. Please try again.');
        setIsUpscaling(false);
      }
    } else {
      // Toggle preview mode if upscaled image already exists
      setIsPreviewMode(!isPreviewMode);
    }
  };

  // Determine which image to display based on preview mode
  const displayImage = isPreviewMode ? upscaledImage : output;

  return (
    <div>
      <h2 className="text-xl font-medium mb-4">Result</h2>
      
      <div className="h-64 bg-gray-100 rounded-lg overflow-hidden relative">
        {isLoading ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-16 h-16 rounded-full border-4 border-gray-300 border-t-primary animate-spin"></div>
          </div>
        ) : displayImage ? (
          <>
            <img 
              src={displayImage} 
              alt="Output" 
              className="w-full h-full object-contain"
            />
            <button 
              onClick={() => setIsFullscreenOpen(true)}
              className="absolute top-2 right-2 bg-white bg-opacity-80 p-1.5 rounded-full hover:bg-opacity-100 transition-all"
              aria-label="View full screen"
            >
              <Maximize className="h-4 w-4 text-gray-700" />
            </button>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <p className="text-muted-foreground text-sm">
              Your AI-generated design will appear here
            </p>
          </div>
        )}
      </div>
      
      {displayImage && (
        <>
          <div className="mt-4 flex gap-2">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={handleDownload}
            >
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
            
            <Button 
              variant="outline"
              className="flex-1"
              onClick={handlePreview}
              disabled={isUpscaling}
            >
              <Eye className="mr-2 h-4 w-4" />
              {isUpscaling ? 'Loading...' : isPreviewMode ? 'Original' : 'Preview HD'}
            </Button>
          </div>
          
          <Dialog open={isFullscreenOpen} onOpenChange={setIsFullscreenOpen}>
            <DialogContent className="max-w-[90vw] w-auto max-h-[90vh] p-0 border-0 bg-transparent">
              <div className="relative bg-black rounded-lg overflow-hidden flex items-center justify-center">
                <img 
                  src={displayImage}
                  alt="Interior Design Preview" 
                  className="max-w-full max-h-[85vh] object-contain"
                />
                <div className="absolute top-2 right-2 flex gap-2">
                  <button 
                    onClick={() => setIsFullscreenOpen(false)}
                    className="bg-white bg-opacity-80 p-2 rounded-full hover:bg-opacity-100 transition-all"
                    aria-label="Close fullscreen"
                  >
                    <Minimize className="h-5 w-5 text-gray-700" />
                  </button>
                  <button 
                    onClick={handleDownload}
                    className="bg-white bg-opacity-80 p-2 rounded-full hover:bg-opacity-100 transition-all"
                    aria-label="Download image"
                  >
                    <Download className="h-5 w-5 text-gray-700" />
                  </button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
};

export default ResultDisplay;
