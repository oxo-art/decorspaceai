
import { Card } from '@/components/ui/card';
import ResultDisplay from './ResultDisplay';

interface OutputSectionProps {
  isLoading: boolean;
  output: string | null;
  inputImage: string | null;
}

const OutputSection: React.FC<OutputSectionProps> = ({ 
  isLoading, 
  output, 
  inputImage 
}) => {
  return (
    <div className="space-y-6 animate-scale-in" style={{ animationDelay: '0.2s' }}>
      <Card className="overflow-hidden border border-gray-200 shadow-sm">
        <div className="p-6">
          <ResultDisplay 
            isLoading={isLoading} 
            output={output}
          />
        </div>
      </Card>
    </div>
  );
};

export default OutputSection;
