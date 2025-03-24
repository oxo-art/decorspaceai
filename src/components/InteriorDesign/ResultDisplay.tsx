
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Eye, Maximize } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

interface ResultDisplayProps {
  isLoading: boolean;
  output: string | null;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ isLoading, output }) => {
  const [isUpscaling, setIsUpscaling] = useState(false);
  const [upscaledImage, setUpscaledImage] = useState<string | null>(null);
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);

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
          setIsUpscaling(false);
          setIsPreviewDialogOpen(true);
          toast.success('High-resolution preview ready!');
        }, 2000);
        
      } catch (error) {
        console.error('Preview error:', error);
        toast.error('Failed to generate preview. Please try again.');
        setIsUpscaling(false);
      }
    } else {
      // If upscaled image already exists, just open the dialog
      setIsPreviewDialogOpen(true);
    }
  };

  // Determine which image to display based on availability
  const displayImage = output;
  const previewImage = upscaledImage || output;

  return (
    <div>
      <h2 className="text-xl font-medium mb-4">Result</h2>
      
      <div className="h-64 bg-gray-100 rounded-lg overflow-hidden relative">
        {isLoading ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-16 h-16 rounded-full border-4 border-gray-300 border-t-primary animate-spin"></div>
          </div>
        ) : displayImage ? (
          <img 
            src={displayImage} 
            alt="Output" 
            className="w-full h-full object-contain"
          />
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
              {isUpscaling ? 'Loading...' : 'Preview HD'}
            </Button>
          </div>
          
          <Dialog open={isPreviewDialogOpen} onOpenChange={setIsPreviewDialogOpen}>
            <DialogContent className="max-w-[98vw] w-[98vw] max-h-[98vh] h-[98vh] p-0 border bg-background">
              <div className="relative bg-background rounded-lg flex flex-col items-center justify-center h-full">
                <div className="flex-1 w-full flex items-center justify-center p-1">
                  <img 
                    src={previewImage}
                    alt="Interior Design Preview" 
                    className="max-w-[98%] max-h-[98%] object-contain"
                  />
                </div>
                <div className="flex gap-4 justify-center p-2 border-t w-full">
                  <Button 
                    onClick={handleDownload}
                    className="flex items-center gap-2"
                  >
                    <Download className="h-5 w-5" />
                    Download Image
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setIsPreviewDialogOpen(false)}
                  >
                    Close
                  </Button>
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
