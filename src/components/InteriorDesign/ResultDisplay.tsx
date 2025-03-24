
import { Button } from '@/components/ui/button';

interface ResultDisplayProps {
  isLoading: boolean;
  output: string | null;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ isLoading, output }) => {
  const handleDownload = () => {
    if (output) {
      const link = document.createElement('a');
      link.href = output;
      link.download = 'ai-interior-design.png';
      link.click();
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
            Download
          </Button>
        </div>
      )}
    </div>
  );
};

export default ResultDisplay;
