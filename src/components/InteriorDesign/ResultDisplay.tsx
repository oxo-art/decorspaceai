
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Eye, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

interface ResultDisplayProps {
  isLoading: boolean;
  output: string | null;
  onDenoiseClick?: (imageUrl: string) => void;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ isLoading, output, onDenoiseClick }) => {
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const [isDenoisingLoading, setIsDenoisingLoading] = useState(false);

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

  const handlePreview = () => {
    if (!output) return;
    setIsPreviewDialogOpen(true);
  };

  const handleDenoise = () => {
    if (!output || !onDenoiseClick) return;
    
    setIsDenoisingLoading(true);
    onDenoiseClick(output);
  };

  return (
    <div>
      <h2 className="text-xl font-medium mb-4">Result</h2>
      
      <div className="h-64 bg-gray-100 rounded-lg overflow-hidden relative">
        {isLoading || isDenoisingLoading ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-16 h-16 rounded-full border-4 border-gray-300 border-t-primary animate-spin"></div>
            {isDenoisingLoading && (
              <div className="absolute bottom-2 left-0 right-0 text-center text-sm font-medium text-primary">
                Denoising image...
              </div>
            )}
          </div>
        ) : output ? (
          <img 
            src={output} 
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
      
      {output && (
        <>
          <div className="mt-4 flex flex-wrap gap-2">
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
            >
              <Eye className="mr-2 h-4 w-4" />
              Preview
            </Button>
            
            {onDenoiseClick && (
              <Button 
                variant="outline"
                className="flex-1"
                onClick={handleDenoise}
                disabled={isDenoisingLoading}
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Denoise
              </Button>
            )}
          </div>
          
          <Dialog open={isPreviewDialogOpen} onOpenChange={setIsPreviewDialogOpen}>
            <DialogContent className="max-w-[98vw] w-[98vw] max-h-[98vh] h-[98vh] p-0 border bg-background">
              <div className="relative bg-background rounded-lg flex flex-col items-center justify-center h-full">
                <div className="flex-1 w-full flex items-center justify-center p-1">
                  <img 
                    src={output}
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
                  {onDenoiseClick && (
                    <Button 
                      onClick={handleDenoise}
                      className="flex items-center gap-2"
                      disabled={isDenoisingLoading}
                    >
                      <Sparkles className="h-5 w-5" />
                      {isDenoisingLoading ? 'Processing...' : 'Denoise Image'}
                    </Button>
                  )}
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
