
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { toast } from 'sonner';

interface ResultDisplayProps {
  isLoading: boolean;
  output: string | null;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ isLoading, output }) => {
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

  return (
    <div>
      <h2 className="text-xl font-medium mb-4">Result</h2>
      
      <div className="h-64 bg-gray-100 rounded-lg overflow-hidden">
        {isLoading ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-16 h-16 rounded-full border-4 border-gray-300 border-t-primary animate-spin"></div>
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
        <div className="mt-4">
          <Button 
            variant="outline" 
            className="w-full"
            onClick={handleDownload}
          >
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        </div>
      )}
    </div>
  );
};

export default ResultDisplay;
