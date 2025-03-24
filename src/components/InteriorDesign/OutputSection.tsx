
import { Card } from '@/components/ui/card';
import ResultDisplay from './ResultDisplay';

interface OutputSectionProps {
  isLoading: boolean;
  output: string | null;
  inputImage: string | null;
  onDenoiseClick?: (imageUrl: string) => void;
}

const OutputSection: React.FC<OutputSectionProps> = ({ 
  isLoading, 
  output, 
  inputImage,
  onDenoiseClick 
}) => {
  // Using a key based on the output value will force a re-render when output changes
  const displayKey = output || 'no-output';
  
  return (
    <div className="space-y-6 animate-scale-in" style={{ animationDelay: '0.2s' }}>
      <Card className="overflow-hidden border border-gray-200 shadow-sm">
        <div className="p-6">
          <ResultDisplay 
            key={displayKey} 
            isLoading={isLoading} 
            output={output}
            onDenoiseClick={onDenoiseClick}
          />
        </div>
      </Card>
    </div>
  );
};

export default OutputSection;
