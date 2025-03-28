
import { Card } from '@/components/ui/card';
import ResultDisplay from './ResultDisplay';
import { PartyPopper } from 'lucide-react';

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
          <h2 className="text-xl font-medium mb-4 flex items-center gap-2">
            <PartyPopper className="h-5 w-5 text-yellow-500" /> 
          </h2>
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
