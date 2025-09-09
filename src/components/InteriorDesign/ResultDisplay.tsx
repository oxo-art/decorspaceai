
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Eye } from 'lucide-react';
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
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const handleDownload = async () => {
    if (!output) return;
    
    try {
      // Fetch the image first to handle potential CORS issues
      const response = await fetch(output);
      if (!response.ok) {
        throw new Error('Failed to download image');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      // Create an anchor element and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = `ai-design-${Date.now()}.png`;
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

  const handlePreview = () => {
    if (!output) return;
    setIsPreviewDialogOpen(true);
  };

  const handleImageError = () => {
    setImageError(true);
    toast.error('Failed to load the generated image');
  };

  const handleImageLoad = () => {
    setImageError(false);
  };

  return (
    <div>
      <div className="w-full bg-muted/20 rounded-lg flex items-center justify-center relative max-w-md mx-auto" style={{ aspectRatio: 'auto' }}>
        {isLoading ? (
          <div className="w-full min-h-[200px] flex items-center justify-center">
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-full border-4 border-gray-300 border-t-primary animate-spin"></div>
          </div>
        ) : output && !imageError ? (
          <img 
            src={output} 
            alt="AI-generated interior design transformation" 
            className="w-full h-auto object-contain rounded-lg shadow-md"
            onError={handleImageError}
            onLoad={handleImageLoad}
          />
        ) : imageError ? (
          <div className="w-full min-h-[200px] flex items-center justify-center p-4">
            <p className="text-red-500 text-xs md:text-sm text-center">
              Failed to load image. Please try generating again.
            </p>
          </div>
        ) : (
          <div className="w-full min-h-[200px] flex items-center justify-center p-4">
            <p className="text-muted-foreground text-xs md:text-sm text-center">
              Your AI-generated design will appear here
            </p>
          </div>
        )}
      </div>
      
      {output && !imageError && (
        <>
          <div className="mt-3 md:mt-4 flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <Button 
              variant="outline" 
              className="flex-1 min-h-[44px] text-sm md:text-base"
              onClick={handleDownload}
            >
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
            
            <Button 
              variant="outline"
              className="flex-1 min-h-[44px] text-sm md:text-base"
              onClick={handlePreview}
            >
              <Eye className="mr-2 h-4 w-4" />
              Preview
            </Button>
          </div>
          
          <Dialog open={isPreviewDialogOpen} onOpenChange={setIsPreviewDialogOpen}>
            <DialogContent className="max-w-[95vw] w-[95vw] max-h-[95vh] h-[95vh] p-0 border bg-background">
              <div className="relative bg-background rounded-lg flex flex-col items-center justify-center h-full">
                <div className="flex-1 w-full flex items-center justify-center p-1">
                  <img 
                    src={output}
                    alt="Full-size preview of AI-generated interior design" 
                    className="max-w-[98%] max-h-[98%] object-contain"
                    onError={handleImageError}
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-center p-3 border-t w-full">
                  <Button 
                    onClick={handleDownload}
                    className="flex items-center justify-center gap-2 min-h-[44px] w-full sm:w-auto"
                  >
                    <Download className="h-4 w-4" />
                    Download Image
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setIsPreviewDialogOpen(false)}
                    className="min-h-[44px] w-full sm:w-auto"
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
